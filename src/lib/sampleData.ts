import { LabReport, LabRow } from './types';

// Sample data based on the uploaded reports for demo mode
// Redcliffe Labs Dec 2025 and Apollo Labs Dec 2023

const dec2023Rows: LabRow[] = [
  // Lipid Profile
  { id: 'demo-2023-ldl', testName: 'LDL Cholesterol', canonicalName: 'LDL Cholesterol', value: 98.5, valueRaw: '98.5', unit: 'mg/dL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2023' },
  { id: 'demo-2023-hdl', testName: 'HDL Cholesterol', canonicalName: 'HDL Cholesterol', value: 45, valueRaw: '45', unit: 'mg/dL', refLow: 40, refHigh: 60, refRaw: '40-60', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2023' },
  { id: 'demo-2023-total-chol', testName: 'Total Cholesterol', canonicalName: 'Total Cholesterol', value: 175, valueRaw: '175', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '<200', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2023' },
  { id: 'demo-2023-trig', testName: 'Triglycerides', canonicalName: 'Triglycerides', value: 120, valueRaw: '120', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '<150', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2023' },
  
  // Liver Profile
  { id: 'demo-2023-ast', testName: 'SGOT/AST', canonicalName: 'AST', value: 28, valueRaw: '28', unit: 'U/L', refLow: 10, refHigh: 40, refRaw: '10-40', flag: 'normal', panel: 'Liver Profile', reportId: 'demo-2023' },
  { id: 'demo-2023-alt', testName: 'SGPT/ALT', canonicalName: 'ALT', value: 32, valueRaw: '32', unit: 'U/L', refLow: 10, refHigh: 49, refRaw: '10-49', flag: 'normal', panel: 'Liver Profile', reportId: 'demo-2023' },
  
  // CBC
  { id: 'demo-2023-hb', testName: 'Hemoglobin', canonicalName: 'Hemoglobin', value: 14.2, valueRaw: '14.2', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'CBC', reportId: 'demo-2023' },
  { id: 'demo-2023-rbc', testName: 'RBC Count', canonicalName: 'RBC Count', value: 5.1, valueRaw: '5.1', unit: 'million/µL', refLow: 4.5, refHigh: 5.5, refRaw: '4.5-5.5', flag: 'normal', panel: 'CBC', reportId: 'demo-2023' },
  { id: 'demo-2023-wbc', testName: 'WBC Count', canonicalName: 'WBC Count', value: 7200, valueRaw: '7200', unit: '/µL', refLow: 4000, refHigh: 11000, refRaw: '4000-11000', flag: 'normal', panel: 'CBC', reportId: 'demo-2023' },
  { id: 'demo-2023-plt', testName: 'Platelet Count', canonicalName: 'Platelet Count', value: 250000, valueRaw: '250000', unit: '/µL', refLow: 150000, refHigh: 400000, refRaw: '150000-400000', flag: 'normal', panel: 'CBC', reportId: 'demo-2023' },
  
  // Vitamins
  { id: 'demo-2023-vitd', testName: 'Vitamin D', canonicalName: 'Vitamin D', value: 28, valueRaw: '28', unit: 'ng/mL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'low', panel: 'Vitamins', reportId: 'demo-2023' },
  { id: 'demo-2023-b12', testName: 'Vitamin B12', canonicalName: 'Vitamin B12', value: 450, valueRaw: '450', unit: 'pg/mL', refLow: 200, refHigh: 900, refRaw: '200-900', flag: 'normal', panel: 'Vitamins', reportId: 'demo-2023' },
  
  // Metabolic
  { id: 'demo-2023-glucose', testName: 'Fasting Glucose', canonicalName: 'Fasting Glucose', value: 92, valueRaw: '92', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic', reportId: 'demo-2023' },
  { id: 'demo-2023-hba1c', testName: 'HbA1c', canonicalName: 'HbA1c', value: 5.4, valueRaw: '5.4', unit: '%', refLow: null, refHigh: 5.7, refRaw: '<5.7', flag: 'normal', panel: 'Metabolic', reportId: 'demo-2023' },
  
  // Thyroid
  { id: 'demo-2023-tsh', testName: 'TSH', canonicalName: 'TSH', value: 2.5, valueRaw: '2.5', unit: 'mIU/L', refLow: 0.4, refHigh: 4.0, refRaw: '0.4-4.0', flag: 'normal', panel: 'Thyroid', reportId: 'demo-2023' },
];

const dec2025Rows: LabRow[] = [
  // Lipid Profile - LDL increased (out of range now)
  { id: 'demo-2025-ldl', testName: 'LDL CHOLESTEROL', canonicalName: 'LDL Cholesterol', value: 119.2, valueRaw: '119.2', unit: 'mg/dL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'high', panel: 'Lipid Profile', reportId: 'demo-2025' },
  { id: 'demo-2025-hdl', testName: 'HDL CHOLESTEROL', canonicalName: 'HDL Cholesterol', value: 42, valueRaw: '42', unit: 'mg/dL', refLow: 40, refHigh: 60, refRaw: '40-60', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2025' },
  { id: 'demo-2025-total-chol', testName: 'TOTAL CHOLESTEROL', canonicalName: 'Total Cholesterol', value: 195, valueRaw: '195', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '<200', flag: 'normal', panel: 'Lipid Profile', reportId: 'demo-2025' },
  { id: 'demo-2025-trig', testName: 'TRIGLYCERIDES', canonicalName: 'Triglycerides', value: 165, valueRaw: '165', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '<150', flag: 'high', panel: 'Lipid Profile', reportId: 'demo-2025' },
  
  // Liver Profile - slight increase but still normal
  { id: 'demo-2025-ast', testName: 'ASPARTATE AMINOTRANSFERASE (AST/SGOT)', canonicalName: 'AST', value: 35, valueRaw: '35', unit: 'U/L', refLow: 10, refHigh: 40, refRaw: '10-40', flag: 'normal', panel: 'Liver Profile', reportId: 'demo-2025' },
  { id: 'demo-2025-alt', testName: 'ALANINE AMINOTRANSFERASE (ALT/SGPT)', canonicalName: 'ALT', value: 45, valueRaw: '45', unit: 'U/L', refLow: 10, refHigh: 49, refRaw: '10-49', flag: 'normal', panel: 'Liver Profile', reportId: 'demo-2025' },
  
  // CBC
  { id: 'demo-2025-hb', testName: 'HAEMOGLOBIN', canonicalName: 'Hemoglobin', value: 13.8, valueRaw: '13.8', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'CBC', reportId: 'demo-2025' },
  { id: 'demo-2025-rbc', testName: 'RBC COUNT', canonicalName: 'RBC Count', value: 4.9, valueRaw: '4.9', unit: 'million/µL', refLow: 4.5, refHigh: 5.5, refRaw: '4.5-5.5', flag: 'normal', panel: 'CBC', reportId: 'demo-2025' },
  { id: 'demo-2025-wbc', testName: 'TOTAL LEUCOCYTE COUNT', canonicalName: 'WBC Count', value: 6800, valueRaw: '6800', unit: '/µL', refLow: 4000, refHigh: 11000, refRaw: '4000-11000', flag: 'normal', panel: 'CBC', reportId: 'demo-2025' },
  { id: 'demo-2025-plt', testName: 'PLATELET COUNT', canonicalName: 'Platelet Count', value: 235000, valueRaw: '235000', unit: '/µL', refLow: 150000, refHigh: 400000, refRaw: '150000-400000', flag: 'normal', panel: 'CBC', reportId: 'demo-2025' },
  
  // Vitamins - Vitamin D improved
  { id: 'demo-2025-vitd', testName: 'VITAMIN D TOTAL', canonicalName: 'Vitamin D', value: 35, valueRaw: '35', unit: 'ng/mL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'normal', panel: 'Vitamins', reportId: 'demo-2025' },
  { id: 'demo-2025-b12', testName: 'VITAMIN B12', canonicalName: 'Vitamin B12', value: 420, valueRaw: '420', unit: 'pg/mL', refLow: 200, refHigh: 900, refRaw: '200-900', flag: 'normal', panel: 'Vitamins', reportId: 'demo-2025' },
  
  // Metabolic - slight increase, worsening trend
  { id: 'demo-2025-glucose', testName: 'FASTING GLUCOSE', canonicalName: 'Fasting Glucose', value: 98, valueRaw: '98', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic', reportId: 'demo-2025' },
  { id: 'demo-2025-hba1c', testName: 'GLYCATED HEMOGLOBIN (HbA1c)', canonicalName: 'HbA1c', value: 5.6, valueRaw: '5.6', unit: '%', refLow: null, refHigh: 5.7, refRaw: '<5.7', flag: 'normal', panel: 'Metabolic', reportId: 'demo-2025' },
  
  // Thyroid
  { id: 'demo-2025-tsh', testName: 'TSH', canonicalName: 'TSH', value: 2.8, valueRaw: '2.8', unit: 'mIU/L', refLow: 0.4, refHigh: 4.0, refRaw: '0.4-4.0', flag: 'normal', panel: 'Thyroid', reportId: 'demo-2025' },
];

export const sampleReports: LabReport[] = [
  {
    id: 'demo-2023',
    fileName: 'Apollo_Labs_Dec_2023.pdf',
    reportDate: new Date(2023, 11, 12), // Dec 12, 2023
    labName: 'Apollo Diagnostics',
    patientName: 'Dhruv',
    extractedText: '(Sample data)',
    rows: dec2023Rows,
    status: 'complete',
  },
  {
    id: 'demo-2025',
    fileName: 'Redcliffe_Labs_Dec_2025.pdf',
    reportDate: new Date(2025, 11, 22), // Dec 22, 2025
    labName: 'Redcliffe Labs',
    patientName: 'Dhruv',
    extractedText: '(Sample data)',
    rows: dec2025Rows,
    status: 'complete',
  },
];
