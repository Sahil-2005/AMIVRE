import { SentimentData } from '@/types/api';
import { MessageSquareWarning, Sparkles } from 'lucide-react';

export function SentimentTab({ data }: { data: SentimentData }) {
  const sortedPainPoints = [...data.pain_points].sort((a, b) => b.sentiment_score - a.sentiment_score);

  const getSeverityConfig = (score: number) => {
    if (score >= 8) return { color: 'text-red-400', bar: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Critical' };
    if (score >= 6) return { color: 'text-amber-400', bar: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'High' };
    return { color: 'text-sky-400', bar: 'bg-sky-500', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', label: 'Moderate' };
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Pain Points — full width */}
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-red-400" />
              Core User Pain Points
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ranked by severity — problems the market is desperate to solve</p>
          </div>
          <span className="text-xs bg-white/[0.05] border border-white/5 rounded-full px-3 py-1 text-muted-foreground">
            {sortedPainPoints.length} identified
          </span>
        </div>
        <div className="p-6 space-y-4">
          {sortedPainPoints.map((pp, idx) => {
            const cfg = getSeverityConfig(pp.sentiment_score);
            return (
              <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-muted-foreground/50 font-bold text-xs w-4">{idx + 1}</span>
                    <p className="text-sm font-medium leading-relaxed text-foreground">{pp.description}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className={`text-xl font-black ${cfg.color}`}>{pp.sentiment_score.toFixed(1)}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full border px-2 py-0.5 ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`} style={{ width: `${pp.sentiment_score * 10}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">/ 10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Desires — full width */}
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Top User Desires
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">What the market is actively asking for and willing to pay for</p>
        </div>
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.top_desires.map((desire, idx) => (
              <div key={idx} className="group flex gap-3 items-start p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all">
                <div className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-sm font-medium leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{desire}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
