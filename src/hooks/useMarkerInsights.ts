import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendData, MarkerInsight } from '@/lib/types';

interface UseMarkerInsightsResult {
  getInsights: (trend: TrendData) => Promise<MarkerInsight | null>;
  isLoading: boolean;
  error: string | null;
}

export function useMarkerInsights(): UseMarkerInsightsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = useCallback(async (trend: TrendData): Promise<MarkerInsight | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('marker-insights', {
        body: {
          marker: {
            canonicalName: trend.canonicalName,
            currentValue: trend.currentValue,
            previousValue: trend.previousValue,
            unit: trend.unit,
            refLow: trend.refLow,
            refHigh: trend.refHigh,
            status: trend.status,
            changePercent: trend.changePercent,
          }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data as MarkerInsight;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get insights';
      setError(message);
      console.error('Error getting marker insights:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getInsights, isLoading, error };
}
