"""
Module: scraper_runner.py

Central orchestrator for all scraper calls.
Returns safely-truncated context strings per agent, ready for direct
injection into Gemini prompt windows (pre-RAG phase).
"""

import asyncio
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# ─── Token budget constants ────────────────────────────────────────────────────
_WEB_CHARS_PER_PAGE = 2000
_REVIEW_CHARS_PER_ITEM = 300
_MAX_REVIEWS = 10
_HN_CHARS_PER_STORY = 150
_MAX_HN_STORIES = 10
_MAX_TRENDS_CHARS = 600
_TOTAL_CAP = 6000  # Hard cap per agent context string


def _truncate(text: str, limit: int) -> str:
    return text[:limit] if len(text) > limit else text


# ─── Individual scraper wrappers ──────────────────────────────────────────────

async def _get_web_context(query: str, num_results: int = 4) -> str:
    """Wikipedia-backed web context."""
    try:
        from app.scrapers.web_scraper import scrape_web
        pages = await scrape_web(query, num_results=num_results)
        parts = []
        for page in pages:
            title = page.get("title", "")
            body = _truncate(page.get("body_text", ""), _WEB_CHARS_PER_PAGE)
            if body:
                parts.append(f"## {title}\n{body}")
        return "\n\n".join(parts)
    except Exception as e:
        logger.warning(f"Web scraper failed: {e}")
        return ""


def _get_reddit_mock_context() -> str:
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
        return "\n".join(lines)
    except Exception as e:
        logger.warning(f"Reddit mock loader failed: {e}")
        return ""


async def _get_review_context(competitors: list[str]) -> str:
    """Live Google Play reviews for a known competitor app."""
    try:
        from app.scrapers.review_scraper import scrape_reviews
        # Map known competitor names to Google Play IDs for live data
        # Use a generic developer productivity app if no match
        play_ids = {
            "github": "com.github.android",
            "gitlab": "com.gitlab.android",
            "jira": "com.atlassian.android.jira.core",
            "linear": "io.linear",
        }
        # Try to match any of the competitors
        matched_ids = {}
        for comp in competitors:
            key = comp.lower().replace(" ", "").replace(".", "")
            if key in play_ids:
                matched_ids[comp] = play_ids[key]

        if not matched_ids:
            # Fallback to GitHub (always a relevant software tool)
            matched_ids = {"github": "com.github.android"}

        reviews = await scrape_reviews(
            competitors=list(matched_ids.keys()),
            play_store_ids=matched_ids,
        )
        lines = []
        for r in reviews[:_MAX_REVIEWS]:
            line = f"[{r['platform']} | {r['rating']}/5 | {r['date']}] {_truncate(r['body'], _REVIEW_CHARS_PER_ITEM)}"
            lines.append(line)
        return "\n".join(lines)
    except Exception as e:
        logger.warning(f"Review scraper failed: {e}")
        return ""


async def _get_trend_context(hn_query: str, trend_keywords: list[str]) -> str:
    """Live HN + Google Trends context."""
    try:
        from app.scrapers.trend_scraper import scrape_trends
        data = await scrape_trends(hn_query=hn_query, trend_keywords=trend_keywords[:5])

        lines = ["=== Hacker News Developer Chatter ==="]
        for story in data.get("hacker_news", [])[:_MAX_HN_STORIES]:
            lines.append(
                f"[{story['points']} pts | {story['num_comments']} comments] "
                f"{_truncate(story['title'], _HN_CHARS_PER_STORY)}"
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
                        f"most recent {recent_val}/100 on {recent_date}"
                    )

        return _truncate("\n".join(lines), _MAX_TRENDS_CHARS + 1400)
    except Exception as e:
        logger.warning(f"Trend scraper failed: {e}")
        return ""


# ─── Public API ───────────────────────────────────────────────────────────────

async def build_market_scout_context(business_idea: str, target_market: str, geography: str) -> str:
    """Wikipedia web context for market sizing."""
    query = f"{target_market} market size industry {geography}"
    raw = await _get_web_context(query, num_results=4)
    header = "=== LIVE WEB INTELLIGENCE (Wikipedia) ===\n"
    return _truncate(header + raw, _TOTAL_CAP) if raw else ""


async def build_sentiment_context(business_idea: str, target_market: str) -> str:
    """Reddit mock + live app store reviews for sentiment."""
    reddit_ctx, review_ctx = await asyncio.gather(
        asyncio.to_thread(_get_reddit_mock_context),
        _get_review_context(["github"]),
    )
    parts = []
    if reddit_ctx:
        parts.append("=== REDDIT DISCUSSIONS (Developer Communities) ===\n" + reddit_ctx)
    if review_ctx:
        parts.append("=== APP STORE REVIEWS (Competitor Apps) ===\n" + review_ctx)
    combined = "\n\n".join(parts)
    return _truncate(combined, _TOTAL_CAP)


async def build_competitor_context(business_idea: str, target_market: str) -> str:
    """Wikipedia competitor landscape + live reviews."""
    web_query = f"{target_market} software tools competitors comparison"
    web_ctx, review_ctx = await asyncio.gather(
        _get_web_context(web_query, num_results=3),
        _get_review_context(["github", "gitlab"]),
    )
    parts = []
    if web_ctx:
        parts.append("=== WEB RESEARCH (Competitor Landscape) ===\n" + web_ctx)
    if review_ctx:
        parts.append("=== USER REVIEWS (Competitor Apps) ===\n" + review_ctx)
    combined = "\n\n".join(parts)
    return _truncate(combined, _TOTAL_CAP)


async def build_trend_context(business_idea: str, target_market: str) -> str:
    """HN chatter + Google Trends for trend forecasting."""
    # Extract keywords from the business idea for trend search
    keywords = [w for w in target_market.split() if len(w) > 4][:3]
    if not keywords:
        keywords = ["software", "SaaS", "developer tools"]
    hn_query = f"{target_market} {business_idea[:50]}"
    return await _get_trend_context(hn_query, keywords)
