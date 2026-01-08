import { useState, useEffect } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TrendData, LabReport } from '@/lib/types';
import { useInsightsContext } from '@/contexts/InsightsContext';
import { exportAnalysisPdf } from '@/lib/exportPdf';

interface FloatingExportButtonProps {
  reports: LabReport[];
  outOfRange: TrendData[];
  worsening: TrendData[];
  other: TrendData[];
  isVisible: boolean;
}

export function FloatingExportButton({ 
  reports, 
  outOfRange, 
  worsening, 
  other, 
  isVisible 
}: FloatingExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { getAllInsights } = useInsightsContext();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const insights = getAllInsights();
      
      await exportAnalysisPdf({
        patientName: reports.find(r => r.patientName)?.patientName || 'Patient',
        reports,
        outOfRange,
        worsening,
        other,
        insights,
      });
      
      setShowSuccess(true);
      toast.success('Report exported successfully!');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="gap-2 shadow-lg rounded-full px-4"
        size="sm"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Generating...</span>
          </>
        ) : showSuccess ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </>
        )}
      </Button>
    </div>
  );
}
