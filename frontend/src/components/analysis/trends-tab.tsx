import { TrendData } from '@/types/api';
import { CitationSources } from '@/components/analysis/citation-sources';
import {
  CalendarClock,
  Rocket,
  ArrowUpRight,
  Waves,
  BarChart3,
  TrendingUp,
  Hash,
  Sparkles,
  Zap,
  Layers,
  Compass,
  Activity,
  Flame,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function TrendsTab({ data }: { data: TrendData }) {
  const getPhaseConfig = (phase: string) => {
    const lower = phase.toLowerCase();
    if (lower.includes('early')) return {
      icon: <Rocket className="h-6 w-6" />,
      color: 'text-violet-400',
      glow: 'shadow-[0_0_25px_rgba(167,139,250,0.15)]',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      gradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
      accentBg: 'bg-violet-400',
      ringColor: 'ring-violet-500/30',
      description: 'High risk, high reward phase. Priority: Market education, acquiring early adopters, proving unit economics, and validating core value propositions.',
      badge: 'Early Stage',
      strategyTag: 'Pioneer & Validate',
      stageIndex: 0,
    };
    if (lower.includes('growth') || lower.includes('growing')) return {
      icon: <ArrowUpRight className="h-6 w-6" />,
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(52,211,153,0.15)]',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      accentBg: 'bg-emerald-400',
      ringColor: 'ring-emerald-500/30',
      description: 'Rapid market expansion phase. Priority: Scaling customer acquisition, expanding distribution channels, and locking in market share before saturation.',
      badge: 'Growing',
      strategyTag: 'Scale & Dominate',
      stageIndex: 1,
    };
    if (lower.includes('mature')) return {
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-amber-400',
      glow: 'shadow-[0_0_25px_rgba(251,191,36,0.15)]',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
      accentBg: 'bg-amber-400',
      ringColor: 'ring-amber-500/30',
      description: 'Established/Saturated market phase. Priority: Brand differentiation, feature specialization, operational efficiency, and customer retention.',
      badge: 'Mature',
      strategyTag: 'Differentiate & Retain',
      stageIndex: 2,
    };
    return {
      icon: <Waves className="h-6 w-6" />,
      color: 'text-sky-400',
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.15)]',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      gradient: 'from-sky-500/15 via-sky-500/5 to-transparent',
      accentBg: 'bg-sky-400',
      ringColor: 'ring-sky-500/30',
      description: 'Market dynamics are shifting rapidly. Priority: Monitor emerging technology/behavior shifts, pivot flexible features, and maintain strategic agility.',
      badge: phase || 'Shifting',
      strategyTag: 'Pivot & Adapt',
      stageIndex: 3,
    };
  };

  const phaseConfig = getPhaseConfig(data.market_phase);

  const stages = [
    { label: 'Early Stage', desc: 'Emerging demand' },
    { label: 'Growth Phase', desc: 'Rapid adoption' },
    { label: 'Mature Market', desc: 'Established ecosystem' },
    { label: 'Shifting Dynamics', desc: 'Evolution & Pivots' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Card: Market Phase & Lifecycle Visualizer */}
      <div className={`relative rounded-3xl border ${phaseConfig.border} bg-card/60 backdrop-blur-xl overflow-hidden p-6 md:p-8 transition-all duration-300 ${phaseConfig.glow}`}>
        {/* Background Ambient Glow */}
        <div className={`absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${phaseConfig.gradient} blur-3xl pointer-events-none opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center h-12 w-12 rounded-2xl border ${phaseConfig.border} ${phaseConfig.bg} ${phaseConfig.color} shadow-inner`}>
                {phaseConfig.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${phaseConfig.accentBg} animate-pulse`} />
                    Market Phase Diagnostics
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3 mt-0.5">
                  {data.market_phase}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold ${phaseConfig.bg} ${phaseConfig.color} ${phaseConfig.border}`}>
                <Zap className="h-3.5 w-3.5" />
                {phaseConfig.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Compass className="h-3.5 w-3.5 text-primary" />
                {phaseConfig.strategyTag}
              </span>
            </div>
          </div>

          {/* Description & Strategy Grid */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2 flex flex-col justify-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Market Lifecycle Strategic Outlook
              </h3>
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-normal">
                {phaseConfig.description}
              </p>
            </div>

            <div className={`rounded-2xl border ${phaseConfig.border} ${phaseConfig.bg} p-4 flex flex-col justify-between backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Momentum</span>
                <TrendingUp className={`h-4 w-4 ${phaseConfig.color}`} />
              </div>
              <div className="text-2xl font-black tracking-tight mb-1 text-foreground">
                {phaseConfig.badge} Velocity
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Optimized for targeted market execution in current state.
              </p>
            </div>
          </div>

          {/* Market Lifecycle Stage Stepper */}
          <div className="pt-4 border-t border-white/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Industry Lifecycle Stage
              </span>
              <span className="text-[11px] text-muted-foreground">
                Stage {phaseConfig.stageIndex + 1} of 4
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {stages.map((stg, i) => {
                const isActive = i === phaseConfig.stageIndex;
                const isPassed = i < phaseConfig.stageIndex;
                return (
                  <div
                    key={i}
                    className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all duration-300 ${
                      isActive
                        ? `${phaseConfig.border} ${phaseConfig.bg} ${phaseConfig.ringColor} ring-1`
                        : isPassed
                        ? 'border-white/10 bg-white/[0.03] text-foreground/80'
                        : 'border-white/5 bg-white/[0.01] text-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold tracking-wider ${isActive ? phaseConfig.color : isPassed ? 'text-primary' : 'text-muted-foreground/40'}`}>
                        0{i + 1}
                      </span>
                      {isActive ? (
                        <span className={`inline-block h-2 w-2 rounded-full ${phaseConfig.accentBg} animate-ping`} />
                      ) : isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                      ) : null}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isActive ? 'text-foreground' : isPassed ? 'text-foreground/90' : 'text-muted-foreground/60'}`}>
                        {stg.label}
                      </h4>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-1">
                        {stg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Sub-Topics & Seasonal Patterns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Emerging Sub-Topics (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Flame className="h-4 w-4" />
                </div>
                Emerging Sub-Topics & Signals
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Market interest clusters and shift signals detected across search & social channels
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold bg-white/5 border border-white/10 rounded-full px-3 py-1 text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {data.sub_topics.length} Signals
            </span>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex flex-wrap gap-2.5">
              {data.sub_topics.map((topic, idx) => {
                return (
                  <div
                    key={idx}
                    className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-blue/[0.03] hover:bg-primary/10 hover:border-primary/40 px-3.5 py-2 text-xs font-semibold text-foreground/90 hover:text-primary transition-all duration-200 cursor-default shadow-sm hover:shadow-md"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary/70 transition-colors">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                      {topic.replace(/\s+/g, '')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Sub-topic resonance mapped from search volume and consumer discussions
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/70">
                Sorted by relevance
              </span>
            </div>
          </div>
        </div>

        {/* Seasonal Patterns (1 col) */}
        <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <CalendarClock className="h-4 w-4" />
                </div>
                Seasonal Demand Patterns
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Cyclical fluctuations, annual peaks, and market demand seasonality
              </p>
            </div>

            <div className="p-6">
              {/* Seasonal Quarter Timeline Badges */}
              {/* <div className="grid grid-cols-4 gap-1.5 mb-5 p-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, idx) => (
                  <div key={idx} className="flex flex-col items-center py-1">
                    <span className="text-[10px] font-bold text-muted-foreground">{q}</span>
                    <div className="h-1 w-full rounded-full bg-primary/30 mt-1" />
                  </div>
                ))}
              </div> */}

              <div className="relative rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-foreground/90 leading-relaxed">
                <p className="relative z-10 text-xs md:text-sm leading-relaxed text-muted-foreground">
                  {data.seasonal_patterns}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Use seasonal cycles to plan marketing campaigns and product launches.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Citations section */}
      <CitationSources sources={data.sources} />
    </div>
  );
}

