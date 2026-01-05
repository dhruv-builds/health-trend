import { format } from 'date-fns';
import { ArrowRight, User } from 'lucide-react';
import { LabReport } from '@/lib/types';

interface AnalyticsBannerProps {
  reports: LabReport[];
  isDemo: boolean;
}

export const AnalyticsBanner = ({ reports, isDemo }: AnalyticsBannerProps) => {
  // Get the first non-empty patient name
  const patientName = reports.find(r => r.patientName?.trim())?.patientName?.trim() || '';
  
  // Get sorted unique dates from reports with valid dates
  const dates = reports
    .filter(r => r.reportDate)
    .map(r => r.reportDate!)
    .sort((a, b) => a.getTime() - b.getTime());
  
  // Format dates for display
  const formatDates = (dates: Date[]): string => {
    if (dates.length === 0) return '';
    if (dates.length === 1) return format(dates[0], 'MMM d, yyyy');
    if (dates.length === 2) {
      return `${format(dates[0], 'MMM d, yyyy')} and ${format(dates[1], 'MMM d, yyyy')}`;
    }
    // 3+ dates: "Dec 12, 2023, Oct 15, 2024, and Dec 22, 2025"
    const lastDate = dates[dates.length - 1];
    const otherDates = dates.slice(0, -1).map(d => format(d, 'MMM d, yyyy')).join(', ');
    return `${otherDates}, and ${format(lastDate, 'MMM d, yyyy')}`;
  };

  const formattedDates = formatDates(dates);
  
  // Build the message
  const buildMessage = (): React.ReactNode => {
    if (patientName && formattedDates) {
      return (
        <>
          Viewing analytics for <strong className="text-foreground">{patientName}</strong> for{' '}
          <strong className="text-foreground">{formattedDates}</strong>
        </>
      );
    }
    if (patientName) {
      return (
        <>
          Viewing analytics for <strong className="text-foreground">{patientName}</strong>
        </>
      );
    }
    if (formattedDates) {
      return (
        <>
          Viewing analytics for reports from <strong className="text-foreground">{formattedDates}</strong>
        </>
      );
    }
    return 'Viewing analytics for your uploaded reports';
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary border border-border">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-secondary-foreground">
          {buildMessage()}
        </span>
      </div>
      {isDemo && (
        <>
          <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <span className="text-sm font-medium text-foreground">
            Upload your reports to see your trends
          </span>
        </>
      )}
    </div>
  );
};
