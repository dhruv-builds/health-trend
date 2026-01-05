import { LabRow } from './types';

// Canonical name mapping for common lab test synonyms
const CANONICAL_MAP: Record<string, string> = {
  // Lipid Panel
  'ldl cholesterol': 'LDL Cholesterol',
  'ldl': 'LDL Cholesterol',
  'ldl-c': 'LDL Cholesterol',
  'low density lipoprotein': 'LDL Cholesterol',
  'hdl cholesterol': 'HDL Cholesterol',
  'hdl': 'HDL Cholesterol',
  'hdl-c': 'HDL Cholesterol',
  'high density lipoprotein': 'HDL Cholesterol',
  'total cholesterol': 'Total Cholesterol',
  'cholesterol': 'Total Cholesterol',
  'triglycerides': 'Triglycerides',
  'triglyceride': 'Triglycerides',
  'vldl': 'VLDL Cholesterol',
  'vldl cholesterol': 'VLDL Cholesterol',
  
  // Liver Panel
  'sgot': 'AST',
  'ast': 'AST',
  'sgot/ast': 'AST',
  'aspartate aminotransferase': 'AST',
  'aspartate aminotransferase (ast/sgot)': 'AST',
  'sgpt': 'ALT',
  'alt': 'ALT',
  'sgpt/alt': 'ALT',
  'alanine aminotransferase': 'ALT',
  'alanine aminotransferase (alt/sgpt)': 'ALT',
  'alkaline phosphatase': 'Alkaline Phosphatase',
  'alp': 'Alkaline Phosphatase',
  'bilirubin total': 'Total Bilirubin',
  'total bilirubin': 'Total Bilirubin',
  'bilirubin direct': 'Direct Bilirubin',
  'direct bilirubin': 'Direct Bilirubin',
  'bilirubin indirect': 'Indirect Bilirubin',
  'ggt': 'GGT',
  'gamma gt': 'GGT',
  'gamma glutamyl transferase': 'GGT',
  
  // Kidney Panel
  'creatinine': 'Creatinine',
  'serum creatinine': 'Creatinine',
  'blood urea nitrogen': 'BUN',
  'bun': 'BUN',
  'urea': 'Urea',
  'blood urea': 'Urea',
  'uric acid': 'Uric Acid',
  'egfr': 'eGFR',
  
  // CBC
  'hemoglobin': 'Hemoglobin',
  'haemoglobin': 'Hemoglobin',
  'hb': 'Hemoglobin',
  'hgb': 'Hemoglobin',
  'rbc': 'RBC Count',
  'rbc count': 'RBC Count',
  'red blood cell count': 'RBC Count',
  'wbc': 'WBC Count',
  'wbc count': 'WBC Count',
  'white blood cell count': 'WBC Count',
  'total leucocyte count': 'WBC Count',
  'tlc': 'WBC Count',
  'platelets': 'Platelet Count',
  'platelet count': 'Platelet Count',
  'plt': 'Platelet Count',
  'hematocrit': 'Hematocrit',
  'haematocrit': 'Hematocrit',
  'hct': 'Hematocrit',
  'pcv': 'Hematocrit',
  'mcv': 'MCV',
  'mean corpuscular volume': 'MCV',
  'mch': 'MCH',
  'mean corpuscular hemoglobin': 'MCH',
  'mchc': 'MCHC',
  'rdw': 'RDW',
  'rdw-cv': 'RDW',
  
  // Thyroid
  'tsh': 'TSH',
  'thyroid stimulating hormone': 'TSH',
  't3': 'T3',
  'triiodothyronine': 'T3',
  't4': 'T4',
  'thyroxine': 'T4',
  'free t3': 'Free T3',
  'ft3': 'Free T3',
  'free t4': 'Free T4',
  'ft4': 'Free T4',
  
  // Diabetes
  'fasting glucose': 'Fasting Glucose',
  'fasting blood sugar': 'Fasting Glucose',
  'fbs': 'Fasting Glucose',
  'glucose fasting': 'Fasting Glucose',
  'random glucose': 'Random Glucose',
  'blood sugar random': 'Random Glucose',
  'hba1c': 'HbA1c',
  'glycated hemoglobin': 'HbA1c',
  'glycosylated hemoglobin': 'HbA1c',
  'hemoglobin a1c': 'HbA1c',
  
  // Vitamins & Minerals
  'vitamin d': 'Vitamin D',
  'vitamin d total': 'Vitamin D',
  '25-hydroxy vitamin d': 'Vitamin D',
  'vitamin b12': 'Vitamin B12',
  'b12': 'Vitamin B12',
  'cyanocobalamin': 'Vitamin B12',
  'folate': 'Folate',
  'folic acid': 'Folate',
  'iron': 'Iron',
  'serum iron': 'Iron',
  'ferritin': 'Ferritin',
  'serum ferritin': 'Ferritin',
  'calcium': 'Calcium',
  'serum calcium': 'Calcium',
  'magnesium': 'Magnesium',
  'serum magnesium': 'Magnesium',
  
  // Proteins
  'total protein': 'Total Protein',
  'albumin': 'Albumin',
  'serum albumin': 'Albumin',
  'globulin': 'Globulin',
  'a/g ratio': 'A/G Ratio',
  'albumin globulin ratio': 'A/G Ratio',
  
  // Cardiac
  'crp': 'CRP',
  'c-reactive protein': 'CRP',
  'hs-crp': 'hs-CRP',
  'high sensitivity crp': 'hs-CRP',
  'homocysteine': 'Homocysteine',
  'lipoprotein a': 'Lipoprotein(a)',
  'lp(a)': 'Lipoprotein(a)',
  
  // Electrolytes
  'sodium': 'Sodium',
  'serum sodium': 'Sodium',
  'potassium': 'Potassium',
  'serum potassium': 'Potassium',
  'chloride': 'Chloride',
  'serum chloride': 'Chloride',
};

