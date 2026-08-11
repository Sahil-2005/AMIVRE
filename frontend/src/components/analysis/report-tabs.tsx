import { AnalysisResult } from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketTab } from './market-tab';
import { SentimentTab } from './sentiment-tab';
import { CompetitorsTab } from './competitors-tab';
import { TrendsTab } from './trends-tab';
import { RiskTab } from './risk-tab';

export function ReportTabs({ data }: { data: AnalysisResult }) {
  return (
    <Tabs defaultValue="risk" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto lg:h-12 mb-8 gap-2 lg:gap-0 bg-muted/50 p-1">
        <TabsTrigger value="risk" className="text-sm py-2 lg:py-1.5">Risk Assessment</TabsTrigger>
        <TabsTrigger value="market" className="text-sm py-2 lg:py-1.5">Market Size</TabsTrigger>
        <TabsTrigger value="competitors" className="text-sm py-2 lg:py-1.5">Competitors</TabsTrigger>
        <TabsTrigger value="sentiment" className="text-sm py-2 lg:py-1.5">User Sentiment</TabsTrigger>
        <TabsTrigger value="trends" className="text-sm py-2 lg:py-1.5">Trends & Forecast</TabsTrigger>
      </TabsList>
      
      <TabsContent value="risk" className="mt-0 outline-none">
        <RiskTab data={data.risk_assessment} />
      </TabsContent>
      
      <TabsContent value="market" className="mt-0 outline-none">
        <MarketTab data={data.market_data} />
      </TabsContent>

      <TabsContent value="competitors" className="mt-0 outline-none">
        <CompetitorsTab data={data.competitor_data} />
      </TabsContent>

      <TabsContent value="sentiment" className="mt-0 outline-none">
        <SentimentTab data={data.sentiment_data} />
      </TabsContent>

      <TabsContent value="trends" className="mt-0 outline-none">
        <TrendsTab data={data.trend_data} />
      </TabsContent>
    </Tabs>
  );
}
