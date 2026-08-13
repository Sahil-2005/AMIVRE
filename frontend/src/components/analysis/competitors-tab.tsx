import { CompetitorData } from '@/types/api';
import { Check, X, Sword, ArrowLeftRight, Crosshair } from 'lucide-react';
import { CitationSources } from '@/components/analysis/citation-sources';

export function CompetitorsTab({ data }: { data: CompetitorData }) {
  const allFeatures = Array.from(new Set(Object.values(data.feature_matrix).flat()));
  const competitorNames = Object.keys(data.feature_matrix);

  const CompetitorCard = ({ comp, isDirect }: { comp: { name: string; description: string }; isDirect: boolean }) => {
    const weakness = data.competitor_weaknesses[comp.name];
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.03] hover:border-primary/20 hover:bg-primary/5 transition-all p-5 group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isDirect ? 'Direct Competitor' : 'Indirect Alternative'}
            </span>
            <h4 className="font-bold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">{comp.name}</h4>
          </div>
          <div className={`shrink-0 rounded-full p-1.5 border ${isDirect ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            {isDirect ? <Sword className="h-3 w-3 text-red-400" /> : <ArrowLeftRight className="h-3 w-3 text-amber-400" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{comp.description}</p>
        {weakness && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Key Weakness</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{weakness}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Competitor cards */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-primary" />
            Competitive Landscape
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Direct and indirect players in your market</p>
        </div>
        <div className="p-6">
          {data.direct_competitors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">Direct Competitors</p>
              <div className="grid gap-3 md:grid-cols-2">
                {data.direct_competitors.map((c, i) => <CompetitorCard key={i} comp={c} isDirect />)}
              </div>
            </div>
          )}
          {data.indirect_competitors.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">Indirect Alternatives</p>
              <div className="grid gap-3 md:grid-cols-2">
                {data.indirect_competitors.map((c, i) => <CompetitorCard key={i} comp={c} isDirect={false} />)}
              </div>
            </div>
          )}
        </div>
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
                    <th key={name} className="px-4 py-4 text-center text-xs font-bold text-foreground">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, fi) => (
                  <tr key={fi} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-sm text-muted-foreground font-medium">{feature}</td>
                    {competitorNames.map(name => {
                      const has = data.feature_matrix[name]?.includes(feature);
                      return (
                        <td key={name} className="px-4 py-3.5 text-center">
                          {has ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/20 mx-auto">
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/[0.03] border border-white/5 mx-auto">
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
