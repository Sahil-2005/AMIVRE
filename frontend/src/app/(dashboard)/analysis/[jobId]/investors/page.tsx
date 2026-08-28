'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { InvestorDiscoveryResponse, InvestorProfile } from '@/types/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, ExternalLink, Lightbulb, MapPin, Rocket, Target, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const fetchInvestors = async (jobId: string): Promise<InvestorDiscoveryResponse> => {
  const { data } = await apiClient.get<InvestorDiscoveryResponse>(`/analysis/${jobId}/investors`);
  return data;
};

export default function InvestorsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const accessToken = useAuthStore((s) => s.accessToken);
  const [wsMessages, setWsMessages] = useState<Array<{ agent_name: string; message: string; status: string }>>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['investors', jobId],
    queryFn: () => fetchInvestors(jobId),
    refetchInterval: (query) => {
      const d = query.state.data;
      if (d && (d.investor_status === 'COMPLETED' || d.investor_status === 'FAILED')) {
        return false;
      }
      return 5000;
    },
  });

  // WebSocket for live progress
  useEffect(() => {
    if (!accessToken || !jobId) return;
    if (data?.investor_status === 'COMPLETED' || data?.investor_status === 'FAILED') return;

    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws';
    const wsUrl = `${baseUrl}/${jobId}?token=${accessToken}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.phase === 'investors' || msg.agent_name === 'Investor_Finder') {
          setWsMessages((prev) => [...prev, msg]);
        }
      } catch { /* ignore */ }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [accessToken, jobId, data?.investor_status]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5d7bff]/30 bg-[#5d7bff]/10 shadow-[0_0_30px_-5px] shadow-[#5d7bff]/30 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-[#8fa4ff] border-t-transparent animate-spin" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">Loading Investor Intelligence...</p>
          <p className="text-xs text-slate-500 mt-1">Retrieving investor discovery data</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Investor Data Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">Could not retrieve investor discovery results.</p>
          <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isRunning = data.investor_status === 'PENDING' || data.investor_status === 'RUNNING';
  const isFailed = data.investor_status === 'FAILED';
  const isCompleted = data.investor_status === 'COMPLETED';

  // Progress view while agent is running
  if (isRunning) {
    return (
      <div className="mx-auto max-w-3xl py-10 space-y-6">
        <button
          onClick={() => router.push(`/analysis/${jobId}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-1"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Research Report
        </button>

        <div className="relative rounded-3xl border border-[#5d7bff]/30 bg-gradient-to-br from-[#5d7bff]/10 via-[#0a0f1e] to-[#080c18] p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5d7bff]/10 blur-[80px] pointer-events-none rounded-full" />
          <div className="relative text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5d7bff]/40 bg-[#5d7bff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8fa4ff]">
              <Rocket className="h-3.5 w-3.5 animate-bounce" />
              Investor Agent Active
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              Finding the right investors for your venture...
            </h2>

            <div className="max-w-md mx-auto space-y-3">
              {wsMessages.length > 0 ? (
                wsMessages.slice(-5).map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                    <div className="h-2 w-2 rounded-full bg-[#5d7bff] animate-pulse shrink-0" />
                    {msg.message}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-[#5d7bff] animate-pulse shrink-0" />
                  Initializing investor discovery agent...
                </div>
              )}
            </div>

            <div className="h-1.5 max-w-xs mx-auto rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#5d7bff] to-[#8fa4ff] animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="mx-auto max-w-3xl py-12 space-y-6">
        <button
          onClick={() => router.push(`/analysis/${jobId}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-1"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Research Report
        </button>
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-2xl backdrop-blur-xl shadow-2xl">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Investor Discovery Failed</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            {data.investor_error || 'An unexpected error occurred while finding investors.'}
          </p>
          <Button onClick={() => router.push(`/analysis/${jobId}`)} className="rounded-xl font-semibold gap-2 shadow-lg">
            Return to Report
          </Button>
        </div>
      </div>
    );
  }

  // COMPLETED — show results
  const result = data.investor_result;
  if (!result || !isCompleted) {
    return <div className="p-8 text-center text-muted-foreground">No investor data available yet.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-6 pb-12 animate-in fade-in-0 duration-700">
      {/* Header */}
      <div className="relative rounded-3xl border border-[#5d7bff]/20 bg-gradient-to-br from-[#5d7bff]/10 via-card to-card overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5d7bff]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="relative p-6 md:p-8">
          <button
            onClick={() => router.push(`/analysis/${jobId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Research Report
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5d7bff]/40 bg-[#5d7bff]/10 px-3 py-1 text-xs font-semibold text-[#8fa4ff] uppercase tracking-widest">
                <Rocket className="h-3 w-3" />
                Phase 2 — Investor Intelligence
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Matched Investors for{' '}
              <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
                {data.target_market}
              </span>
            </h1>
            <p className="text-sm text-slate-400">{data.business_idea?.slice(0, 120)}...</p>
          </div>
        </div>
      </div>

      {/* Funding Strategy Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#080c18] p-5 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff] uppercase">
            <Target className="h-3.5 w-3.5" />
            Recommended Stage
          </div>
          <p className="text-xl font-black text-white">{result.funding_stage_recommendation}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#080c18] p-5 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff] uppercase">
            <TrendingUp className="h-3.5 w-3.5" />
            Suggested Raise
          </div>
          <p className="text-xl font-black text-white">{result.recommended_raise_amount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#080c18] p-5 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff] uppercase">
            <Clock className="h-3.5 w-3.5" />
            Market Timing
          </div>
          <p className="text-sm font-medium text-white leading-relaxed">{result.market_timing_assessment}</p>
        </div>
      </div>

      {/* Pitch Angle Suggestions */}
      <div className="rounded-2xl border border-white/10 bg-[#080c18] p-5">
        <div className="flex items-center gap-2 mb-4 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff] uppercase">
          <Lightbulb className="h-3.5 w-3.5" />
          Pitch Angle Suggestions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.pitch_angle_suggestions.map((angle, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#5d7bff]/20 text-[10px] font-bold text-[#8fa4ff]">
                {i + 1}
              </span>
              {angle}
            </div>
          ))}
        </div>
      </div>

      {/* Matched Investors Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff] uppercase">
          <Building2 className="h-3.5 w-3.5" />
          Matched Investors ({result.matched_investors.length})
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.matched_investors
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .map((investor, i) => (
              <InvestorCard key={i} investor={investor} rank={i + 1} />
            ))}
        </div>
      </div>
    </div>
  );
}

function InvestorCard({ investor, rank }: { investor: InvestorProfile; rank: number }) {
  const scoreColor =
    investor.relevance_score >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    investor.relevance_score >= 60 ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
    'text-amber-400 border-amber-500/40 bg-amber-500/10';

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080c18] p-5 space-y-4 transition-all hover:border-[#5d7bff]/30 hover:bg-[#0a0f1e]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5d7bff]/20 text-[10px] font-bold text-[#8fa4ff]">
              #{rank}
            </span>
            <h3 className="text-base font-bold text-white">{investor.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
              {investor.type}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3" />
              {investor.location}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${scoreColor}`}>
          {investor.relevance_score}%
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {investor.focus_areas.slice(0, 4).map((area, i) => (
          <span key={i} className="rounded-full bg-[#5d7bff]/10 border border-[#5d7bff]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#8fa4ff]">
            {area}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <p className="text-slate-500 mb-1">Check Size</p>
          <p className="font-semibold text-white">{investor.typical_check_size}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Portfolio</p>
          <p className="font-semibold text-white">{investor.portfolio_examples.slice(0, 2).join(', ')}</p>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed text-slate-400">{investor.reasoning}</p>

      {investor.contact_url && investor.contact_url !== 'N/A' && (
        <a
          href={investor.contact_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8fa4ff] hover:text-[#a9bcff] transition-colors"
        >
          View Profile <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
