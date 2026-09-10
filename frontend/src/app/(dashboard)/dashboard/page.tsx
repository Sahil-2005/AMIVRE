'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import { AnalysisHistoryTable } from '@/components/dashboard/analysis-history-table';
import { PaginatedAnalysisJobs } from '@/types/api';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Crosshair,
  MessageSquare,
  PlusCircle,
  Radar,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const fetchDashboardAnalyses = async (): Promise<PaginatedAnalysisJobs> => {
  const { data } = await apiClient.get<PaginatedAnalysisJobs>('/analysis/?page=1&limit=50');
  return data;
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['analyses', 1],
    queryFn: fetchDashboardAnalyses,
  });

  const jobs = data?.items || [];
  
  const stats = {
    total: jobs.length,
    completed: jobs.filter((j: { status: string }) => j.status === 'COMPLETED').length,
    running: jobs.filter((j: { status: string }) => j.status === 'RUNNING' || j.status === 'PENDING').length,
  };

  // Derived, presentation-only values
  const idle = Math.max(stats.total - stats.completed - stats.running, 0);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const completedPct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const runningPct = stats.total > 0 ? (stats.running / stats.total) * 100 : 0;
  const idlePct = stats.total > 0 ? (idle / stats.total) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 rounded-full border border-[#5d7bff]/20" />
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-[#8fa4ff]" />
            <Radar className="absolute h-5 w-5 text-[#5d7bff]/60" />
          </div>
          <p className="text-sm text-slate-400">Loading your intelligence hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      {/* ambient color wash behind the whole page */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#5d7bff]/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-40 h-[380px] w-[380px] rounded-full bg-[#a855f7]/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-[#10b981]/10 blur-[140px]" />
      </div>

      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#5d7bff]/30 bg-gradient-to-br from-[#2a2470] via-[#1a1550] to-[#0f0f2e] px-6 py-7 shadow-xl shadow-[#5d7bff]/10 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #a9bcff 1px, transparent 1px), linear-gradient(to bottom, #a9bcff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#8f6dff]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#34d399]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#c3d0ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a9bcff]" />
              DASHBOARD
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}{' '}
              <span className="inline-block">👋</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#c3d0ff]/80">
              Your venture intelligence command center.
            </p>
          </div>

          <Link
            href="/new-analysis"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1550] shadow-lg shadow-black/20 transition-all hover:bg-[#e8ecff] sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats — vivid, distinct colored cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Analyses"
          value={stats.total}
          icon={BarChart3}
          accent="blue"
          trend="+0 this week"
        />
        <StatCard
          label="Completed Reports"
          value={stats.completed}
          icon={CheckCircle2}
          accent="emerald"
          trend="Ready to view"
        />
        <StatCard
          label="In Progress"
          value={stats.running}
          icon={Clock}
          accent="amber"
          trend="Agents running"
          pulse={stats.running > 0}
        />
      </div>

      {/* Analytics — derived purely from existing stats */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[0a0f1e] p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#8f6dff]/20 blur-3xl" />

        <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Pipeline Overview</h2>
            <p className="mt-0.5 text-xs text-slate-400">How your analyses break down right now</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1.5 shadow-lg shadow-emerald-400/20">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-950" />
            <span className="text-xs font-bold text-emerald-950">{completionRate}% completion rate</span>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
          <ProgressRing completedPct={completedPct} runningPct={runningPct} idlePct={idlePct} total={stats.total} />

          <div className="space-y-4">
            <BreakdownRow color="#34d399" label="Completed" value={stats.completed} pct={completedPct} />
            <BreakdownRow color="#fbbf24" label="In Progress" value={stats.running} pct={runningPct} />
            <BreakdownRow color="#818cf8" label="Other / Queued" value={idle} pct={idlePct} />
          </div>
        </div>
      </div>

      {/* Quick start CTA - shown when no analyses */}
      {stats.total === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[#8f6dff]/30 bg-gradient-to-br from-[#3a2d7a] via-[#241a5c] to-[#150f3e] p-8 shadow-xl shadow-[#5d7bff]/10">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-1/3 translate-x-1/4 rounded-full bg-[#a855f7]/30 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  Launch Your First Intelligence Report
                </h3>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#c3d0ff]/80">
                  Deploy 5 specialized AI agents on any startup idea and get a
                  full venture intelligence report in minutes.
                </p>
              </div>
              <Link
                href="/new-analysis"
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#241a5c] shadow-lg shadow-black/20 transition-all hover:bg-[#e8ecff] md:self-auto"
              >
                Start Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-5">
              <AgentChip icon={Crosshair} label="Market Scout" color="#60a5fa" />
              <AgentChip icon={MessageSquare} label="Sentiment Analyst" color="#e879f9" />
              <AgentChip icon={Users} label="Competitor Mapper" color="#f472b6" />
              <AgentChip icon={TrendingUp} label="Trend Forecaster" color="#34d399" />
              <AgentChip icon={Shield} label="Risk Assessor" color="#fb923c" />
            </div>
          </div>
        </div>
      )}

      {/* Analysis Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]">
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#5d7bff]/20 via-[#8f6dff]/10 to-transparent px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Analyses</h2>
            <p className="mt-0.5 text-xs text-slate-400">All your market intelligence reports</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5d7bff] shadow-lg shadow-[#5d7bff]/30">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="p-6">
          <AnalysisHistoryTable />
        </div>
      </div>
    </div>
  );
}

const ACCENTS = {
  blue: {
    border: 'border-blue-400/40',
    bg: 'bg-gradient-to-br from-blue-500/25 via-blue-500/5 to-transparent',
    iconBg: 'bg-blue-500',
    trend: 'bg-blue-400/20 text-blue-300',
    glow: 'shadow-blue-500/20',
  },
  emerald: {
    border: 'border-emerald-400/40',
    bg: 'bg-gradient-to-br from-emerald-500/25 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500',
    trend: 'bg-emerald-400/20 text-emerald-300',
    glow: 'shadow-emerald-500/20',
  },
  amber: {
    border: 'border-amber-400/40',
    bg: 'bg-gradient-to-br from-amber-500/25 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500',
    trend: 'bg-amber-400/20 text-amber-300',
    glow: 'shadow-amber-500/20',
  },
} as const;

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  pulse = false,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: keyof typeof ACCENTS;
  trend: string;
  pulse?: boolean;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${a.border} ${a.bg} p-6 shadow-lg ${a.glow}`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.iconBg} shadow-lg ${a.glow}`}>
          <Icon className={`h-5 w-5 text-white ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.trend}`}>{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <p className="mt-0.5 text-4xl font-bold tracking-tighter text-white">{value}</p>
      </div>
    </div>
  );
}

function ProgressRing({
  completedPct,
  runningPct,
  idlePct,
  total,
}: {
  completedPct: number;
  runningPct: number;
  idlePct: number;
  total: number;
}) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const completedLen = (completedPct / 100) * c;
  const runningLen = (runningPct / 100) * c;
  const idleLen = (idlePct / 100) * c;

  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e2240" strokeWidth="12" />
        {total > 0 ? (
          <>
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#34d399"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${completedLen} ${c - completedLen}`}
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${runningLen} ${c - runningLen}`}
              strokeDashoffset={-completedLen}
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#818cf8"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${idleLen} ${c - idleLen}`}
              strokeDashoffset={-(completedLen + runningLen)}
            />
          </>
        ) : null}
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className="text-3xl font-bold text-white">{total}</p>
        <p className="text-[11px] text-slate-400">total runs</p>
      </div>
    </div>
  );
}

function BreakdownRow({
  color,
  label,
  value,
  pct,
}: {
  color: string;
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-200">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
        <span className="text-slate-400">
          {value} <span className="text-slate-500">· {Math.round(pct)}%</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#1e2240]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AgentChip({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-4 text-center backdrop-blur">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span className="text-[11px] leading-tight text-[#c3d0ff]/90">{label}</span>
    </div>
  );
}
//   );
// }
