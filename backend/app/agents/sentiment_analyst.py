import asyncio
from app.agents.base_agent import BaseAgent
from app.orchestrator.state import SentimentOutput


class SentimentAnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-3.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")
        job_id = state.get("_job_id")

        self._publish_progress(job_id, "Sentiment_Analyst", "AGENT_RUNNING", "Loading Reddit community discussions...")

        from app.scrapers.scraper_runner import build_sentiment_context
        context_string = asyncio.run(
            build_sentiment_context(business_idea, target_market)
        )

        self._publish_progress(job_id, "Sentiment_Analyst", "AGENT_RUNNING", "Running sentiment analysis on user reviews...")

        prompt = f"""
        Act as a web sentiment analyst.
        We are building a product based on this idea: '{business_idea}' for the '{target_market}' market.
        
        Using the provided real user posts and reviews from Reddit and app stores, perform the following:
        1. Identify the top pain points users experience in this market right now. Be specific and use evidence from the data.
        2. Identify the top 5 desires or positive wishes users express heavily in the reviews.
        3. Calculate a sentiment score between -1.0 (extremely negative) to 1.0 (extremely positive) for each pain point cluster.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt,
            input_vars={},
            output_schema=SentimentOutput,
            context_string=context_string,
            job_id=job_id,
            agent_name="Sentiment_Analyst",
        )

        return {"sentiment_data": result}
