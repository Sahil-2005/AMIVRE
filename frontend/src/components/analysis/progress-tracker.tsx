'use client';

import { useWebsocketProgress, AgentStatus } from '@/hooks/use-websocket-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProgressTrackerProps {
  jobId: string;
  jobIdea: string;
  onComplete: () => void;
}

export function ProgressTracker({ jobId, jobIdea, onComplete }: ProgressTrackerProps) {
  const progressState = useWebsocketProgress(jobId);

  useEffect(() => {
    if (progressState.status === 'COMPLETED') {
      // Add slight delay so user sees the 100% completion before switching
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [progressState.status, onComplete]);

  const StatusIcon = ({ status }: { status: AgentStatus }) => {
    switch (status) {
      case 'WAITING':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case 'RUNNING':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getAgentLabel = (key: string) => key.replace('_', ' ');

  if (progressState.status === 'FAILED') {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>
          Something went wrong while running the agents. Please check your dashboard or try submitting the idea again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">Analyzing Business Idea</CardTitle>
        <CardDescription className="truncate max-w-lg mx-auto italic mt-2">
          "{jobIdea}"
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="space-y-4">
          {Object.entries(progressState.agents).map(([agent, data]) => (
            <div key={agent} className="flex items-center gap-4">
              <StatusIcon status={data.status} />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className={`font-medium ${data.status === 'WAITING' ? 'text-muted-foreground' : ''}`}>
                    {getAgentLabel(agent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {data.status === 'RUNNING' ? 'Running...' : data.status === 'COMPLETED' ? 'Done' : 'Waiting'}
                  </span>
                </div>
                <Progress value={data.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{Math.round(progressState.overallProgress)}%</span>
          </div>
          <Progress 
            value={progressState.overallProgress} 
            className="h-3"
            // Make the progress bar primary colored
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Estimated time remaining: ~3 min
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
