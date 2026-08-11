'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { AnalysisJobResponse } from '@/types/api';
import { ProgressTracker } from '@/components/analysis/progress-tracker';
import { ReportTabs } from '@/components/analysis/report-tabs';
import { ExecutiveSummary } from '@/components/analysis/executive-summary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const fetchAnalysis = async (jobId: string): Promise<AnalysisJobResponse> => {
  const { data } = await apiClient.get<AnalysisJobResponse>(`/analysis/${jobId}`);
  return data;
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const [forceReportView, setForceReportView] = useState(false);

  // Poll if status is not COMPLETED or FAILED, unless we are forcing report view
  const { data: job, isLoading, isError, refetch } = useQuery({
    queryKey: ['analysis', jobId],
    queryFn: () => fetchAnalysis(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'COMPLETED' || data.status === 'FAILED')) {
        return false;
      }
      return forceReportView ? false : 5000;
    }
  });

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading analysis details...</div>;
  }

  if (isError || !job) {
    return <div className="text-destructive p-4">Failed to load analysis. It may have been deleted.</div>;
  }

  const isCompleted = job.status === 'COMPLETED' || forceReportView;
  const isFailed = job.status === 'FAILED';

  if (!isCompleted && !isFailed) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
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
      <div className="mx-auto max-w-4xl py-10">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
          <p>{job.error_message || 'An unknown error occurred during processing.'}</p>
        </div>
      </div>
    );
  }

  // Job is COMPLETED
  const result = job.result_json;
  if (!result) return <div>No result data available.</div>;

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="relative rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="relative p-6 md:p-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Intelligence Report</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3 max-w-3xl">
                "{job.business_idea.slice(0, 80)}{job.business_idea.length > 80 ? '…' : ''}"
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  {job.target_market}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground px-3 py-1 text-xs font-semibold">
                  {job.geography}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground px-3 py-1 text-xs font-semibold">
                  {job.depth} Depth
                </span>
              </div>
            </div>
            <Button onClick={() => window.print()} variant="outline" className="shrink-0 gap-2 rounded-xl border-white/10 hover:border-white/20 bg-white/5">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <ExecutiveSummary
        risk={result.risk_assessment}
        marketPhase={result.trend_data.market_phase}
      />

      <ReportTabs data={result} />
    </div>
  );
}