// Panel detection based on canonical names
const PANEL_MAP: Record<string, string> = {
  'LDL Cholesterol': 'Lipid Profile',
  'HDL Cholesterol': 'Lipid Profile',
  'Total Cholesterol': 'Lipid Profile',
  'Triglycerides': 'Lipid Profile',
  'VLDL Cholesterol': 'Lipid Profile',
  'AST': 'Liver Profile',
  'ALT': 'Liver Profile',
  'Alkaline Phosphatase': 'Liver Profile',
  'Total Bilirubin': 'Liver Profile',
  'Direct Bilirubin': 'Liver Profile',
  'Indirect Bilirubin': 'Liver Profile',
  'GGT': 'Liver Profile',
  'Creatinine': 'Kidney Profile',
  'BUN': 'Kidney Profile',
  'Urea': 'Kidney Profile',
  'Uric Acid': 'Kidney Profile',
  'eGFR': 'Kidney Profile',
  'Hemoglobin': 'CBC',
  'RBC Count': 'CBC',
  'WBC Count': 'CBC',
  'Platelet Count': 'CBC',
  'Hematocrit': 'CBC',
  'MCV': 'CBC',
  'MCH': 'CBC',
  'MCHC': 'CBC',
  'RDW': 'CBC',
  'TSH': 'Thyroid',
  'T3': 'Thyroid',
  'T4': 'Thyroid',
  'Free T3': 'Thyroid',
  'Free T4': 'Thyroid',
  'Fasting Glucose': 'Metabolic',
  'Random Glucose': 'Metabolic',
  'HbA1c': 'Metabolic',
  'Vitamin D': 'Vitamins',
  'Vitamin B12': 'Vitamins',
  'Folate': 'Vitamins',
  'Iron': 'Minerals',
  'Ferritin': 'Minerals',
  'Calcium': 'Minerals',
  'Magnesium': 'Minerals',
  'Total Protein': 'Proteins',
  'Albumin': 'Proteins',
  'Globulin': 'Proteins',
  'A/G Ratio': 'Proteins',
  'CRP': 'Cardiac',
  'hs-CRP': 'Cardiac',
  'Homocysteine': 'Cardiac',
  'Lipoprotein(a)': 'Cardiac',
  'Sodium': 'Electrolytes',
  'Potassium': 'Electrolytes',
  'Chloride': 'Electrolytes',
};

