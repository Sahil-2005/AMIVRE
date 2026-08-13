"""
Module: research_pipeline.py

Autonomous Research Pipeline utilizing Tavily API for search and Crawl4AI for web extraction.
Replaces the legacy manual scrapers.
"""

import asyncio
import logging
from typing import List, Dict, Tuple
from tavily import AsyncTavilyClient
from crawl4ai import AsyncWebCrawler
from app.config import settings

logger = logging.getLogger(__name__)

# Quota Mitigation Settings
MAX_URLS_PER_AGENT = 10
MAX_CHARS_PER_URL = 4000
TOTAL_MAX_CHARS = 30000

async def _tavily_search(queries: List[str]) -> List[str]:
    """Search Tavily for multiple queries and return a combined list of top URLs."""
    if not settings.TAVILY_API_KEY:
        logger.warning("TAVILY_API_KEY is not set. Cannot perform searches.")
        return []

    client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
    urls = []
    
    # We execute searches concurrently for all queries
    search_tasks = []
    for q in queries:
        search_tasks.append(client.search(query=q, search_depth="basic", max_results=5))
    
    try:
        results = await asyncio.gather(*search_tasks, return_exceptions=True)
        for res in results:
            if isinstance(res, Exception):
                logger.error(f"Tavily search failed: {res}")
                continue
            
            for item in res.get("results", []):
                if item.get("url"):
                    urls.append(item["url"])
                    
    except Exception as e:
        logger.error(f"Failed to fetch Tavily results: {e}")
        
    return urls

def _clean_urls(urls: List[str]) -> List[str]:
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

async def _extract_content(urls: List[str]) -> Tuple[str, List[Dict]]:
    """Use Crawl4AI to visit URLs and extract clean Markdown content."""
    if not urls:
        return "", []

    raw_data = []
    markdown_parts = []
    
    async with AsyncWebCrawler(verbose=True) as crawler:
        # Run crawls concurrently
        crawl_tasks = []
        for url in urls:
            crawl_tasks.append(crawler.arun(url=url))
            
        results = await asyncio.gather(*crawl_tasks, return_exceptions=True)
        
        for idx, result in enumerate(results):
            url = urls[idx]
            if isinstance(result, Exception):
                logger.error(f"Crawl4AI failed for {url}: {result}")
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

async def run_pipeline(queries: List[str]) -> Tuple[str, List[Dict]]:
    """
    Executes the full agentic pipeline for a given set of queries.
    Returns the truncated Markdown string and the raw data dictionary for the frontend.
    """
    logger.info(f"Running pipeline with queries: {queries}")
    urls = await _tavily_search(queries)
    clean_urls = _clean_urls(urls)
    logger.info(f"Extracting content for {len(clean_urls)} URLs.")
    context_string, raw_data = await _extract_content(clean_urls)
    return context_string, raw_data
