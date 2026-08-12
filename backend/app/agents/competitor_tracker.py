import asyncio
from app.agents.base_agent import BaseAgent
from app.orchestrator.state import CompetitorOutput


class CompetitorTrackerAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-3.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")
        job_id = state.get("_job_id")

        self._publish_progress(job_id, "Competitor_Tracker", "AGENT_RUNNING", "Mapping competitor landscape via Wikipedia...")

        from app.scrapers.scraper_runner import build_competitor_context
        context_string = asyncio.run(
            build_competitor_context(business_idea, target_market)
        )

        self._publish_progress(job_id, "Competitor_Tracker", "AGENT_RUNNING", "Cross-referencing user reviews for competitor weaknesses...")

        prompt = f"""
        Act as a competitive intelligence tracker.
        We are building a product in the '{target_market}' market.
        Idea: {business_idea}
        
        Using the provided live web research and user reviews as your primary evidence:
        1. Identify 5 direct competitors and 3 indirect competitors. Provide their name and a brief description.
        2. Create a feature matrix across these competitors by mapping top 5-7 key features to the competitors that have them.
        3. Identify the primary weakness of each competitor, backed by the review data where possible.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt,
            input_vars={},
            output_schema=CompetitorOutput,
            context_string=context_string,
            job_id=job_id,
            agent_name="Competitor_Tracker",
        )

        return {"competitor_data": result}
