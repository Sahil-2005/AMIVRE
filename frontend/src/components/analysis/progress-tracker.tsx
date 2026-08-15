'use client';

import { useWebsocketProgress, AgentProgressData, ProgressState } from '@/hooks/use-websocket-progress';
import { useEffect, useRef } from 'react';
import {
  Globe, MessageSquare, Swords, TrendingUp, ShieldAlert,
  CheckCircle2, Circle, Loader2, XCircle, Activity, Zap
} from 'lucide-react';

interface ProgressTrackerProps {
  jobId: string;
  jobIdea: string;
  onComplete: () => void;
}

const AGENT_CONFIG: Record<string, {
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
  gradientFrom: string;
}> = {
  Market_Scout: {
    label: 'Market Scout',
    subtitle: 'Sizing the opportunity',
    icon: Globe,
    color: 'text-violet-400',
    glow: 'shadow-violet-500/30',
    gradientFrom: 'from-violet-500',
  },
  Sentiment_Analyst: {
    label: 'Sentiment Analyst',
    subtitle: 'Reading the community pulse',
    icon: MessageSquare,
    color: 'text-sky-400',
    glow: 'shadow-sky-500/30',
    gradientFrom: 'from-sky-500',
  },
  Competitor_Tracker: {
    label: 'Competitor Tracker',
    subtitle: 'Mapping the battlefield',
    icon: Swords,
    color: 'text-amber-400',
    glow: 'shadow-amber-500/30',
    gradientFrom: 'from-amber-500',
  },
  Trend_Forecaster: {
    label: 'Trend Forecaster',
    subtitle: 'Decoding market momentum',
    icon: TrendingUp,
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/30',
    gradientFrom: 'from-emerald-500',
  },
  Risk_Modeller: {
    label: 'Risk Modeller',
    subtitle: 'Stress-testing the venture',
    icon: ShieldAlert,
    color: 'text-rose-400',
    glow: 'shadow-rose-500/30',
    gradientFrom: 'from-rose-500',
  },
};

const PARALLEL_AGENTS = ['Market_Scout', 'Sentiment_Analyst', 'Competitor_Tracker', 'Trend_Forecaster'];

