import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentProgressData {
  status: AgentStatus;
  progress: number;
  message: string;
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

const initialAgent: AgentProgressData = { status: 'WAITING', progress: 0, message: '' };

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
              { time: now(), message, agent: agentName || 'System' },
              ...prev.activityLog.slice(0, 19), // keep last 20 entries
            ];
          }

          if (data.status === 'RUNNING' && prev.status === 'PENDING') {
            // Job started — flip all parallel agents to RUNNING
            newState.status = 'RUNNING';
            const parallelAgents: (keyof ProgressState['agents'])[] = [
              'Market_Scout', 'Sentiment_Analyst', 'Competitor_Tracker', 'Trend_Forecaster'
            ];
            parallelAgents.forEach(a => {
              newState.agents[a] = { status: 'RUNNING', progress: 5, message: 'Initializing...' };
            });
            newState.overallProgress = 5;

          } else if (data.status === 'AGENT_RUNNING' && agentName && newState.agents[agentName]) {
            // Live activity update for a specific agent
            newState.agents[agentName] = {
              ...newState.agents[agentName],
              status: 'RUNNING',
              message,
              // Nudge the individual bar forward a bit
              progress: Math.min(newState.agents[agentName].progress + 15, 85),
            };

          } else if (data.status === 'AGENT_COMPLETE' && agentName && newState.agents[agentName]) {
            newState.agents[agentName] = { status: 'COMPLETED', progress: 100, message: 'Done' };

            const completedCount = Object.values(newState.agents).filter(a => a.status === 'COMPLETED').length;
            if (completedCount === 4 && newState.agents.Risk_Modeller.status === 'WAITING') {
              newState.agents.Risk_Modeller = { status: 'RUNNING', progress: 10, message: 'Synthesizing final risk model...' };
              newState.overallProgress = 80;
            } else {
              newState.overallProgress = Math.min(10 + completedCount * 17, 80);
            }

          } else if (data.status === 'COMPLETED') {
            newState.status = 'COMPLETED';
            newState.overallProgress = 100;
            Object.keys(newState.agents).forEach(key => {
              newState.agents[key as keyof ProgressState['agents']] = { status: 'COMPLETED', progress: 100, message: 'Done' };
            });

          } else if (data.status === 'FAILED') {
            newState.status = 'FAILED';
            if (agentName && newState.agents[agentName]) {
              newState.agents[agentName] = { status: 'FAILED', progress: 0, message };
            }
          }

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
