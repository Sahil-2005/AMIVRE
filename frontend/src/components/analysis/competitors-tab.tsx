// import { CompetitorData } from '@/types/api';
// import { Check, X, Sword, ArrowLeftRight, Crosshair } from 'lucide-react';
// import { CitationSources } from '@/components/analysis/citation-sources';

// export function CompetitorsTab({ data }: { data: CompetitorData }) {
//   const allFeatures = Array.from(new Set(Object.values(data.feature_matrix).flat()));
//   const competitorNames = Object.keys(data.feature_matrix);

//   const CompetitorCard = ({ comp, isDirect }: { comp: { name: string; description: string }; isDirect: boolean }) => {
//     const weakness = data.competitor_weaknesses[comp.name];
//     return (
//       <div className="rounded-xl border border-white/5 bg-white/[0.03] hover:border-primary/20 hover:bg-primary/5 transition-all p-5 group">
//         <div className="flex items-start justify-between gap-3 mb-3">
//           <div>
//             <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               {isDirect ? 'Direct Competitor' : 'Indirect Alternative'}
//             </span>
//             <h4 className="font-bold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">{comp.name}</h4>
//           </div>
//           <div className={`shrink-0 rounded-full p-1.5 border ${isDirect ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
//             {isDirect ? <Sword className="h-3 w-3 text-red-400" /> : <ArrowLeftRight className="h-3 w-3 text-amber-400" />}
//           </div>
//         </div>
//         <p className="text-sm text-muted-foreground leading-relaxed mb-3">{comp.description}</p>
//         {weakness && (
//           <div className="pt-3 border-t border-white/5">
//             <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Key Weakness</p>
//             <p className="text-xs text-muted-foreground leading-relaxed">{weakness}</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       {/* Competitor cards */}
//       <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
//         <div className="px-6 pt-6 pb-4 border-b border-white/5">
//           <h3 className="font-bold text-base flex items-center gap-2">
//             <Crosshair className="h-4 w-4 text-primary" />
//             Competitive Landscape
//           </h3>
//           <p className="text-xs text-muted-foreground mt-0.5">Direct and indirect players in your market</p>
//         </div>
//         <div className="p-6">
//           {data.direct_competitors.length > 0 && (
//             <div className="mb-6">
//               <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">Direct Competitors</p>
//               <div className="grid gap-3 md:grid-cols-2">
//                 {data.direct_competitors.map((c, i) => <CompetitorCard key={i} comp={c} isDirect />)}
//               </div>
//             </div>
//           )}
//           {data.indirect_competitors.length > 0 && (
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">Indirect Alternatives</p>
//               <div className="grid gap-3 md:grid-cols-2">
//                 {data.indirect_competitors.map((c, i) => <CompetitorCard key={i} comp={c} isDirect={false} />)}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Feature Matrix */}
//       {competitorNames.length > 0 && allFeatures.length > 0 && (
//         <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
//           <div className="px-6 pt-6 pb-4 border-b border-white/5">
//             <h3 className="font-bold text-base">Feature Matrix</h3>
//             <p className="text-xs text-muted-foreground mt-0.5">How competitors stack up on key capabilities</p>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[600px]">
//               <thead>
//                 <tr className="border-b border-white/5">
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[280px]">Feature</th>
//                   {competitorNames.map(name => (
//                     <th key={name} className="px-4 py-4 text-center text-xs font-bold text-foreground">
//                       {name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {allFeatures.map((feature, fi) => (
//                   <tr key={fi} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
//                     <td className="px-6 py-3.5 text-sm text-muted-foreground font-medium">{feature}</td>
//                     {competitorNames.map(name => {
//                       const has = data.feature_matrix[name]?.includes(feature);
//                       return (
//                         <td key={name} className="px-4 py-3.5 text-center">
//                           {has ? (
//                             <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/20 mx-auto">
//                               <Check className="h-3.5 w-3.5 text-emerald-400" />
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/[0.03] border border-white/5 mx-auto">
//                               <X className="h-3 w-3 text-muted-foreground/30" />
//                             </span>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
      
//       <CitationSources sources={data.sources} />
//     </div>
//   );
// }


import { CompetitorData } from '@/types/api';
import { Check, X, Sword, ArrowLeftRight, Crosshair, Users, Percent, Target, Sparkles } from 'lucide-react';
import { CitationSources } from '@/components/analysis/citation-sources';

