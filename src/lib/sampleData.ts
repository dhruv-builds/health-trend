import { LabReport, LabRow } from './types';

// Dhruv's real lab data from Apollo Labs (Dec 2023) and Redcliffe Labs (Dec 2025)

const dec2023Rows: LabRow[] = [
  // Complete Blood Count (CBC)
  { id: 'dhruv-2023-hb', testName: 'Haemoglobin', canonicalName: 'Hemoglobin', value: 14.9, valueRaw: '14.9', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-rbc', testName: 'RBC Count', canonicalName: 'RBC Count', value: 4.75, valueRaw: '4.75', unit: 'Million/cu.mm', refLow: 4.5, refHigh: 5.5, refRaw: '4.5-5.5', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-wbc', testName: 'Total Leucocyte Count (TLC)', canonicalName: 'WBC Count', value: 4400, valueRaw: '4,400', unit: 'cells/cu.mm', refLow: 4000, refHigh: 10000, refRaw: '4000-10000', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-plt', testName: 'Platelet Count', canonicalName: 'Platelet Count', value: 261000, valueRaw: '261000', unit: 'cells/cu.mm', refLow: 150000, refHigh: 410000, refRaw: '150000-410000', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-pcv', testName: 'PCV', canonicalName: 'PCV', value: 44.2, valueRaw: '44.20', unit: '%', refLow: 40, refHigh: 50, refRaw: '40-50', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-mcv', testName: 'MCV', canonicalName: 'MCV', value: 93, valueRaw: '93', unit: 'fL', refLow: 83, refHigh: 101, refRaw: '83-101', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-mch', testName: 'MCH', canonicalName: 'MCH', value: 31.4, valueRaw: '31.4', unit: 'pg', refLow: 27, refHigh: 32, refRaw: '27-32', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-mchc', testName: 'MCHC', canonicalName: 'MCHC', value: 33.8, valueRaw: '33.8', unit: 'g/dL', refLow: 31.5, refHigh: 34.5, refRaw: '31.5-34.5', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-rdw', testName: 'R.D.W', canonicalName: 'RDW', value: 12.5, valueRaw: '12.5', unit: '%', refLow: 11.6, refHigh: 14, refRaw: '11.6-14', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2023' },

  // Lipid Profile
  { id: 'dhruv-2023-total-chol', testName: 'Total Cholesterol', canonicalName: 'Total Cholesterol', value: 201, valueRaw: '201', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '<200', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-trig', testName: 'Triglycerides', canonicalName: 'Triglycerides', value: 83, valueRaw: '83', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '<150', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-hdl', testName: 'HDL Cholesterol', canonicalName: 'HDL Cholesterol', value: 74, valueRaw: '74', unit: 'mg/dL', refLow: 40, refHigh: 60, refRaw: '40-60', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-ldl', testName: 'LDL Cholesterol', canonicalName: 'LDL Cholesterol', value: 110.28, valueRaw: '110.28', unit: 'mg/dL', refLow: null, refHigh: 100, refRaw: '<100', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-vldl', testName: 'VLDL Cholesterol', canonicalName: 'VLDL Cholesterol', value: 16.64, valueRaw: '16.64', unit: 'mg/dL', refLow: null, refHigh: 30, refRaw: '<30', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-non-hdl', testName: 'Non-HDL Cholesterol', canonicalName: 'Non-HDL Cholesterol', value: 127, valueRaw: '127', unit: 'mg/dL', refLow: null, refHigh: 130, refRaw: '<130', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2023' },

  // Liver Profile
  { id: 'dhruv-2023-bilirubin', testName: 'Bilirubin, Total', canonicalName: 'Bilirubin Total', value: 0.78, valueRaw: '0.78', unit: 'mg/dL', refLow: 0.3, refHigh: 1.2, refRaw: '0.3-1.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-ast', testName: 'Aspartate Aminotransferase (AST/SGOT)', canonicalName: 'AST', value: 20.7, valueRaw: '20.7', unit: 'U/L', refLow: null, refHigh: 50, refRaw: '<50', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-alt', testName: 'Alanine Aminotransferase (ALT/SGPT)', canonicalName: 'ALT', value: 18.91, valueRaw: '18.91', unit: 'U/L', refLow: null, refHigh: 50, refRaw: '<50', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-alp', testName: 'Alkaline Phosphatase', canonicalName: 'Alkaline Phosphatase', value: 62.12, valueRaw: '62.12', unit: 'U/L', refLow: 30, refHigh: 120, refRaw: '30-120', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-albumin', testName: 'Albumin', canonicalName: 'Albumin', value: 4.41, valueRaw: '4.41', unit: 'g/dL', refLow: 3.5, refHigh: 5.2, refRaw: '3.5-5.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-protein', testName: 'Protein, Total', canonicalName: 'Total Protein', value: 6.78, valueRaw: '6.78', unit: 'g/dL', refLow: 6.6, refHigh: 8.3, refRaw: '6.6-8.3', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2023' },

  // Kidney Profile
  { id: 'dhruv-2023-creatinine', testName: 'Creatinine', canonicalName: 'Creatinine', value: 0.71, valueRaw: '0.71', unit: 'mg/dL', refLow: 0.72, refHigh: 1.18, refRaw: '0.72-1.18', flag: 'low', panel: 'Kidney Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-urea', testName: 'Urea', canonicalName: 'Urea', value: 25.56, valueRaw: '25.56', unit: 'mg/dL', refLow: 17, refHigh: 43, refRaw: '17-43', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-bun', testName: 'Blood Urea Nitrogen', canonicalName: 'BUN', value: 11.9, valueRaw: '11.9', unit: 'mg/dL', refLow: 8, refHigh: 23, refRaw: '8-23', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-uric-acid', testName: 'Uric Acid', canonicalName: 'Uric Acid', value: 4.53, valueRaw: '4.53', unit: 'mg/dL', refLow: 3.5, refHigh: 7.2, refRaw: '3.5-7.2', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2023' },

  // Thyroid Profile
  { id: 'dhruv-2023-t3', testName: 'Tri-Iodothyronine (T3, Total)', canonicalName: 'T3', value: 0.92, valueRaw: '0.92', unit: 'ng/mL', refLow: 0.7, refHigh: 2.04, refRaw: '0.7-2.04', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-t4', testName: 'Thyroxine (T4, Total)', canonicalName: 'T4', value: 8.73, valueRaw: '8.73', unit: 'μg/dL', refLow: 5.48, refHigh: 14.28, refRaw: '5.48-14.28', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-tsh', testName: 'Thyroid Stimulating Hormone (TSH)', canonicalName: 'TSH', value: 1.334, valueRaw: '1.334', unit: 'μIU/mL', refLow: 0.34, refHigh: 5.6, refRaw: '0.34-5.60', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2023' },

  // Metabolic
  { id: 'dhruv-2023-glucose', testName: 'Glucose, Fasting', canonicalName: 'Fasting Glucose', value: 94, valueRaw: '94', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic', reportId: 'dhruv-2023' },

  // Electrolytes
  { id: 'dhruv-2023-sodium', testName: 'Sodium', canonicalName: 'Sodium', value: 140.24, valueRaw: '140.24', unit: 'mmol/L', refLow: 136, refHigh: 146, refRaw: '136-146', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-potassium', testName: 'Potassium', canonicalName: 'Potassium', value: 4.0, valueRaw: '4.0', unit: 'mmol/L', refLow: 3.5, refHigh: 5.1, refRaw: '3.5-5.1', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-chloride', testName: 'Chloride', canonicalName: 'Chloride', value: 102.74, valueRaw: '102.74', unit: 'mmol/L', refLow: 101, refHigh: 109, refRaw: '101-109', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-calcium', testName: 'Calcium', canonicalName: 'Calcium', value: 9.34, valueRaw: '9.34', unit: 'mg/dL', refLow: 8.8, refHigh: 10.6, refRaw: '8.8-10.6', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
  { id: 'dhruv-2023-phosphorus', testName: 'Phosphorus, Inorganic', canonicalName: 'Phosphorus', value: 2.67, valueRaw: '2.67', unit: 'mg/dL', refLow: 2.5, refHigh: 4.5, refRaw: '2.5-4.5', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2023' },
];

const dec2025Rows: LabRow[] = [
  // Complete Blood Count (CBC)
  { id: 'dhruv-2025-hb', testName: 'Hemoglobin', canonicalName: 'Hemoglobin', value: 15.6, valueRaw: '15.6', unit: 'g/dL', refLow: 13, refHigh: 17, refRaw: '13-17', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-rbc', testName: 'RBC Count', canonicalName: 'RBC Count', value: 5, valueRaw: '5', unit: '10^6/μl', refLow: 4.5, refHigh: 5.5, refRaw: '4.5-5.5', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-wbc', testName: 'TLC', canonicalName: 'WBC Count', value: 4600, valueRaw: '4.6', unit: '10^3/μl', refLow: 4, refHigh: 10, refRaw: '4-10', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-plt', testName: 'Platelet Count', canonicalName: 'Platelet Count', value: 264000, valueRaw: '264', unit: '10^3/μl', refLow: 150, refHigh: 410, refRaw: '150-410', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-pcv', testName: 'PCV', canonicalName: 'PCV', value: 42, valueRaw: '42', unit: '%', refLow: 40, refHigh: 50, refRaw: '40-50', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-mcv', testName: 'MCV', canonicalName: 'MCV', value: 84, valueRaw: '84', unit: 'fl', refLow: 83, refHigh: 101, refRaw: '83-101', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-mch', testName: 'MCH', canonicalName: 'MCH', value: 31.1, valueRaw: '31.1', unit: 'pg', refLow: 27, refHigh: 32, refRaw: '27-32', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-mchc', testName: 'MCHC', canonicalName: 'MCHC', value: 37, valueRaw: '37', unit: 'g/dL', refLow: 31.5, refHigh: 34.5, refRaw: '31.5-34.5', flag: 'high', panel: 'CBC', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-rdw', testName: 'RDW (CV)', canonicalName: 'RDW', value: 13.8, valueRaw: '13.8', unit: '%', refLow: 11.6, refHigh: 14, refRaw: '11.6-14', flag: 'normal', panel: 'CBC', reportId: 'dhruv-2025' },

  // Lipid Profile
  { id: 'dhruv-2025-total-chol', testName: 'Total Cholesterol', canonicalName: 'Total Cholesterol', value: 200, valueRaw: '200', unit: 'mg/dL', refLow: null, refHigh: 200, refRaw: '<200', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-trig', testName: 'Triglycerides', canonicalName: 'Triglycerides', value: 74, valueRaw: '74', unit: 'mg/dL', refLow: null, refHigh: 150, refRaw: '<150', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-hdl', testName: 'HDL Cholesterol', canonicalName: 'HDL Cholesterol', value: 66, valueRaw: '66', unit: 'mg/dL', refLow: 40, refHigh: 80, refRaw: '40-80', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-ldl', testName: 'LDL Cholesterol', canonicalName: 'LDL Cholesterol', value: 119.2, valueRaw: '119.2', unit: 'mg/dL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-vldl', testName: 'V.L.D.L Cholesterol', canonicalName: 'VLDL Cholesterol', value: 14.8, valueRaw: '14.8', unit: 'mg/dL', refLow: null, refHigh: 30, refRaw: '<30', flag: 'normal', panel: 'Lipid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-non-hdl', testName: 'Non HDL Cholesterol', canonicalName: 'Non-HDL Cholesterol', value: 134, valueRaw: '134', unit: 'mg/dL', refLow: null, refHigh: 130, refRaw: '<130', flag: 'high', panel: 'Lipid Profile', reportId: 'dhruv-2025' },

  // Liver Profile
  { id: 'dhruv-2025-bilirubin', testName: 'Bilirubin Total', canonicalName: 'Bilirubin Total', value: 0.9, valueRaw: '0.9', unit: 'mg/dL', refLow: null, refHigh: 1.2, refRaw: '<1.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-ast', testName: 'SGOT/AST', canonicalName: 'AST', value: 18, valueRaw: '18', unit: 'U/L', refLow: 11, refHigh: 34, refRaw: '11-34', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-alt', testName: 'SGPT/ALT', canonicalName: 'ALT', value: 14, valueRaw: '14', unit: 'U/L', refLow: null, refHigh: 45, refRaw: '<45', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-alp', testName: 'Alkaline Phosphatase', canonicalName: 'Alkaline Phosphatase', value: 81, valueRaw: '81', unit: 'U/L', refLow: 50, refHigh: 116, refRaw: '50-116', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-albumin', testName: 'Albumin', canonicalName: 'Albumin', value: 4.8, valueRaw: '4.8', unit: 'g/dL', refLow: 3.5, refHigh: 5.2, refRaw: '3.5-5.2', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-protein', testName: 'Total Protein', canonicalName: 'Total Protein', value: 7.4, valueRaw: '7.4', unit: 'g/dL', refLow: 6.4, refHigh: 8.3, refRaw: '6.4-8.3', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-ggt', testName: 'Gamma Glutamyl Transferase (GGT)', canonicalName: 'GGT', value: 19, valueRaw: '19', unit: 'U/L', refLow: null, refHigh: 55, refRaw: '<55', flag: 'normal', panel: 'Liver Profile', reportId: 'dhruv-2025' },

  // Kidney Profile
  { id: 'dhruv-2025-creatinine', testName: 'Creatinine', canonicalName: 'Creatinine', value: 0.78, valueRaw: '0.78', unit: 'mg/dL', refLow: 0.6, refHigh: 1.3, refRaw: '0.6-1.3', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-urea', testName: 'Blood Urea', canonicalName: 'Urea', value: 22, valueRaw: '22', unit: 'mg/dL', refLow: 19, refHigh: 44.1, refRaw: '19-44.1', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-bun', testName: 'BUN', canonicalName: 'BUN', value: 10.28, valueRaw: '10.28', unit: 'mg/dL', refLow: 8.9, refHigh: 20.6, refRaw: '8.9-20.6', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-uric-acid', testName: 'Uric Acid', canonicalName: 'Uric Acid', value: 4.8, valueRaw: '4.8', unit: 'mg/dL', refLow: 3.7, refHigh: 7.7, refRaw: '3.7-7.7', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-egfr', testName: 'eGFR (CKD-EPI)', canonicalName: 'eGFR', value: 117.78, valueRaw: '117.78', unit: 'ml/min/1.73 sq m', refLow: 90, refHigh: null, refRaw: '>90', flag: 'normal', panel: 'Kidney Profile', reportId: 'dhruv-2025' },

  // Thyroid Profile
  { id: 'dhruv-2025-t3', testName: 'Triiodothyronine (T3)', canonicalName: 'T3', value: 98, valueRaw: '98', unit: 'ng/dL', refLow: 35, refHigh: 193, refRaw: '35-193', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-t4', testName: 'Total Thyroxine (T4)', canonicalName: 'T4', value: 8.1, valueRaw: '8.1', unit: 'μg/dL', refLow: 4.87, refHigh: 11.72, refRaw: '4.87-11.72', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-tsh', testName: 'Thyroid Stimulating Hormone (Ultrasensitive)', canonicalName: 'TSH', value: 1.2, valueRaw: '1.2', unit: 'mIU/L', refLow: 0.35, refHigh: 4.94, refRaw: '0.35-4.94', flag: 'normal', panel: 'Thyroid Profile', reportId: 'dhruv-2025' },

  // Metabolic / Diabetes
  { id: 'dhruv-2025-glucose', testName: 'Glucose Fasting', canonicalName: 'Fasting Glucose', value: 82, valueRaw: '82', unit: 'mg/dL', refLow: 70, refHigh: 100, refRaw: '70-100', flag: 'normal', panel: 'Metabolic', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-hba1c', testName: 'Glycosylated Hemoglobin (HbA1c)', canonicalName: 'HbA1c', value: 5, valueRaw: '5', unit: '%', refLow: null, refHigh: 5.6, refRaw: '<5.6', flag: 'normal', panel: 'Metabolic', reportId: 'dhruv-2025' },

  // Vitamins
  { id: 'dhruv-2025-vitd', testName: 'Vitamin D 25 - Hydroxy', canonicalName: 'Vitamin D', value: 28.2, valueRaw: '28.2', unit: 'ng/mL', refLow: 30, refHigh: 100, refRaw: '30-100', flag: 'low', panel: 'Vitamins', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-b12', testName: 'Vitamin - B12', canonicalName: 'Vitamin B12', value: 405, valueRaw: '405', unit: 'pg/mL', refLow: 187, refHigh: 883, refRaw: '187-883', flag: 'normal', panel: 'Vitamins', reportId: 'dhruv-2025' },

  // Electrolytes
  { id: 'dhruv-2025-sodium', testName: 'Sodium', canonicalName: 'Sodium', value: 140, valueRaw: '140', unit: 'mmol/L', refLow: 136, refHigh: 145, refRaw: '136-145', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-potassium', testName: 'Potassium', canonicalName: 'Potassium', value: 4.5, valueRaw: '4.5', unit: 'mmol/L', refLow: 3.5, refHigh: 5.1, refRaw: '3.5-5.1', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-chloride', testName: 'Chloride', canonicalName: 'Chloride', value: 105, valueRaw: '105', unit: 'mmol/L', refLow: 98, refHigh: 107, refRaw: '98-107', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-calcium', testName: 'Calcium Serum', canonicalName: 'Calcium', value: 9.2, valueRaw: '9.2', unit: 'mg/dL', refLow: 8.4, refHigh: 10.2, refRaw: '8.4-10.2', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-phosphorus', testName: 'Phosphorus', canonicalName: 'Phosphorus', value: 3, valueRaw: '3', unit: 'mg/dL', refLow: 2.3, refHigh: 4.7, refRaw: '2.3-4.7', flag: 'normal', panel: 'Electrolytes', reportId: 'dhruv-2025' },

  // Iron Studies
  { id: 'dhruv-2025-iron', testName: 'Iron', canonicalName: 'Iron', value: 103, valueRaw: '103', unit: 'μg/dL', refLow: 65, refHigh: 175, refRaw: '65-175', flag: 'normal', panel: 'Iron Studies', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-tibc', testName: 'TIBC (Total Iron Binding Capacity)', canonicalName: 'TIBC', value: 282, valueRaw: '282', unit: 'μg/dL', refLow: 228, refHigh: 428, refRaw: '228-428', flag: 'normal', panel: 'Iron Studies', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-transferrin', testName: 'Transferrin Saturation', canonicalName: 'Transferrin Saturation', value: 36.52, valueRaw: '36.52', unit: '%', refLow: 16, refHigh: 45, refRaw: '16-45', flag: 'normal', panel: 'Iron Studies', reportId: 'dhruv-2025' },

  // Inflammation
  { id: 'dhruv-2025-crp', testName: 'CRP (Quantitative)', canonicalName: 'CRP', value: 1.2, valueRaw: '1.2', unit: 'mg/L', refLow: null, refHigh: 5, refRaw: '<5', flag: 'normal', panel: 'Inflammation', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-esr', testName: 'ESR - Erythrocyte Sedimentation Rate', canonicalName: 'ESR', value: 4, valueRaw: '4', unit: 'mm/hr', refLow: null, refHigh: 10, refRaw: '<10', flag: 'normal', panel: 'Inflammation', reportId: 'dhruv-2025' },
  { id: 'dhruv-2025-hscrp', testName: 'Highly Sensitive C-Reactive Protein (hs-CRP)', canonicalName: 'hs-CRP', value: 1, valueRaw: '1', unit: 'mg/L', refLow: null, refHigh: 1, refRaw: '<1', flag: 'normal', panel: 'Inflammation', reportId: 'dhruv-2025' },
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
