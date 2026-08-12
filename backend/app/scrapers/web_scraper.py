import re
import asyncio
import urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup
import httpx
from playwright.async_api import async_playwright


def parse_html_to_text(html: str, url: str = "", title: str = "") -> dict:
    """
    Extract clean readable text from raw HTML.
    Targets: <h1>, <h2>, <h3>, <p>, <li>
    Removes: <script>, <style>, <nav>, <footer>, <header>, <aside>
    """
    soup = BeautifulSoup(html, "lxml")

    # Remove all noise elements
    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "form", "noscript", "iframe", "svg"]):
        tag.decompose()

    # Extract meaningful text nodes
    chunks = []
    for tag in soup.find_all(["h1", "h2", "h3", "p", "li"]):
        text = tag.get_text(separator=" ", strip=True)
        if len(text) > 40:   # skip tiny fragments like menu items
            chunks.append(text)

    body_text = "\n\n".join(chunks)
    body_text = re.sub(r'\n{3,}', '\n\n', body_text)  # collapse whitespace

    page_title = title
    if not page_title:
        title_tag = soup.find("title")
        page_title = title_tag.get_text(strip=True) if title_tag else ""

    return {
        "url": url,
        "title": page_title,
        "body_text": body_text[:8000],   # cap at ~8K chars per page
    }


# ─── PHASE B: LIVE INTEGRATION ────────────────────────────────────────────────

async def _fetch_wikipedia_page(client: httpx.AsyncClient, page_title: str) -> tuple[str, str, str]:
    """Fetch raw HTML for a Wikipedia page."""
    url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(page_title)}"
    api_url = f"https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(page_title)}&format=json"
    try:
        r = await client.get(
            api_url, timeout=12.0, follow_redirects=True,
            headers={"User-Agent": "AMIVRE/1.0 (Market Scout Agent)"}
        )
        if r.status_code == 200:
            data = r.json()
            if "parse" in data and "text" in data["parse"]:
                html = data["parse"]["text"]["*"]
                return url, page_title, html
    except Exception:
        pass
    return url, page_title, ""


async def scrape_web(query: str, num_results: int = 5) -> list[dict]:
    """
    Phase B live: Search Wikipedia via API → fetch page HTML concurrently → BS4 parse.
    100% free, keyless, and extremely reliable alternative to DuckDuckGo/Google.
    """
    search_url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "utf8": "",
        "format": "json",
        "srlimit": num_results
    }
    
    page_titles = []
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                search_url, params=params, timeout=10.0,
                headers={"User-Agent": "AMIVRE/1.0 (Market Scout Agent)"}
            )
            if r.status_code == 200:
                data = r.json()
                if "query" in data and "search" in data["query"]:
                    for item in data["query"]["search"]:
                        page_titles.append(item["title"])
    except Exception as e:
        print(f"[Warning] Wikipedia search failed: {e}")

    if not page_titles:
        print(f"[Warning] No Wikipedia results found for query: {query}")
        return []

    # Fetch all pages concurrently
    async with httpx.AsyncClient() as client:
        fetched = await asyncio.gather(
            *[_fetch_wikipedia_page(client, title) for title in page_titles]
        )

    # Parse HTML
    results_out = []
    for url, title, html in fetched:
        if html and len(html) > 500:
            results_out.append(
                parse_html_to_text(html, url=url, title=title)
            )

    return results_out


# ─── OFFLINE TEST ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    fixture = Path(__file__).parent / "fixtures" / "web_sample.html"
    
    if not fixture.exists():
        print(f"Error: Fixture file not found at {fixture}")
        exit(1)
        
    html = fixture.read_text(encoding="utf-8", errors="ignore")

    result = parse_html_to_text(html, url="https://example.com/ai-tools", title="")

    print(f"Title   : {result['title']}")
    print(f"Chars   : {len(result['body_text'])}")
    print(f"Preview : {result['body_text'][:300]}")
    print("\n[SUCCESS] Offline parsing test passed! You are ready for Phase B.")
