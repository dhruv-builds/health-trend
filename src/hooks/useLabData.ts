import { useState, useCallback } from 'react';
import { LabReport, LabRow } from '@/lib/types';
import { extractTextFromPDF, hasExtractableText } from '@/lib/pdfExtract';
import { parseLabText } from '@/lib/parseLabs';
import { sampleReports } from '@/lib/sampleData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

async function standardizeWithAI(text: string, reportId: string): Promise<LabRow[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('standardize-labs', {
      body: { text, reportId }
    });

    if (error) {
      console.error('AI standardization error:', error);
      return null;
    }

    if (data?.error) {
      console.error('AI processing error:', data.error);
      if (data.error.includes('Rate limit')) {
        toast.error('AI rate limit exceeded. Using fallback parser.');
      }
      return null;
    }

    return data?.labRows || null;
  } catch (err) {
    console.error('Failed to call standardize-labs:', err);
    return null;
  }
}

export function useLabData() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isDemo, setIsDemo] = useState(true);

  const addReport = useCallback(async (file: File) => {
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create initial report entry
    const newReport: LabReport = {
      id: reportId,
      fileName: file.name,
      reportDate: null,
      labName: '',
      patientName: '',
      extractedText: '',
      rows: [],
      status: 'extracting',
    };

    setReports(prev => [...prev, newReport]);
    setIsDemo(false);

    try {
      // Extract text from PDF
      const extraction = await extractTextFromPDF(file);
      
      // Debug logging for date extraction
      console.log(`[${file.name}] Extracted date: ${extraction.detectedDate}, lab: ${extraction.labName}`);
      
      if (!hasExtractableText(extraction.text)) {
        setReports(prev => prev.map(r => 
          r.id === reportId 
            ? { ...r, status: 'error', error: 'Could not extract text. Try enabling OCR.' }
            : r
        ));
        return;
      }

      // Parse the extracted text - try AI first, fallback to regex
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'parsing', extractedText: extraction.text }
          : r
      ));

      // Try AI-powered standardization first
      let rows = await standardizeWithAI(extraction.text, reportId);
      
      // Fallback to regex parser if AI fails
      if (!rows || rows.length === 0) {
        console.log('AI parsing failed or returned no results, using fallback regex parser');
        rows = parseLabText(extraction.text, reportId);
      } else {
        console.log(`AI successfully parsed ${rows.length} lab results`);
      }

      // Update with parsed data
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? {
              ...r,
              status: 'complete',
              reportDate: extraction.detectedDate,
              labName: extraction.labName,
              patientName: extraction.patientName,
              rows,
            }
          : r
      ));
    } catch (error) {
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
          : r
      ));
    }
  }, []);

  const removeReport = useCallback((reportId: string) => {
    setReports(prev => {
      const newReports = prev.filter(r => r.id !== reportId);
      if (newReports.length === 0) {
        setIsDemo(true);
      }
      return newReports;
    });
  }, []);

  const updateReportDate = useCallback((reportId: string, date: Date) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, reportDate: date } : r
    ));
  }, []);

  const clearAllReports = useCallback(() => {
    setReports([]);
    setIsDemo(true);
  }, []);

  // Return demo data if no reports uploaded
  const activeReports = isDemo ? sampleReports : reports;

  return {
    reports: activeReports,
    isDemo,
    addReport,
    removeReport,
    updateReportDate,
    clearAllReports,
  };
}
