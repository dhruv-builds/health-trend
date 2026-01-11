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

const systemPrompt = `You are a medical lab report parser. Extract lab test data from the provided text and return structured JSON.

For each lab test found, extract:
- testName: Normalize to canonical names (e.g., "Hemoglobin", "Glucose Fasting", "Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "TSH", "T3", "T4", "Vitamin D", "Vitamin B12", "Iron", "Ferritin", "Creatinine", "Urea", "Uric Acid", "Sodium", "Potassium", "Calcium", "SGOT/AST", "SGPT/ALT", "Bilirubin Total", "Alkaline Phosphatase", "Total Protein", "Albumin", "HbA1c", "WBC", "RBC", "Platelet Count", "ESR", "Non HDL Cholesterol", "MCHC", "MCV", "MCH")
- value: The numeric result (just the number)
- unit: The measurement unit (e.g., "g/dL", "mg/dL", "mIU/L", "ng/mL", "mmol/L")
- refLow: Lower bound of reference range (number or null if only upper bound exists)
- refHigh: Upper bound of reference range (number or null if only lower bound exists)

CRITICAL: Pay careful attention to reference ranges. You MUST extract both bounds when available:
- "30-100" or "30 - 100" means refLow=30, refHigh=100
- "30.0-100.0" means refLow=30, refHigh=100
- "< 100" or "<100" means refLow=null, refHigh=100
- "> 30" or ">30" means refLow=30, refHigh=null
- "0-130" means refLow=0, refHigh=130
- "Deficient: <20, Insufficient: 20-29, Sufficient: 30-100" means refLow=30, refHigh=100 (use sufficient range)

Return ONLY a JSON array of objects with these fields. No markdown, no explanation.

Example output:
[
  {"testName": "Vitamin D", "value": 28.2, "unit": "ng/mL", "refLow": 30, "refHigh": 100},
  {"testName": "LDL Cholesterol", "value": 119, "unit": "mg/dL", "refLow": null, "refHigh": 100},
  {"testName": "HDL Cholesterol", "value": 45, "unit": "mg/dL", "refLow": 40, "refHigh": null},
  {"testName": "Hemoglobin", "value": 14.2, "unit": "g/dL", "refLow": 13.5, "refHigh": 17.5},
  {"testName": "Non HDL Cholesterol", "value": 134, "unit": "mg/dL", "refLow": null, "refHigh": 130}
]`;

// Known reference ranges fallback for common tests when AI extraction fails
const KNOWN_REFERENCE_RANGES: Record<string, { refLow: number | null; refHigh: number | null }> = {
  'Vitamin D': { refLow: 30, refHigh: 100 },
  'LDL Cholesterol': { refLow: null, refHigh: 100 },
  'HDL Cholesterol': { refLow: 40, refHigh: null },
  'Total Cholesterol': { refLow: null, refHigh: 200 },
  'Triglycerides': { refLow: null, refHigh: 150 },
  'Non HDL Cholesterol': { refLow: null, refHigh: 130 },
  'VLDL': { refLow: null, refHigh: 30 },
  'Hemoglobin': { refLow: 12, refHigh: 17.5 },
  'HbA1c': { refLow: null, refHigh: 5.7 },
  'Glucose Fasting': { refLow: 70, refHigh: 100 },
  'TSH': { refLow: 0.4, refHigh: 4.0 },
  'Creatinine': { refLow: 0.6, refHigh: 1.2 },
  'MCHC': { refLow: 31.5, refHigh: 34.5 },
  'MCV': { refLow: 80, refHigh: 100 },
  'MCH': { refLow: 27, refHigh: 33 },
  'WBC': { refLow: 4000, refHigh: 11000 },
  'RBC': { refLow: 4.5, refHigh: 5.5 },
  'Platelet Count': { refLow: 150000, refHigh: 400000 },
  'Hematocrit': { refLow: 36, refHigh: 50 },
  'ESR': { refLow: null, refHigh: 20 },
  'SGOT/AST': { refLow: null, refHigh: 40 },
  'SGPT/ALT': { refLow: null, refHigh: 40 },
  'Bilirubin Total': { refLow: null, refHigh: 1.2 },
  'Alkaline Phosphatase': { refLow: 44, refHigh: 147 },
  'Total Protein': { refLow: 6.0, refHigh: 8.3 },
  'Albumin': { refLow: 3.5, refHigh: 5.0 },
  'Urea': { refLow: 7, refHigh: 20 },
  'Uric Acid': { refLow: 3.5, refHigh: 7.2 },
  'Sodium': { refLow: 136, refHigh: 145 },
  'Potassium': { refLow: 3.5, refHigh: 5.0 },
  'Calcium': { refLow: 8.5, refHigh: 10.5 },
  'Vitamin B12': { refLow: 200, refHigh: 900 },
  'Iron': { refLow: 60, refHigh: 170 },
  'Ferritin': { refLow: 12, refHigh: 300 },
  'T3': { refLow: 80, refHigh: 200 },
  'T4': { refLow: 5.1, refHigh: 14.1 },
  'Free T3': { refLow: 2.0, refHigh: 4.4 },
  'Free T4': { refLow: 0.82, refHigh: 1.77 },
};


