import { SentimentData } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageSquareWarning, ThumbsUp } from 'lucide-react';

export function SentimentTab({ data }: { data: SentimentData }) {
  // Sort pain points by score descending
  const sortedPainPoints = [...data.pain_points].sort((a, b) => b.sentiment_score - a.sentiment_score);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2 shadow-sm border-l-4 border-l-destructive/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5 text-destructive/80" />
            Core User Pain Points
          </CardTitle>
          <CardDescription>The most severe problems users currently face in this market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedPainPoints.map((pp, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm md:text-base leading-tight max-w-[80%]">{pp.description}</span>
                <span className="text-sm font-bold bg-muted px-2 py-1 rounded-md">{pp.sentiment_score.toFixed(1)}/10</span>
              </div>
              <Progress 
                value={pp.sentiment_score * 10} 
                className="h-2" 
                // Set color based on severity
                style={{
                  background: 'var(--secondary)',
                  ...(pp.sentiment_score > 7 ? { '--progress-background': 'var(--destructive)' } as any : {})
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 shadow-sm border-l-4 border-l-green-500/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500/80" />
            Top User Desires
          </CardTitle>
          <CardDescription>What the market is actively asking for</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.top_desires.map((desire, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-muted/40 p-3 rounded-lg border">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-sm font-medium leading-snug">{desire}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
