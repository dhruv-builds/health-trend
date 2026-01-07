import { LabReport, LabRow } from './types';

// Dhruv's real lab data from Apollo Labs (Dec 2023) and Redcliffe Labs (Dec 2025)

const dec2023Rows: LabRow[] = [
  // Complete Blood Count
  { id: 'dhruv-2023-hb', testName: 'Haemoglobin', canonicalName: 'Hemoglobin', value: 14.9, valueRaw: '14.9', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-wbc', testName: 'Total Leucocyte Count (TLC)', canonicalName: 'WBC', value: 4400, valueRaw: '4400', unit: 'cells/cu.mm', refLow: 4000, refHigh: 10000, refRaw: '4000-10000', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-rbc', testName: 'RBC Count', canonicalName: 'RBC', value: 5, valueRaw: '5', unit: '10^6/μl', refLow: 5, refHigh: 6, refRaw: '5-6', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-plt', testName: 'Platelet Count', canonicalName: 'Platelet Count', value: 261000, valueRaw: '261000', unit: 'cells/cu.mm', refLow: 150000, refHigh: 410000, refRaw: '150000-410000', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-mchc', testName: 'MCHC', canonicalName: 'MCHC', value: 33.8, valueRaw: '33.8', unit: 'g/dL', refLow: 31.5, refHigh: 34.5, refRaw: '31.5-34.5', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2023' },

  // Lipid Profile
  { id: 'dhruv-2023-total-chol', testName: 'Total Cholesterol', canonicalName: 'Total Cholesterol', value: 201, valueRaw: '201', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '—-200', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-trig', testName: 'Triglycerides', canonicalName: 'Triglycerides', value: 83, valueRaw: '83', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '—-150', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-hdl', testName: 'HDL Cholesterol', canonicalName: 'HDL Cholesterol', value: 74, valueRaw: '74', unit: 'mg/dL', refLow: 40, refHigh: 80, refRaw: '40-80', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-ldl', testName: 'LDL Cholesterol', canonicalName: 'LDL Cholesterol', value: 110.28, valueRaw: '110.28', unit: 'mg/dL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2023' },

  // Thyroid Panel
  { id: 'dhruv-2023-tsh', testName: 'Thyroid Stimulating Hormone (TSH)', canonicalName: 'TSH', value: 1.334, valueRaw: '1.334', unit: 'mIU/L', refLow: 0.35, refHigh: 4.94, refRaw: '0.35-4.94', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-t3', testName: 'Tri-Iodothyronine (T3, Total)', canonicalName: 'T3', value: 0.92, valueRaw: '0.92', unit: 'ng/mL', refLow: 0.7, refHigh: 2.04, refRaw: '0.7-2.04', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-t4', testName: 'Thyroxine (T4, Total)', canonicalName: 'T4', value: 8.73, valueRaw: '8.73', unit: 'μg/dL', refLow: 4.87, refHigh: 11.72, refRaw: '4.87-11.72', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2023' },

  // Kidney Panel
  { id: 'dhruv-2023-creatinine', testName: 'Creatinine', canonicalName: 'Creatinine', value: 0.7, valueRaw: '0.7', unit: 'mg/dL', refLow: 0.6, refHigh: 1.3, refRaw: '0.6-1.3', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-urea', testName: 'Urea', canonicalName: 'Urea', value: 26, valueRaw: '26', unit: 'mg/dL', refLow: 19, refHigh: 44, refRaw: '19-44', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-uric-acid', testName: 'Uric Acid', canonicalName: 'Uric Acid', value: 5, valueRaw: '5', unit: 'mg/dL', refLow: 4, refHigh: 8, refRaw: '4-8', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2023' },

  // Electrolytes
  { id: 'dhruv-2023-sodium', testName: 'Sodium', canonicalName: 'Sodium', value: 140, valueRaw: '140', unit: 'mmol/L', refLow: 136, refHigh: 145, refRaw: '136-145', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-potassium', testName: 'Potassium', canonicalName: 'Potassium', value: 4, valueRaw: '4', unit: 'mmol/L', refLow: 4, refHigh: 5, refRaw: '4-5', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-calcium', testName: 'Calcium', canonicalName: 'Calcium', value: 9, valueRaw: '9', unit: 'mg/dL', refLow: 8, refHigh: 10, refRaw: '8-10', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },

  // Liver Profile
  { id: 'dhruv-2023-sgpt', testName: 'SGPT/ALT', canonicalName: 'SGPT/ALT', value: 19, valueRaw: '19', unit: 'U/L', refLow: null, refHigh: 45, refRaw: '—-45', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-bilirubin', testName: 'Bilirubin, Total', canonicalName: 'Bilirubin Total', value: 0.8, valueRaw: '0.8', unit: 'mg/dL', refLow: null, refHigh: 1.2, refRaw: '—-1.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-sgot', testName: 'SGOT/AST', canonicalName: 'SGOT/AST', value: 21, valueRaw: '21', unit: 'U/L', refLow: 11, refHigh: 34, refRaw: '11-34', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-alp', testName: 'Alkaline Phosphatase', canonicalName: 'Alkaline Phosphatase', value: 62, valueRaw: '62', unit: 'U/L', refLow: 50, refHigh: 116, refRaw: '50-116', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-protein', testName: 'Protein, Total', canonicalName: 'Total Protein', value: 6.8, valueRaw: '6.8', unit: 'g/dL', refLow: 6.4, refHigh: 8.3, refRaw: '6.4-8.3', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-albumin', testName: 'Albumin', canonicalName: 'Albumin', value: 4.4, valueRaw: '4.4', unit: 'g/dL', refLow: 3.5, refHigh: 5.2, refRaw: '3.5-5.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },

  // Metabolic Panel
  { id: 'dhruv-2023-glucose', testName: 'Glucose, Fasting', canonicalName: 'Glucose Fasting', value: 94, valueRaw: '94', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic Panel', reportId: 'dhruv-2023' },
];

const dec2025Rows: LabRow[] = [
  // Complete Blood Count
  { id: 'dhruv-2025-hb', testName: 'Hemoglobin', canonicalName: 'Hemoglobin', value: 15.6, valueRaw: '15.6', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-wbc', testName: 'TLC', canonicalName: 'WBC', value: 5, valueRaw: '5', unit: '10^3/μl', refLow: 4, refHigh: 10, refRaw: '4-10', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-rbc', testName: 'RBC', canonicalName: 'RBC', value: 5, valueRaw: '5', unit: '10^6/μl', refLow: 5, refHigh: 6, refRaw: '5-6', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-plt', testName: 'Platelet Count', canonicalName: 'Platelet Count', value: 264, valueRaw: '264', unit: '10^3/μl', refLow: 150, refHigh: 410, refRaw: '150-410', flag: 'normal', panel: 'Complete Blood Count', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-mchc', testName: 'MCHC', canonicalName: 'MCHC', value: 37, valueRaw: '37', unit: 'g/dL', refLow: 31.5, refHigh: 34.5, refRaw: '31.5-34.5', flag: 'high', panel: 'Complete Blood Count', reportId: 'dhruv-2025' },

  // Lipid Profile
  { id: 'dhruv-2025-total-chol', testName: 'Total Cholesterol', canonicalName: 'Total Cholesterol', value: 200, valueRaw: '200', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '—-200', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-trig', testName: 'Triglycerides', canonicalName: 'Triglycerides', value: 74, valueRaw: '74', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '—-150', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-hdl', testName: 'HDL Cholesterol', canonicalName: 'HDL Cholesterol', value: 66, valueRaw: '66', unit: 'mg/dL', refLow: 40, refHigh: 80, refRaw: '40-80', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-ldl', testName: 'LDL Cholesterol', canonicalName: 'LDL Cholesterol', value: 119.2, valueRaw: '119.2', unit: 'mg/dL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2025' },

  // Thyroid Panel
  { id: 'dhruv-2025-tsh', testName: 'Thyroid Stimulating Hormone (Ultrasensitive)', canonicalName: 'TSH', value: 1.2, valueRaw: '1.2', unit: 'mIU/L', refLow: 0.35, refHigh: 4.94, refRaw: '0.35-4.94', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-t3', testName: 'Triiodothyronine (T3)', canonicalName: 'T3', value: 98, valueRaw: '98', unit: 'ng/dL', refLow: 35, refHigh: 193, refRaw: '35-193', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-t4', testName: 'Total Thyroxine (T4)', canonicalName: 'T4', value: 8.1, valueRaw: '8.1', unit: 'μg/dL', refLow: 4.87, refHigh: 11.72, refRaw: '4.87-11.72', flag: 'normal', panel: 'Thyroid Panel', reportId: 'dhruv-2025' },

  // Kidney Panel
  { id: 'dhruv-2025-creatinine', testName: 'Creatinine', canonicalName: 'Creatinine', value: 0.8, valueRaw: '0.8', unit: 'mg/dL', refLow: 0.6, refHigh: 1.3, refRaw: '0.6-1.3', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-urea', testName: 'Blood Urea', canonicalName: 'Urea', value: 22, valueRaw: '22', unit: 'mg/dL', refLow: 19, refHigh: 44, refRaw: '19-44', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-uric-acid', testName: 'Uric Acid', canonicalName: 'Uric Acid', value: 5, valueRaw: '5', unit: 'mg/dL', refLow: 4, refHigh: 8, refRaw: '4-8', flag: 'normal', panel: 'Kidney Panel', reportId: 'dhruv-2025' },

  // Electrolytes
  { id: 'dhruv-2025-sodium', testName: 'Sodium', canonicalName: 'Sodium', value: 140, valueRaw: '140', unit: 'mmol/L', refLow: 136, refHigh: 145, refRaw: '136-145', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-potassium', testName: 'Potassium', canonicalName: 'Potassium', value: 5, valueRaw: '5', unit: 'mmol/L', refLow: 4, refHigh: 5, refRaw: '4-5', flag: 'high', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-calcium', testName: 'Calcium', canonicalName: 'Calcium', value: 9, valueRaw: '9', unit: 'mg/dL', refLow: 8, refHigh: 10, refRaw: '8-10', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },

  // Liver Profile
  { id: 'dhruv-2025-sgpt', testName: 'SGPT/ALT', canonicalName: 'SGPT/ALT', value: 14, valueRaw: '14', unit: 'U/L', refLow: null, refHigh: 45, refRaw: '—-45', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-bilirubin', testName: 'Bilirubin Total', canonicalName: 'Bilirubin Total', value: 0.9, valueRaw: '0.9', unit: 'mg/dL', refLow: null, refHigh: 1.2, refRaw: '—-1.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-sgot', testName: 'SGOT/AST', canonicalName: 'SGOT/AST', value: 18, valueRaw: '18', unit: 'U/L', refLow: 11, refHigh: 34, refRaw: '11-34', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-alp', testName: 'Alkaline Phosphatase', canonicalName: 'Alkaline Phosphatase', value: 81, valueRaw: '81', unit: 'U/L', refLow: 50, refHigh: 116, refRaw: '50-116', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-protein', testName: 'Total Protein', canonicalName: 'Total Protein', value: 7.4, valueRaw: '7.4', unit: 'g/dL', refLow: 6.4, refHigh: 8.3, refRaw: '6.4-8.3', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-albumin', testName: 'Albumin', canonicalName: 'Albumin', value: 4.8, valueRaw: '4.8', unit: 'g/dL', refLow: 3.5, refHigh: 5.2, refRaw: '3.5-5.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },

  // Metabolic Panel
  { id: 'dhruv-2025-glucose', testName: 'Glucose Fasting', canonicalName: 'Glucose Fasting', value: 82, valueRaw: '82', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic Panel', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-hba1c', testName: 'Glycosylated Hemoglobin (HbA1c)', canonicalName: 'HbA1c', value: 5, valueRaw: '5', unit: '%', refLow: null, refHigh: 5.6, refRaw: '—-5.6', flag: 'normal', panel: 'Metabolic Panel', reportId: 'dhruv-2025' },

  // Vitamins & Minerals
  { id: 'dhruv-2025-vitd', testName: 'Vitamin D 25 - Hydroxy', canonicalName: 'Vitamin D', value: 28.2, valueRaw: '28.2', unit: 'ng/mL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'low', panel: 'Vitamins & Minerals', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-b12', testName: 'Vitamin - B12', canonicalName: 'Vitamin B12', value: 405, valueRaw: '405', unit: 'pg/mL', refLow: 187, refHigh: 883, refRaw: '187-883', flag: 'normal', panel: 'Vitamins & Minerals', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-iron', testName: 'Iron', canonicalName: 'Iron', value: 103, valueRaw: '103', unit: 'μg/dL', refLow: 65, refHigh: 175, refRaw: '65-175', flag: 'normal', panel: 'Vitamins & Minerals', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-ferritin', testName: 'Ferritin', canonicalName: 'Ferritin', value: 101, valueRaw: '101', unit: 'ng/mL', refLow: 22, refHigh: 275, refRaw: '22-275', flag: 'normal', panel: 'Vitamins & Minerals', reportId: 'dhruv-2025' },
];

export const sampleReports: LabReport[] = [
  {
    id: 'dhruv-2023',
    fileName: 'Dhruv_Report_-_Blood_Test.pdf',
    reportDate: new Date(2023, 11, 12), // Dec 12, 2023
    labName: 'Apollo Diagnostics',
    patientName: 'Dhruv',
    extractedText: '(Real data from Dhruv\'s lab reports)',
    rows: dec2023Rows,
    status: 'complete',
  },
  {
    id: 'dhruv-2025',
    fileName: 'dhruv_-_Report_202512.pdf',
    reportDate: new Date(2025, 11, 22), // Dec 22, 2025
    labName: 'Redcliffe Labs',
    patientName: 'Dhruv',
    extractedText: '(Real data from Dhruv\'s lab reports)',
    rows: dec2025Rows,
    status: 'complete',
  },
];
