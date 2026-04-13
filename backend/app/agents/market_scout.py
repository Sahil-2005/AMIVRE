from app.agents.base_agent import BaseAgent
from app.orchestrator.state import MarketScoutOutput


class MarketScoutAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-1.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")
        geography = state.get("geography", "")

        prompt = f"""
        Analyze the following business idea and estimate the market sizing.
        
        Business Idea: {business_idea}
        Target Market: {target_market}
        Geography: {geography}
        
        Use your knowledge base to provide estimates for Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM).
        Identify the top market verticals.
        Estimate the current market growth rate.
        List regulatory considerations.
        Assess if the market is saturated and justify.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt, input_vars={}, output_schema=MarketScoutOutput
        )

        return {"market_data": result}
