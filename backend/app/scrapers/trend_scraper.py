import json
import asyncio
from pathlib import Path
from datetime import datetime
import httpx
from pytrends.request import TrendReq
import pandas as pd


# ─── PARSERS (PHASE A) ────────────────────────────────────────────────────────

def parse_hn_search(raw: dict) -> list[dict]:
    """Parse Hacker News Algolia search JSON."""
    stories = []
    for hit in raw.get("hits", []):
        stories.append({
            "title": hit.get("title", ""),
            "url": hit.get("url", ""),
            "points": hit.get("points", 0),
            "num_comments": hit.get("num_comments", 0),
            "created_at": hit.get("created_at", "")[:10],
            "objectID": hit.get("objectID", ""),
        })
    return stories


def parse_trends_dataframe(df: pd.DataFrame) -> dict:
    """
    Parse a pytrends pandas DataFrame into a structured dictionary.
    df contains dates as index and keywords as columns.
    """
    if df.empty:
        return {}
        
    # Drop the 'isPartial' column if it exists
    if 'isPartial' in df.columns:
        df = df.drop(columns=['isPartial'])
        
    # Convert index (datetime) to string and values to native types
    trends_dict = {}
    for keyword in df.columns:
        trends_dict[keyword] = {
            str(date)[:10]: int(value) 
            for date, value in df[keyword].items()
        }
        
    return trends_dict


# ─── LIVE INTEGRATION (PHASE B) ───────────────────────────────────────────────

async def scrape_hacker_news(query: str, limit: int = 10) -> list[dict]:
    """
    Fetch top HN stories matching the query using Algolia API.
    """
    url = "https://hn.algolia.com/api/v1/search"
    params = {
        "query": query,
        "tags": "story",
        "hitsPerPage": limit,
    }
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                url, params=params, timeout=10.0,
                headers={"User-Agent": "AMIVRE/1.0 (Market Scout Agent)"}
            )
            if r.status_code == 200:
                return parse_hn_search(r.json())
    except Exception as e:
        print(f"[Warning] HN scrape failed: {e}")
    return []


def scrape_google_trends(keywords: list[str], timeframe: str = "today 12-m") -> dict:
    """
    Fetch Google Trends interest over time using pytrends.
    Pytrends is synchronous, so it will be run in a thread.
    """
    try:
        pytrend = TrendReq(hl='en-US', tz=360)
        # Google Trends only accepts up to 5 keywords at a time
        kw_list = keywords[:5]
        pytrend.build_payload(kw_list, cat=0, timeframe=timeframe, geo='', gprop='')
        df = pytrend.interest_over_time()
        return parse_trends_dataframe(df)
    except Exception as e:
        print(f"[Warning] Google Trends scrape failed: {e}")
        return {}


async def scrape_trends(hn_query: str, trend_keywords: list[str]) -> dict:
    """
    Orchestrate both Hacker News and Google Trends scraping concurrently.
    """
    # Start HN fetch async
    hn_task = asyncio.create_task(scrape_hacker_news(hn_query))
    
    # Run pytrends in a thread since it is synchronous and uses requests internally
    trends_data = await asyncio.to_thread(scrape_google_trends, trend_keywords)
    hn_data = await hn_task
    
    return {
        "hacker_news": hn_data,
        "google_trends": trends_data
    }


# ─── OFFLINE TEST ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    fixtures = Path(__file__).parent / "fixtures"
    
    # Test HN offline parser
    hn_file = fixtures / "hn_sample.json"
    if hn_file.exists():
        raw_hn = json.loads(hn_file.read_text())
        parsed_hn = parse_hn_search(raw_hn)
        print(f"Parsed {len(parsed_hn)} Hacker News stories from fixture.")
        if parsed_hn:
            print(f"Top story: {parsed_hn[0]['title']} ({parsed_hn[0]['points']} points)")
    else:
        print("HN fixture not found.")
        
    print("\n[SUCCESS] Offline parsers tested!")