serve(async (req) => {
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
    const { text, reportId } = await req.json();

    // Input validation
    if (!text || !reportId) {
      console.error('Missing required fields: text or reportId');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text and reportId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate text length (max 100KB)
    if (typeof text !== 'string' || text.length === 0 || text.length > 100000) {
      return new Response(
        JSON.stringify({ error: 'Text must be a non-empty string under 100KB' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate reportId format (alphanumeric, hyphens, underscores only)
    if (typeof reportId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(reportId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid reportId format. Use alphanumeric characters, hyphens, and underscores only (max 100 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing report ${reportId}, text length: ${text.length}`);

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
          { role: 'user', content: `Parse this lab report and extract all test results:\n\n${text}` }
        ],
        temperature: 0.1,
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
        JSON.stringify({ error: 'AI processing failed' }),
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

    console.log('AI response:', content);

    // Parse the JSON from the response
    let labData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        labData = JSON.parse(jsonMatch[0]);
      } else {
        labData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', raw: content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Standardize numeric values based on test type
    const standardizeValue = (value: number, testName: string): number => {
      if (isNaN(value) || value === null) return value;
      
      // Tests that should be integers (counts, large values)
      const integerTests = [
        'WBC', 'RBC', 'Platelet Count', 'Glucose Fasting', 'Glucose Random', 
        'Glucose PP', 'Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol',
        'Triglycerides', 'VLDL', 'Urea', 'BUN', 'Uric Acid',
        'Sodium', 'Potassium', 'Chloride', 'Calcium', 'Magnesium', 'Phosphorus',
        'SGOT/AST', 'SGPT/ALT', 'Alkaline Phosphatase', 'GGT', 'Iron', 'Ferritin'
      ];
      
      // Tests that need 1 decimal place
      const oneDecimalTests = [
        'Hemoglobin', 'Hematocrit', 'MCV', 'MCH', 'MCHC', 'HbA1c',
        'Total Protein', 'Albumin', 'Globulin', 'Bilirubin Total', 'Bilirubin Direct',
        'Creatinine'
      ];
      
      // Tests that need 2 decimal places
      const twoDecimalTests = [
        'TSH', 'T3', 'T4', 'Free T3', 'Free T4', 'Vitamin D', 'Vitamin B12',
        'Folate', 'eGFR', 'Insulin'
      ];
      
      if (integerTests.includes(testName)) {
        return Math.round(value);
      } else if (oneDecimalTests.includes(testName)) {
        return Math.round(value * 10) / 10;
      } else if (twoDecimalTests.includes(testName)) {
        return Math.round(value * 100) / 100;
      }
      
      // Default: 2 decimal places for unknown tests
      return Math.round(value * 100) / 100;
    };

    // Transform to LabRow format with panel assignment
    const panelMap: Record<string, string> = {
      'Total Cholesterol': 'Lipid Profile',
      'HDL Cholesterol': 'Lipid Profile',
      'LDL Cholesterol': 'Lipid Profile',
      'Triglycerides': 'Lipid Profile',
      'VLDL': 'Lipid Profile',
      'Glucose Fasting': 'Metabolic Panel',
      'Glucose Random': 'Metabolic Panel',
      'Glucose PP': 'Metabolic Panel',
      'HbA1c': 'Metabolic Panel',
      'Insulin': 'Metabolic Panel',
      'TSH': 'Thyroid Panel',
      'T3': 'Thyroid Panel',
      'T4': 'Thyroid Panel',
      'Free T3': 'Thyroid Panel',
      'Free T4': 'Thyroid Panel',
      'Hemoglobin': 'Complete Blood Count',
      'WBC': 'Complete Blood Count',
      'RBC': 'Complete Blood Count',
      'Platelet Count': 'Complete Blood Count',
      'Hematocrit': 'Complete Blood Count',
      'MCV': 'Complete Blood Count',
      'MCH': 'Complete Blood Count',
      'MCHC': 'Complete Blood Count',
      'ESR': 'Complete Blood Count',
      'SGOT/AST': 'Liver Profile',
      'SGPT/ALT': 'Liver Profile',
      'Bilirubin Total': 'Liver Profile',
      'Bilirubin Direct': 'Liver Profile',
      'Alkaline Phosphatase': 'Liver Profile',
      'GGT': 'Liver Profile',
      'Total Protein': 'Liver Profile',
      'Albumin': 'Liver Profile',
      'Globulin': 'Liver Profile',
      'Creatinine': 'Kidney Panel',
      'Urea': 'Kidney Panel',
      'BUN': 'Kidney Panel',
      'Uric Acid': 'Kidney Panel',
      'eGFR': 'Kidney Panel',
      'Sodium': 'Electrolytes',
      'Potassium': 'Electrolytes',
      'Chloride': 'Electrolytes',
      'Calcium': 'Electrolytes',
      'Magnesium': 'Electrolytes',
      'Phosphorus': 'Electrolytes',
      'Vitamin D': 'Vitamins & Minerals',
      'Vitamin B12': 'Vitamins & Minerals',
      'Folate': 'Vitamins & Minerals',
      'Iron': 'Vitamins & Minerals',
      'Ferritin': 'Vitamins & Minerals',
      'TIBC': 'Vitamins & Minerals',
    };

    // Validate each item has required fields
    labData = labData.filter((item: any) => {
      if (!item.testName || item.value === undefined) {
        console.warn('Skipping invalid lab item:', item);
        return false;
      }
      return true;
    });

    const labRows = labData.map((item: any, index: number) => {
      const rawValue = typeof item.value === 'number' ? item.value : parseFloat(item.value);
      const rawRefLow = item.refLow != null ? (typeof item.refLow === 'number' ? item.refLow : parseFloat(item.refLow)) : null;
      const rawRefHigh = item.refHigh != null ? (typeof item.refHigh === 'number' ? item.refHigh : parseFloat(item.refHigh)) : null;
      
      // Standardize values to consistent decimal places
      const value = !isNaN(rawValue) ? standardizeValue(rawValue, item.testName) : null;
      let refLow = rawRefLow != null && !isNaN(rawRefLow) ? standardizeValue(rawRefLow, item.testName) : null;
      let refHigh = rawRefHigh != null && !isNaN(rawRefHigh) ? standardizeValue(rawRefHigh, item.testName) : null;
      
      // Apply fallback reference ranges if AI failed to extract them
      const fallback = KNOWN_REFERENCE_RANGES[item.testName];
      if (fallback) {
        if (refLow === null && fallback.refLow !== null) {
          refLow = standardizeValue(fallback.refLow, item.testName);
          console.log(`Applied fallback refLow for ${item.testName}: ${refLow}`);
        }
        if (refHigh === null && fallback.refHigh !== null) {
          refHigh = standardizeValue(fallback.refHigh, item.testName);
          console.log(`Applied fallback refHigh for ${item.testName}: ${refHigh}`);
        }
      }
      
      // Log warning for items with still missing ranges
      if (refLow === null && refHigh === null) {
        console.warn(`No reference range available for ${item.testName}`);
      }
      
      // Build refRaw string
      let refRaw = '';
      if (refLow != null && refHigh != null) {
        refRaw = `${refLow} - ${refHigh}`;
      } else if (refHigh != null) {
        refRaw = `< ${refHigh}`;
      } else if (refLow != null) {
        refRaw = `> ${refLow}`;
      }
      
      let flag: 'normal' | 'low' | 'high' | 'critical' = 'normal';
      if (value != null) {
        if (refLow != null && value < refLow) {
          flag = value < refLow * 0.8 ? 'critical' : 'low';
        } else if (refHigh != null && value > refHigh) {
          flag = value > refHigh * 1.2 ? 'critical' : 'high';
        }
      }

      return {
        id: `${reportId}-${index}`,
        reportId,
        testName: item.testName,
        canonicalName: item.testName,
        value,
        valueRaw: String(item.value),
        unit: item.unit || '',
        refLow,
        refHigh,
        refRaw,
        flag,
        panel: panelMap[item.testName] || 'Other',
      };
    });

    console.log(`Parsed ${labRows.length} lab results for report ${reportId}`);

    return new Response(
      JSON.stringify({ labRows }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in standardize-labs function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
