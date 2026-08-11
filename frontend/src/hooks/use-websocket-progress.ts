import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface ProgressState {
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  overallProgress: number;
  agents: {
    Market_Scout: { status: AgentStatus; progress: number };
    Sentiment_Analyst: { status: AgentStatus; progress: number };
    Competitor_Tracker: { status: AgentStatus; progress: number };
    Trend_Forecaster: { status: AgentStatus; progress: number };
    Risk_Modeller: { status: AgentStatus; progress: number };
  };
}

const initialState: ProgressState = {
  status: 'PENDING',
  overallProgress: 0,
  agents: {
    Market_Scout: { status: 'WAITING', progress: 0 },
    Sentiment_Analyst: { status: 'WAITING', progress: 0 },
    Competitor_Tracker: { status: 'WAITING', progress: 0 },
    Trend_Forecaster: { status: 'WAITING', progress: 0 },
    Risk_Modeller: { status: 'WAITING', progress: 0 },
  }
};

export function useWebsocketProgress(jobId: string) {
  const [progress, setProgress] = useState<ProgressState>(initialState);
  const { accessToken } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId || !accessToken) return;

    // Connect to WebSocket
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/${jobId}?token=${accessToken}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        setProgress(prev => {
          const newState = { ...prev };
          
          if (data.status === 'RUNNING') {
            newState.status = 'RUNNING';
            // Start all initial agents
            if (prev.status === 'PENDING') {
              ['Market_Scout', 'Sentiment_Analyst', 'Competitor_Tracker', 'Trend_Forecaster'].forEach(agent => {
                newState.agents[agent as keyof typeof newState.agents] = { status: 'RUNNING', progress: 10 };
              });
              newState.overallProgress = 10;
            }
          } else if (data.status === 'AGENT_COMPLETE' && data.agent_name) {
            const agent = data.agent_name as keyof typeof newState.agents;
            if (newState.agents[agent]) {
              newState.agents[agent] = { status: 'COMPLETED', progress: 100 };
            }
            
            // Calculate overall progress (simplified)
            let completed = 0;
            Object.values(newState.agents).forEach(a => { if (a.status === 'COMPLETED') completed++; });
            
            if (completed === 4 && newState.agents.Risk_Modeller.status === 'WAITING') {
              newState.agents.Risk_Modeller = { status: 'RUNNING', progress: 10 };
              newState.overallProgress = 80;
            } else {
              newState.overallProgress = 10 + (completed * 17.5); // Math for smoothish bar
            }
          } else if (data.status === 'COMPLETED') {
            newState.status = 'COMPLETED';
            newState.overallProgress = 100;
            Object.keys(newState.agents).forEach(key => {
              newState.agents[key as keyof typeof newState.agents] = { status: 'COMPLETED', progress: 100 };
            });
          } else if (data.status === 'FAILED') {
            newState.status = 'FAILED';
          }
          
          return newState;
        });
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [jobId, accessToken]);

  return progress;
}
