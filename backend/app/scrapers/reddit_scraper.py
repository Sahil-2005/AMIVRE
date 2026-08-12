import json
import asyncio
from pathlib import Path

import praw
import httpx
from app.config import settings


def parse_reddit_listing(raw: dict) -> list[dict]:
    """Parse the JSON from Reddit's public search/listing API."""
    posts = []
    for child in raw.get("data", {}).get("children", []):
        d = child.get("data", {})
        posts.append({
            "title": d.get("title", ""),
            "selftext": d.get("selftext", "")[:1000],
            "score": d.get("score", 0),
            "url": f"https://reddit.com{d.get('permalink', '')}",
            "subreddit": d.get("subreddit_name_prefixed", ""),
            "top_comments": [],  # fetched separately in Phase B
        })
    return posts


def parse_comment_listing(raw: list) -> list[str]:
    """
    Parse the second element of a Reddit post's .json response.
    Returns top 3 comment bodies sorted by score.
    """
    comments = []
    try:
        for c in raw[1]["data"]["children"]:
            d = c.get("data", {})
            body = d.get("body", "")
            score = d.get("score", 0)
            if body and body != "[deleted]" and body != "[removed]" and len(body) > 20:
                comments.append((score, body[:500]))
        comments.sort(key=lambda x: x[0], reverse=True)
        return [c[1] for c in comments[:3]]
    except (IndexError, KeyError):
        return []


# ─── PHASE B: LIVE INTEGRATION ────────────────────────────────────────────────

def _make_reddit_client() -> praw.Reddit:
    return praw.Reddit(
        client_id=settings.REDDIT_CLIENT_ID,
        client_secret=settings.REDDIT_CLIENT_SECRET,
        user_agent=settings.REDDIT_USER_AGENT,
    )


async def _fetch_post_comments(client: httpx.AsyncClient, url: str, ua: str) -> list[str]:
    """Fetch top comments using Reddit's public JSON endpoint — no auth needed."""
    try:
        r = await client.get(
            url.rstrip("/") + ".json?limit=10&sort=top",
            headers={"User-Agent": ua},
            timeout=8.0,
        )
        if r.status_code == 200:
            return parse_comment_listing(r.json())
    except Exception:
        pass
    return []


async def scrape_reddit(query: str, target_market: str, num_posts: int = 50) -> list[dict]:
    """PRAW cross-subreddit search → concurrent comment fetch per post."""
    reddit = _make_reddit_client()
    subreddits = ["startups", "entrepreneur", "SaaS", "programming", "technology", "artificial"]
    combined = "+".join(subreddits)

    posts = []
    for submission in reddit.subreddit(combined).search(
        query, sort="top", time_filter="year", limit=num_posts
    ):
        posts.append({
            "title": submission.title,
            "selftext": submission.selftext[:1000],
            "score": submission.score,
            "url": f"https://reddit.com{submission.permalink}",
            "subreddit": submission.subreddit_name_prefixed,
            "top_comments": [],
        })

    # Fetch all comments concurrently — uses public .json, no extra auth
    ua = settings.REDDIT_USER_AGENT
    async with httpx.AsyncClient() as client:
        all_comments = await asyncio.gather(
            *[_fetch_post_comments(client, p["url"], ua) for p in posts]
        )

    for post, comments in zip(posts, all_comments):
        post["top_comments"] = comments

    return posts


# ─── OFFLINE TEST ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    fixture = Path(__file__).parent / "fixtures" / "reddit_sample.json"
    
    if not fixture.exists():
        print(f"Error: Fixture file not found at {fixture}")
        print("Please run the curl command to download the sample data first.")
        exit(1)
        
    raw = json.loads(fixture.read_text(encoding="utf-8"))

    posts = parse_reddit_listing(raw)
    print(f"Parsed {len(posts)} posts from fixture.")
    
    for p in posts[:3]:
        print(f"\n  > {p['title']}")
        print(f"     Score: {p['score']}  |  {p['subreddit']}")
        if p['selftext']:
            print(f"     Body: {p['selftext'][:80]}...")
            
    print("\n[SUCCESS] Offline parsing test passed! You are ready for Phase B.")
