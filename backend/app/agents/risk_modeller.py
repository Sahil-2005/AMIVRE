from app.agents.base_agent import BaseAgent
from app.orchestrator.state import RiskModelOutput


class RiskModellerAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-3.6-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")

        # Gather outputs from other agents
        market_data = state.get("market_data", {})
        sentiment_data = state.get("sentiment_data", {})
        competitor_data = state.get("competitor_data", {})
        trend_data = state.get("trend_data", {})

        prompt = f"""
        Act as a Principal Venture Risk Modeller.
        We are doing a final stress-test on the following business idea:
        '{business_idea}'
        
        Here is the intelligence gathered by the sub-agents:
        Market Data: {market_data}
        Sentiment Data: {sentiment_data}
        Competitor Data: {competitor_data}
        Trend Data: {trend_data}
        
        Your tasks:
        1. Produce a Business Model Canvas stress-test with at least 5 identified failure points based on the gathered data.
        2. Assign an overall Venture Risk Score (0-100, where 100 is maximum risk).
        3. Break down the risk score into Market, Competition, Financial, and Regulatory components.
        4. Generate specific, actionable mitigation strategies for each failure point.
        5. Output a final recommendation: 'Go', 'Proceed with Caution', or 'No-Go' and justify it.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt, input_vars={}, output_schema=RiskModelOutput
        )

        return {"risk_assessment": result}
