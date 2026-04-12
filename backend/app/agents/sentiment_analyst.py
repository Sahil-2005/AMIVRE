from app.agents.base_agent import BaseAgent
from app.orchestrator.state import SentimentOutput


class SentimentAnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__(model_name="gemini-1.5-flash")

    def run(self, state: dict) -> dict:
        business_idea = state.get("business_idea", "")
        target_market = state.get("target_market", "")

        prompt = f"""
        Act as a web sentiment analyst.
        We are building a product based on this idea: '{business_idea}' for the '{target_market}' market.
        
        Simulate scraping public forums like Reddit and review platforms like Trustpilot for competitors in this space.
        Identify the top pain points users experience in this market right now.
        Identify the top 5 desires or positive wishes users express heavily in reviews.
        Calculate a sentiment score between -1.0 (extremely negative) to 1.0 (extremely positive) for each pain point cluster.
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt, input_vars={}, output_schema=SentimentOutput
        )

        return {"sentiment_data": result}
