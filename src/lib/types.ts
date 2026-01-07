// Core data types for HealthTrend

export type ActiveDataset = 'none' | 'public_dhruv' | 'user_upload';

export interface LabRow {
  id: string;
  testName: string;
  canonicalName: string;
  value: number | null;
  valueRaw: string;
  unit: string;
  refLow: number | null;
  refHigh: number | null;
  refRaw: string;
  flag: 'normal' | 'low' | 'high' | 'critical';
  panel: string;
  reportId: string;
}

export interface LabReport {
  id: string;
  fileName: string;
  reportDate: Date | null;
  labName: string;
  patientName: string;
  extractedText: string;
  rows: LabRow[];
  status: 'pending' | 'extracting' | 'parsing' | 'complete' | 'error';
  error?: string;
}

export interface TrendData {
  canonicalName: string;
  panel: string;
  unit: string;
  dataPoints: Array<{
    date: Date;
    value: number;
    refLow: number | null;
    refHigh: number | null;
    flag: LabRow['flag'];
    reportId: string;
  }>;
  currentValue: number;
  previousValue: number | null;
  refLow: number | null;
  refHigh: number | null;
  status: 'out_of_range' | 'worsening' | 'stable' | 'improving';
  changePercent: number | null;
  hasUnitVariance: boolean;
}

export interface MarkerInsight {
  canonicalName: string;
  explanation: string;
  concerns: string[];
  suggestions: string[];
  doctorQuestions: string[];
  confidence: 'low' | 'medium' | 'high';
}
