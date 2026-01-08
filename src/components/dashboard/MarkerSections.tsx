import { useState, useMemo } from 'react';
import { AlertCircle, Eye, Activity, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { TrendData } from '@/lib/types';
import { MarkerCard } from '@/components/markers/MarkerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MarkerSectionsProps {
  outOfRange: TrendData[];
  worsening: TrendData[];
  other: TrendData[];
}

export function MarkerSections({ outOfRange, worsening, other }: MarkerSectionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOther, setShowOther] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  // Get all unique panels
  const allPanels = useMemo(() => {
    const panels = new Set<string>();
    [...outOfRange, ...worsening, ...other].forEach(t => panels.add(t.panel));
    return Array.from(panels).sort();
  }, [outOfRange, worsening, other]);

  // Filter function
  const filterTrends = (trends: TrendData[]) => {
    return trends.filter(t => {
      const matchesSearch = searchQuery === '' || 
        t.canonicalName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPanel = selectedPanel === null || t.panel === selectedPanel;
      return matchesSearch && matchesPanel;
    });
  };

  const filteredOutOfRange = filterTrends(outOfRange);
  const filteredWorsening = filterTrends(worsening);
  const filteredOther = filterTrends(other);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search markers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedPanel === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPanel(null)}
          >
            All
          </Button>
          {allPanels.map(panel => (
            <Button
              key={panel}
              variant={selectedPanel === panel ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPanel(panel)}
            >
              {panel}
            </Button>
          ))}
        </div>
      </div>

      {/* Out of Range Section */}
      {filteredOutOfRange.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Out of Range</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
              {filteredOutOfRange.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOutOfRange.map(trend => (
              <MarkerCard key={trend.canonicalName} trend={trend} />
            ))}
          </div>
        </section>
      )}

      {/* Worsening Trends Section */}
      {filteredWorsening.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Trends to Monitor</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              {filteredWorsening.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorsening.map(trend => (
              <MarkerCard key={trend.canonicalName} trend={trend} />
            ))}
          </div>
        </section>
      )}

      {/* Other Markers Section */}
      {filteredOther.length > 0 && (
        <section>
          <button
            onClick={() => setShowOther(!showOther)}
            className="flex items-center gap-2 mb-4 group"
          >
            <Activity className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              Other Markers
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {filteredOther.length}
            </span>
            {showOther ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {showOther && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {filteredOther.map(trend => (
                <MarkerCard key={trend.canonicalName} trend={trend} showAIInsights={false} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* No results */}
      {filteredOutOfRange.length === 0 && filteredWorsening.length === 0 && filteredOther.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {searchQuery || selectedPanel 
              ? 'No markers match your search' 
              : 'No markers found. Upload lab reports to see your trends.'}
          </p>
        </div>
      )}
    </div>
  );
}
