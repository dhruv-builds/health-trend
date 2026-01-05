import { useState, useCallback } from 'react';
import { LabReport } from '@/lib/types';
import { extractTextFromPDF, hasExtractableText } from '@/lib/pdfExtract';
import { parseLabText } from '@/lib/parseLabs';
import { sampleReports } from '@/lib/sampleData';

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
      
      if (!hasExtractableText(extraction.text)) {
        setReports(prev => prev.map(r => 
          r.id === reportId 
            ? { ...r, status: 'error', error: 'Could not extract text. Try enabling OCR.' }
            : r
        ));
        return;
      }

      // Parse the extracted text
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'parsing', extractedText: extraction.text }
          : r
      ));

      const rows = parseLabText(extraction.text, reportId);

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
