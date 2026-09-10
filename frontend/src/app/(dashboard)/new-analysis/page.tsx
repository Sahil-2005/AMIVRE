

import { SubmitForm } from '@/components/analysis/submit-form';
import { Metadata } from 'next';
import { Brain, Globe2, Layers, TrendingUp, Users, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Analysis | AMIVRE',
  description: 'Deploy autonomous AI agents to analyze your business idea',
};

const agents = [
  {
    icon: Globe2,
    name: 'Market Scout',
    desc: 'TAM/SAM/SOM sizing',
    color: '#60a5fa',
  },
  {
    icon: Users,
    name: 'Sentiment Analyst',
    desc: 'Pain points & desires',
    color: '#c084fc',
  },
  {
    icon: Layers,
    name: 'Competitor Mapper',
    desc: 'Feature matrix',
    color: '#fbbf24',
  },
  {
    icon: TrendingUp,
    name: 'Trend Forecaster',
    desc: 'Market phase & patterns',
    color: '#34d399',
  },
  {
    icon: Brain,
    name: 'Risk Assessor',
    desc: 'Failure points & mitigation',
    color: '#fb7185',
  },
];

export default function NewAnalysisPage() {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#8f6dff]/25 bg-gradient-to-br from-[#241a5c] via-[#170f42] to-[#0a0f1e] px-6 py-7 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #a9bcff 1px, transparent 1px), linear-gradient(to bottom, #a9bcff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#8f6dff]/30 blur-3xl" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8f6dff] to-[#c084fc] shadow-lg shadow-[#8f6dff]/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#c4b5fd]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c084fc]" />
              NEW ANALYSIS
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Analyze Your Venture
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#c3d0ff]/80">
              Describe your venture and let AMIVRE&apos;s specialized AI agents research the market, competition, customer sentiment, trends, and risks for  delivering an evidence-backed intelligence report.
            </p>
          </div>
        </div>
      </div>

  

      {/* Agent preview strip — connected pipeline */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
        <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8f6dff]" />
          5 AGENTS DEPLOYED IN PARALLEL
        </p>
 
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div key={agent.name} className="relative">
                {/* connector line to next card (desktop only) */}
                {i < agents.length - 1 && (
                  <div
                    className="pointer-events-none absolute right-[-18px] top-8 hidden h-px w-4 sm:block"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${agent.color}80, ${agents[i + 1].color}80)`,
                    }}
                  />
                )}
 
                <div
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#050810] px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg"
                  style={{ ['--glow' as string]: agent.color }}
                >
                  <span className="absolute left-2.5 top-2.5 text-[10px] font-semibold text-slate-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
 
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-full transition-shadow group-hover:shadow-[0_0_20px_var(--glow)]"
                    style={{ backgroundColor: `${agent.color}1f`, border: `1px solid ${agent.color}40` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: agent.color }} />
                  </div>
 
                  <div>
                    <p className="text-xs font-semibold leading-tight text-white">
                      {agent.name}
                    </p>
                    <p className="mt-1 text-[10px] leading-tight text-slate-500">
                      {agent.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      


       <SubmitForm />
    </div>

  );
}