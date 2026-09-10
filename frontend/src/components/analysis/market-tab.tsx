


'use client';
import { MarketData } from '@/types/api';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, Scale, AlertCircle, ChevronRight, DollarSign } from 'lucide-react';
import { CitationSources } from '@/components/analysis/citation-sources';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa'];

export function MarketTab({ data }: { data: MarketData }) {
  // Normalizes any TAM/SAM/SOM string to a common unit (billions) so the chart and
  // percentage insights compare like-for-like, even when figures are quoted in
  // different units (e.g. "$95 Billion" vs "$150 Million").
  const parseValue = (val: string) => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 0;
    const lower = val.toLowerCase();
    if (lower.includes('trillion')) return num * 1000;
    if (lower.includes('million')) return num / 1000;
    return num; // assume billions
  };

  const chartData = [
    { name: 'TAM', value: parseValue(data.total_addressable_market), label: data.total_addressable_market, desc: 'Total Addressable' },
    { name: 'SAM', value: parseValue(data.serviceable_addressable_market), label: data.serviceable_addressable_market, desc: 'Serviceable Addressable' },
    { name: 'SOM', value: parseValue(data.serviceable_obtainable_market), label: data.serviceable_obtainable_market, desc: 'Serviceable Obtainable' },
  ];

  // Bar height uses a cube-root compression so a SOM that's a fraction of a percent of
  // TAM still renders as a visible bar, instead of disappearing on a linear scale.
  const chartDisplayData = chartData.map(d => ({ ...d, displayValue: Math.cbrt(d.value) }));

  // ---- Derived insights (presentation-only, computed from the same three figures) ----
  const formatPct = (pct: number) => (pct >= 10 ? `${Math.round(pct)}%` : `${pct.toFixed(1)}%`);
  const samOfTam = chartData[0].value > 0 ? (chartData[1].value / chartData[0].value) * 100 : 0;
  const somOfSam = chartData[1].value > 0 ? (chartData[2].value / chartData[1].value) * 100 : 0;
  const somOfTam = chartData[0].value > 0 ? (chartData[2].value / chartData[0].value) * 100 : 0;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; label: string; desc: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/10 bg-card/90 backdrop-blur-md shadow-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.desc} Market</p>
          <p className="text-xl font-black text-primary">{payload[0].payload.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Chart - Full Width */}
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-white/5">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base">Market Size Opportunity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">TAM / SAM / SOM breakdown based on target demographics</p>
        </div>
        <div className="p-6">
          {/* Funnel stat row */}
          <div className="flex items-stretch gap-2 mb-8">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-stretch gap-2 flex-1 min-w-0">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center flex-1 min-w-0 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:shadow-md cursor-pointer">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{d.desc}</p>
                  <p className="text-2xl font-black truncate" style={{ color: COLORS[i] }}>{d.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {i === 0 && d.name}
                    {i === 1 && `${d.name} · ${formatPct(samOfTam)} of TAM`}
                    {i === 2 && `${d.name} · ${formatPct(somOfSam)} of SAM`}
                  </p>
                </div>
                {i < chartData.length - 1 && (
                  <div className="flex items-center shrink-0 text-muted-foreground/30">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDisplayData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis hide dataKey="displayValue" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="displayValue" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartDisplayData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          

          {/* Whole-funnel insight */}
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <DollarSign className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your realistically obtainable market (<span className="font-semibold text-foreground">SOM</span>) represents{' '}
              <span className="font-bold text-primary">{formatPct(somOfTam)}</span> of the total addressable market — the
              near-term opportunity, before any expansion beyond the current serviceable segment.
            </p>
          </div>
        </div>
      </div>

      {/* Growth & Saturation */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-white/5">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Growth & Saturation
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:shadow-md cursor-pointer">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Estimated CAGR</p>
              <p className="text-4xl font-black text-primary leading-none">{data.growth_rate}</p>
            </div>
            {data.is_saturated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 px-3 py-1 text-xs font-semibold shrink-0">
                <AlertCircle className="h-3 w-3" /> Highly Saturated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold shrink-0">
                <TrendingUp className="h-3 w-3" /> Room for Growth
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Saturation Rationale</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{data.saturation_justification}</p>
          </div>
        </div>
      </div>

      {/* Verticals & Regulations */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-white/5">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Verticals & Regulations
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Top Target Verticals <span className="text-muted-foreground/50 normal-case">· {data.top_verticals.length} identified</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {data.top_verticals.map((v, i) => (
                <span key={i} className="rounded-full border border-primary/20 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold transition-all duration-300 hover:border-primary/40 hover:bg-primary/20 hover:shadow-md cursor-pointer">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Scale className="h-3 w-3" /> Regulatory Considerations
            </p>
            <ul className="flex flex-col gap-2.5">
              {data.regulatory_considerations.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground rounded-lg border border-amber-500/10 bg-amber-500/[0.04] p-3 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/10 hover:shadow-md hover:text-foreground/90 cursor-pointer">
                  <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CitationSources sources={data.sources} />
    </div>
  );
}