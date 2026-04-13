from app.agents.base_agent import BaseAgent
from app.orchestrator.state import TrendOutput


class TrendForecasterAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-1.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")

        prompt = f"""
        Act as a market trend forecaster.
        We are building a product based on this idea: '{business_idea}' for the '{target_market}' market.
        
        Simulate analyzing 12-month trend data and recent tech publications.
        Determine the market phase (Emerging, Growing, Mature, or Declining).
        Detect rising sub-topics within this market.
        Identify seasonal patterns or fluctuations in demand.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt, input_vars={}, output_schema=TrendOutput
        )

        return {"trend_data": result}
