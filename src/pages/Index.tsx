import { useMemo } from 'react';
import { Activity, Shield, ArrowRight } from 'lucide-react';
import { useLabData } from '@/hooks/useLabData';
import { calculateTrends, categorizeTrends } from '@/lib/trends';
import { DropZone } from '@/components/upload/DropZone';
import { ReportList } from '@/components/upload/ReportList';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { MarkerSections } from '@/components/dashboard/MarkerSections';

const Index = () => {
  const { reports, isDemo, addReport, removeReport, updateReportDate } = useLabData();

  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      await addReport(file);
    }
  };

  const trends = useMemo(() => calculateTrends(reports), [reports]);
  const { outOfRange, worsening, other } = useMemo(() => categorizeTrends(trends), [trends]);

  return (
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
          <p className="text-muted-foreground max-w-xl">
            Upload your lab reports to visualize trends, identify out-of-range markers, 
            and track changes over time. Your data stays in your browser.
          </p>
        </div>
      </header>

      <main className="container max-w-6xl py-8 px-4 space-y-8">
        {/* Medical Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-accent">
          <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-accent-foreground">
              <strong>For educational purposes only.</strong> This tool does not provide medical advice. 
              Always consult your healthcare provider for interpretation of lab results.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <DropZone onFilesSelected={handleFilesSelected} />
          <ReportList 
            reports={reports}
            isDemo={isDemo}
            onRemove={removeReport}
            onDateChange={updateReportDate}
          />
        </section>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary border border-border">
            <span className="text-sm text-secondary-foreground">
              Viewing sample data
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Upload your reports to see your trends
            </span>
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
  );
};

export default Index;
