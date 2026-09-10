
import { RiskAssessment } from '@/types/api';
import { AlertTriangle, ShieldAlert, Lightbulb, TrendingDown, BarChart3, Swords, DollarSign, Scale, Gauge } from 'lucide-react';

export function RiskTab({ data }: { data: RiskAssessment }) {
  const getRiskConfig = (score: number) => {
    if (score < 40) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' };
    if (score < 70) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' };
    return { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: 'bg-red-500' };
  };

  const riskDimensions = [
    { label: 'Market Risk', value: data.market_risk, Icon: BarChart3 },
    { label: 'Competition Risk', value: data.competition_risk, Icon: Swords },
    { label: 'Financial Risk', value: data.financial_risk, Icon: DollarSign },
    { label: 'Regulatory Risk', value: data.regulatory_risk, Icon: Scale },
  ];

  // ---- Derived insights (presentation-only, computed from the same 4 scores) ----
  const overallScore = Math.round(riskDimensions.reduce((sum, d) => sum + d.value, 0) / riskDimensions.length);
  const overallCfg = getRiskConfig(overallScore);
  const topConcern = riskDimensions.reduce((max, d) => (d.value > max.value ? d : max), riskDimensions[0]);

  return (
    <div className="flex flex-col gap-5">
      {/* Overall risk summary */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-white/5">
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
          <div className={`shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-xl border ${overallCfg.border} ${overallCfg.bg} px-8 py-5`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              Overall Risk
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-black ${overallCfg.color}`}>{overallScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${overallCfg.bg} ${overallCfg.color} ${overallCfg.border}`}>
              {overallCfg.label}
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
            <p className="text-sm text-foreground leading-relaxed">
              This venture scores <span className={`font-bold ${overallCfg.color}`}>{overallCfg.label.toLowerCase()} overall risk</span>{' '}
              across the four dimensions tracked below. The primary area of concern is{' '}
              <span className="font-bold text-foreground">{topConcern.label}</span>, scoring{' '}
              <span className={`font-bold ${getRiskConfig(topConcern.value).color}`}>{topConcern.value}/100</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              Composite score is the average of Market, Competition, Financial, and Regulatory risk.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-white/5">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            Risk Breakdown
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Detailed analysis across core venture dimensions</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {riskDimensions.map((dim, i) => {
            const cfg = getRiskConfig(dim.value);
            const isTopConcern = dim.label === topConcern.label;
            return (
              <div
                key={i}
                className={`relative rounded-xl border p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${isTopConcern ? `${cfg.border} ${cfg.bg} hover:shadow-red-500/20` : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/5 hover:shadow-white/5'}`}
              >
                {isTopConcern && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/15 text-red-400">
                    Top Concern
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{dim.label}</span>
                  <div className={`shrink-0 rounded-lg p-1.5 border ${cfg.bg} ${cfg.border}`}>
                    <dim.Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-3xl font-black ${cfg.color}`}>{dim.value}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                      style={{ width: `${dim.value}%` }}
                    />
                  </div>
                  <span className={`inline-flex mt-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failure points + Mitigation strategies */}
      <div className="flex flex-col gap-5">
        {/* Critical Failure Points */}
        <div className="rounded-2xl border border-red-500/20 bg-card overflow-hidden flex flex-col transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
          <div className="px-6 pt-6 pb-4 border-b border-red-500/10 bg-red-500/5">
            <h3 className="font-bold text-sm flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Critical Failure Points
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Most likely reasons this venture will fail, ranked by severity</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-3">
            {data.failure_points.map((point, idx) => {
              const colonIdx = point.indexOf(':');
              const hasTitle = colonIdx > 0 && colonIdx < 80;
              const title = hasTitle ? point.slice(0, colonIdx).trim() : null;
              const description = hasTitle ? point.slice(colonIdx + 1).trim() : point;
              const isTop = idx === 0;
              return (
                <div
                  key={idx}
                  className={`flex gap-3.5 rounded-xl border p-4 group transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer ${isTop ? 'border-red-500/25 bg-red-500/[0.06] hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-red-500/20' : 'border-white/5 bg-white/[0.03] hover:border-red-500/20 hover:bg-red-500/5 hover:shadow-red-500/15'}`}
                >
                  <div className={`shrink-0 flex h-[30px] w-[30px] items-center justify-center rounded-full border ${isTop ? 'bg-red-500/15 border-red-500/30' : 'bg-red-500/10 border-red-500/20'}`}>
                    {isTop ? (
                      <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <span className="text-[11px] font-bold text-red-400">{idx + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    {isTop && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Highest Severity</span>
                    )}
                    {title && (
                      <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">{title}</p>
                    )}
                    <p className="text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/50 transition-colors">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mitigation Strategies */}
        <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden flex flex-col transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
          <div className="px-6 pt-6 pb-4 border-b border-primary/10 bg-primary/5">
            <h3 className="font-bold text-sm flex items-center gap-2 text-primary">
              <Lightbulb className="h-4 w-4" />
              Mitigation Strategies
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Actionable steps to de-risk the venture, in priority order</p>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {data.mitigation_strategies.map((strategy, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/8 transition-all duration-300 hover:shadow-md hover:scale-102 cursor-pointer group">
                <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs group-hover:bg-primary/20 transition-colors">
                  {idx + 1}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/95 transition-colors pt-0.5">{strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}