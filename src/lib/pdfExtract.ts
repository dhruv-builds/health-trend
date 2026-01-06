import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker - use local bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface ExtractionResult {
  text: string;
  detectedDate: Date | null;
  labName: string;
  patientName: string;
}

// Date patterns found in lab reports
const DATE_PATTERNS = [
  // "Dec 22, 2025" or "December 22, 2025"
  /(?:Sample\s+Collected|Collected|Report\s+Date|Reported|Date)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
  // "22/Dec/2023" or "22-Dec-2023"
  /(?:Sample\s+Collected|Collected|Report\s+Date|Reported|Date)[:\s]+(\d{1,2}[\/\-][A-Za-z]+[\/\-]\d{4})/i,
  // "22/12/2023" or "22-12-2023"
  /(?:Sample\s+Collected|Collected|Report\s+Date|Reported|Date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
  // "2023-12-22"
  /(?:Sample\s+Collected|Collected|Report\s+Date|Reported|Date)[:\s]+(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i,
  // NEW: Handle "Reported P 10/12/2025" - allow single char between keyword and date
  /(?:Reported|Collected|Date)[:\s]+\w?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
  // Fallback patterns without prefix
  /(\d{1,2}[\/\-][A-Za-z]{3}[\/\-]\d{4})/i,
  /([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
  // NEW: Last resort - find any DD/MM/YYYY or MM/DD/YYYY pattern
  /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
];

// Lab name patterns
const LAB_PATTERNS = [
  /Redcliffe\s+Labs?/i,
  /Apollo\s+(?:Diagnostics|Labs?)/i,
  /Dr\.?\s*Lal\s*Path\s*Labs?/i,
  /SRL\s+Diagnostics/i,
  /Thyrocare/i,
  /Metropolis/i,
];

// Patient name patterns
const PATIENT_PATTERNS = [
  /(?:Patient\s+Name|Name)[:\s]+([A-Za-z\s]+?)(?:\n|Age|Gender|DOB|$)/i,
  /(?:Mr\.|Mrs\.|Ms\.)\s+([A-Za-z\s]+?)(?:\n|,|Age|$)/i,
  // "Patient: John Doe" or "Patient : John Doe"
  /Patient\s*[:\-]\s*([A-Za-z\s]+?)(?:\n|,|Age|Gender|DOB|Ref|$)/i,
  // "Name : John Doe"
  /\bName\s*[:\-]\s*([A-Za-z\s]+?)(?:\n|,|Age|Gender|DOB|Ref|$)/i,
  // "Client: John Doe"
  /(?:Client|Customer)\s*[:\-]\s*([A-Za-z\s]+?)(?:\n|,|$)/i,
];

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const months: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  // Try "Dec 22, 2025" format
  const monthFirst = dateStr.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (monthFirst) {
    const month = months[monthFirst[1].toLowerCase()];
    if (month !== undefined) {
      return new Date(parseInt(monthFirst[3]), month, parseInt(monthFirst[2]));
    }
  }

  // Try "22/Dec/2023" or "22-Dec-2023" format
  const dayMonthYear = dateStr.match(/(\d{1,2})[\/\-]([A-Za-z]+)[\/\-](\d{4})/);
  if (dayMonthYear) {
    const month = months[dayMonthYear[2].toLowerCase()];
    if (month !== undefined) {
      return new Date(parseInt(dayMonthYear[3]), month, parseInt(dayMonthYear[1]));
    }
  }

  // Try "22/12/2023" format (DD/MM/YYYY)
  const numericDMY = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (numericDMY) {
    return new Date(parseInt(numericDMY[3]), parseInt(numericDMY[2]) - 1, parseInt(numericDMY[1]));
  }

  // Try "2023-12-22" format (YYYY-MM-DD)
  const numericYMD = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (numericYMD) {
    return new Date(parseInt(numericYMD[1]), parseInt(numericYMD[2]) - 1, parseInt(numericYMD[3]));
  }

  return null;
}

function extractMetadata(text: string): { date: Date | null; labName: string; patientName: string } {
  let date: Date | null = null;
  let labName = '';
  let patientName = '';

  // Extract date
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      date = parseDate(match[1]);
      if (date) break;
    }
  }

  // Extract lab name
  for (const pattern of LAB_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      labName = match[0].trim();
      break;
    }
  }

  // Extract patient name
  for (const pattern of PATIENT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      patientName = match[1].trim();
      break;
    }
  }

  return { date, labName, patientName };
}

export async function extractTextFromPDF(file: File): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        if (item && typeof item === 'object' && 'str' in item) {
          const str = (item as { str: unknown }).str;
          return typeof str === 'string' ? str : '';
        }
        return '';
      })
      .join(' ');
    fullText += pageText + '\n';
  }

  const metadata = extractMetadata(fullText);

  return {
    text: fullText,
    detectedDate: metadata.date,
    labName: metadata.labName,
    patientName: metadata.patientName,
  };
}

export function hasExtractableText(text: string): boolean {
  // Check if we got meaningful text (at least some alphanumeric content)
  const alphanumericCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
  return alphanumericCount > 100;
}
