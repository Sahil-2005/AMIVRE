'use client';

import { useWebsocketProgress, AgentStatus, AgentProgressData, ProgressState } from '@/hooks/use-websocket-progress';
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
  sources: string[];
}> = {
  Market_Scout: {
    label: 'Market Scout',
    subtitle: 'Sizing the opportunity',
    icon: Globe,
    color: 'text-violet-400',
    glow: 'shadow-violet-500/30',
    sources: ['Wikipedia'],
  },
  Sentiment_Analyst: {
    label: 'Sentiment Analyst',
    subtitle: 'Reading the community pulse',
    icon: MessageSquare,
    color: 'text-sky-400',
    glow: 'shadow-sky-500/30',
    sources: ['Reddit', 'Google Play'],
  },
  Competitor_Tracker: {
    label: 'Competitor Tracker',
    subtitle: 'Mapping the battlefield',
    icon: Swords,
    color: 'text-amber-400',
    glow: 'shadow-amber-500/30',
    sources: ['Wikipedia', 'App Reviews'],
  },
  Trend_Forecaster: {
    label: 'Trend Forecaster',
    subtitle: 'Decoding market momentum',
    icon: TrendingUp,
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/30',
    sources: ['Hacker News', 'Google Trends'],
  },
  Risk_Modeller: {
    label: 'Risk Modeller',
    subtitle: 'Stress-testing the venture',
    icon: ShieldAlert,
    color: 'text-rose-400',
    glow: 'shadow-rose-500/30',
    sources: ['All Agent Outputs'],
  },
};

