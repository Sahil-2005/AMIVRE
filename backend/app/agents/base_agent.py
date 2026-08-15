import logging
import json
from typing import Type, Optional
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
import redis

logger = logging.getLogger(__name__)

# Module-level Redis connection pool — reused by all agents across all publish calls.
# Avoids the overhead of creating and closing a new TCP connection on every progress event.
_redis_pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)


def _get_redis():
    """Return a Redis client backed by the shared connection pool."""
    return redis.Redis(connection_pool=_redis_pool)


class BaseAgent:
    """
    Base class for all AMIVRE specialist agents.
    Provides standard LLM initialization, structured output execution,
    and Redis progress pub/sub for real-time frontend updates.
    """

    def __init__(self, model_name: str = "gemini-3.5-flash"):
        self.model_name = model_name
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.2,
            max_retries=3,
        )

    def _publish_progress(self, job_id: Optional[str], agent_name: str, status: str, message: str = ""):
        """Publish an agent progress event to Redis for the WebSocket to broadcast."""
        if not job_id:
            return
        try:
            payload = json.dumps({
                "status": status,
                "agent_name": agent_name,
                "message": message,
            })
            # Reuse the module-level connection pool — no TCP overhead per call
            r = _get_redis()
            r.publish(f"progress:{job_id}", payload)
        except Exception as e:
            logger.warning(f"Could not publish progress event: {e}")

    def execute_with_structured_output(
        self,
        prompt_template: str,
        input_vars: dict,
        output_schema: Type[BaseModel],
        context_string: str = "",
        job_id: Optional[str] = None,
        agent_name: str = "",
    ) -> BaseModel:
        """
        Executes the LLM with a strict output schema.

        Args:
            prompt_template: The human prompt string with formatting variables.
            input_vars: Dictionary of variables to inject into the prompt.
            output_schema: Pydantic class representing the desired JSON output.
            context_string: Optionally prepend live scraped data to ground the prompt.
            job_id: If provided, publishes WebSocket progress events to Redis.
            agent_name: The agent's display name for progress events.

        Returns:
            An instance of the parsed output_schema.
        """
        # Prepend scraped context to the prompt if available
        grounded_prompt = prompt_template
        if context_string:
            grounded_prompt = (
                f"The following data was gathered live from real web sources to ground your analysis.\n"
                f"Use it as your primary evidence; fill any gaps with your general knowledge.\n\n"
                f"{context_string}\n\n"
                f"---\n\n"
                f"{prompt_template}"
            )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an expert AI business analyst for AMIVRE, an autonomous market intelligence engine. "
                    "Your task is to output highly accurate, data-driven analysis in strictly valid JSON matching "
                    "the requested schema. If exact data is missing, provide a grounded, highly realistic estimate "
                    "based on the provided context.",
                ),
                ("human", "{human_prompt}"),
            ]
        )

        structured_llm = self.llm.with_structured_output(output_schema)
        chain = prompt | structured_llm
        safe_input_vars = {**input_vars, "human_prompt": grounded_prompt}

        try:
            logger.info(f"Executing {self.__class__.__name__} with model {self.model_name}")
            result = chain.invoke(safe_input_vars)
            return result
        except Exception as e:
            logger.error(f"Error executing agent {self.__class__.__name__}: {str(e)}")
            raise e
