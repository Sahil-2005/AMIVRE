'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/lib/auth';
import apiClient from '@/lib/api-client';
import { AnalysisHistoryTable } from '@/components/dashboard/analysis-history-table';
import { ArrowRight, BarChart3, CheckCircle2, Clock, PlusCircle, TrendingUp, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { setUser, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, running: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await authApi.getMe();
        setUser(u);
        const { data } = await apiClient.get('/analysis/?page=1&limit=50');
        const jobs = data.items || [];
        setStats({
          total: jobs.length,
          completed: jobs.filter((j: { status: string }) => j.status === 'COMPLETED').length,
          running: jobs.filter((j: { status: string }) => j.status === 'RUNNING' || j.status === 'PENDING').length,
        });
        setLoading(false);
      } catch {
        router.push('/login');
      }
    };
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your intelligence hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Your venture intelligence command center.
          </p>
        </div>
        <Link
          href="/new-analysis"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Analyses"
          value={stats.total}
          icon={BarChart3}
          iconColor="text-blue-400"
          bgColor="bg-blue-400/10"
          trend="+0 this week"
        />
        <StatCard
          label="Completed Reports"
          value={stats.completed}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-400/10"
          trend="Ready to view"
        />
        <StatCard
          label="In Progress"
          value={stats.running}
          icon={Clock}
          iconColor="text-amber-400"
          bgColor="bg-amber-400/10"
          trend="Agents running"
          pulse={stats.running > 0}
        />
      </div>

      {/* Quick start CTA - shown when no analyses */}
      {stats.total === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-8">
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Launch Your First Intelligence Report</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-lg">
                Deploy 5 specialized AI agents — Market Scout, Sentiment Analyst, Competitor Mapper, Trend Forecaster, and Risk Assessor — on any startup idea.
              </p>
            </div>
            <Link
              href="/new-analysis"
              className="group inline-flex items-center gap-2 shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              Start Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Analysis Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Analyses</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All your market intelligence reports</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <AnalysisHistoryTable />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, iconColor, bgColor, trend, pulse = false }: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  trend: string;
  pulse?: boolean;
}) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 hover:border-border transition-all duration-200 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor} ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-4xl font-bold tracking-tighter mt-0.5">{value}</p>
      </div>
    </div>
  );
}
