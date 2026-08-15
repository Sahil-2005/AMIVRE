import { RiskAssessment } from '@/types/api';
import { AlertTriangle, ShieldAlert, Lightbulb, TrendingDown } from 'lucide-react';

export function RiskTab({ data }: { data: RiskAssessment }) {
  const getRiskConfig = (score: number) => {
    if (score < 40) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' };
    if (score < 70) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' };
    return { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: 'bg-red-500' };
  };

  const riskDimensions = [
    { label: 'Market Risk', value: data.market_risk, icon: '📊' },
    { label: 'Competition Risk', value: data.competition_risk, icon: '⚔️' },
    { label: 'Financial Risk', value: data.financial_risk, icon: '💸' },
    { label: 'Regulatory Risk', value: data.regulatory_risk, icon: '⚖️' },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {/* Risk Breakdown — full width */}
      <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            Risk Breakdown
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Detailed analysis across core venture dimensions</p>
        </div>
        <div className="grid md:grid-cols-4 divide-x divide-white/5">
          {riskDimensions.map((dim, i) => {
            const cfg = getRiskConfig(dim.value);
            return (
              <div key={i} className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{dim.label}</span>
                  <span className="text-lg">{dim.icon}</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-3xl font-black ${cfg.color}`}>{dim.value}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  {/* Custom progress bar */}
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

      {/* Critical Failure Points */}
      <div className="lg:col-span-1 rounded-2xl border border-red-500/20 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-red-500/10 bg-red-500/5">
          <h3 className="font-bold text-sm flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Critical Failure Points
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Most likely reasons this venture will fail</p>
        </div>
        <div className="p-6 space-y-4">
          {data.failure_points.map((point, idx) => (
            <div key={idx} className="flex gap-3 group">
              <div className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <ShieldAlert className="h-3 w-3 text-red-400" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mitigation Strategies */}
      <div className="lg:col-span-2 rounded-2xl border border-primary/20 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-primary/10 bg-primary/5">
          <h3 className="font-bold text-sm flex items-center gap-2 text-primary">
            <Lightbulb className="h-4 w-4" />
            Mitigation Strategies
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Actionable steps to de-risk the venture</p>
        </div>
        <div className="p-6 space-y-3">
          {data.mitigation_strategies.map((strategy, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
              <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs">
                {idx + 1}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{strategy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