export function CompetitorsTab({ data }: { data: CompetitorData }) {
  const allFeatures = Array.from(new Set(Object.values(data.feature_matrix).flat()));
  const competitorNames = Object.keys(data.feature_matrix);
  const totalFeatures = allFeatures.length;
  const totalCompetitors = data.direct_competitors.length + data.indirect_competitors.length;

  // ---- Derived insights (presentation-only, computed from the same feature_matrix data) ----
  const coverageByCompetitor = competitorNames.reduce<Record<string, number>>((acc, name) => {
    acc[name] = data.feature_matrix[name]?.length ?? 0;
    return acc;
  }, {});
  const adoptionByFeature = allFeatures.reduce<Record<string, number>>((acc, feature) => {
    acc[feature] = competitorNames.filter(name => data.feature_matrix[name]?.includes(feature)).length;
    return acc;
  }, {});
  const avgCoveragePct = totalFeatures > 0 && competitorNames.length > 0
    ? Math.round(
        (Object.values(coverageByCompetitor).reduce((a, b) => a + b, 0) / (competitorNames.length * totalFeatures)) * 100
      )
    : 0;
  const sortedFeaturesByAdoption = [...allFeatures].sort((a, b) => adoptionByFeature[b] - adoptionByFeature[a]);
  const mostCommonFeature = sortedFeaturesByAdoption[0];
  const rarestFeature = sortedFeaturesByAdoption[sortedFeaturesByAdoption.length - 1];

  const InsightTile = ({
    icon: Icon,
    label,
    value,
    caption,
    tone = 'default',
  }: {
    icon: typeof Users;
    label: string;
    value: string;
    caption?: string;
    tone?: 'default' | 'amber' | 'emerald';
  }) => {
    const toneClasses =
      tone === 'amber'
        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/15'
        : tone === 'emerald'
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/15'
        : 'bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/15';

    return (
      <div className="group rounded-xl border border-white/5 bg-white/[0.03] p-4 flex items-start gap-3 min-w-0 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] hover:-translate-y-0.5">
        <div className={`shrink-0 rounded-lg p-2 border transition-colors duration-300 ${toneClasses}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-foreground leading-tight mt-0.5 truncate">{value}</p>
          {caption && <p className="text-xs text-muted-foreground mt-0.5 truncate">{caption}</p>}
        </div>
      </div>
    );
  };

  const CompetitorRow = ({ comp, isDirect, index }: { comp: { name: string; description: string }; isDirect: boolean; index: number }) => {
    const weakness = data.competitor_weaknesses[comp.name];
    const accent = isDirect ? 'red' : 'amber';

    return (
      <div className="group relative flex gap-4 sm:gap-6 py-5 pl-5 pr-3 transition-all duration-300 hover:bg-white/[0.025] hover:pl-6">
        {/* accent rail */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1 ${
            accent === 'red' ? 'bg-red-500/25 group-hover:bg-red-500/70' : 'bg-amber-500/25 group-hover:bg-amber-500/70'
          }`}
        />

        {/* index + icon */}
        <div className="shrink-0 flex flex-col items-center gap-2 pt-0.5">
          <span className="text-[10px] font-mono text-muted-foreground/40 transition-colors duration-300 group-hover:text-muted-foreground/70">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div
            className={`rounded-full p-2 border transition-all duration-300 group-hover:scale-110 ${
              accent === 'red' ? 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/15' : 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/15'
            }`}
          >
            {isDirect ? <Sword className="h-3 w-3 text-red-400" /> : <ArrowLeftRight className="h-3 w-3 text-amber-400" />}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 min-w-0 grid sm:grid-cols-[190px_1fr] gap-2 sm:gap-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isDirect ? 'Direct Competitor' : 'Indirect Alternative'}
            </span>
            <h4 className="font-bold text-base text-foreground mt-0.5 transition-colors duration-300 group-hover:text-primary">
              {comp.name}
            </h4>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
              {comp.description}
            </p>
            {weakness && (
              <div className="mt-3 flex gap-2.5">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-400 mt-px whitespace-nowrap">
                  Weakness
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{weakness}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Market insights */}
      {totalCompetitors > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InsightTile
            icon={Users}
            label="Tracked Players"
            value={String(totalCompetitors)}
            caption={`${data.direct_competitors.length} direct · ${data.indirect_competitors.length} indirect`}
          />
          {totalFeatures > 0 && (
            <>
              <InsightTile
                icon={Percent}
                label="Avg. Feature Coverage"
                value={`${avgCoveragePct}%`}
                caption="Across tracked capabilities"
                tone={avgCoveragePct >= 50 ? 'emerald' : 'default'}
              />
              <InsightTile
                icon={Target}
                label="Table Stakes"
                value={mostCommonFeature ?? '—'}
                caption={mostCommonFeature ? `${adoptionByFeature[mostCommonFeature]}/${competitorNames.length} competitors have it` : undefined}
                tone="amber"
              />
              <InsightTile
                icon={Sparkles}
                label="Whitespace Opportunity"
                value={rarestFeature ?? '—'}
                caption={rarestFeature ? `Only ${adoptionByFeature[rarestFeature]}/${competitorNames.length} offer it` : undefined}
                tone="emerald"
              />
            </>
          )}
        </div>
      )}

      {/* Competitor list */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-primary" />
            Competitive Landscape
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Direct and indirect players in your market</p>
        </div>

        {data.direct_competitors.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 px-6 pt-5 pb-1">Direct Competitors</p>
            <div className="divide-y divide-white/5">
              {data.direct_competitors.map((c, i) => (
                <CompetitorRow key={i} comp={c} isDirect index={i} />
              ))}
            </div>
          </div>
        )}

        {data.indirect_competitors.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 px-6 pt-5 pb-1">Indirect Alternatives</p>
            <div className="divide-y divide-white/5">
              {data.indirect_competitors.map((c, i) => (
                <CompetitorRow key={i} comp={c} isDirect={false} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature Matrix */}
      {competitorNames.length > 0 && allFeatures.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <h3 className="font-bold text-base">Feature Matrix</h3>
            <p className="text-xs text-muted-foreground mt-0.5">How competitors stack up on key capabilities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[280px]">Feature</th>
                  {competitorNames.map(name => (
                    <th key={name} className="px-4 py-4 text-center text-xs font-bold text-foreground transition-colors duration-300 hover:text-primary cursor-default">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, fi) => (
                  <tr key={fi} className="border-b border-white/[0.03] transition-colors duration-300 hover:bg-white/[0.03]">
                    <td className="px-6 py-3.5 text-sm text-muted-foreground font-medium">{feature}</td>
                    {competitorNames.map(name => {
                      const has = data.feature_matrix[name]?.includes(feature);
                      return (
                        <td key={name} className="px-4 py-3.5 text-center">
                          {has ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/20 mx-auto transition-transform duration-200 hover:scale-125 hover:bg-emerald-500/25">
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/[0.03] border border-white/5 mx-auto transition-transform duration-200 hover:scale-110">
                              <X className="h-3 w-3 text-muted-foreground/30" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CitationSources sources={data.sources} />
    </div>
  );
}
