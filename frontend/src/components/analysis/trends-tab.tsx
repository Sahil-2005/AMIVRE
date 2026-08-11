import { TrendData } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Hash, CalendarDays } from 'lucide-react';

export function TrendsTab({ data }: { data: TrendData }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Market Phase
          </CardTitle>
          <CardDescription>Current stage of market maturity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20">
              {data.market_phase}
            </div>
            <p className="text-muted-foreground text-sm flex-1">
              {data.market_phase.toLowerCase().includes('early') && "High risk, high reward. Focus on education and early adopters."}
              {data.market_phase.toLowerCase().includes('growth') && "Rapid expansion. Focus on scaling and capturing market share quickly."}
              {data.market_phase.toLowerCase().includes('mature') && "Saturated market. Focus on differentiation, niche targeting, and operational efficiency."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-500" />
            Emerging Sub-Topics
          </CardTitle>
          <CardDescription>What people are starting to talk about</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.sub_topics.map((topic, idx) => (
              <Badge key={idx} variant="outline" className="px-3 py-1.5 text-sm">
                #{topic.replace(/\s+/g, '')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-amber-500" />
            Seasonal Patterns
          </CardTitle>
          <CardDescription>When demand peaks and dips</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-sm">
            {data.seasonal_patterns}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
