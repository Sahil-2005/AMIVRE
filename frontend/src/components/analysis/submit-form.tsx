'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { JobDepth } from '@/types/api';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Zap, Globe, Users, Layers } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEPTH_OPTIONS = [
  { value: 'QUICK', label: 'Quick Scan', desc: '· Quick market overview', icon: Zap },
  { value: 'STANDARD', label: 'Standard', desc: '· Comprehensive analysis', icon: Layers },
  { value: 'DEEP', label: 'Deep Dive', desc: '· Exhaustive multi-agent research', icon: Globe },
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
    } catch (error: any) {
      if (error.response?.status === 429) toast.error('Daily limit reached. Try again tomorrow.');
      else if (error.response?.status === 422) toast.error('Idea needs more detail — at least 50 words.');
      else toast.error('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  const selectedDepth = DEPTH_OPTIONS.find(d => d.value === depth);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Business Idea */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">1</div>
            <div>
              <h3 className="text-sm font-semibold">Describe Your Venture</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Be specific. The more context, the sharper the intelligence.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Textarea
            id="businessIdea"
            placeholder="Describe your product in detail: what it does, who it's for, the problem it solves, how it creates value, and what makes it different from existing solutions on the market..."
            className="min-h-[180px] resize-none bg-background border-border/60 focus:border-primary/60 focus-visible:ring-primary/20 text-sm leading-relaxed placeholder:text-muted-foreground/50"
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            disabled={loading}
          />
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted-foreground">Word count</span>
              <span className={`text-xs font-medium tabular-nums ${wordCount >= 50 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                {wordCount} / 50 words minimum
              </span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${wordCount >= 50 ? 'bg-emerald-400' : 'bg-primary'}`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Target Info */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">2</div>
            <div>
              <h3 className="text-sm font-semibold">Define Your Target</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Focus the agents on the right market segment and geography.</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="targetMarket" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Users className="h-3.5 w-3.5" /> Target Audience
            </Label>
            <Input
              id="targetMarket"
              placeholder="e.g., B2B SaaS founders, Gen-Z consumers"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              disabled={loading}
              required
              className="h-11 bg-background border-border/60 focus:border-primary/60 focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geography" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> Geography
            </Label>
            <Input
              id="geography"
              placeholder="e.g., Global, North America, India"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              disabled={loading}
              required
              className="h-11 bg-background border-border/60 focus:border-primary/60 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Depth Selection */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">3</div>
            <div>
              <h3 className="text-sm font-semibold">Choose Analysis Depth</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Deeper analyses deploy more agent iterations and produce richer outputs.</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEPTH_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = depth === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDepth(option.value as JobDepth)}
                disabled={loading}
                className={`flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isSelected
                  ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                  : 'border-border/60 bg-background hover:border-border hover:bg-muted/40'
                  }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{option.desc}</p>
                </div>
                {isSelected && <div className="self-end ml-auto mt-auto h-2 w-2 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedDepth?.label}</span> · {selectedDepth?.desc}
        </div>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none w-full sm:w-auto justify-center"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Deploying agents...</>
          ) : (
            <>Deploy Intelligence Agents <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>
          )}
        </button>
      </div>
    </form>
  );
}
