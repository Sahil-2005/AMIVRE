from langgraph.graph import StateGraph, START, END
from app.orchestrator.state import AgentState

from app.agents.market_scout import MarketScoutAgent
from app.agents.sentiment_analyst import SentimentAnalystAgent
from app.agents.competitor_tracker import CompetitorTrackerAgent
from app.agents.trend_forecaster import TrendForecasterAgent
from app.agents.risk_modeller import RiskModellerAgent


def build_graph():
    # Initialize StateGraph with our typed dictionary state
    workflow = StateGraph(AgentState)

    # Initialize agents
    market_scout = MarketScoutAgent()
    sentiment_analyst = SentimentAnalystAgent()
    competitor_tracker = CompetitorTrackerAgent()
    trend_forecaster = TrendForecasterAgent()
    risk_modeller = RiskModellerAgent()

    # Add nodes referencing the agent run logic
    workflow.add_node("Market_Scout", market_scout.run)
    workflow.add_node("Sentiment_Analyst", sentiment_analyst.run)
    workflow.add_node("Competitor_Tracker", competitor_tracker.run)
    workflow.add_node("Trend_Forecaster", trend_forecaster.run)

    # The Risk Modeller acts as the synthesizer node
    workflow.add_node("Risk_Modeller", risk_modeller.run)

    # Add directed edges from start to parallel nodes
    workflow.add_edge(START, "Market_Scout")
    workflow.add_edge(START, "Sentiment_Analyst")
    workflow.add_edge(START, "Competitor_Tracker")
    workflow.add_edge(START, "Trend_Forecaster")

    # All parallel nodes converge into the Risk Modeller node
    workflow.add_edge("Market_Scout", "Risk_Modeller")
    workflow.add_edge("Sentiment_Analyst", "Risk_Modeller")
    workflow.add_edge("Competitor_Tracker", "Risk_Modeller")
    workflow.add_edge("Trend_Forecaster", "Risk_Modeller")

    # Risk modellers finishes the graph
    workflow.add_edge("Risk_Modeller", END)

    return workflow.compile()


# The global compiled instance
graph = build_graph()
