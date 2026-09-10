"""
Module: graph.py

LangGraph orchestrator — defines the agent execution flow.

Architecture:
  Master Query Node → [Market Scout, Sentiment Analyst, Competitor Tracker, Trend Forecaster] → Risk Modeller

The 4 scraping agents run IN PARALLEL via LangGraph's native fan-out/fan-in pattern.
Each agent independently scrapes the web and calls Gemini, then all results converge
into the Risk Modeller for the final stress-test.

A small stagger (2s) is added between LLM calls to avoid hitting Gemini's rate limit,
while scraping still happens fully concurrently.
"""

import json
import logging
import threading
import time

from langgraph.graph import END, START, StateGraph

from app.agents.competitor_tracker import CompetitorTrackerAgent
from app.agents.market_scout import MarketScoutAgent
from app.agents.master_query_node import master_query_node
from app.agents.risk_modeller import RiskModellerAgent
from app.agents.sentiment_analyst import SentimentAnalystAgent
from app.agents.trend_forecaster import TrendForecasterAgent
from app.orchestrator.state import AgentState

logger = logging.getLogger(__name__)

# Shared connection pool for progress publishing (same pool as base_agent)
from app.agents.base_agent import _get_redis

# Shared lock + counter to stagger Gemini LLM calls across parallel agents.
# This prevents 4 agents from hitting the Gemini API at the exact same millisecond,
# which could trigger rate limiting. Each agent waits (index * 2) seconds before
# calling the LLM, but scraping still runs fully concurrently.
_llm_stagger_lock = threading.Lock()
_llm_call_counter = 0


def _get_stagger_delay() -> float:
    """Return a stagger delay (in seconds) for the next LLM call."""
    global _llm_call_counter
    with _llm_stagger_lock:
        delay = _llm_call_counter * 1.5  # 0s, 1.5s, 3s, 4.5s
        _llm_call_counter += 1
        return delay


def _reset_stagger():
    """Reset the stagger counter at the start of each pipeline run."""
    global _llm_call_counter
    with _llm_stagger_lock:
        _llm_call_counter = 0


def _publish_agent_complete(job_id: str | None, agent_name: str):
    """Publish AGENT_COMPLETE after a node finishes."""
    if not job_id:
        return
    try:
        payload = json.dumps(
            {
                "status": "AGENT_COMPLETE",
                "agent_name": agent_name,
                "message": f"{agent_name.replace('_', ' ')} finished.",
            }
        )
        r = _get_redis()
        r.publish(f"progress:{job_id}", payload)
    except Exception as e:
        logger.warning(f"Could not publish AGENT_COMPLETE for {agent_name}: {e}")


def _make_node(agent, result_key: str):
    """Wrap an agent's run() with LLM stagger + AGENT_COMPLETE publishing."""

    def node(state: dict) -> dict:
        # Apply stagger delay before the LLM call to avoid Gemini rate limits.
        # The scraping portion runs first (no stagger), only the final LLM inference is staggered.
        delay = _get_stagger_delay()
        if delay > 0:
            logger.info(
                f"Staggering {result_key} LLM call by {delay:.1f}s to avoid Gemini rate limits"
            )
            time.sleep(delay)

        result = agent.run(state)
        _publish_agent_complete(state.get("_job_id"), result_key)
        return result

    return node


def _master_query_with_reset(state: dict) -> dict:
    """Run the master query node and reset the LLM stagger counter for the next parallel batch."""

    _reset_stagger()
    return master_query_node(state)




def build_graph():
    workflow = StateGraph(AgentState)

    market_scout = MarketScoutAgent()
    sentiment_analyst = SentimentAnalystAgent()
    competitor_tracker = CompetitorTrackerAgent()
    trend_forecaster = TrendForecasterAgent()
    risk_modeller = RiskModellerAgent()

    workflow.add_node("Master_Query_Node", _master_query_with_reset)
    workflow.add_node("Market_Scout", _make_node(market_scout, "Market_Scout"))
    workflow.add_node(
        "Sentiment_Analyst", _make_node(sentiment_analyst, "Sentiment_Analyst")
    )
    workflow.add_node(
        "Competitor_Tracker", _make_node(competitor_tracker, "Competitor_Tracker")
    )
    workflow.add_node(
        "Trend_Forecaster", _make_node(trend_forecaster, "Trend_Forecaster")
    )
    workflow.add_node("Risk_Modeller", _make_node(risk_modeller, "Risk_Modeller"))

    # --- Fan-out: Master Query → All 4 agents in parallel ---
    workflow.add_edge(START, "Master_Query_Node")
    workflow.add_edge("Master_Query_Node", "Market_Scout")
    workflow.add_edge("Master_Query_Node", "Sentiment_Analyst")
    workflow.add_edge("Master_Query_Node", "Competitor_Tracker")
    workflow.add_edge("Master_Query_Node", "Trend_Forecaster")

    # --- Fan-in: All 4 agents converge → Risk Modeller ---
    workflow.add_edge("Market_Scout", "Risk_Modeller")
    workflow.add_edge("Sentiment_Analyst", "Risk_Modeller")
    workflow.add_edge("Competitor_Tracker", "Risk_Modeller")
    workflow.add_edge("Trend_Forecaster", "Risk_Modeller")

    workflow.add_edge("Risk_Modeller", END)

    return workflow.compile()


graph = build_graph()
