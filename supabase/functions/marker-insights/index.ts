import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

// Rate limiting: 10 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter to only keep timestamps within the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  // Add current request timestamp
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  
  // Cleanup old IPs periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [key, times] of rateLimitMap.entries()) {
      const validTimes = times.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (validTimes.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validTimes);
      }
    }
  }
  
  return false;
}

const systemPrompt = `You are a medical lab results assistant. Given a lab marker with its current value, reference range, and trend data, provide a helpful explanation for a patient.

Your response must be valid JSON with this exact structure:
{
  "explanation": "A 2-3 sentence plain-language explanation of what this marker measures and why it matters",
  "concerns": ["List of 1-3 potential concerns if this value is abnormal, or empty array if normal"],
  "suggestions": ["List of 1-3 lifestyle or dietary suggestions that may help, or empty array if not applicable"],
  "doctorQuestions": ["List of 1-2 questions the patient might ask their doctor about this result"]
}

Guidelines:
- Use simple, patient-friendly language
- Be informative but not alarmist
- Always recommend consulting a healthcare provider for medical advice
- Focus on actionable, practical information
- If the value is within normal range, acknowledge that positively`;

interface MarkerData {
  canonicalName: string;
  currentValue: number;
  previousValue: number | null;
  unit: string;
  refLow: number | null;
  refHigh: number | null;
  status: 'out_of_range' | 'worsening' | 'stable' | 'improving';
  changePercent: number | null;
}

const VALID_STATUSES = ['out_of_range', 'worsening', 'stable', 'improving'];

// Validate marker data structure
function validateMarkerData(marker: any): { valid: boolean; error?: string } {
  if (!marker || typeof marker !== 'object') {
    return { valid: false, error: 'Invalid marker data' };
  }

  if (!marker.canonicalName || typeof marker.canonicalName !== 'string') {
    return { valid: false, error: 'Missing or invalid canonicalName' };
  }

  // Validate canonicalName length and format (allow letters, numbers, spaces, hyphens, slashes)
  if (marker.canonicalName.length > 200 || !/^[a-zA-Z0-9\s\/-]+$/.test(marker.canonicalName)) {
    return { valid: false, error: 'Invalid marker name format' };
  }

  if (typeof marker.currentValue !== 'number' || isNaN(marker.currentValue)) {
    return { valid: false, error: 'Invalid currentValue: must be a number' };
  }

  if (!marker.unit || typeof marker.unit !== 'string') {
    return { valid: false, error: 'Missing or invalid unit' };
  }

  if (marker.unit.length > 50) {
    return { valid: false, error: 'Unit too long' };
  }

  if (!VALID_STATUSES.includes(marker.status)) {
    return { valid: false, error: `Invalid status: must be one of ${VALID_STATUSES.join(', ')}` };
  }

  // Optional fields validation
  if (marker.previousValue !== null && (typeof marker.previousValue !== 'number' || isNaN(marker.previousValue))) {
    return { valid: false, error: 'Invalid previousValue: must be a number or null' };
  }

  if (marker.refLow !== null && (typeof marker.refLow !== 'number' || isNaN(marker.refLow))) {
    return { valid: false, error: 'Invalid refLow: must be a number or null' };
  }

  if (marker.refHigh !== null && (typeof marker.refHigh !== 'number' || isNaN(marker.refHigh))) {
    return { valid: false, error: 'Invalid refHigh: must be a number or null' };
  }

  if (marker.changePercent !== null && (typeof marker.changePercent !== 'number' || isNaN(marker.changePercent))) {
    return { valid: false, error: 'Invalid changePercent: must be a number or null' };
  }

  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  if (isRateLimited(clientIP)) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a minute and try again.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { marker } = await req.json() as { marker: MarkerData };

    // Validate marker data
    const validation = validateMarkerData(marker);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt with marker context
    const statusDescription = {
      'out_of_range': 'currently outside the normal reference range',
      'worsening': 'showing a worsening trend compared to previous results',
      'stable': 'stable and within normal range',
      'improving': 'showing improvement compared to previous results'
    }[marker.status];

    const trendInfo = marker.previousValue !== null && marker.changePercent !== null
      ? `The value changed from ${marker.previousValue} to ${marker.currentValue} (${marker.changePercent > 0 ? '+' : ''}${marker.changePercent.toFixed(1)}% change).`
      : 'This is the first recorded value.';

    const refRangeInfo = marker.refLow !== null && marker.refHigh !== null
      ? `Reference range: ${marker.refLow} - ${marker.refHigh} ${marker.unit}`
      : marker.refLow !== null
        ? `Reference range: > ${marker.refLow} ${marker.unit}`
        : marker.refHigh !== null
          ? `Reference range: < ${marker.refHigh} ${marker.unit}`
          : 'Reference range not specified';

    const userPrompt = `Lab Marker: ${marker.canonicalName}
Current Value: ${marker.currentValue} ${marker.unit}
${refRangeInfo}
Status: ${statusDescription}
${trendInfo}

Please provide insights about this lab result.`;

    console.log(`Requesting insights for: ${marker.canonicalName}`);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to get AI insights' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in Perplexity response');
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let insights;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      // Return a fallback structure
      insights = {
        explanation: content.slice(0, 300),
        concerns: [],
        suggestions: [],
        doctorQuestions: []
      };
    }

    console.log('Successfully generated insights for:', marker.canonicalName);

    return new Response(
      JSON.stringify({
        canonicalName: marker.canonicalName,
        ...insights,
        confidence: marker.status === 'out_of_range' ? 'high' : 'medium'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in marker-insights:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