function AgentCard({ agentKey, data, allAgents }: { agentKey: string; data: AgentProgressData; allAgents: ProgressState['agents'] }) {
  const config = AGENT_CONFIG[agentKey];
  const Icon = config.icon;

  const isRunning = data.status === 'RUNNING';
  const isDone = data.status === 'COMPLETED';
  const isFailed = data.status === 'FAILED';
  const isWaiting = data.status === 'WAITING';
  
  const isFinalAgent = agentKey === 'Risk_Modeller';

  // For the final agent synthesis effect
  const activeSources = data.sources || [];

  if (isFinalAgent) {
    return (
      <div className={`relative mt-6 rounded-2xl border p-1 transition-all duration-1000
        ${isRunning ? 'border-primary/50 shadow-2xl shadow-primary/20 scale-[1.02]' : 'border-white/10'}
        ${isWaiting ? 'opacity-50 grayscale' : ''}
      `}>
        {isRunning && (
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 opacity-20 blur-xl animate-pulse" />
        )}
        <div className="relative bg-card rounded-xl p-6 overflow-hidden">
          {isRunning && (
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_infinite]" />
          )}
          
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-700
              ${isRunning ? 'border-primary/30 bg-primary/10 shadow-[0_0_30px_-5px] shadow-primary/30 animate-pulse' : 'border-white/10 bg-white/5'}
              ${isDone ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : ''}
            `}>
              <Icon className={`h-8 w-8 ${isRunning ? 'text-primary' : isDone ? 'text-emerald-400' : 'text-muted-foreground'}`} />
              
              {/* Synthesis connecting lines visual (only when running) */}
              {isRunning && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
                  <div className="w-px h-10 bg-gradient-to-b from-violet-500/0 via-violet-500/50 to-violet-500/0 animate-[shimmer_1.5s_infinite]" />
                  <div className="w-px h-10 bg-gradient-to-b from-sky-500/0 via-sky-500/50 to-sky-500/0 animate-[shimmer_1.5s_infinite_0.2s]" />
                  <div className="w-px h-10 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0 animate-[shimmer_1.5s_infinite_0.4s]" />
                  <div className="w-px h-10 bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 animate-[shimmer_1.5s_infinite_0.6s]" />
                </div>
              )}
            </div>

            <div>
              <h3 className={`font-bold text-lg ${isRunning ? 'bg-gradient-to-r from-violet-400 to-primary bg-clip-text text-transparent' : ''}`}>
                {config.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm mx-auto h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out
                  ${isRunning ? 'bg-gradient-to-r from-violet-500 via-sky-500 to-primary' : ''}
                  ${isDone ? 'bg-emerald-500' : ''}
                `}
                style={{ width: `${data.progress}%` }}
              />
            </div>

            {data.message && !isWaiting && (
              <p className={`text-xs transition-all duration-300 ${isRunning ? 'text-primary animate-pulse' : 'text-emerald-500/60'}`}>
                {data.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal Agent Cards
  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col gap-4
        ${isRunning ? `border-white/20 bg-white/[0.05] shadow-lg ${config.glow} scale-[1.01]` : 'border-white/5 bg-card'}
        ${isDone ? 'border-emerald-500/10 bg-emerald-500/[0.02]' : ''}
        ${isFailed ? 'border-red-500/20 bg-red-500/[0.04]' : ''}
        ${isWaiting ? 'opacity-60' : ''}
      `}
    >
      {/* Running shimmer */}
      {isRunning && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-500
          ${isRunning ? `border-white/20 bg-white/10 ${config.color} shadow-inner` : 'border-white/5 bg-white/5 text-muted-foreground'}
          ${isDone ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : ''}
          ${isFailed ? 'border-red-500/20 bg-red-500/10 text-red-400' : ''}
        `}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`font-semibold text-sm ${isWaiting ? 'text-muted-foreground' : 'text-foreground'}`}>
              {config.label}
            </span>
            {/* Status icon */}
            <span className="shrink-0 transition-all duration-300">
              {isWaiting && <Circle className="h-4 w-4 text-muted-foreground/40" />}
              {isRunning && <Loader2 className={`h-4 w-4 animate-spin ${config.color}`} />}
              {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {isFailed && <XCircle className="h-4 w-4 text-red-400" />}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-3">{config.subtitle}</p>

          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out
                ${isRunning ? `bg-gradient-to-r from-${config.color.split('-')[1]}-500/80 to-${config.color.split('-')[1]}-400` : ''}
                ${isDone ? 'bg-emerald-500' : ''}
                ${isFailed ? 'bg-red-500' : ''}
                ${isWaiting ? 'bg-white/10' : ''}
              `}
              style={{ width: `${data.progress}%` }}
            />
          </div>

          {/* Live message */}
          {data.message && !isWaiting && (
            <p className={`text-xs mt-2 truncate transition-all duration-300
              ${isRunning ? config.color : ''}
              ${isDone ? 'text-emerald-500/60' : ''}
              ${isFailed ? 'text-red-400' : ''}
            `}>
              {data.message}
            </p>
          )}
        </div>
      </div>

      {/* Expanded Accordion Area (Only visible when running) */}
      <div 
        className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isRunning ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="rounded-xl bg-black/40 border border-white/5 p-3 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Live Sources Scraped</span>
            </div>
            
            {activeSources.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60 py-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Initializing search queries...
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {activeSources.map((source, idx) => (
                  <div 
                    key={`${source}-${idx}`}
                    className="animate-in fade-in zoom-in-95 duration-300 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-foreground/80"
                  >
                    <CheckCircle2 className={`h-3 w-3 ${config.color}`} />
                    {source}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgressTracker({ jobId, jobIdea, onComplete }: ProgressTrackerProps) {
  const progressState = useWebsocketProgress(jobId);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressState.status === 'COMPLETED') {
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [progressState.status, onComplete]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [progressState.activityLog.length]);

  const isFailed = progressState.status === 'FAILED';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-0 duration-700">
      {/* Hero Header */}
      <div className="text-center space-y-3 pb-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Live Intelligence Gathering
        </div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          Analyzing Your Venture
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto italic truncate">
          &ldquo;{jobIdea}&rdquo;
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Agent Cards — 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          {Object.entries(progressState.agents).map(([key, data]) => (
            <AgentCard key={key} agentKey={key} data={data} allAgents={progressState.agents} />
          ))}
        </div>

        {/* Right Panel — Overall + Activity Log */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Overall Progress Ring */}
          <div className="rounded-2xl border border-white/5 bg-card p-6 flex flex-col items-center justify-center gap-4">
            <div className="relative h-28 w-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressState.overallProgress / 100)}`}
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tabular-nums">
                  {Math.round(progressState.overallProgress)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Overall Progress</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFailed ? 'Analysis failed' : progressState.status === 'COMPLETED' ? 'Analysis complete!' : 'Estimated ~3 min'}
              </p>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="flex-1 rounded-2xl border border-white/5 bg-card overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Live Activity</span>
              <Zap className="h-3 w-3 text-amber-400 ml-auto" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-64 scrollbar-thin">
              {progressState.activityLog.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Waiting for agents to start...</p>
              ) : (
                progressState.activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs animate-in slide-in-from-top-1 fade-in-0 duration-300">
                    <span className="shrink-0 font-mono text-muted-foreground/60 mt-0.5">{entry.time}</span>
                    <div>
                      <span className="text-primary/70 font-medium">{entry.agent.replace('_', ' ')}</span>
                      <span className="text-muted-foreground"> — {entry.message}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
