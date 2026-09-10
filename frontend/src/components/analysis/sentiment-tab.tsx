// import { SentimentData } from '@/types/api';
// import { MessageSquareWarning, Sparkles } from 'lucide-react';
// import { CitationSources } from '@/components/analysis/citation-sources';

// export function SentimentTab({ data }: { data: SentimentData }) {
//   const sortedPainPoints = [...data.pain_points].sort((a, b) => b.sentiment_score - a.sentiment_score);

//   const getSeverityConfig = (score: number) => {
//     if (score >= 8) return { color: 'text-red-400', bar: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Critical' };
//     if (score >= 6) return { color: 'text-amber-400', bar: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'High' };
//     return { color: 'text-sky-400', bar: 'bg-sky-500', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', label: 'Moderate' };
//   };

//   return (
//     <div className="grid gap-5 md:grid-cols-2">
//       {/* Pain Points — full width */}
//       <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
//         <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
//           <div>
//             <h3 className="font-bold text-base flex items-center gap-2">
//               <MessageSquareWarning className="h-4 w-4 text-red-400" />
//               Core User Pain Points
//             </h3>
//             <p className="text-xs text-muted-foreground mt-0.5">Ranked by severity — problems the market is desperate to solve</p>
//           </div>
//           <span className="text-xs bg-white/[0.05] border border-white/5 rounded-full px-3 py-1 text-muted-foreground">
//             {sortedPainPoints.length} identified
//           </span>
//         </div>
//         <div className="p-6 space-y-4">
//           {sortedPainPoints.map((pp, idx) => {
//             const cfg = getSeverityConfig(pp.sentiment_score);
//             return (
//               <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-4">
//                 <div className="flex items-start justify-between gap-4 mb-3">
//                   <div className="flex items-start gap-3">
//                     <span className="shrink-0 mt-0.5 text-muted-foreground/50 font-bold text-xs w-4">{idx + 1}</span>
//                     <p className="text-sm font-medium leading-relaxed text-foreground">{pp.description}</p>
//                   </div>
//                   <div className="shrink-0 flex flex-col items-end gap-1.5">
//                     <span className={`text-xl font-black ${cfg.color}`}>{pp.sentiment_score.toFixed(1)}</span>
//                     <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full border px-2 py-0.5 ${cfg.badge}`}>{cfg.label}</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 pl-7">
//                   <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
//                     <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`} style={{ width: `${pp.sentiment_score * 10}%` }} />
//                   </div>
//                   <span className="text-[10px] text-muted-foreground shrink-0">/ 10</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Top Desires — full width */}
//       <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
//         <div className="px-6 pt-6 pb-4 border-b border-white/5">
//           <h3 className="font-bold text-base flex items-center gap-2">
//             <Sparkles className="h-4 w-4 text-emerald-400" />
//             Top User Desires
//           </h3>
//           <p className="text-xs text-muted-foreground mt-0.5">What the market is actively asking for and willing to pay for</p>
//         </div>
//         <div className="p-6">
//           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//             {data.top_desires.map((desire, idx) => (
//               <div key={idx} className="group flex gap-3 items-start p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all">
//                 <div className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
//                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 </div>
//                 <span className="text-sm font-medium leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{desire}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <CitationSources sources={data.sources} />
//     </div>
//   );
// }


import { SentimentData } from '@/types/api';
import { MessageSquareWarning, Sparkles, Flame, Gauge, ListChecks, Quote, UserRound } from 'lucide-react';
import { CitationSources } from '@/components/analysis/citation-sources';

