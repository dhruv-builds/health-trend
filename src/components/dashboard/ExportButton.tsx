import { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TrendData, LabReport } from '@/lib/types';
import { useInsightsContext } from '@/contexts/InsightsContext';
import { exportAnalysisPdf } from '@/lib/exportPdf';

interface ExportButtonProps {
  reports: LabReport[];
  isDemo: boolean;
  outOfRange: TrendData[];
  worsening: TrendData[];
  other: TrendData[];
}

export function ExportButton({ reports, isDemo, outOfRange, worsening, other }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { getAllInsights } = useInsightsContext();

  const handleExport = async () => {
    if (isDemo) {
      toast.info('Upload your blood reports first to export analysis', {
        action: {
          label: 'Upload',
          onClick: () => {
            // Scroll to upload section
            const dropZone = document.querySelector('[data-dropzone]');
            if (dropZone) {
              dropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          },
        },
      });
      return;
    }

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
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : showSuccess ? (
        <>
          <Check className="w-4 h-4" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
