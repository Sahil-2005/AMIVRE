import { RiskAssessment } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';

export function RiskTab({ data }: { data: RiskAssessment }) {
  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-green-500 bg-green-500/10';
    if (score < 70) return 'text-amber-500 bg-amber-500/10';
    return 'text-destructive bg-destructive/10';
  };

  const getProgressColor = (score: number) => {
    if (score < 40) return '[&>div]:bg-green-500';
    if (score < 70) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-destructive';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Risk Breakdown */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Risk Breakdown</CardTitle>
          <CardDescription>Detailed analysis across core venture dimensions</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-4">
          {[
            { label: 'Market Risk', val: data.market_risk },
            { label: 'Competition Risk', val: data.competition_risk },
            { label: 'Financial Risk', val: data.financial_risk },
            { label: 'Regulatory Risk', val: data.regulatory_risk },
          ].map((item, i) => (
            <div key={i} className="space-y-2 p-4 border rounded-lg bg-muted/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRiskColor(item.val)}`}>
                  {item.val}/100
                </span>
              </div>
              <Progress value={item.val} className={`h-2 ${getProgressColor(item.val)}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-1 shadow-sm border-t-4 border-t-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Critical Failure Points
          </CardTitle>
          <CardDescription>Most likely reasons this venture will fail</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.failure_points.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm items-start">
                <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-2 shadow-sm border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Mitigation Strategies
          </CardTitle>
          <CardDescription>Actionable steps to derisk the venture</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data.mitigation_strategies.map((strategy, idx) => (
              <li key={idx} className="flex gap-3 text-sm items-start bg-muted p-4 rounded-lg">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{strategy}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