function getCanonicalName(testName: string): string {
  const normalized = testName.toLowerCase().trim();
  return CANONICAL_MAP[normalized] || testName.trim();
}

function getPanel(canonicalName: string): string {
  return PANEL_MAP[canonicalName] || 'Other';
}

function parseValue(valueStr: string): number | null {
  if (!valueStr) return null;
  const cleaned = valueStr.replace(/[<>]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseReferenceRange(rangeStr: string): { low: number | null; high: number | null } {
  if (!rangeStr) return { low: null, high: null };
  
  const cleaned = rangeStr.trim();
  
  // Handle "<X" format
  const lessThan = cleaned.match(/^<\s*([\d.]+)/);
  if (lessThan) {
    return { low: null, high: parseFloat(lessThan[1]) };
  }
  
  // Handle ">X" format
  const greaterThan = cleaned.match(/^>\s*([\d.]+)/);
  if (greaterThan) {
    return { low: parseFloat(greaterThan[1]), high: null };
  }
  
  // Handle "X-Y" or "X - Y" format
  const range = cleaned.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (range) {
    return { low: parseFloat(range[1]), high: parseFloat(range[2]) };
  }
  
  return { low: null, high: null };
}

function determineFlag(value: number | null, refLow: number | null, refHigh: number | null): LabRow['flag'] {
  if (value === null) return 'normal';
  
  if (refLow !== null && value < refLow) {
    return value < refLow * 0.7 ? 'critical' : 'low';
  }
  if (refHigh !== null && value > refHigh) {
    return value > refHigh * 1.3 ? 'critical' : 'high';
  }
  
  return 'normal';
}

// Pattern to match lab result rows
// Handles various table formats from different labs
const ROW_PATTERNS = [
  // Standard format: Test Name | Value | Unit | Reference Range
  /^([A-Za-z][A-Za-z0-9\s\/\(\)\-\.]+?)\s+([\d.]+)\s*([a-zA-Z\/%µμ]+(?:\/[a-zA-Z]+)?)\s+([\d.<>\-\s]+(?:[-–]\s*[\d.]+)?)/,
  // Format with possible H/L flag: Test Name | Value | Unit | Flag | Reference
  /^([A-Za-z][A-Za-z0-9\s\/\(\)\-\.]+?)\s+([\d.]+)\s*([a-zA-Z\/%µμ]+(?:\/[a-zA-Z]+)?)\s*[HL]?\s*([\d.<>\-\s]+(?:[-–]\s*[\d.]+)?)/,
];

export function parseLabText(text: string, reportId: string): LabRow[] {
  const rows: LabRow[] = [];
  const lines = text.split('\n');
  const seenTests = new Set<string>();
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.length < 10) continue;
    
    for (const pattern of ROW_PATTERNS) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const testName = match[1].trim();
        const valueRaw = match[2].trim();
        const unit = match[3].trim();
        const refRaw = match[4].trim();
        
        // Skip if test name looks like a header or non-test row
        if (testName.toLowerCase().includes('test name') ||
            testName.toLowerCase().includes('result') ||
            testName.length < 2) {
          continue;
        }
        
        const canonicalName = getCanonicalName(testName);
        const value = parseValue(valueRaw);
        const { low: refLow, high: refHigh } = parseReferenceRange(refRaw);
        
        // Skip duplicates within same report
        const key = `${canonicalName}-${reportId}`;
        if (seenTests.has(key)) continue;
        seenTests.add(key);
        
        rows.push({
          id: `${reportId}-${canonicalName.replace(/\s+/g, '-').toLowerCase()}`,
          testName,
          canonicalName,
          value,
          valueRaw,
          unit,
          refLow,
          refHigh,
          refRaw,
          flag: determineFlag(value, refLow, refHigh),
          panel: getPanel(canonicalName),
          reportId,
        });
        
        break; // Found a match, move to next line
      }
    }
  }
  
  return rows;
}

export function getAllPanels(rows: LabRow[]): string[] {
  const panels = new Set(rows.map(r => r.panel));
  return Array.from(panels).sort();
}
