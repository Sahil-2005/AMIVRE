'use client';
import { MarketData } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, Scale, AlertCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa'];

export function MarketTab({ data }: { data: MarketData }) {
  const parseValue = (val: string) => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const chartData = [
    { name: 'TAM', value: parseValue(data.total_addressable_market), label: data.total_addressable_market, desc: 'Total Addressable' },
    { name: 'SAM', value: parseValue(data.serviceable_addressable_market), label: data.serviceable_addressable_market, desc: 'Serviceable Addressable' },
    { name: 'SOM', value: parseValue(data.serviceable_obtainable_market), label: data.serviceable_obtainable_market, desc: 'Serviceable Obtainable' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
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
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-base">Market Size Opportunity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">TAM / SAM / SOM breakdown based on target demographics</p>
        </div>
        <div className="p-6">
          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {chartData.map((d, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{d.desc}</p>
                <p className="text-2xl font-black" style={{ color: COLORS[i] }}>{d.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.name}</p>
              </div>
            ))}
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Growth & Saturation */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Growth & Saturation
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estimated CAGR</p>
            <p className="text-4xl font-black text-primary">{data.growth_rate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Market Saturation</p>
            {data.is_saturated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 px-3 py-1 text-xs font-semibold mb-3">
                <AlertCircle className="h-3 w-3" /> Highly Saturated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold mb-3">
                <TrendingUp className="h-3 w-3" /> Room for Growth
              </span>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">{data.saturation_justification}</p>
          </div>
        </div>
      </div>

      {/* Verticals & Regulations */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Verticals & Regulations
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Target Verticals</p>
            <div className="flex flex-wrap gap-2">
              {data.top_verticals.map((v, i) => (
                <span key={i} className="rounded-full border border-primary/20 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Scale className="h-3 w-3" /> Regulatory Considerations
            </p>
            <ul className="space-y-2">
              {data.regulatory_considerations.map((r, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
