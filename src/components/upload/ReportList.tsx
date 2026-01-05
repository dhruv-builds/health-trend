import { format } from 'date-fns';
import { FileText, Trash2, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { LabReport } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportListProps {
  reports: LabReport[];
  isDemo: boolean;
  onRemove: (reportId: string) => void;
  onDateChange: (reportId: string, date: Date) => void;
}

export function ReportList({ reports, isDemo, onRemove, onDateChange }: ReportListProps) {
  if (reports.length === 0) {
    return null;
  }

  const getStatusIcon = (status: LabReport['status']) => {
    switch (status) {
      case 'extracting':
      case 'parsing':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (report: LabReport) => {
    switch (report.status) {
      case 'extracting':
        return 'Extracting text...';
      case 'parsing':
        return 'Parsing markers...';
      case 'complete':
        return `${report.rows.length} markers found`;
      case 'error':
        return report.error || 'Error processing';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {isDemo ? 'Sample Reports (Demo)' : 'Uploaded Reports'}
        </h3>
        <span className="text-xs text-muted-foreground">
          {reports.length} report{reports.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors',
              report.status === 'error' && 'border-destructive/30 bg-destructive/5'
            )}
          >
            <div className="flex-shrink-0">
              {getStatusIcon(report.status)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{report.fileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {report.labName && (
                  <span>{report.labName}</span>
                )}
                {report.labName && (report.reportDate || report.status === 'complete') && <span>•</span>}
                {report.reportDate ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(report.reportDate, 'MMM d, yyyy')}
                  </span>
                ) : report.status === 'complete' ? (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertCircle className="w-3 h-3" />
                    Date not detected
                  </span>
                ) : null}
                {!report.labName && !report.reportDate && report.status !== 'complete' && (
                  <span>{getStatusText(report)}</span>
                )}
              </div>
            </div>

            {!isDemo && (
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(report.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isDemo && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Upload your own reports to see your personal lab trends
        </p>
      )}
    </div>
  );
}
