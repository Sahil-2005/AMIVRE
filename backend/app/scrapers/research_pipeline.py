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
MAX_URLS_PER_AGENT = 5
MAX_CHARS_PER_URL = 3000
TOTAL_MAX_CHARS = 15000

async def _tavily_search(queries: List[str]) -> List[str]:
    """Search Tavily for multiple queries and return a combined list of top URLs."""
    if not settings.TAVILY_API_KEY:
        logger.warning("TAVILY_API_KEY is not set. Cannot perform searches.")
        return []

    client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
    urls = []
    
    # Stagger searches to avoid hammering the API
    for q in queries:
        try:
            res = await client.search(query=q, search_depth="basic", max_results=3)
            for item in res.get("results", []):
                if item.get("url"):
                    urls.append(item["url"])
            await asyncio.sleep(1) # 1-second delay between queries
        except Exception as e:
            logger.error(f"Tavily search failed for query '{q}': {e}")
        
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

async def _extract_content(urls: List[str], progress_callback=None) -> Tuple[str, List[Dict]]:
    """Use Crawl4AI to visit URLs and extract clean Markdown content."""
    if not urls:
        return "", []

    raw_data = []
    markdown_parts = []
    
    async with AsyncWebCrawler(verbose=True) as crawler:
        # Process URLs in batches of 2 to avoid memory spikes from Chromium
        batch_size = 2
        for i in range(0, len(urls), batch_size):
            batch = urls[i:i + batch_size]
            crawl_tasks = [crawler.arun(url=url) for url in batch]
            
            results = await asyncio.gather(*crawl_tasks, return_exceptions=True)
            
            for idx, result in enumerate(results):
                url = batch[idx]
                if progress_callback:
                    # Strip http/https and truncate URL for clean UI display
                    clean_url = url.replace("https://", "").replace("http://", "").split("/")[0]
                    progress_callback(f"Scraping: {clean_url}...")

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
            
            # Short delay between batches
            if i + batch_size < len(urls):
                await asyncio.sleep(2)
            
    # Compile the final string with a hard cap to protect Gemini quota
    final_context = "\n\n---\n\n".join(markdown_parts)
    final_context = _truncate(final_context, TOTAL_MAX_CHARS)
    
    return final_context, raw_data

async def run_pipeline(queries: List[str], progress_callback=None) -> Tuple[str, List[Dict]]:
    """
    Executes the full agentic pipeline for a given set of queries.
    Returns the truncated Markdown string and the raw data dictionary for the frontend.
    """
    logger.info(f"Running pipeline with queries: {queries}")
    if progress_callback: progress_callback("Searching web via Tavily...")
    urls = await _tavily_search(queries)
    clean_urls = _clean_urls(urls)
    
    if progress_callback: progress_callback(f"Found {len(clean_urls)} sources. Initializing Crawl4AI...")
    logger.info(f"Extracting content for {len(clean_urls)} URLs.")
    context_string, raw_data = await _extract_content(clean_urls, progress_callback)
    
    if progress_callback: progress_callback("Analyzing extracted data with Gemini...")
    return context_string, raw_data
