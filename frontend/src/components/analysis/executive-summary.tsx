import { RiskAssessment } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ExecutiveSummary({ risk, marketPhase }: { risk: RiskAssessment; marketPhase: string }) {
  
  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-green-500';
    if (score < 70) return 'text-amber-500';
    return 'text-destructive';
  };

  const getRecColor = (rec: string) => {
    if (rec.toLowerCase().includes('go') && !rec.toLowerCase().includes('no')) return 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30';
    if (rec.toLowerCase().includes('caution')) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
    return 'bg-destructive/15 text-destructive border-destructive/30';
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Risk Score Card */}
      <Card className="md:col-span-1 shadow-sm border-t-4 border-t-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Venture Risk Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
          <div className={`text-6xl font-black tracking-tighter ${getRiskColor(risk.risk_score)}`}>
            {risk.risk_score}
          </div>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Out of 100</p>
        </CardContent>
      </Card>

      {/* Recommendation Card */}
      <Card className={`md:col-span-2 shadow-sm border ${getRecColor(risk.recommendation)}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
            {risk.recommendation.toLowerCase().includes('no') ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            Final Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold tracking-tight mb-4">{risk.recommendation}</h2>
          <p className="opacity-90 text-sm leading-relaxed">
            {risk.justification}
          </p>
          
          <div className="mt-6 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Market Phase:</span>
            <span className="text-sm font-bold bg-background/50 px-2 py-1 rounded-md">{marketPhase}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
