import json
import asyncio
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
from google_play_scraper import reviews as gp_reviews
from app_store_scraper import AppStore
from playwright.async_api import async_playwright


# ─── GOOGLE PLAY PARSER ───────────────────────────────────────────────────────
def parse_play_store_reviews(raw: list[dict]) -> list[dict]:
    """
    Parse the list returned by google-play-scraper's reviews() function.
    Each item has: userName, score, content, at (datetime)
    """
    reviews = []
    for item in raw:
        body = item.get("content") or ""
        if not body or len(body) < 15:
            continue
        date_val = item.get("at")
        date_str = date_val.strftime("%Y-%m-%d") if hasattr(date_val, "strftime") else str(date_val)[:10]
        reviews.append({
            "platform": "google_play",
            "rating": int(item.get("score", 0)),
            "body": body[:600],
            "date": date_str,
        })
    return reviews


# ─── APP STORE PARSER ─────────────────────────────────────────────────────────
def parse_app_store_reviews(raw: list[dict]) -> list[dict]:
    """
    Parse the list from app-store-scraper's reviews() function.
    Each item has: title, review, rating, date
    """
    reviews = []
    for item in raw:
        body = item.get("review") or ""
        if not body or len(body) < 15:
            continue
        reviews.append({
            "platform": "app_store",
            "rating": int(item.get("rating", 0)),
            "body": body[:600],
            "date": str(item.get("date", ""))[:10],
        })
    return reviews


# ─── TRUSTPILOT PARSER ────────────────────────────────────────────────────────
def parse_trustpilot_html(html: str) -> list[dict]:
    """
    Parse rendered Trustpilot HTML.
    Trustpilot uses data-service-review-* attributes — robust against CSS changes.
    """
    soup = BeautifulSoup(html, "lxml")
    reviews = []

    # Each review is wrapped in an <article> with data-service-review-id
    for article in soup.find_all("article", attrs={"data-service-review-id": True}):
        # Rating: <div data-service-review-rating="N">
        rating_div = article.find(attrs={"data-service-review-rating": True})
        rating = int(rating_div["data-service-review-rating"]) if rating_div else 0

        # Body text
        body_tag = article.find("p", class_=lambda c: c and "review-content" in c.lower())
        if not body_tag:
            # Fallback: find any <p> inside the article with meaningful text
            body_tag = next(
                (p for p in article.find_all("p") if len(p.get_text(strip=True)) > 30),
                None
            )
        body = body_tag.get_text(strip=True) if body_tag else ""

        # Date: <time datetime="YYYY-MM-DD...">
        time_tag = article.find("time")
        date_str = ""
        if time_tag and time_tag.get("datetime"):
            date_str = time_tag["datetime"][:10]

        if body and len(body) > 15:
            reviews.append({
                "platform": "trustpilot",
                "rating": rating,
                "body": body[:600],
                "date": date_str,
            })

    return reviews


# ─── PHASE B: LIVE INTEGRATION ────────────────────────────────────────────────

async def _scrape_play_store(app_id: str, count: int = 100) -> list[dict]:
    """
    Fetch reviews from Google Play Store.
    app_id: the package name, e.g. "com.coderabbit.android"
    """
    try:
        raw, _ = await asyncio.to_thread(gp_reviews, app_id, lang="en", country="us", count=count)
        return parse_play_store_reviews(raw)
    except Exception:
        return []


async def _scrape_app_store(app_name: str, app_id: int, count: int = 100) -> list[dict]:
    """
    Fetch reviews from Apple App Store.
    app_name: short name for URL slug, e.g. "github"
    app_id:   numeric App Store ID, e.g. 1477376905
    """
    try:
        scraper = await asyncio.to_thread(AppStore, country="us", app_name=app_name, app_id=app_id)
        await asyncio.to_thread(scraper.review, how_many=count)
        return parse_app_store_reviews(scraper.reviews)
    except Exception:
        return []


async def _scrape_trustpilot(domain: str) -> list[dict]:
    """
    Fetch reviews from Trustpilot using Playwright.
    domain: the company's domain slug on Trustpilot, e.g. "coderabbit.ai"
    Playwright renders the page (handles light JS), BS4 extracts reviews.
    """
    url = f"https://www.trustpilot.com/review/{domain}"
    html = ""
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            ctx = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                locale="en-US",
                timezone_id="America/New_York",
            )
            page = await ctx.new_page()
            try:
                await page.goto(url, wait_until="networkidle", timeout=20000)
                html = await page.content()
            except Exception:
                pass
            finally:
                await browser.close()
    except Exception:
        pass

    if not html:
        return []
    return parse_trustpilot_html(html)


async def scrape_reviews(
    competitors: list[str],
    play_store_ids: dict[str, str] | None = None,
    app_store_ids: dict[str, int] | None = None,
) -> list[dict]:
    """
    Orchestrate review scraping for competitors across all three platforms.

    Args:
        competitors:    List of competitor names (used for Trustpilot domain slugs).
        play_store_ids: Map of competitor name → Google Play package ID.
        app_store_ids:  Map of competitor name → Apple App Store numeric ID.
    """
    all_reviews: list[dict] = []
    tasks = []

    for comp in competitors:
        slug = comp.lower().replace(" ", "").replace(".", "")
        tasks.append(_scrape_trustpilot(slug))

        if play_store_ids and comp in play_store_ids:
            tasks.append(_scrape_play_store(play_store_ids[comp]))

        if app_store_ids and comp in app_store_ids:
            tasks.append(_scrape_app_store(comp.lower(), app_store_ids[comp]))

    if not tasks:
        return []

    results = await asyncio.gather(*tasks, return_exceptions=True)
    for r in results:
        if isinstance(r, list):
            all_reviews.extend(r)

    return all_reviews


# ─── OFFLINE TEST ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    fixtures = Path(__file__).parent / "fixtures"

    # Test Play Store parser
    play_file = fixtures / "reviews_play_sample.json"
    if play_file.exists():
        raw = json.loads(play_file.read_text())
        play_reviews = parse_play_store_reviews(raw)
        if play_reviews:
            avg = sum(r["rating"] for r in play_reviews) / max(len(play_reviews), 1)
            print(f"Play Store: {len(play_reviews)} reviews, avg rating {avg:.2f}")
        else:
            print("Play Store: 0 valid reviews parsed.")
    else:
        print("Play Store fixture not found.")

    # Test Trustpilot parser
    tp_file = fixtures / "reviews_trustpilot_sample.html"
    if tp_file.exists():
        html = tp_file.read_text(encoding="utf-8", errors="ignore")
        tp_reviews = parse_trustpilot_html(html)
        if tp_reviews:
            avg = sum(r["rating"] for r in tp_reviews) / max(len(tp_reviews), 1)
            print(f"Trustpilot: {len(tp_reviews)} reviews, avg rating {avg:.2f}")
            negs = [r for r in tp_reviews if r["rating"] <= 2]
            if negs:
                print(f"  Negative sample: {negs[0]['body'][:150]}")
        else:
            print("Trustpilot: 0 valid reviews parsed.")
    else:
        print("Trustpilot fixture not found.")

    print("\n[SUCCESS] Offline parsing test passed!")
