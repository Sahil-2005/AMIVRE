"""
Module: scraper_runner.py

Central orchestrator for all scraper calls.
Returns safely-truncated context strings per agent, ready for direct
injection into Gemini prompt windows (pre-RAG phase).

IMPORTANT: All public build_* methods return a tuple of (context_string, raw_data).
The raw_data is stored in LangGraph state for the frontend "Scraper Receipts" drawer.
"""

import asyncio
import json
import logging
import re
from pathlib import Path

from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

logger = logging.getLogger(__name__)

# ─── Token budget constants ────────────────────────────────────────────────────
_WEB_CHARS_PER_PAGE = 2000
_REVIEW_CHARS_PER_ITEM = 300
_MAX_REVIEWS = 50
_HN_CHARS_PER_STORY = 150
_MAX_HN_STORIES = 10
_MAX_TRENDS_CHARS = 600
_TOTAL_CAP = 6000  # Hard cap per agent context string


def _truncate(text: str, limit: int) -> str:
    return text[:limit] if len(text) > limit else text


class SearchQueries(BaseModel):
    wikipedia_market_query: str = Field(description="A 2-4 word query to search Wikipedia for the market (e.g. 'Sustainable fashion', 'Pet food industry')")
    wikipedia_competitor_query: str = Field(description="A 2-4 word query to search Wikipedia for competitors (e.g. 'Sustainable fashion companies', 'Pet food brands')")
    app_store_query: str = Field(description="A 2-3 word query to search Google Play for competitor apps (e.g. 'custom apparel', 'dog food delivery')")
    hn_query: str = Field(description="A 2-3 word query to search Hacker News for developer discussions about this market")
    trend_keywords: list[str] = Field(description="List of exactly 3 short keywords for Google Trends")

