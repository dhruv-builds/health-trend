import { FileText, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { LabReport, TrendData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  reports: LabReport[];
  trends: TrendData[];
  outOfRangeCount: number;
  worseningCount: number;
}

export function StatsBar({ reports, trends, outOfRangeCount, worseningCount }: StatsBarProps) {
  const totalMarkers = trends.length;
  const completedReports = reports.filter(r => r.status === 'complete').length;

  const stats = [
    {
      label: 'Reports',
      value: completedReports,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Markers',
      value: totalMarkers,
      icon: Activity,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
    {
      label: 'Out of Range',
      value: outOfRangeCount,
      icon: AlertTriangle,
      color: outOfRangeCount > 0 ? 'text-destructive' : 'text-success',
      bgColor: outOfRangeCount > 0 ? 'bg-destructive/10' : 'bg-success/10',
    },
    {
      label: 'Near Limit',
      value: worseningCount,
      icon: TrendingUp,
      color: worseningCount > 0 ? 'text-warning' : 'text-success',
      bgColor: worseningCount > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-4 rounded-xl bg-card border"
        >
          <div className={cn('p-2.5 rounded-lg', stat.bgColor)}>
            <stat.icon className={cn('w-5 h-5', stat.color)} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
