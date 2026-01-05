import { LabRow, LabReport, TrendData } from './types';

export function calculateTrends(reports: LabReport[]): TrendData[] {
  // Group all rows by canonical name
  const grouped = new Map<string, {
    rows: LabRow[];
    dates: Date[];
    reports: LabReport[];
  }>();

  for (const report of reports) {
    if (!report.reportDate || report.status !== 'complete') continue;
    
    for (const row of report.rows) {
      if (row.value === null) continue;
      
      const existing = grouped.get(row.canonicalName);
      if (existing) {
        existing.rows.push(row);
        existing.dates.push(report.reportDate);
        existing.reports.push(report);
      } else {
        grouped.set(row.canonicalName, {
          rows: [row],
          dates: [report.reportDate],
          reports: [report],
        });
      }
    }
  }

  const trends: TrendData[] = [];

  for (const [canonicalName, data] of grouped) {
    // Sort by date
    const sorted = data.rows
      .map((row, i) => ({ row, date: data.dates[i], report: data.reports[i] }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (sorted.length === 0) continue;

    const latestEntry = sorted[sorted.length - 1];
    const previousEntry = sorted.length > 1 ? sorted[sorted.length - 2] : null;

    const currentValue = latestEntry.row.value!;
    const previousValue = previousEntry?.row.value ?? null;
    const refLow = latestEntry.row.refLow;
    const refHigh = latestEntry.row.refHigh;

    // Calculate change percentage
    let changePercent: number | null = null;
    if (previousValue !== null && previousValue !== 0) {
      changePercent = ((currentValue - previousValue) / previousValue) * 100;
    }

    // Determine status
    const status = determineStatus(currentValue, previousValue, refLow, refHigh, changePercent);

    trends.push({
      canonicalName,
      panel: latestEntry.row.panel,
      unit: latestEntry.row.unit,
      dataPoints: sorted.map(s => ({
        date: s.date,
        value: s.row.value!,
        refLow: s.row.refLow,
        refHigh: s.row.refHigh,
        flag: s.row.flag,
        reportId: s.row.reportId,
      })),
      currentValue,
      previousValue,
      refLow,
      refHigh,
      status,
      changePercent,
    });
  }

  return trends;
}

function determineStatus(
  current: number,
  previous: number | null,
  refLow: number | null,
  refHigh: number | null,
  changePercent: number | null
): TrendData['status'] {
  // Check if currently out of range
  if (refLow !== null && current < refLow) return 'out_of_range';
  if (refHigh !== null && current > refHigh) return 'out_of_range';

  // If no previous value, consider stable
  if (previous === null || changePercent === null) return 'stable';

  // Check for worsening trend (moving toward boundary)
  const isWorseningTowardLow = refLow !== null && changePercent < -5 && current < previous;
  const isWorseningTowardHigh = refHigh !== null && changePercent > 5 && current > previous;

  // Also check if getting significantly closer to boundary
  if (refLow !== null && refHigh !== null) {
    const prevDistanceToLow = previous - refLow;
    const currDistanceToLow = current - refLow;
    const prevDistanceToHigh = refHigh - previous;
    const currDistanceToHigh = refHigh - current;

    // If distance to boundary reduced by more than 20%, consider worsening
    if (prevDistanceToLow > 0 && currDistanceToLow > 0) {
      if (currDistanceToLow < prevDistanceToLow * 0.8) return 'worsening';
    }
    if (prevDistanceToHigh > 0 && currDistanceToHigh > 0) {
      if (currDistanceToHigh < prevDistanceToHigh * 0.8) return 'worsening';
    }
  }

  if (isWorseningTowardLow || isWorseningTowardHigh) return 'worsening';

  // Check for improving trend (moving away from boundary)
  if (changePercent !== null) {
    if (refLow !== null && changePercent > 5 && previous < current) return 'improving';
    if (refHigh !== null && changePercent < -5 && previous > current) return 'improving';
  }

  return 'stable';
}

export function categorizeTrends(trends: TrendData[]): {
  outOfRange: TrendData[];
  worsening: TrendData[];
  other: TrendData[];
} {
  const outOfRange = trends.filter(t => t.status === 'out_of_range');
  const worsening = trends.filter(t => t.status === 'worsening');
  const other = trends.filter(t => t.status === 'stable' || t.status === 'improving');

  return { outOfRange, worsening, other };
}
