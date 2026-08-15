import { TrendData } from '@/types/api';
import { CitationSources } from '@/components/analysis/citation-sources';
import { CalendarClock, Rocket, ArrowUpRight, Waves, BarChart3, TrendingUp, Hash } from 'lucide-react';

export function TrendsTab({ data }: { data: TrendData }) {
  const getPhaseConfig = (phase: string) => {
    const lower = phase.toLowerCase();
    if (lower.includes('early')) return {
      icon: <Rocket className="h-5 w-5" />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      gradient: 'from-violet-500/20 to-transparent',
      description: 'High risk, high reward. Focus on education and securing early adopters to prove product-market fit.',
      badge: 'Early Stage',
    };
    if (lower.includes('growth') || lower.includes('growing')) return {
      icon: <ArrowUpRight className="h-5 w-5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-500/20 to-transparent',
      description: 'Rapid expansion phase. Focus on scaling distribution and capturing market share before saturation.',
      badge: 'Growing',
    };
    if (lower.includes('mature')) return {
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-500/20 to-transparent',
      description: 'Saturated market. Differentiation, niche targeting, and operational efficiency are critical to win.',
      badge: 'Mature',
    };
    return {
      icon: <Waves className="h-5 w-5" />,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      gradient: 'from-sky-500/20 to-transparent',
      description: 'Market dynamics are shifting. Monitor closely and adapt strategy accordingly.',
      badge: phase,
    };
  };

  const phaseConfig = getPhaseConfig(data.market_phase);

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {/* Market Phase — full width */}
      <div className={`lg:col-span-3 relative rounded-2xl border overflow-hidden ${phaseConfig.border}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${phaseConfig.gradient} opacity-60`} />
        <div className="relative p-6 flex flex-col md:flex-row md:items-center gap-6">
          <div className={`shrink-0 flex items-center justify-center h-16 w-16 rounded-2xl border ${phaseConfig.bg} ${phaseConfig.border} ${phaseConfig.color}`}>
            {phaseConfig.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-widest text-muted-foreground`}>Market Phase</span>
              <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-bold ${phaseConfig.bg} ${phaseConfig.color} ${phaseConfig.border}`}>
                {phaseConfig.badge}
              </span>
            </div>
            <h3 className={`text-2xl font-black tracking-tight mb-2 ${phaseConfig.color}`}>{data.market_phase}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{phaseConfig.description}</p>
          </div>
          <div className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border ${phaseConfig.bg} ${phaseConfig.border}`}>
            <TrendingUp className={`h-5 w-5 ${phaseConfig.color}`} />
            <span className={`text-sm font-bold ${phaseConfig.color}`}>Phase Active</span>
          </div>
        </div>
      </div>

      {/* Sub-topics */}
      <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            Emerging Sub-Topics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">What the market is starting to talk about — signals of where attention is moving</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {data.sub_topics.map((topic, idx) => {
              const opacity = Math.max(0.5, 1 - idx * 0.08);
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 text-primary px-3 py-1.5 text-sm font-semibold hover:border-primary/40 hover:bg-primary/20 transition-all cursor-default"
                  style={{ opacity }}
                >
                  <Hash className="h-3 w-3 opacity-70" />
                  {topic.replace(/\s+/g, '')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-amber-400" />
            Seasonal Patterns
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">When demand peaks and dips throughout the year</p>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{data.seasonal_patterns}</p>
        </div>
      </div>

      <CitationSources sources={data.sources} />
    </div>
  );
}
