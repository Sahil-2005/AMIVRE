import { RiskAssessment } from '@/types/api';
import { AlertTriangle, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export function ExecutiveSummary({ risk, marketPhase }: { risk: RiskAssessment; marketPhase: string }) {
  const getScoreConfig = (score: number) => {
    if (score < 40) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', ring: 'from-emerald-500/30', label: 'Low Risk' };
    if (score < 70) return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', ring: 'from-amber-500/30', label: 'Medium Risk' };
    return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', ring: 'from-red-500/30', label: 'High Risk' };
  };

  const getRecConfig = (rec: string) => {
    const lower = rec.toLowerCase();
    if (lower.includes('go') && !lower.includes('no')) return {
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/30',
      labelBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <ShieldCheck className="h-5 w-5" />,
    };
    if (lower.includes('caution')) return {
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      border: 'border-amber-500/30',
      labelBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: <AlertTriangle className="h-5 w-5" />,
    };
    return {
      gradient: 'from-red-500/20 via-red-500/5 to-transparent',
      border: 'border-red-500/30',
      labelBg: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: <AlertTriangle className="h-5 w-5" />,
    };
  };

  const scoreConfig = getScoreConfig(risk.risk_score);
  const recConfig = getRecConfig(risk.recommendation);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (risk.risk_score / 100) * circumference;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Risk Score Card */}
      <div className={`relative rounded-2xl border bg-card p-6 overflow-hidden flex flex-col items-center justify-center text-center ${scoreConfig.border}`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${scoreConfig.ring} to-transparent opacity-50`} />
        <p className="relative text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Venture Risk Score</p>
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
            <circle
              cx="50" cy="50" r="40" fill="none" strokeWidth="8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={scoreConfig.color}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${scoreConfig.color}`}>{risk.risk_score}</span>
            <span className="text-xs text-muted-foreground font-medium">/ 100</span>
          </div>
        </div>
        <div className={`relative mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${scoreConfig.labelBg} ${scoreConfig.border}`}>
          <Zap className="h-3 w-3" />
          {scoreConfig.label}
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={`relative md:col-span-2 rounded-2xl border overflow-hidden ${recConfig.border}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${recConfig.gradient}`} />
        <div className="relative p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${recConfig.labelBg}`}>
              {recConfig.icon}
              Final Recommendation
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-3 leading-tight">{risk.recommendation}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">{risk.justification}</p>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Market Phase</span>
            </div>
            <span className="text-sm font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">{marketPhase}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
