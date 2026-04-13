from typing import Dict, Any, Optional, TypedDict
from pydantic import BaseModel, Field

# ----------------- Single Agent Output Schemas -----------------


class MarketScoutOutput(BaseModel):
    total_addressable_market: str = Field(description="Estimated TAM with units")
    serviceable_addressable_market: str = Field(description="Estimated SAM with units")
    serviceable_obtainable_market: str = Field(description="Estimated SOM with units")
    top_verticals: list[str] = Field(description="Top 3 to 5 market verticals")
    growth_rate: str = Field(description="Current market growth rate")
    regulatory_considerations: list[str] = Field(description="Any regulations to watch")
    is_saturated: bool = Field(description="True if market is heavily saturated")
    saturation_justification: str = Field(
        description="Why the market is or isn't saturated"
    )


class SentimentOutput(BaseModel):
    pain_points: list[Dict[str, Any]] = Field(
        description="List of pain points with description and exact sentiment_score from -1.0 to 1.0"
    )
    top_desires: list[str] = Field(description="Top 5 user desires")


class CompetitorOutput(BaseModel):
    direct_competitors: list[Dict[str, str]] = Field(
        description="List of name and description of approx 5 direct competitors"
    )
    indirect_competitors: list[Dict[str, str]] = Field(
        description="List of name and description of approx 3 indirect competitors"
    )
    feature_matrix: Dict[str, list[str]] = Field(
        description="Key features mapping to which competitors have them"
    )
    competitor_weaknesses: Dict[str, str] = Field(
        description="Mapping of competitor name to their primary weakness"
    )


class TrendOutput(BaseModel):
    market_phase: str = Field(
        description="Must be one of: Emerging, Growing, Mature, Declining"
    )
    sub_topics: list[str] = Field(description="Detect rising sub-topics in the market")
    seasonal_patterns: str = Field(description="Identified seasonal demand patterns")


class RiskModelOutput(BaseModel):
    risk_score: int = Field(ge=0, le=100, description="Overall venture risk score")
    market_risk: int = Field(ge=0, le=100)
    competition_risk: int = Field(ge=0, le=100)
    financial_risk: int = Field(ge=0, le=100)
    regulatory_risk: int = Field(ge=0, le=100)
    failure_points: list[str] = Field(
        description="Business Model Canvas stress-test failure points (at least 5)"
    )
    mitigation_strategies: list[str] = Field(
        description="Strategies for the identified failure points"
    )
    recommendation: str = Field(description="Go / Proceed with Caution / No-Go")
    justification: str = Field(description="Reasoning behind the final recommendation")


# ----------------- LangGraph State -----------------


class AgentState(TypedDict):
    # Job context inputs
    business_idea: str
    target_market: str
    geography: str
    depth: str

    # Partial outputs natively merged (no reducer needed because nodes will output dictionaries with these keys)
    market_data: Optional[MarketScoutOutput]
    sentiment_data: Optional[SentimentOutput]
    competitor_data: Optional[CompetitorOutput]
    trend_data: Optional[TrendOutput]

    # Final output
    risk_assessment: Optional[RiskModelOutput]
