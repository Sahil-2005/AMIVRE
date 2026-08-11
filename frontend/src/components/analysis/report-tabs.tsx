'use client';
import { AnalysisResult } from '@/types/api';
import { useState } from 'react';
import { MarketTab } from './market-tab';
import { SentimentTab } from './sentiment-tab';
import { CompetitorsTab } from './competitors-tab';
import { TrendsTab } from './trends-tab';
import { RiskTab } from './risk-tab';
import { ShieldAlert, BarChart2, Swords, MessageCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
  { id: 'market', label: 'Market Size', icon: BarChart2 },
  { id: 'competitors', label: 'Competitors', icon: Swords },
  { id: 'sentiment', label: 'User Sentiment', icon: MessageCircle },
  { id: 'trends', label: 'Trends & Forecast', icon: TrendingUp },
];

export function ReportTabs({ data }: { data: AnalysisResult }) {
  const [active, setActive] = useState('risk');

  return (
    <div className="flex flex-col gap-5">
      {/* Premium Tab Bar */}
      <div className="relative rounded-2xl border border-white/5 bg-card p-1.5 flex gap-1 overflow-x-auto scrollbar-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : '')} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-0">
        {active === 'risk' && <RiskTab data={data.risk_assessment} />}
        {active === 'market' && <MarketTab data={data.market_data} />}
        {active === 'competitors' && <CompetitorsTab data={data.competitor_data} />}
        {active === 'sentiment' && <SentimentTab data={data.sentiment_data} />}
        {active === 'trends' && <TrendsTab data={data.trend_data} />}
      </div>
    </div>
  );
}
