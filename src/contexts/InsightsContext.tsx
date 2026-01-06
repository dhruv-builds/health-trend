import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MarkerInsight } from '@/lib/types';

interface InsightsContextType {
  insights: Map<string, MarkerInsight>;
  setInsight: (canonicalName: string, insight: MarkerInsight) => void;
  getInsight: (canonicalName: string) => MarkerInsight | undefined;
  getAllInsights: () => Map<string, MarkerInsight>;
  clearInsights: () => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = useState<Map<string, MarkerInsight>>(new Map());

  const setInsight = useCallback((canonicalName: string, insight: MarkerInsight) => {
    setInsights(prev => {
      const newMap = new Map(prev);
      newMap.set(canonicalName, insight);
      return newMap;
    });
  }, []);

  const getInsight = useCallback((canonicalName: string): MarkerInsight | undefined => {
    return insights.get(canonicalName);
  }, [insights]);

  const getAllInsights = useCallback(() => {
    return new Map(insights);
  }, [insights]);

  const clearInsights = useCallback(() => {
    setInsights(new Map());
  }, []);

  return (
    <InsightsContext.Provider value={{ insights, setInsight, getInsight, getAllInsights, clearInsights }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsightsContext() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error('useInsightsContext must be used within an InsightsProvider');
  }
  return context;
}
