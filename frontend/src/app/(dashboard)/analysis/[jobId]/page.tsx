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
    <div className="mx-auto max-w-6xl flex flex-col gap-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Report</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span className="truncate max-w-md">"{job.business_idea}"</span>
            <span>•</span>
            <Badge variant="secondary">{job.target_market}</Badge>
            <Badge variant="outline">{job.geography}</Badge>
          </div>
        </div>
        
        <Button onClick={() => window.print()} className="shrink-0 gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <ExecutiveSummary 
        risk={result.risk_assessment} 
        marketPhase={result.trend_data.market_phase} 
      />

      <ReportTabs data={result} />
    </div>
  );
}