def _generate_search_queries(business_idea: str, target_market: str) -> SearchQueries:
    """Uses Gemini to generate highly targeted search queries for the scrapers."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.0
    )
    structured_llm = llm.with_structured_output(SearchQueries)
    prompt = f"""
    We need to search various platforms for market research on the following startup:
    Idea: {business_idea}
    Target Market: {target_market}
    
    Generate the most relevant, broad industry search queries. Do NOT just copy the input text.
    Extract the core industry or product category.
    For example, if the idea is a 3D-knitted biodegradable apparel brand, the Wikipedia market query should be 'Sustainable fashion' or 'Textile recycling', NOT 'Minimalist fashion enthusiasts'.
    """
    try:
        return structured_llm.invoke(prompt)
    except Exception as e:
        logger.error(f"Failed to generate search queries: {e}")
        # Fallback to safe defaults if LLM fails
        return SearchQueries(
            wikipedia_market_query="Software industry",
            wikipedia_competitor_query="Software companies",
            app_store_query="productivity",
            hn_query="software",
            trend_keywords=["software", "SaaS", "tech"]
        )


# ─── Individual scraper wrappers ──────────────────────────────────────────────

async def _get_web_context(query: str, num_results: int = 4) -> tuple[str, list]:
    """Wikipedia-backed web context."""
    try:
        from app.scrapers.web_scraper import scrape_web
        pages = await scrape_web(query, num_results=num_results)
        parts = []
        for page in pages:
            title = page.get("title", "")
            url = page.get("url", "")
            body = _truncate(page.get("body_text", ""), _WEB_CHARS_PER_PAGE)
            if body:
                parts.append(f"## {title}\nSource URL: {url}\n{body}")
        return "\n\n".join(parts), pages
    except Exception as e:
        logger.warning(f"Web scraper failed: {e}")
        return "", []


def _get_reddit_mock_context() -> tuple[str, list]:
    """Phase A: Load the reddit mock fixture and format as readable text."""
    try:
        fixture = Path(__file__).parent / "fixtures" / "reddit_sample.json"
        raw = json.loads(fixture.read_text(encoding="utf-8"))
        from app.scrapers.reddit_scraper import parse_reddit_listing
        posts = parse_reddit_listing(raw)
        lines = []
        for p in posts:
            lines.append(f"[{p['subreddit']} | {p['score']} pts] {p['title']}")
            if p.get("selftext"):
                lines.append(f"  > {_truncate(p['selftext'], 200)}")
        return "\n".join(lines), posts
    except Exception as e:
        logger.warning(f"Reddit mock loader failed: {e}")
        return "", []


async def _get_review_context(app_store_query: str) -> tuple[str, list]:
    """
    Live Google Play reviews for RELEVANT competitor apps.
    
    Instead of hardcoding app IDs, we use google-play-scraper's search to
    dynamically find apps that match the user's actual business domain.
    """
    try:
        from google_play_scraper import search as gp_search
        from app.scrapers.review_scraper import scrape_reviews
        
        # Build a domain-relevant search query from the business idea
        logger.info(f"Searching Google Play for: {app_store_query}")
        
        # Search Google Play for relevant apps
        search_results = await asyncio.to_thread(
            gp_search, app_store_query, n_hits=3, lang="en", country="us"
        )
        
        if not search_results:
            logger.warning(f"No Google Play apps found for: {search_terms}")
            return "", []
        
        # Build play_store_ids from search results
        matched_ids = {}
        for app in search_results[:3]:
            app_id = app.get("appId", "")
            app_title = app.get("title", app_id)
            if app_id:
                matched_ids[app_title] = app_id
        
        if not matched_ids:
            return "", []
        
        logger.info(f"Found relevant apps: {list(matched_ids.keys())}")
        
        reviews = await scrape_reviews(
            competitors=list(matched_ids.keys()),
            play_store_ids=matched_ids,
        )
        
        lines = []
        for r in reviews[:_MAX_REVIEWS]:
            line = f"[{r['platform']} | {r['rating']}/5 | {r['date']}] {_truncate(r['body'], _REVIEW_CHARS_PER_ITEM)}"
            lines.append(line)
        return "\n".join(lines), reviews
    except Exception as e:
        logger.warning(f"Review scraper failed: {e}")
        return "", []


async def _get_trend_context(hn_query: str, trend_keywords: list[str]) -> tuple[str, dict]:
    """Live HN + Google Trends context."""
    try:
        from app.scrapers.trend_scraper import scrape_trends
        data = await scrape_trends(hn_query=hn_query, trend_keywords=trend_keywords[:5])

        lines = ["=== Hacker News Developer Chatter ==="]
        hn_stories = data.get("hacker_news", [])
        for story in hn_stories[:_MAX_HN_STORIES]:
            story_url = story.get('url', '')
            hn_item_url = f"https://news.ycombinator.com/item?id={story.get('objectID', '')}"
            lines.append(
                f"[{story['points']} pts | {story['num_comments']} comments] "
                f"{_truncate(story['title'], _HN_CHARS_PER_STORY)}\n"
                f"Source URL: {story_url or hn_item_url}"
            )

        trends = data.get("google_trends", {})
        if trends:
            lines.append("\n=== Google Trends — 12-Month Interest (0-100) ===")
            for keyword, dates in trends.items():
                if dates:
                    items = list(dates.items())
                    peak_date, peak_val = max(items, key=lambda x: x[1])
                    recent_date, recent_val = items[-1]
                    lines.append(
                        f"- \"{keyword}\": peak {peak_val}/100 on {peak_date}, "
                        f"most recent {recent_val}/100 on {recent_date}\n"
                        f"Source URL: https://trends.google.com/trends/explore?q={keyword.replace(' ', '+')}"
                    )

        return _truncate("\n".join(lines), _MAX_TRENDS_CHARS + 1400), data
    except Exception as e:
        logger.warning(f"Trend scraper failed: {e}")
        return "", {}


# ─── Public API ───────────────────────────────────────────────────────────────

async def build_market_scout_context(business_idea: str, target_market: str, geography: str) -> tuple[str, list]:
    """Wikipedia web context for market sizing."""
    queries = _generate_search_queries(business_idea, target_market)
    logger.info(f"Market Scout Wikipedia query: {queries.wikipedia_market_query}")
    raw_str, raw_data = await _get_web_context(queries.wikipedia_market_query, num_results=4)
    header = "=== LIVE WEB INTELLIGENCE (Wikipedia) ===\n"
    return (_truncate(header + raw_str, _TOTAL_CAP) if raw_str else ""), raw_data


async def build_sentiment_context(business_idea: str, target_market: str) -> tuple[str, dict]:
    """Reddit mock + live app store reviews for sentiment."""
    queries = _generate_search_queries(business_idea, target_market)
    (reddit_ctx, reddit_raw), (review_ctx, review_raw) = await asyncio.gather(
        asyncio.to_thread(_get_reddit_mock_context),
        _get_review_context(queries.app_store_query),
    )
    parts = []
    if reddit_ctx:
        parts.append("=== REDDIT DISCUSSIONS (Developer Communities) ===\n" + reddit_ctx)
    if review_ctx:
        parts.append("=== APP STORE REVIEWS (Competitor Apps) ===\n" + review_ctx)
    combined = "\n\n".join(parts)
    raw_data = {"reddit": reddit_raw, "reviews": review_raw}
    return _truncate(combined, _TOTAL_CAP), raw_data


async def build_competitor_context(business_idea: str, target_market: str) -> tuple[str, dict]:
    """Wikipedia competitor landscape + live reviews."""
    queries = _generate_search_queries(business_idea, target_market)
    logger.info(f"Competitor Tracker Wikipedia query: {queries.wikipedia_competitor_query}")
    (web_ctx, web_raw), (review_ctx, review_raw) = await asyncio.gather(
        _get_web_context(queries.wikipedia_competitor_query, num_results=3),
        _get_review_context(queries.app_store_query),
    )
    parts = []
    if web_ctx:
        parts.append("=== WEB RESEARCH (Competitor Landscape) ===\n" + web_ctx)
    if review_ctx:
        parts.append("=== USER REVIEWS (Competitor Apps) ===\n" + review_ctx)
    combined = "\n\n".join(parts)
    raw_data = {"web": web_raw, "reviews": review_raw}
    return _truncate(combined, _TOTAL_CAP), raw_data


async def build_trend_context(business_idea: str, target_market: str) -> tuple[str, dict]:
    """HN chatter + Google Trends for trend forecasting."""
    queries = _generate_search_queries(business_idea, target_market)
    logger.info(f"Trend Forecaster HN query: {queries.hn_query}, Trend keywords: {queries.trend_keywords}")
    return await _get_trend_context(queries.hn_query, queries.trend_keywords)
