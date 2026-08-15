'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { PaginatedAnalysisJobs, AnalysisJobResponse } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowRight, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const fetchAnalyses = async (page: number): Promise<PaginatedAnalysisJobs> => {
  const { data } = await apiClient.get<PaginatedAnalysisJobs>(`/analysis/?page=${page}&limit=10`);
  return data;
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    COMPLETED: { label: 'Completed', className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
    RUNNING: { label: 'Running', className: 'bg-blue-400/10 text-blue-400 border-blue-400/20 animate-pulse' },
    FAILED: { label: 'Failed', className: 'bg-red-400/10 text-red-400 border-red-400/20' },
    PENDING: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border/60' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
};

export function AnalysisHistoryTable() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analyses', page],
    queryFn: () => fetchAnalyses(page),
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">Failed to load analyses. Please try refreshing the page.</p>
      </div>
    );
  }

  const jobs = data?.items || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/40 bg-card/40 py-20 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">No analyses yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
          Deploy your first set of agents and get a complete venture intelligence report in seconds.
        </p>
        <button
          onClick={() => router.push('/new-analysis')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          Create First Analysis <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-muted/40 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Business Idea</span>
        <span className="hidden md:block">Market</span>
        <span className="hidden sm:block">Depth</span>
        <span>Status</span>
        <span></span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border/40">
        {jobs.map((job: AnalysisJobResponse) => (
          <div
            key={job.id}
            onClick={() => router.push(`/analysis/${job.id}`)}
            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center cursor-pointer hover:bg-muted/30 transition-colors group"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{job.business_idea}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span className="hidden md:block text-sm text-muted-foreground max-w-[140px] truncate">{job.target_market}</span>
            <span className="hidden sm:block">
              <span className="inline-flex items-center rounded-lg border border-border/60 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {job.depth}
              </span>
            </span>
            <StatusBadge status={job.status} />
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 bg-muted/20">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
