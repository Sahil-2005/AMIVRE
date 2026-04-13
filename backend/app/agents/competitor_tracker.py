from app.agents.base_agent import BaseAgent
from app.orchestrator.state import CompetitorOutput


class CompetitorTrackerAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-1.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")

        prompt = f"""
        Act as a competitive intelligence tracker.
        We are building a product in the '{target_market}' market.
        Idea: {business_idea}
        
        Identify 5 direct competitors and 3 indirect competitors.
        For each, provide their name and a brief description.
        Create a feature matrix across these competitors by mapping top 5-7 key features to the competitors that have them.
        Identify the primary weakness of each competitor.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt, input_vars={}, output_schema=CompetitorOutput
        )

        return {"competitor_data": result}
