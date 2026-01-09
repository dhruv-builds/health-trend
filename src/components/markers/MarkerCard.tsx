import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Eye, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { TrendData, MarkerInsight } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';
import { useMarkerInsights } from '@/hooks/useMarkerInsights';
import { MarkerInsightsPanel } from './MarkerInsightsPanel';
import { useInsightsContext } from '@/contexts/InsightsContext';

interface MarkerCardProps {
  trend: TrendData;
  showAIInsights?: boolean;
}

export function MarkerCard({ trend, showAIInsights = true }: MarkerCardProps) {
  const [showInsights, setShowInsights] = useState(false);
  const { getInsights, isLoading, error } = useMarkerInsights();
  const { getInsight, setInsight: setContextInsight } = useInsightsContext();
  
  // Get insight from context
  const insight = getInsight(trend.canonicalName) || null;

  const {
    canonicalName,
    panel,
    unit,
    dataPoints,
    currentValue,
    previousValue,
    refLow,
    refHigh,
    status,
    changePercent,
    hasUnitVariance,
  } = trend;

  const chartData = dataPoints.map(dp => ({
    date: dp.date.getTime(),
    value: dp.value,
  }));

  const handleGetInsights = async () => {
    if (insight) {
      setShowInsights(!showInsights);
      return;
    }

    const result = await getInsights(trend);
    if (result) {
      setContextInsight(trend.canonicalName, result);
      setShowInsights(true);
    }
  };

  const getStatusStyles = () => {
    // If unit variance detected, show neutral styling
    if (hasUnitVariance && status === 'stable') {
      return {
        border: 'border-border',
        bg: 'bg-card',
        badge: 'bg-secondary text-secondary-foreground',
        badgeText: 'Within Range',
        icon: Minus,
      };
    }

    switch (status) {
      case 'out_of_range':
        return {
          border: 'border-destructive/30',
          bg: 'bg-destructive/5',
          badge: 'bg-destructive text-destructive-foreground',
          badgeText: 'Out of Range',
          icon: AlertCircle,
        };
      case 'worsening':
        return {
          border: 'border-warning/30',
          bg: 'bg-warning/5',
          badge: 'bg-warning text-warning-foreground',
          badgeText: 'Near Limit',
          icon: Eye,
        };
      default:
        return {
          border: 'border-border',
          bg: 'bg-card',
          badge: 'bg-secondary text-secondary-foreground',
          badgeText: 'Within Range',
          icon: Minus,
        };
    }
  };

  const styles = getStatusStyles();
  const StatusIcon = styles.icon;

  const getChangeIcon = () => {
    if (changePercent === null || Math.abs(changePercent) < 1) {
      return <Minus className="w-3 h-3" />;
    }
    return changePercent > 0 
      ? <TrendingUp className="w-3 h-3" />
      : <TrendingDown className="w-3 h-3" />;
  };

  const formatValue = (val: number) => {
    if (val >= 10000) return val.toLocaleString();
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(1);
  };

  const getChartColor = () => {
    switch (status) {
      case 'out_of_range': return 'hsl(var(--destructive))';
      case 'worsening': return 'hsl(var(--warning))';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <div 
      className={cn(
        'rounded-xl border p-4 transition-all hover:shadow-md',
        styles.border,
        styles.bg,
        showAIInsights && 'cursor-pointer'
      )}
      onClick={showAIInsights ? handleGetInsights : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-foreground leading-tight">{canonicalName}</h3>
          <p className="text-xs text-muted-foreground">{panel}</p>
        </div>
        <span className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
          styles.badge
        )}>
          <StatusIcon className="w-3 h-3" />
          {styles.badgeText}
        </span>
      </div>

      {/* Values */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-foreground">
          {formatValue(currentValue)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      {/* Previous value and change - hide if unit variance detected */}
      {previousValue !== null && !hasUnitVariance && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>Previous: {formatValue(previousValue)}</span>
          {changePercent !== null && (
            <span className={cn(
              'flex items-center gap-0.5',
              changePercent > 5 ? 'text-warning' : changePercent < -5 ? 'text-success' : ''
            )}>
              {getChangeIcon()}
              {Math.abs(changePercent).toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {/* Reference range */}
      <div className="text-xs text-muted-foreground mb-3">
        Normal range: {refLow !== null ? formatValue(refLow) : '—'} – {refHigh !== null ? formatValue(refHigh) : '—'} {unit}
      </div>

      {/* Sparkline - hide if unit variance detected */}
      {dataPoints.length > 1 && !hasUnitVariance && (
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              {refLow !== null && (
                <ReferenceLine y={refLow} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" strokeOpacity={0.3} />
              )}
              {refHigh !== null && (
                <ReferenceLine y={refHigh} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" strokeOpacity={0.3} />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={getChartColor()}
                strokeWidth={2}
                dot={{ fill: getChartColor(), r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Unit variance indicator */}
      {hasUnitVariance && (
        <div className="text-xs text-muted-foreground italic py-2">
          Trend unavailable (unit variance detected)
        </div>
      )}

      {/* Dates - hide if unit variance detected */}
      {!hasUnitVariance && (
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {dataPoints.length > 0 && (
            <>
              <span>{format(dataPoints[0].date, 'MMM yyyy')}</span>
              {dataPoints.length > 1 && (
                <span>{format(dataPoints[dataPoints.length - 1].date, 'MMM yyyy')}</span>
              )}
            </>
          )}
        </div>
      )}

      {/* AI Insights Button */}
      {showAIInsights && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              handleGetInsights();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              insight && showInsights ? 'Hide explanation' : (
                <>
                  <Sparkles className="w-3 h-3 text-foreground" />
                  Explain this result
                </>
              )
            )}
          </Button>

          {error && (
            <p className="text-xs text-destructive text-center mt-2">{error}</p>
          )}

          {showInsights && insight && (
            <MarkerInsightsPanel insight={insight} />
          )}
        </div>
      )}
    </div>
  );
}
