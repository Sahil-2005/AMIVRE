'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { AnalysisJobResponse } from '@/types/api';
import { ProgressTracker } from '@/components/analysis/progress-tracker';
import { ReportTabs } from '@/components/analysis/report-tabs';
import { ExecutiveSummary } from '@/components/analysis/executive-summary';
import { ScrapedDataDrawer } from '@/components/analysis/scraped-data-drawer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Download, Rocket, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const fetchAnalysis = async (jobId: string): Promise<AnalysisJobResponse> => {
  const { data } = await apiClient.get<AnalysisJobResponse>(`/analysis/${jobId}`);
  return data;
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const [forceReportView, setForceReportView] = useState(false);
  const [triggeringInvestors, setTriggeringInvestors] = useState(false);

  // Poll if status is not COMPLETED or FAILED, unless we are forcing report view
  const { data: job, isLoading, isError, refetch } = useQuery({
    queryKey: ['analysis', jobId],
    queryFn: () => fetchAnalysis(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'COMPLETED' || data.status === 'FAILED')) {
        return false;
      }
      return forceReportView ? false : 10000;
    }
  });

  const handleFindInvestors = async () => {
    setTriggeringInvestors(true);
    try {
      await apiClient.post(`/analysis/${jobId}/investors`);
      toast.success('Investor discovery started!');
      router.push(`/analysis/${jobId}/investors`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error?.response?.data?.detail || 'Failed to start investor discovery';
      if (detail.includes('already running or completed')) {
        router.push(`/analysis/${jobId}/investors`);
      } else {
        toast.error(detail);
      }
    } finally {
      setTriggeringInvestors(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_30px_-5px] shadow-primary/30 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <div>
          <p className="text-lg font-bold">Loading Analysis Intelligence...</p>
          <p className="text-xs text-muted-foreground mt-1">Retrieving multi-agent venture data</p>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Analysis Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">The requested analysis job could not be retrieved or may have been removed.</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline" className="rounded-xl border-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = job.status === 'COMPLETED' || forceReportView;
  const isFailed = job.status === 'FAILED';

  if (!isCompleted && !isFailed) {
    return (
      <div className="mx-auto max-w-5xl py-6 md:py-10 space-y-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-1"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        
        <ProgressTracker 
          jobId={jobId} 
          jobIdea={job.business_idea} 
          onComplete={() => {
            refetch().then(() => setForceReportView(true));
          }}
        />
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="mx-auto max-w-3xl py-12 space-y-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-1"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-2xl backdrop-blur-xl shadow-2xl">
          <Badge variant="destructive" className="mb-4 uppercase tracking-widest text-[10px] px-3 py-1 font-bold">
            Job Failed
          </Badge>
          <h2 className="text-2xl font-black text-foreground mb-2">Analysis Could Not Complete</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            {job.error_message || 'An unexpected error occurred in the agent execution pipeline.'}
          </p>
          <Button onClick={() => router.push('/new-analysis')} className="rounded-xl font-semibold gap-2 shadow-lg">
            Try A New Analysis
          </Button>
        </div>
      </div>
    );
  }

  // Job is COMPLETED
  const result = job.result_json;
  if (!result) return <div className="p-8 text-center text-muted-foreground">No result data available.</div>;

  const hasInvestorData = job.investor_status !== null;

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-6 pb-12 animate-in fade-in-0 duration-700">
      {/* Premium Header Banner */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-card to-card overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl pointer-events-none rounded-full" />
        <div className="relative p-6 md:p-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Verified Intelligence Report
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                &ldquo;{job.business_idea.slice(0, 90)}{job.business_idea.length > 90 ? '…' : ''}&rdquo;
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold shadow-sm">
                  🎯 {job.target_market}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 text-foreground/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  🌍 {job.geography}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  ⚡ {job.depth} Research
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start">
              <ScrapedDataDrawer scrapedData={result.scraped_data} />
              <Button 
                onClick={() => window.print()} 
                variant="outline" 
                className="gap-2 rounded-xl border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ExecutiveSummary
        risk={result.risk_assessment}
        marketPhase={result.trend_data.market_phase}
      />

      <ReportTabs data={result} />

      {/* Phase 2: Investor Discovery CTA */}
      <div className="relative rounded-3xl border border-[#5d7bff]/30 bg-gradient-to-br from-[#5d7bff]/10 via-[#0a0f1e] to-[#0a0f1e] overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#5d7bff]/15 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#8fa4ff]/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="relative p-8 md:p-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5d7bff]/40 bg-[#5d7bff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8fa4ff]">
            <Rocket className="h-3.5 w-3.5" />
            Phase 2 — Next Step
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Your research is complete.{' '}
            <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
              Ready to find investors?
            </span>
          </h2>
          
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our Investor Finder agent will analyze your venture profile, scrape investor databases,
            and identify the best-matched VCs, angels, and accelerators for your startup.
          </p>

          {hasInvestorData ? (
            <Button
              onClick={() => router.push(`/analysis/${jobId}/investors`)}
              className="h-12 px-8 rounded-xl bg-[#b7c6ff] text-base font-bold text-[#0a0e1a] shadow-lg shadow-[#5d7bff]/25 hover:bg-[#c9d5ff] hover:shadow-[#5d7bff]/35 transition-all gap-2"
            >
              View Investor Results
              <ExternalLink className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFindInvestors}
              disabled={triggeringInvestors}
              className="h-12 px-8 rounded-xl bg-[#b7c6ff] text-base font-bold text-[#0a0e1a] shadow-lg shadow-[#5d7bff]/25 hover:bg-[#c9d5ff] hover:shadow-[#5d7bff]/35 transition-all gap-2"
            >
              {triggeringInvestors ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-[#0a0e1a] border-t-transparent animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  Find Investors
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
