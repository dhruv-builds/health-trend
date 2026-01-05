import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

const systemPrompt = `You are a medical lab report parser. Extract lab test data from the provided text and return structured JSON.

For each lab test found, extract:
- testName: Normalize to canonical names (e.g., "Hemoglobin", "Glucose Fasting", "Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "TSH", "T3", "T4", "Vitamin D", "Vitamin B12", "Iron", "Ferritin", "Creatinine", "Urea", "Uric Acid", "Sodium", "Potassium", "Calcium", "SGOT/AST", "SGPT/ALT", "Bilirubin Total", "Alkaline Phosphatase", "Total Protein", "Albumin", "HbA1c", "WBC", "RBC", "Platelet Count", "ESR")
- value: The numeric result (just the number)
- unit: The measurement unit (e.g., "g/dL", "mg/dL", "mIU/L", "ng/mL", "mmol/L")
- refLow: Lower bound of reference range (number or null)
- refHigh: Upper bound of reference range (number or null)

Return ONLY a JSON array of objects with these fields. No markdown, no explanation.

Example output:
[
  {"testName": "Hemoglobin", "value": 14.2, "unit": "g/dL", "refLow": 13.5, "refHigh": 17.5},
  {"testName": "Glucose Fasting", "value": 95, "unit": "mg/dL", "refLow": 70, "refHigh": 100}
]`;


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    const labRows = labData.map((item: any, index: number) => {
      const rawValue = typeof item.value === 'number' ? item.value : parseFloat(item.value);
      const rawRefLow = item.refLow != null ? (typeof item.refLow === 'number' ? item.refLow : parseFloat(item.refLow)) : null;
      const rawRefHigh = item.refHigh != null ? (typeof item.refHigh === 'number' ? item.refHigh : parseFloat(item.refHigh)) : null;
      
      // Standardize values to consistent decimal places
      const value = !isNaN(rawValue) ? standardizeValue(rawValue, item.testName) : null;
      const refLow = rawRefLow != null && !isNaN(rawRefLow) ? standardizeValue(rawRefLow, item.testName) : null;
      const refHigh = rawRefHigh != null && !isNaN(rawRefHigh) ? standardizeValue(rawRefHigh, item.testName) : null;
      
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
