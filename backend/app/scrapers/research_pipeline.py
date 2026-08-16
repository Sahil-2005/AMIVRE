"""
Module: research_pipeline.py

Autonomous Research Pipeline utilizing Tavily API for search and Crawl4AI for web extraction.
Replaces the legacy manual scrapers.

Architecture:
- Tavily queries run concurrently (semaphore-limited to 3).
- A global asyncio.Lock serializes Crawl4AI access so that only ONE Chromium
  browser instance is active at a time — critical when 4 agents run in parallel
  inside a Docker container (prevents resource starvation & mass timeouts).
- Tavily search results include text snippets that are used as FALLBACK content
  when Crawl4AI fails to crawl a URL (timeout, anti-bot, etc.).
"""

import asyncio
import logging
import threading

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
CRAWL_TIMEOUT_SECS = 25  # Per-URL timeout for Crawl4AI

# Global lock to serialize Crawl4AI browser access across parallel agents.
# Without this, 4 agents each spawn a Chromium browser, overwhelming the container.
_crawl_lock = threading.Lock()


async def _tavily_search(queries: list[str]) -> tuple[list[str], dict[str, str]]:
    """Search Tavily for multiple queries concurrently.

    Returns:
        - A combined list of top URLs.
        - A dict mapping URL -> snippet text (fallback content if Crawl4AI fails).
    """
    if not settings.TAVILY_API_KEY:
        logger.warning("TAVILY_API_KEY is not set. Cannot perform searches.")
        return [], {}

    client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
    all_urls: list[str] = []
    snippets: dict[str, str] = {}
    semaphore = asyncio.Semaphore(TAVILY_CONCURRENCY)

    async def _search_one(q: str) -> list[dict]:
        async with semaphore:
            try:
                res = await client.search(query=q, search_depth="basic", max_results=3)
                return res.get("results", [])
            except Exception as e:
                logger.error(f"Tavily search failed for query '{q}': {e}")
                return []

    # Fire all queries concurrently, bounded by semaphore
    results = await asyncio.gather(*[_search_one(q) for q in queries])
    for result_items in results:
        for item in result_items:
            url = item.get("url")
            if url:
                all_urls.append(url)
                # Store Tavily's snippet as fallback content
                snippet = item.get("content", "")
                if snippet and url not in snippets:
                    snippets[url] = snippet

    return all_urls, snippets


def _clean_urls(urls: list[str]) -> list[str]:
    """Deduplicate and clean the URL list."""
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
    urls: list[str], snippets: dict[str, str], progress_callback=None
) -> tuple[str, list[dict]]:
    """Use Crawl4AI to visit URLs and extract clean Markdown content.

    Uses a global threading lock so only one Chromium browser exists at a time
    across parallel agents. Falls back to Tavily snippets for URLs that fail.
    """
    if not urls:
        return "", []

    raw_data = []
    markdown_parts = []

    # Acquire the global lock to ensure only one browser runs at a time
    with _crawl_lock:
        async with AsyncWebCrawler(verbose=False) as crawler:
            for url in urls:
                if progress_callback:
                    clean_url = (
                        url.replace("https://", "").replace("http://", "").split("/")[0]
                    )
                    progress_callback(f"Scraping: {clean_url}...")

                content = None
                try:
                    result = await asyncio.wait_for(
                        crawler.arun(url=url), timeout=CRAWL_TIMEOUT_SECS
                    )
                    if result and result.success and result.markdown and result.markdown.strip():
                        content = _truncate(result.markdown, MAX_CHARS_PER_URL)
                    elif result and not result.success:
                        logger.warning(f"Crawl4AI failed for {url}: {result.error_message}")
                except asyncio.TimeoutError:
                    logger.warning(f"Crawl4AI timed out after {CRAWL_TIMEOUT_SECS}s for {url}")
                except Exception as e:
                    logger.error(f"Crawl4AI exception for {url}: {e}")

                # Fallback: use Tavily snippet if crawl failed
                if not content and url in snippets:
                    content = _truncate(snippets[url], MAX_CHARS_PER_URL)
                    logger.info(f"Using Tavily snippet fallback for {url}")

                if content:
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
    urls, snippets = await _tavily_search(queries)
    clean_urls = _clean_urls(urls)

    if progress_callback:
        progress_callback(f"Found {len(clean_urls)} sources. Extracting content...")
    logger.info(f"Extracting content for {len(clean_urls)} URLs.")
    context_string, raw_data = await _extract_content(clean_urls, snippets, progress_callback)

    if progress_callback:
        progress_callback("Analyzing extracted data with Gemini...")
    return context_string, raw_data
