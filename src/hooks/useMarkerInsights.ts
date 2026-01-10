import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendData, MarkerInsight } from '@/lib/types';

interface UseMarkerInsightsResult {
  getInsights: (trend: TrendData) => Promise<MarkerInsight | null>;
  isLoading: boolean;
  error: string | null;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

export function useMarkerInsights(): UseMarkerInsightsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = useCallback(async (trend: TrendData): Promise<MarkerInsight | null> => {
    setIsLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Wait before retrying (exponential backoff)
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        }

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

        setIsLoading(false);
        return data as MarkerInsight;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');

        // Don't retry on validation errors (these won't succeed on retry)
        if (lastError.message.includes('Invalid') || lastError.message.includes('Missing')) {
          break;
        }

        console.log(`Attempt ${attempt + 1} failed:`, lastError.message);
      }
    }

    const message = lastError?.message || 'Failed to get insights';
    setError(message);
    console.error('Error getting marker insights after retries:', lastError);
    setIsLoading(false);
    return null;
  }, []);

  return { getInsights, isLoading, error };
}
