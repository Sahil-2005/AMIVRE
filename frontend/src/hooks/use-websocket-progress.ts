import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentProgressData {
  status: AgentStatus;
  progress: number;
  message: string;
  sources: string[];
}

export interface ProgressState {
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  overallProgress: number;
  activityLog: Array<{ time: string; message: string; agent: string }>;
  agents: {
    Market_Scout:      AgentProgressData;
    Sentiment_Analyst: AgentProgressData;
    Competitor_Tracker: AgentProgressData;
    Trend_Forecaster:  AgentProgressData;
    Risk_Modeller:     AgentProgressData;
  };
}

const PARALLEL_AGENTS = ['Market_Scout', 'Sentiment_Analyst', 'Competitor_Tracker', 'Trend_Forecaster'] as const;

const initialAgent: AgentProgressData = { status: 'WAITING', progress: 0, message: '', sources: [] };

const initialState: ProgressState = {
  status: 'PENDING',
  overallProgress: 0,
  activityLog: [],
  agents: {
    Market_Scout:       { ...initialAgent },
    Sentiment_Analyst:  { ...initialAgent },
    Competitor_Tracker: { ...initialAgent },
    Trend_Forecaster:   { ...initialAgent },
    Risk_Modeller:      { ...initialAgent },
  }
};

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

/**
 * Calculate overall progress dynamically from individual agent progress.
 * The 4 parallel agents account for 80% of the work, Risk Modeller accounts for 20%.
 */
function calculateOverallProgress(agents: ProgressState['agents']): number {
  // Parallel agents contribute 80% total (20% each)
  const parallelProgress = PARALLEL_AGENTS.reduce((sum, name) => {
    return sum + (agents[name].progress / 100) * 20;
  }, 0);

  // Risk Modeller contributes the final 20%
  const riskProgress = (agents.Risk_Modeller.progress / 100) * 20;

  return Math.round(parallelProgress + riskProgress);
}

export function useWebsocketProgress(jobId: string) {
  const [progress, setProgress] = useState<ProgressState>(initialState);
  const { accessToken } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId || !accessToken) return;

    setProgress(initialState);

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/${jobId}?token=${accessToken}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const agentName = data.agent_name as keyof ProgressState['agents'] | null;
        const message: string = data.message || '';

        setProgress(prev => {
          const newState: ProgressState = {
            ...prev,
            agents: { ...prev.agents },
            activityLog: [...prev.activityLog],
          };

          if (message) {
            newState.activityLog = [
              ...prev.activityLog,
              { time: now(), message, agent: agentName || 'System' },
            ].slice(-50); // Keep last 50 entries in chronological order
          }

          if (data.status === 'RUNNING' && prev.status === 'PENDING') {
            // Job just started — mark overall as RUNNING
            newState.status = 'RUNNING';

          } else if (data.status === 'AGENT_RUNNING' && agentName && newState.agents[agentName]) {
            // Live activity update for a specific agent — agents self-report their running state.
            // In parallel mode, multiple agents can be RUNNING simultaneously.
            const updatedSources = [...newState.agents[agentName].sources];
            if (message.startsWith('Scraping: ')) {
              const domain = message.replace('Scraping: ', '').replace('...', '').trim();
              if (domain && !updatedSources.includes(domain)) {
                updatedSources.push(domain);
                // Keep only the last 6 sources to avoid overflowing the UI
                if (updatedSources.length > 6) updatedSources.shift();
              }
            }

            newState.agents[agentName] = {
              ...newState.agents[agentName],
              status: 'RUNNING',
              message,
              sources: updatedSources,
              // Nudge the individual bar forward a bit
              progress: Math.min(newState.agents[agentName].progress + 12, 85),
            };

          } else if (data.status === 'AGENT_COMPLETE' && agentName && newState.agents[agentName]) {
            newState.agents[agentName] = { ...newState.agents[agentName], status: 'COMPLETED', progress: 100, message: 'Done' };

            // Check if all 4 parallel agents are done — if so, Risk Modeller is next
            const allParallelDone = PARALLEL_AGENTS.every(
              name => newState.agents[name].status === 'COMPLETED'
            );
            if (allParallelDone && newState.agents.Risk_Modeller.status === 'WAITING') {
              newState.agents.Risk_Modeller = {
                ...newState.agents.Risk_Modeller,
                status: 'RUNNING',
                progress: 10,
                message: 'Synthesizing final risk model...',
              };
            }

          } else if (data.status === 'COMPLETED') {
            newState.status = 'COMPLETED';
            newState.overallProgress = 100;
            Object.keys(newState.agents).forEach(key => {
              const k = key as keyof ProgressState['agents'];
              newState.agents[k] = { ...newState.agents[k], status: 'COMPLETED', progress: 100, message: 'Done' };
            });

          } else if (data.status === 'FAILED') {
            newState.status = 'FAILED';
            if (agentName && newState.agents[agentName]) {
              newState.agents[agentName] = { ...newState.agents[agentName], status: 'FAILED', progress: 0, message };
            }
          }

          // Recalculate overall progress from individual agents
          newState.overallProgress = calculateOverallProgress(newState.agents);

          return newState;
        });
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [jobId, accessToken]);

  return progress;
}