function ParallelAgentCard({ agentKey, data }: { agentKey: string; data: AgentProgressData }) {
  const config = AGENT_CONFIG[agentKey];
  const Icon = config.icon;

  const isRunning = data.status === 'RUNNING';
  const isDone = data.status === 'COMPLETED';
  const isFailed = data.status === 'FAILED';
  const isWaiting = data.status === 'WAITING';

  const activeSources = data.sources || [];

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all duration-700 ease-out overflow-hidden flex flex-col gap-3
        ${isRunning ? `border-white/20 bg-white/[0.05] shadow-lg ${config.glow} scale-[1.01]` : 'border-white/5 bg-card'}
        ${isDone ? 'border-emerald-500/10 bg-emerald-500/[0.02]' : ''}
        ${isFailed ? 'border-red-500/20 bg-red-500/[0.04]' : ''}
        ${isWaiting ? 'opacity-50' : ''}
      `}
    >
      {/* Running shimmer */}
      {isRunning && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      )}

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-xl border transition-all duration-500
          ${isRunning ? `border-white/20 bg-white/10 ${config.color} shadow-inner` : 'border-white/5 bg-white/5 text-muted-foreground'}
          ${isDone ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : ''}
          ${isFailed ? 'border-red-500/20 bg-red-500/10 text-red-400' : ''}
        `}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`font-semibold text-sm ${isWaiting ? 'text-muted-foreground' : 'text-foreground'}`}>
              {config.label}
            </span>
            {/* Status icon */}
            <span className="shrink-0 transition-all duration-300">
              {isWaiting && <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />}
              {isRunning && <Loader2 className={`h-3.5 w-3.5 animate-spin ${config.color}`} />}
              {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              {isFailed && <XCircle className="h-3.5 w-3.5 text-red-400" />}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">{config.subtitle}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out
            ${isRunning ? 'bg-gradient-to-r from-primary to-primary/70' : ''}
            ${isDone ? 'bg-emerald-500' : ''}
            ${isFailed ? 'bg-red-500' : ''}
            ${isWaiting ? 'bg-white/10' : ''}
          `}
          style={{ width: `${data.progress}%` }}
        />
      </div>

      {/* Live message */}
      {data.message && !isWaiting && (
        <p className={`text-[11px] truncate transition-all duration-300
          ${isRunning ? config.color : ''}
          ${isDone ? 'text-emerald-500/60' : ''}
          ${isFailed ? 'text-red-400' : ''}
        `}>
          {data.message}
        </p>
      )}

      {/* Live sources — compact for grid */}
      {isRunning && activeSources.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeSources.map((source, idx) => (
            <div
              key={`${source}-${idx}`}
              className="animate-in fade-in zoom-in-95 duration-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-foreground/70"
            >
              <CheckCircle2 className={`h-2.5 w-2.5 ${config.color}`} />
              {source}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskModellerCard({ data }: { data: AgentProgressData }) {
  const config = AGENT_CONFIG['Risk_Modeller'];
  const Icon = config.icon;

  const isRunning = data.status === 'RUNNING';
  const isDone = data.status === 'COMPLETED';
  const isWaiting = data.status === 'WAITING';

  return (
    <div className={`relative rounded-2xl border p-1 transition-all duration-1000
      ${isRunning ? 'border-primary/50 shadow-2xl shadow-primary/20 scale-[1.01]' : 'border-white/10'}
      ${isWaiting ? 'opacity-40 grayscale' : ''}
    `}>
      {isRunning && (
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 opacity-20 blur-xl animate-pulse" />
      )}
      <div className="relative bg-card rounded-xl p-5 overflow-hidden">
        {isRunning && (
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_infinite]" />
        )}

        <div className="flex items-center gap-4">
          <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-700
            ${isRunning ? 'border-primary/30 bg-primary/10 shadow-[0_0_30px_-5px] shadow-primary/30 animate-pulse' : 'border-white/10 bg-white/5'}
            ${isDone ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : ''}
          `}>
            <Icon className={`h-6 w-6 ${isRunning ? 'text-primary' : isDone ? 'text-emerald-400' : 'text-muted-foreground'}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base ${isRunning ? 'bg-gradient-to-r from-violet-400 to-primary bg-clip-text text-transparent' : ''}`}>
              {config.label}
            </h3>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>

          <span className="shrink-0">
            {isWaiting && <Circle className="h-4 w-4 text-muted-foreground/40" />}
            {isRunning && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out
              ${isRunning ? 'bg-gradient-to-r from-violet-500 via-sky-500 to-primary' : ''}
              ${isDone ? 'bg-emerald-500' : ''}
            `}
            style={{ width: `${data.progress}%` }}
          />
        </div>

        {data.message && !isWaiting && (
          <p className={`text-xs mt-2 transition-all duration-300 ${isRunning ? 'text-primary animate-pulse' : 'text-emerald-500/60'}`}>
            {data.message}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProgressTracker({ jobId, jobIdea, onComplete }: ProgressTrackerProps) {
  const progressState = useWebsocketProgress(jobId);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressState.status === 'COMPLETED') {
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [progressState.status, onComplete]);

  // Smooth scroll ONLY the internal log container box, NEVER the window viewport
  useEffect(() => {
    if (logContainerRef.current) {
      const container = logContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [progressState.activityLog.length]);

  const isFailed = progressState.status === 'FAILED';

  // Count how many parallel agents are active (running or complete)
  const parallelActive = PARALLEL_AGENTS.filter(
    name => progressState.agents[name as keyof ProgressState['agents']].status !== 'WAITING'
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in-0 duration-700">
      {/* Hero Header */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-card to-card p-6 md:p-8 text-center overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-primary/20 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          {parallelActive > 1
            ? `${parallelActive} Agents Running in Parallel`
            : 'Autonomous Multi-Agent Intelligence Engine'
          }
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
          Stress-Testing Your Venture
        </h1>
        <p className="text-sm md:text-base text-muted-foreground/90 max-w-xl mx-auto italic mt-2 truncate">
          &ldquo;{jobIdea}&rdquo;
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Agent Cards — 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Parallel agents in a 2×2 grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {PARALLEL_AGENTS.map(key => (
              <ParallelAgentCard
                key={key}
                agentKey={key}
                data={progressState.agents[key as keyof ProgressState['agents']]}
              />
            ))}
          </div>

          {/* Convergence connector */}
          <div className="flex items-center justify-center gap-1 py-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-semibold px-3">
              Converging Intelligence
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Risk Modeller — full width convergence card */}
          <RiskModellerCard data={progressState.agents.Risk_Modeller} />
        </div>

        {/* Right Panel — Overall Progress + Terminal Log */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Overall Progress Gauge */}
          <div className="rounded-2xl border border-white/10 bg-card/80 backdrop-blur-md p-6 flex flex-col items-center justify-center gap-4 shadow-xl">
            <div className="relative h-32 w-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressState.overallProgress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tabular-nums tracking-tight">
                  {Math.round(progressState.overallProgress)}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Percent</span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Overall Execution</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFailed ? 'Analysis failed' : progressState.status === 'COMPLETED' ? 'Analysis complete!' : 'Parallel Agent Execution'}
              </p>
            </div>
          </div>

          {/* Live Activity Terminal */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl min-h-[300px]">
            <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <Activity className="h-3.5 w-3.5 text-primary ml-1" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/90">Agent Terminal Stream</span>
              </div>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>

            {/* Scrollable Container without window scroll trigger */}
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 max-h-72 font-mono text-xs scrollbar-thin scrollbar-thumb-white/10"
            >
              {progressState.activityLog.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8 text-muted-foreground/60 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Connecting to agent stream...</span>
                </div>
              ) : (
                progressState.activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs leading-relaxed animate-in fade-in-0 duration-200 hover:bg-white/[0.02] p-1 rounded">
                    <span className="shrink-0 text-white/40 select-none">[{entry.time}]</span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold uppercase border border-primary/20">
                      {entry.agent.replace('_', ' ')}
                    </span>
                    <span className="text-muted-foreground/90 break-words">{entry.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