export function SentimentTab({ data }: { data: SentimentData }) {
  // sentiment_score is negative for pain points (more negative = more painful), so the
  // most severe issue is the one furthest from 0 — sort ascending to surface it first.
  const sortedPainPoints = [...data.pain_points].sort((a, b) => a.sentiment_score - b.sentiment_score);

  // Severity is driven by the magnitude of the (negative) score, assuming a -1..0 scale.
  const getSeverityConfig = (score: number) => {
    const intensity = Math.abs(score);
    if (intensity >= 0.7) return { color: 'text-red-400', bar: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Critical' };
    if (intensity >= 0.4) return { color: 'text-amber-400', bar: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'High' };
    return { color: 'text-sky-400', bar: 'bg-sky-500', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', label: 'Moderate' };
  };

  // ---- Derived insights (presentation-only, computed from the same pain_points data) ----
  const avgIntensity = data.pain_points.length > 0
    ? data.pain_points.reduce((sum, pp) => sum + Math.abs(pp.sentiment_score), 0) / data.pain_points.length
    : 0;
  const sharpestPain = sortedPainPoints[0];
  const criticalCount = data.pain_points.filter(pp => Math.abs(pp.sentiment_score) >= 0.7).length;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Insight strip */}
      {data.pain_points.length > 0 && (
        <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex items-start gap-3 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]">
            <div className="shrink-0 rounded-lg p-2 border bg-white/[0.05] border-white/10 text-muted-foreground">
              <ListChecks className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pain Points Tracked</p>
              <p className="text-lg font-bold text-foreground leading-tight mt-0.5">{data.pain_points.length}</p>
              {criticalCount > 0 && (
                <p className="text-xs text-red-400 mt-0.5">{criticalCount} critical</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex items-start gap-3 transition-all duration-300 hover:border-amber-500/25 hover:bg-white/[0.05]">
            <div className="shrink-0 rounded-lg p-2 border bg-amber-500/10 border-amber-500/20 text-amber-400">
              <Gauge className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg. Pain Intensity</p>
              <p className="text-lg font-bold text-foreground leading-tight mt-0.5">{avgIntensity.toFixed(2)}</p>
            </div>
          </div>
          {sharpestPain && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/10">
              <div className="shrink-0 rounded-lg p-2 border bg-red-500/10 border-red-500/20 text-red-400">
                <Flame className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Sharpest Pain Point</p>
                <p className="text-xs italic text-muted-foreground leading-snug mt-0.5 line-clamp-2">&ldquo;{sharpestPain.description}&rdquo;</p>
              </div>
            </div>
          )}
        </div>
      )}

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
            const intensityPct = Math.min(100, Math.abs(pp.sentiment_score) * 100);
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl rounded-tl-md border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${idx === 0 ? 'border-red-500/25 bg-red-500/[0.04] hover:border-red-500/40' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'}`}
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-white/[0.04] rotate-180 transition-colors duration-300 group-hover:text-white/[0.09]" />
                <div className="flex items-start gap-3">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/[0.1] group-hover:border-white/20">
                    <UserRound className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <p className="text-xs font-semibold text-muted-foreground">
                     <span className="text-muted-foreground/40">#{idx + 1}</span>
                      </p>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 shrink-0">Sharpest Pain</span>
                      )}
                    </div>
                    <p className="text-sm italic leading-relaxed text-foreground">&ldquo;{pp.description}&rdquo;</p>

                    <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 max-w-[160px] h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`} style={{ width: `${intensityPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">sentiment</span>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className={`text-sm font-black ${cfg.color}`}>{pp.sentiment_score.toFixed(1)}</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full border px-2 py-0.5 ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Desires — full width */}
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Top User Desires
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">What the market is actively asking for and willing to pay for</p>
          </div>
          <span className="text-xs bg-white/[0.05] border border-white/5 rounded-full px-3 py-1 text-muted-foreground">
            {data.top_desires.length} identified
          </span>
        </div>
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.top_desires.map((desire, idx) => (
              <div key={idx} className="group relative rounded-2xl rounded-tl-md border border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 p-4">
                <Quote className="absolute top-3 right-3 h-6 w-6 text-emerald-400/[0.08] rotate-180 transition-colors duration-300 group-hover:text-emerald-400/20" />
                <div className="flex items-start gap-3">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center transition-colors duration-300 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40">
                    <UserRound className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">Wanted · #{idx + 1}</p>
                    <p className="text-sm italic leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                      &ldquo;{desire}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CitationSources sources={data.sources} />
    </div>
  );
}