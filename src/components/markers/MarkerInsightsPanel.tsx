import { MarkerInsight } from '@/lib/types';
import { Lightbulb, AlertCircle, HeartPulse, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkerInsightsPanelProps {
  insight: MarkerInsight;
}

export function MarkerInsightsPanel({ insight }: MarkerInsightsPanelProps) {
  return (
    <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Explanation */}
      <div className="flex gap-2">
        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">{insight.explanation}</p>
      </div>

      {/* Concerns */}
      {insight.concerns.length > 0 && (
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Potential Concerns</p>
            <ul className="text-sm text-foreground space-y-1">
              {insight.concerns.map((concern, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-muted-foreground">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {insight.suggestions.length > 0 && (
        <div className="flex gap-2">
          <HeartPulse className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Suggestions</p>
            <ul className="text-sm text-foreground space-y-1">
              {insight.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-muted-foreground">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Doctor Questions */}
      {insight.doctorQuestions.length > 0 && (
        <div className="flex gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Questions for Your Doctor</p>
            <ul className="text-sm text-foreground space-y-1">
              {insight.doctorQuestions.map((question, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-muted-foreground">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Confidence indicator */}
      <div className="flex justify-end">
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          insight.confidence === 'high' ? 'bg-primary/10 text-primary' :
          insight.confidence === 'medium' ? 'bg-secondary text-secondary-foreground' :
          'bg-muted text-muted-foreground'
        )}>
          {insight.confidence} confidence
        </span>
      </div>
    </div>
  );
}
