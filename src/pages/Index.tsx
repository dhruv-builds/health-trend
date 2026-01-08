import { useMemo, useState, useRef } from 'react';
import { Activity, Shield, Upload } from 'lucide-react';
import { useLabData } from '@/hooks/useLabData';
import { calculateTrends, categorizeTrends } from '@/lib/trends';
import { DropZone } from '@/components/upload/DropZone';
import { ReportList } from '@/components/upload/ReportList';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { MarkerSections } from '@/components/dashboard/MarkerSections';
import { AnalyticsBanner } from '@/components/dashboard/AnalyticsBanner';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { InsightsProvider, useInsightsContext } from '@/contexts/InsightsContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const IndexContent = () => {
  const { reports, activeDataset, addReport, removeReport, updateReportDate, clearAllReports, showPublicExample } = useLabData();
  const { clearInsights } = useInsightsContext();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      await addReport(file);
    }
  };

  const trends = useMemo(() => calculateTrends(reports), [reports]);
  const { outOfRange, worsening, other } = useMemo(() => categorizeTrends(trends), [trends]);

  const handleClearData = () => {
    clearAllReports();
    clearInsights();
    setShowHowItWorks(false);
    toast.success('All data cleared from this browser');
  };

  const handleUploadClick = () => {
    dropzoneRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const fileInput = dropzoneRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    }, 500);
  };

  const handleSwitchBack = () => {
    clearAllReports();
    clearInsights();
    showPublicExample();
  };

  const isPublicExample = activeDataset === 'public_dhruv';

  return (
    <>
      {/* How it works modal */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How HealthTrend works (in your browser)</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Upload multiple lab PDFs to visualize trends, spot out-of-range markers, and get plain-English insights on what to do next.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Processing happens locally on this device (your PDF is read in your browser).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Stored data: your extracted markers are kept only in this browser session unless you export.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Clear data anytime: use 'Clear data' to remove extracted results from this browser.</span>
              </li>
            </ul>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleClearData}
              className="sm:order-1"
            >
              Clear data
            </Button>
            <Button
              onClick={() => setShowHowItWorks(false)}
              className="sm:order-2"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <header className="border-b bg-card/50">
          <div className="container max-w-6xl py-8 px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">
                HealthTrend
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Visualize your blood work history in seconds. See trends, understand ranges, 
              and get plain-English insights. Private, secure, and processed entirely on your device.
            </p>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-primary hover:underline font-medium mt-1"
            >
              How it works
            </button>
          </div>
        </header>

        {/* Medical Disclaimer */}
        <div className="border-b bg-accent/50">
          <div className="container max-w-6xl py-3 px-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-foreground">
              <strong>For educational purposes only.</strong> This tool does not provide medical advice. 
              Always consult your healthcare provider for interpretation of lab results.
            </p>
          </div>
        </div>

        <main className="container max-w-6xl py-8 px-4 space-y-8">

          {/* Upload Section */}
          <section className="grid md:grid-cols-2 gap-6">
            <div ref={dropzoneRef}>
              <DropZone onFilesSelected={handleFilesSelected} />
            </div>
            <ReportList 
              reports={reports}
              activeDataset={activeDataset}
              onRemove={removeReport}
              onDateChange={updateReportDate}
            />
          </section>

          {/* Analytics Section Container */}
          <div className="bg-muted/50 border border-border rounded-xl p-6 space-y-6">
            {/* Public Example Banner */}
            {isPublicExample && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>You're viewing a live example (from real blood reports)</strong>. 
                    Upload your own to see your stats.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={handleUploadClick}
                      size="sm"
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload your report
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Banner with Export Button */}
            {reports.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <AnalyticsBanner reports={reports} activeDataset={activeDataset} />
                <div className="flex flex-col items-end gap-1">
                  <ExportButton 
                    reports={reports}
                    isDemo={isPublicExample}
                    outOfRange={outOfRange}
                    worsening={worsening}
                    other={other}
                  />
                  <p className="text-xs text-muted-foreground">
                    Export saves a copy to your device.
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <StatsBar 
              reports={reports}
              trends={trends}
              outOfRangeCount={outOfRange.length}
              worseningCount={worsening.length}
            />

            {/* Markers Dashboard */}
            <MarkerSections 
              outOfRange={outOfRange}
              worsening={worsening}
              other={other}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/30 py-6 mt-12">
          <div className="container max-w-6xl px-4">
            <p className="text-sm text-muted-foreground text-center">
              HealthTrend — Your lab data stays private. No accounts, no servers, no storage.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

const Index = () => {
  return (
    <InsightsProvider>
      <IndexContent />
    </InsightsProvider>
  );
};

export default Index;
