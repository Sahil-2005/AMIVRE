

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { JobDepth } from '@/types/api';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Zap, Globe, Users, Layers, CheckCircle2, Circle, FileText, Clock, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const DEPTH_OPTIONS = [
  {
    value: 'QUICK',
    label: 'Quick Scan',
    desc: 'Quick market overview',
    icon: Zap,
    time: '~2 min runtime',
    detail: 'A fast pass using core market signals — ideal for early validation before you commit to deeper research.',
    points: ['Market snapshot', 'Top 3 competitors', 'Basic sentiment read'],
  },
  {
    value: 'STANDARD',
    label: 'Standard',
    desc: 'Comprehensive analysis',
    icon: Layers,
    time: '~5 min runtime',
    detail: 'Full-depth research across all five agents with cross-validated findings. Our most popular option.',
    points: ['Complete TAM / SAM / SOM', 'Competitor feature matrix', 'Risk & mitigation plan'],
  },
  {
    value: 'DEEP',
    label: 'Deep Dive',
    desc: 'Exhaustive multi-agent research',
    icon: Globe,
    time: '~10 min runtime',
    detail: 'Exhaustive multi-pass research with expanded agent iterations for maximum confidence on high-stakes decisions.',
    points: ['Extended competitor mapping', 'Multi-source sentiment analysis', 'Scenario-based risk modeling'],
  },
];

