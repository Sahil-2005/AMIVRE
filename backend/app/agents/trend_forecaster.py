import asyncio
from app.agents.base_agent import BaseAgent
from app.orchestrator.state import TrendOutput


class TrendForecasterAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-3.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")
        job_id = state.get("_job_id")

        self._publish_progress(job_id, "Trend_Forecaster", "AGENT_RUNNING", "Querying Hacker News developer chatter...")

        from app.scrapers.scraper_runner import build_trend_context
        context_string, raw_data = asyncio.run(
            build_trend_context(business_idea, target_market)
        )

        self._publish_progress(job_id, "Trend_Forecaster", "AGENT_RUNNING", "Analyzing Google Trends search volume data...")

        prompt = f"""
        Act as a market trend forecaster.
        We are building a product based on this idea: '{business_idea}' for the '{target_market}' market.
        
        Using the provided live Hacker News discussions and Google Trends data as your primary evidence:
        1. Determine the market phase (Emerging, Growing, Mature, or Declining). Justify with data points from the context.
        2. Detect rising sub-topics within this market based on what developers are actually discussing.
        3. Identify seasonal patterns or fluctuations in demand based on the trend data.
        
        STRICT CITATION RULES:
        1. Look for lines starting with "Source URL:" in the provided context. These are the ONLY valid URLs.
        2. For each HN story or trend used, add an entry to the `sources` array with the exact `url` from the "Source URL:" line, the `title`, and `platform` set to "Hacker News" or "Google Trends".
        3. DO NOT invent, guess, or hallucinate any URLs. If no Source URL is available, leave the `sources` array empty.
        4. Never use generic URLs like "https://news.ycombinator.com" or "https://trends.google.com". Only use full, specific URLs from the context.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt,
            input_vars={},
            output_schema=TrendOutput,
            context_string=context_string,
            job_id=job_id,
            agent_name="Trend_Forecaster",
        )

        return {
            "trend_data": result,
            "scraped_data": {"trend_forecaster": raw_data}
        }
