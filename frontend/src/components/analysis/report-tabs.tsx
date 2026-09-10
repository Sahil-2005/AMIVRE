'use client';
import { AnalysisResult } from '@/types/api';
import { useState } from 'react';
import { MarketTab } from './market-tab';
import { SentimentTab } from './sentiment-tab';
import { CompetitorsTab } from './competitors-tab';
import { TrendsTab } from './trends-tab';
import { RiskTab } from './risk-tab';
import {
  ShieldAlert, BarChart2, Swords, MessageCircle, TrendingUp,
  Globe, MessageSquare, Star, Flame, LineChart, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
  { id: 'market', label: 'Market Size', icon: BarChart2 },
  { id: 'competitors', label: 'Competitors', icon: Swords },
  { id: 'sentiment', label: 'User Sentiment', icon: MessageCircle },
  { id: 'trends', label: 'Trends & Forecast', icon: TrendingUp },
];

const DATA_SOURCES = [
  { label: 'Wikipedia', icon: Globe, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { label: 'Reddit (Mock)', icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { label: 'Google Play', icon: Star, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { label: 'Hacker News', icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Google Trends', icon: LineChart, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

export function ReportTabs({ data }: { data: AnalysisResult }) {
  const [active, setActive] = useState('risk');

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Tab Bar */}
      <div className="relative rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex-1 justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.01]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Data Provenance Strip */}
      <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md px-5 py-3 flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">
          <Database className="h-3.5 w-3.5 text-primary" />
          <span>Scraped Live Sources</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {DATA_SOURCES.map(source => {
            const Icon = source.icon;
            return (
              <span key={source.label} className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm',
                source.bg, source.color
              )}>
                <Icon className="h-3 w-3" />
                {source.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-0 animate-in fade-in-0 duration-300">
        {active === 'risk' && <RiskTab data={data.risk_assessment} />}
        {active === 'market' && <MarketTab data={data.market_data} />}
        {active === 'competitors' && <CompetitorsTab data={data.competitor_data} />}
        {active === 'sentiment' && <SentimentTab data={data.sentiment_data} />}
        {active === 'trends' && <TrendsTab data={data.trend_data} />}
      </div>
    </div>
  );
}
