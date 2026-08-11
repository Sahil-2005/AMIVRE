// Auth
export interface LoginRequest { username: string; password: string }
export interface RegisterRequest { email: string; password: string }
export interface TokenResponse { access_token: string; refresh_token: string; token_type: string }
export interface UserResponse { id: string; email: string; is_active: boolean; created_at: string }

// Analysis
export type JobDepth = "QUICK" | "STANDARD" | "DEEP"
export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "PARTIAL"

export interface AnalysisSubmitRequest {
  business_idea: string
  target_market: string
  geography: string
  depth: JobDepth
}

export interface MarketData {
  total_addressable_market: string;
  serviceable_addressable_market: string;
  serviceable_obtainable_market: string;
  top_verticals: string[];
  growth_rate: string;
  regulatory_considerations: string[];
  is_saturated: boolean;
  saturation_justification: string;
}

export interface SentimentData {
  pain_points: Array<{ description: string; sentiment_score: number }>;
  top_desires: string[];
}

export interface CompetitorData {
  direct_competitors: Array<{ name: string; description: string }>;
  indirect_competitors: Array<{ name: string; description: string }>;
  feature_matrix: Record<string, string[]>;
  competitor_weaknesses: Record<string, string>;
}

export interface TrendData {
  market_phase: string;
  sub_topics: string[];
  seasonal_patterns: string;
}

export interface RiskAssessment {
  risk_score: number;
  market_risk: number;
  competition_risk: number;
  financial_risk: number;
  regulatory_risk: number;
  failure_points: string[];
  mitigation_strategies: string[];
  recommendation: string;
  justification: string;
}

export interface AnalysisResult {
  market_data: MarketData
  sentiment_data: SentimentData
  competitor_data: CompetitorData
  trend_data: TrendData
  risk_assessment: RiskAssessment
}

export interface AnalysisJobResponse {
  id: string
  user_id: string
  business_idea: string
  target_market: string
  geography: string
  status: JobStatus
  depth: JobDepth
  result_json: AnalysisResult | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export interface PaginatedAnalysisJobs {
  items: AnalysisJobResponse[];
  total: number;
  page: number;
  limit: number;
}
