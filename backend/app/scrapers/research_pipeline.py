"""
Module: research_pipeline.py

Autonomous Research Pipeline utilizing Tavily API for search and Crawl4AI for web extraction.
Replaces the legacy manual scrapers.

Performance Notes:
- Tavily queries run concurrently (semaphore-limited to 3) instead of sequentially.
- Crawl4AI processes all URLs in a single batch instead of batches of 2 with 2s sleeps.
- A per-URL timeout of 15s prevents hanging on slow/unresponsive sites.
"""

import asyncio
import logging

from crawl4ai import AsyncWebCrawler
from tavily import AsyncTavilyClient

from app.config import settings

logger = logging.getLogger(__name__)

# Quota Mitigation Settings
MAX_URLS_PER_AGENT = 5
MAX_CHARS_PER_URL = 3000
TOTAL_MAX_CHARS = 15000

# Concurrency limits to stay within API quotas
TAVILY_CONCURRENCY = 3  # Max simultaneous Tavily searches
CRAWL_TIMEOUT_SECS = 15  # Per-URL timeout for Crawl4AI


async def _tavily_search(queries: list[str]) -> list[str]:
    """Search Tavily for multiple queries concurrently and return a combined list of top URLs."""
    if not settings.TAVILY_API_KEY:
        logger.warning("TAVILY_API_KEY is not set. Cannot perform searches.")
        return []

    client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
    urls = []
    semaphore = asyncio.Semaphore(TAVILY_CONCURRENCY)

    async def _search_one(q: str) -> list[str]:
        async with semaphore:
            try:
                res = await client.search(query=q, search_depth="basic", max_results=3)
                return [
                    item["url"] for item in res.get("results", []) if item.get("url")
                ]
            except Exception as e:
                logger.error(f"Tavily search failed for query '{q}': {e}")
                return []

    # Fire all queries concurrently, bounded by semaphore
    results = await asyncio.gather(*[_search_one(q) for q in queries])
    for result_urls in results:
        urls.extend(result_urls)

    return urls


def _clean_urls(urls: list[str]) -> list[str]:
    """Deduplicate and clean the URL list."""
    # Deduplicate while preserving order
    seen = set()
    cleaned = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            cleaned.append(u)
    return cleaned[:MAX_URLS_PER_AGENT]


def _truncate(text: str, limit: int) -> str:
    if not text:
        return ""
    return text[:limit] + "..." if len(text) > limit else text


async def _extract_content(
    urls: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Use Crawl4AI to visit URLs and extract clean Markdown content.

    All URLs are processed in a single concurrent batch with individual timeouts
    to prevent one slow page from blocking the entire batch.
    """
    if not urls:
        return "", []

    raw_data = []
    markdown_parts = []

    async with AsyncWebCrawler(verbose=False) as crawler:
        # Process ALL URLs concurrently — individual timeouts protect against hangs
        async def _crawl_one(url: str):
            """Crawl a single URL with a timeout."""
            try:
                return await asyncio.wait_for(
                    crawler.arun(url=url), timeout=CRAWL_TIMEOUT_SECS
                )
            except asyncio.TimeoutError:
                logger.warning(
                    f"Crawl4AI timed out after {CRAWL_TIMEOUT_SECS}s for {url}"
                )
                return None
            except Exception as e:
                logger.error(f"Crawl4AI failed for {url}: {e}")
                return None

        results = await asyncio.gather(*[_crawl_one(url) for url in urls])

        for idx, result in enumerate(results):
            url = urls[idx]
            if progress_callback:
                # Strip http/https and truncate URL for clean UI display
                clean_url = (
                    url.replace("https://", "").replace("http://", "").split("/")[0]
                )
                progress_callback(f"Scraping: {clean_url}...")

            if result is None:
                continue

            if not result.success:
                logger.error(f"Failed to crawl {url}: {result.error_message}")
                continue

            # Quota Mitigation: Truncate the markdown
            content = _truncate(result.markdown, MAX_CHARS_PER_URL)
            if not content.strip():
                continue

            raw_data.append({"url": url, "content": content})
            markdown_parts.append(f"### Source URL: {url}\n\n{content}")

    # Compile the final string with a hard cap to protect Gemini quota
    final_context = "\n\n---\n\n".join(markdown_parts)
    final_context = _truncate(final_context, TOTAL_MAX_CHARS)

    return final_context, raw_data


async def run_pipeline(
    queries: list[str], progress_callback=None
) -> tuple[str, list[dict]]:
    """
    Executes the full agentic pipeline for a given set of queries.
    Returns the truncated Markdown string and the raw data dictionary for the frontend.
    """
    logger.info(f"Running pipeline with queries: {queries}")
    if progress_callback:
        progress_callback("Searching web via Tavily...")
    urls = await _tavily_search(queries)
    clean_urls = _clean_urls(urls)

    if progress_callback:
        progress_callback(f"Found {len(clean_urls)} sources. Extracting content...")
    logger.info(f"Extracting content for {len(clean_urls)} URLs.")
    context_string, raw_data = await _extract_content(clean_urls, progress_callback)

    if progress_callback:
        progress_callback("Analyzing extracted data with Gemini...")
    return context_string, raw_data
