import { useState, useEffect } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  showNudge?: boolean;
  onDismissNudge?: () => void;
  onExportClick?: () => void;
}

export function FloatingExportButton({ 
  reports, 
  outOfRange, 
  worsening, 
  other, 
  isVisible,
  showNudge = false,
  onDismissNudge,
  onExportClick,
}: FloatingExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const { getAllInsights } = useInsightsContext();

  // Sync nudge visibility with prop and handle auto-dismiss
  useEffect(() => {
    if (showNudge) {
      setNudgeVisible(true);
      const timer = setTimeout(() => {
        setNudgeVisible(false);
        onDismissNudge?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNudge, onDismissNudge]);

  // Dismiss on global click/tap
  useEffect(() => {
    if (!nudgeVisible) return;
    
    const handleClick = () => {
      setNudgeVisible(false);
      onDismissNudge?.();
    };
    
    // Use a small delay to avoid dismissing immediately on the same click that triggered the nudge
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick);
      document.addEventListener('touchstart', handleClick);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [nudgeVisible, onDismissNudge]);

  const dismissNudge = () => {
    setNudgeVisible(false);
    onDismissNudge?.();
  };

  const handleExport = async () => {
    onExportClick?.();
    dismissNudge();
    
    // Check if any markers are detected
    const totalMarkers = outOfRange.length + worsening.length + other.length;
    
    if (totalMarkers === 0) {
      toast.error('No markers detected. Please make sure a lab report is uploaded.');
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
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <TooltipProvider>
        <Tooltip open={nudgeVisible}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleExport}
              onMouseEnter={dismissNudge}
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
          </TooltipTrigger>
          <TooltipContent 
            side="left" 
            className="bg-primary text-primary-foreground font-medium px-3 py-2"
          >
            <p>Save your analysis for your doctor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
