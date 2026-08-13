import json
import logging
import asyncio
import redis
from app.config import settings

from langgraph.graph import StateGraph, START, END
from app.orchestrator.state import AgentState

from app.agents.market_scout import MarketScoutAgent
from app.agents.sentiment_analyst import SentimentAnalystAgent
from app.agents.competitor_tracker import CompetitorTrackerAgent
from app.agents.trend_forecaster import TrendForecasterAgent
from app.agents.risk_modeller import RiskModellerAgent

logger = logging.getLogger(__name__)


def _publish_agent_complete(job_id: str | None, agent_name: str):
    """Publish AGENT_COMPLETE after a node finishes."""
    if not job_id:
        return
    try:
        payload = json.dumps({"status": "AGENT_COMPLETE", "agent_name": agent_name, "message": f"{agent_name.replace('_', ' ')} finished."})
        sync_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        sync_redis.publish(f"progress:{job_id}", payload)
        sync_redis.close()
    except Exception as e:
        logger.warning(f"Could not publish AGENT_COMPLETE for {agent_name}: {e}")


def _make_node(agent, result_key: str):
    """Wrap an agent's run() with AGENT_COMPLETE publishing after completion."""
    def node(state: dict) -> dict:
        result = agent.run(state)
        _publish_agent_complete(state.get("_job_id"), result_key)
        return result
    return node


from app.agents.master_query_node import master_query_node

def build_graph():
    workflow = StateGraph(AgentState)

    market_scout = MarketScoutAgent()
    sentiment_analyst = SentimentAnalystAgent()
    competitor_tracker = CompetitorTrackerAgent()
    trend_forecaster = TrendForecasterAgent()
    risk_modeller = RiskModellerAgent()

    workflow.add_node("Master_Query_Node", master_query_node)
    workflow.add_node("Market_Scout",      _make_node(market_scout,      "Market_Scout"))
    workflow.add_node("Sentiment_Analyst", _make_node(sentiment_analyst, "Sentiment_Analyst"))
    workflow.add_node("Competitor_Tracker",_make_node(competitor_tracker,"Competitor_Tracker"))
    workflow.add_node("Trend_Forecaster",  _make_node(trend_forecaster,  "Trend_Forecaster"))
    workflow.add_node("Risk_Modeller",     _make_node(risk_modeller,     "Risk_Modeller"))

    workflow.add_edge(START, "Master_Query_Node")
    workflow.add_edge("Master_Query_Node", "Market_Scout")
    workflow.add_edge("Master_Query_Node", "Sentiment_Analyst")
    workflow.add_edge("Master_Query_Node", "Competitor_Tracker")
    workflow.add_edge("Master_Query_Node", "Trend_Forecaster")

    workflow.add_edge("Market_Scout",      "Risk_Modeller")
    workflow.add_edge("Sentiment_Analyst", "Risk_Modeller")
    workflow.add_edge("Competitor_Tracker","Risk_Modeller")
    workflow.add_edge("Trend_Forecaster",  "Risk_Modeller")

    workflow.add_edge("Risk_Modeller", END)

    return workflow.compile()


graph = build_graph()
