"""
Module: scraper_runner.py

Orchestrator for the agentic research pipeline.
Exposes context builders that take the pre-generated queries from AgentState
and run the Tavily->Crawl4AI pipeline.
"""

import logging

from app.scrapers.research_pipeline import run_pipeline

logger = logging.getLogger(__name__)


async def build_market_scout_context(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Runs the research pipeline for Market Scout."""
    context, raw_data = await run_pipeline(queries, progress_callback)
    return f"=== LIVE WEB INTELLIGENCE (Market Data) ===\n{context}", raw_data


async def build_sentiment_context(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Runs the research pipeline for Sentiment Analyst."""
    context, raw_data = await run_pipeline(queries, progress_callback)
    return f"=== LIVE WEB INTELLIGENCE (User Sentiment) ===\n{context}", raw_data


async def build_competitor_context(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Runs the research pipeline for Competitor Tracker."""
    context, raw_data = await run_pipeline(queries, progress_callback)
    return f"=== LIVE WEB INTELLIGENCE (Competitor Data) ===\n{context}", raw_data


async def build_trend_context(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Runs the research pipeline for Trend Forecaster."""
    context, raw_data = await run_pipeline(queries, progress_callback)
    return f"=== LIVE WEB INTELLIGENCE (Trend Data) ===\n{context}", raw_data


async def build_investor_context(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Runs the research pipeline for Investor Finder (Phase 2)."""
    context, raw_data = await run_pipeline(queries, progress_callback)
    return f"=== LIVE WEB INTELLIGENCE (Investor Data) ===\n{context}", raw_data
