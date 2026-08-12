import asyncio
from app.agents.base_agent import BaseAgent
from app.orchestrator.state import MarketScoutOutput


class MarketScoutAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-3.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")
        geography = state.get("geography", "")
        job_id = state.get("_job_id")

        self._publish_progress(job_id, "Market_Scout", "AGENT_RUNNING", "Scraping Wikipedia for market intelligence...")

        # Run async scraper in a sync context
        from app.scrapers.scraper_runner import build_market_scout_context
        context_string = asyncio.run(
            build_market_scout_context(business_idea, target_market, geography)
        )

        self._publish_progress(job_id, "Market_Scout", "AGENT_RUNNING", "Analyzing market sizing and saturation...")

        prompt = f"""
        Analyze the following business idea and estimate the market sizing.
        
        Business Idea: {business_idea}
        Target Market: {target_market}
        Geography: {geography}
        
        Use the provided live web intelligence AND your knowledge base to provide estimates for:
        - Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM).
        - The top market verticals.
        - The current market growth rate.
        - Regulatory considerations.
        - Whether the market is saturated and justify your answer.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt,
            input_vars={},
            output_schema=MarketScoutOutput,
            context_string=context_string,
            job_id=job_id,
            agent_name="Market_Scout",
        )

        return {"market_data": result}