export function SubmitForm() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [geography, setGeography] = useState('');
  const [depth, setDepth] = useState<JobDepth>('STANDARD');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const wordCount = businessIdea.trim().split(/\s+/).filter(Boolean).length;
  const charCount = businessIdea.length;
  const isValid = wordCount >= 50 && charCount >= 200 && targetMarket && geography;
  const progress = Math.min(100, (wordCount / 50) * 100);

  // Derived, presentation-only step-completion flags — reuse existing state, no new logic.
  const step1Done = wordCount >= 50 && charCount >= 200;
  const step2Done = Boolean(targetMarket) && Boolean(geography);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await apiClient.post('/analysis/submit', {
        business_idea: businessIdea,
        target_market: targetMarket,
        geography,
        depth,
      });
      toast.success('Agents deployed successfully!');
      router.push(`/analysis/${response.data.job_id}`);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 429) toast.error('Daily limit reached. Try again tomorrow.');
      else if (err.response?.status === 422) toast.error('Idea needs more detail — at least 50 words.');
      else toast.error('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  const selectedDepth = DEPTH_OPTIONS.find(d => d.value === depth);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Stepper */}
      <div className="flex items-center rounded-2xl border border-white/10 bg-[#0a0f1e] px-5 py-4">
        <StepDot label="Venture" done={step1Done} active={!step1Done} />
        <StepLine done={step1Done} />
        <StepDot label="Target" done={step2Done} active={step1Done && !step2Done} />
        <StepLine done={step2Done} />
        <StepDot label="Analysis" done={false} active={step2Done} last />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          {/* Business Idea + Target — unified card, divided into sections */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]">
            <SectionHeader n={1} title="Describe Your Venture" sub="Be specific. The more context, the sharper the intelligence." done={step1Done} />
            <div className="p-6 pt-5">
              <Textarea
                id="businessIdea"
                placeholder="Describe your product in detail: what it does, who it's for, the problem it solves, how it creates value, and what makes it different from existing solutions on the market..."
                className="min-h-[160px] resize-none border-white/10 bg-[#050810] text-sm leading-relaxed text-white placeholder:text-slate-600 focus:border-[#8f6dff]/60 focus-visible:ring-[#8f6dff]/20"
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                disabled={loading}
              />
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Word count</span>
                  <span className={`text-xs font-medium tabular-nums ${wordCount >= 50 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {wordCount} / 50 words minimum
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${wordCount >= 50 ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#8f6dff] to-[#c084fc]'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/5" />

            <SectionHeader n={2} title="Define Your Target" sub="Tell AMIVRE where and for whom you plan to build." done={step2Done} />
            <div className="grid grid-cols-1 gap-5 p-6 pt-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetMarket" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#a78bfa]">
                  <Users className="h-3.5 w-3.5" /> Target Audience
                </Label>
                <Input
                  id="targetMarket"
                  placeholder="e.g., B2B SaaS founders, Gen-Z consumers"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 border-white/10 bg-[#050810] text-white placeholder:text-slate-600 focus:border-[#8f6dff]/60 focus-visible:ring-[#8f6dff]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="geography" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#a78bfa]">
                  <Globe className="h-3.5 w-3.5" /> Geography
                </Label>
                <Input
                  id="geography"
                  placeholder="e.g., Global, North America, India"
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 border-white/10 bg-[#050810] text-white placeholder:text-slate-600 focus:border-[#8f6dff]/60 focus-visible:ring-[#8f6dff]/20"
                />
              </div>
            </div>
          </div>

          {/* Depth Selection */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]">
            <SectionHeader n={3} title="Choose Analysis Depth" sub="Deeper analyses deploy more agent iterations and produce richer outputs." done={false} />
            <div className="grid grid-cols-1 gap-3 p-6 pt-5 sm:grid-cols-3">
              {DEPTH_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = depth === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDepth(option.value as JobDepth)}
                    disabled={loading}
                    className={`relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isSelected
                      ? 'border-[#8f6dff]/60 bg-gradient-to-br from-[#8f6dff]/15 to-transparent shadow-lg shadow-[#8f6dff]/10'
                      : 'border-white/10 bg-[#050810] hover:border-white/20 hover:bg-white/5'
                      }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[#c084fc]" />
                    )}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-gradient-to-br from-[#8f6dff] to-[#c084fc] text-white' : 'bg-white/5 text-slate-400'}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#e9d5ff]' : 'text-white'}`}>{option.label}</p>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          {option.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{option.desc}</p>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-400">{option.detail}</p>

                    <ul className="w-full space-y-1.5 border-t border-white/5 pt-3">
                      {option.points.map((point) => (
                        <li key={point} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-400">
                          <Check className={`mt-0.5 h-3 w-3 shrink-0 ${isSelected ? 'text-[#c084fc]' : 'text-slate-600'}`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky review / deploy panel */}
        <div className="lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-2xl border border-[#8f6dff]/25 bg-gradient-to-br from-[#241a5c] via-[#170f42] to-[#0a0f1e]">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#c4b5fd]">
                <FileText className="h-3.5 w-3.5" />
                REVIEW & DEPLOY
              </p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <ReviewRow label="Venture" done={step1Done} value={businessIdea ? `${wordCount} words` : 'Not started'} />
              <ReviewRow label="Target Audience" done={Boolean(targetMarket)} value={targetMarket || 'Not set'} />
              <ReviewRow label="Geography" done={Boolean(geography)} value={geography || 'Not set'} />

              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-xs text-slate-500">Analysis Depth</p>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  {selectedDepth && <selectedDepth.icon className="h-4 w-4 text-[#c084fc]" />}
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedDepth?.label}</p>
                    <p className="text-[11px] text-slate-500">{selectedDepth?.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8f6dff] to-[#c084fc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8f6dff]/25 transition-all hover:opacity-90 hover:shadow-[#8f6dff]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Deploying agents...</>
                ) : (
                  <>Deploy Agents <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
              {!isValid && !loading && (
                <p className="mt-2.5 text-center text-[11px] text-slate-500">
                  Complete all fields to deploy your agents
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  n,
  title,
  sub,
  done,
}: {
  n: number;
  title: string;
  sub: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-[#8f6dff]/10 to-transparent px-6 py-5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
          done
            ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-400'
            : 'border-[#8f6dff]/30 bg-[#8f6dff]/15 text-[#c4b5fd]'
        }`}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : n}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function StepDot({
  label,
  done,
  active,
  last = false,
}: {
  label: string;
  done: boolean;
  active: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${last ? '' : ''}`}>
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <Circle className={`h-4 w-4 shrink-0 ${active ? 'text-[#c084fc]' : 'text-slate-600'}`} fill={active ? '#c084fc33' : 'transparent'} />
      )}
      <span className={`whitespace-nowrap text-xs font-medium ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ done }: { done: boolean }) {
  return (
    <div className="mx-3 h-px flex-1">
      <div className={`h-full w-full ${done ? 'bg-emerald-400/40' : 'bg-white/10'}`} />
    </div>
  );
}

function ReviewRow({ label, done, value }: { label: string; done: boolean; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-slate-600" />
        )}
        {label}
      </span>
      <span className="max-w-[160px] truncate text-right text-xs font-medium text-slate-300">{value}</span>
    </div>
  );
}
