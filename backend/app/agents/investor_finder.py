"""
Module: investor_finder.py

Phase 2 Agent — Investor Discovery.
Runs independently of the research pipeline, triggered on-demand after Phase 1 completes.
Uses existing research results to build context, then scrapes and analyzes investor data.
"""

import asyncio
import json
import logging

from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

from app.agents.base_agent import BaseAgent
from app.config import settings
from app.orchestrator.state import InvestorFinderOutput

logger = logging.getLogger(__name__)


class InvestorQueries(BaseModel):
    investor_queries: list[str] = Field(
        description="5 to 8 Google search queries to find relevant investors, VCs, angels, and accelerators for this specific venture."
    )


class InvestorFinderAgent(BaseAgent):
    """
    Discovers and ranks investors that are the best match for a given venture.
    Receives the completed Phase 1 research context and uses it to target searches.
    """

    def __init__(self):
        super().__init__(model_name="gemini-3.5-flash")

    def generate_investor_queries(self, research_context: dict) -> list[str]:
        """Use LLM to generate targeted investor search queries based on research results."""
        business_idea = research_context.get("business_idea", "")
        target_market = research_context.get("target_market", "")
        geography = research_context.get("geography", "")

        # Extract key signals from Phase 1 results
        market_data = research_context.get("market_data", {})
        risk_data = research_context.get("risk_assessment", {})
        competitor_data = research_context.get("competitor_data", {})

        tam = market_data.get("total_addressable_market", "unknown") if isinstance(market_data, dict) else "unknown"
        risk_score = risk_data.get("risk_score", "unknown") if isinstance(risk_data, dict) else "unknown"
        recommendation = risk_data.get("recommendation", "unknown") if isinstance(risk_data, dict) else "unknown"

        llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.0,
        )

        structured_llm = llm.with_structured_output(InvestorQueries)

        prompt = f"""
        You are an expert startup fundraising strategist. Generate 5 to 8 highly targeted Google search queries
        to find the most relevant investors (VCs, angels, accelerators) for this specific venture:

        Business Idea: {business_idea}
        Target Market: {target_market}
        Geography: {geography}
        Market Size (TAM): {tam}
        Risk Assessment: Score {risk_score}/100, Recommendation: {recommendation}

        Your queries should target:
        - VC firms and angel investors who actively invest in the {target_market} space
        - Recent funding rounds in similar verticals (to find active investors)
        - Accelerators and incubators focused on this industry
        - Investor blog posts or interviews about this market
        - Use search operators like site:crunchbase.com, site:wellfound.com where helpful
        - Focus on investors active in {geography} or who invest globally
        """

        try:
            result = structured_llm.invoke(prompt)
            return result.investor_queries
        except Exception as e:
            logger.error(f"Failed to generate investor queries: {e}")
            return [
                f"top VCs investing in {target_market} {geography}",
                f"angel investors {target_market} startups",
                f"recent seed funding rounds {target_market}",
                f"accelerators for {target_market} startups {geography}",
                f"venture capital firms {target_market} portfolio",
            ]

    def run(self, research_context: dict, job_id: str | None = None) -> InvestorFinderOutput:
        """
        Execute the full investor discovery pipeline.

        Args:
            research_context: The completed Phase 1 result_json from the analysis job.
            job_id: For publishing WebSocket progress events.
        """
        business_idea = research_context.get("business_idea", "")
        target_market = research_context.get("target_market", "")
        geography = research_context.get("geography", "")

        self._publish_progress(
            job_id, "Investor_Finder", "AGENT_RUNNING",
            "Generating targeted investor search queries..."
        )

        # Step 1: Generate search queries
        queries = self.generate_investor_queries(research_context)
        logger.info(f"Generated {len(queries)} investor queries")

        self._publish_progress(
            job_id, "Investor_Finder", "AGENT_RUNNING",
            f"Searching for investors across {len(queries)} dimensions..."
        )

        # Step 2: Run the scraping pipeline
        from app.scrapers.scraper_runner import build_investor_context

        context_string, raw_data = asyncio.run(
            build_investor_context(queries, lambda msg: self._publish_progress(
                job_id, "Investor_Finder", "AGENT_RUNNING", msg
            ))
        )

        self._publish_progress(
            job_id, "Investor_Finder", "AGENT_RUNNING",
            "Analyzing investor data and matching to venture profile..."
        )

        # Step 3: Build a research summary to ground the LLM
        market_data = research_context.get("market_data", {})
        risk_data = research_context.get("risk_assessment", {})
        competitor_data = research_context.get("competitor_data", {})
        trend_data = research_context.get("trend_data", {})

        research_summary = f"""
        === VENTURE RESEARCH SUMMARY (from Phase 1 analysis) ===
        Business Idea: {business_idea}
        Target Market: {target_market}
        Geography: {geography}
        TAM: {market_data.get('total_addressable_market', 'N/A') if isinstance(market_data, dict) else 'N/A'}
        Growth Rate: {market_data.get('growth_rate', 'N/A') if isinstance(market_data, dict) else 'N/A'}
        Market Phase: {trend_data.get('market_phase', 'N/A') if isinstance(trend_data, dict) else 'N/A'}
        Risk Score: {risk_data.get('risk_score', 'N/A') if isinstance(risk_data, dict) else 'N/A'}/100
        Recommendation: {risk_data.get('recommendation', 'N/A') if isinstance(risk_data, dict) else 'N/A'}
        """

        # Step 4: LLM analysis with structured output
        prompt = f"""
        You are an expert startup fundraising advisor. Based on the venture research and live investor intelligence below,
        identify and rank the 8-12 BEST investor matches for this startup.

        {research_summary}

        For each investor, provide:
        - Their name, type (Angel/VC/Micro-VC/Corporate VC/Accelerator), focus areas
        - Typical check size, portfolio examples, location
        - A relevance score (0-100) based on how well they match this specific venture
        - Reasoning for why they are a good fit
        - A contact URL (from the scraped data, or their known website)
        - The source where you found this information

        Also provide:
        - A funding stage recommendation (Pre-Seed / Seed / Series A) based on the market data
        - A recommended raise amount justified by the TAM and growth rate
        - 3-5 pitch angle suggestions specific to what investors in this space care about
        - A market timing assessment on whether now is a good time to raise

        STRICT CITATION RULES:
        1. Look for lines starting with "### Source URL:" in the provided context. These are the ONLY valid URLs for sources.
        2. For contact_url, use the investor's known website or profile page.
        3. DO NOT invent or hallucinate URLs. If no source is available, use "N/A".
        """

        result = self.execute_with_structured_output(
            prompt_template=prompt,
            input_vars={},
            output_schema=InvestorFinderOutput,
            context_string=context_string,
            job_id=job_id,
            agent_name="Investor_Finder",
        )

        self._publish_progress(
            job_id, "Investor_Finder", "AGENT_COMPLETE",
            "Investor discovery complete."
        )

        return result
