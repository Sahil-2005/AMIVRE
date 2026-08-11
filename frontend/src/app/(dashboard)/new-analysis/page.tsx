import { SubmitForm } from '@/components/analysis/submit-form';
import { Metadata } from 'next';
import { Brain, Globe2, Layers, TrendingUp, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Analysis | AMIVRE',
  description: 'Deploy autonomous AI agents to analyze your business idea',
};

const agents = [
  { icon: Globe2, name: 'Market Scout', desc: 'TAM/SAM/SOM sizing', color: 'text-blue-400 bg-blue-400/10' },
  { icon: Users, name: 'Sentiment Analyst', desc: 'Pain points & desires', color: 'text-violet-400 bg-violet-400/10' },
  { icon: Layers, name: 'Competitor Mapper', desc: 'Feature matrix', color: 'text-amber-400 bg-amber-400/10' },
  { icon: TrendingUp, name: 'Trend Forecaster', desc: 'Market phase & patterns', color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: Brain, name: 'Risk Assessor', desc: 'Failure points & mitigation', color: 'text-red-400 bg-red-400/10' },
];

export default function NewAnalysisPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">New Analysis</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Deploy Your Agents</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
          Describe your venture. Five specialized AI agents will simultaneously research the market, competition, sentiment, trends, and risk — delivering a complete intelligence report.
        </p>
      </div>

      {/* Agent preview strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.name} className="flex flex-col items-center gap-2 shrink-0 w-[110px]">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${agent.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold leading-tight">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{agent.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-border/60" />

      <SubmitForm />
    </div>
  );
}
