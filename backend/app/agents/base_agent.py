import logging
from typing import Type
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings

logger = logging.getLogger(__name__)


class BaseAgent:
    """
    Base class for all AMIVRE specialist agents.
    Provides standard LLM initialization and structured output execution.
    """

    def __init__(self, model_name: str = "gemini-3.5-flash"):
        self.model_name = model_name
        # Instantiate LLM per worker safely using the settings API key
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.2,  # Low temp for analytical consistency
            max_retries=3,
        )

    def execute_with_structured_output(
        self, prompt_template: str, input_vars: dict, output_schema: Type[BaseModel]
    ) -> BaseModel:
        """
        Executes the LLM with a strict output schema.

        Args:
            prompt_template: The system/human prompt string with formatting variables.
            input_vars: Dictionary of variables to inject into the prompt.
            output_schema: Pydantic class representing the desired explicit JSON output.

        Returns:
            An instance of the parsed output_schema.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an expert AI business analyst for AMIVRE, an autonomous market intelligence engine. Your task is to output highly accurate, data-driven analysis in strictly valid JSON matching the requested schema. If exact data is missing, provide a grounded, highly realistic estimate based on the provided context.",
                ),
                ("human", "{human_prompt}"),
            ]
        )

        # Bind the Pydantic schema to the LLM to guarantee output shape
        structured_llm = self.llm.with_structured_output(output_schema)

        chain = prompt | structured_llm

        # Safely pass the prompt_template as a variable so brackets aren't evaluated
        safe_input_vars = {**input_vars, "human_prompt": prompt_template}

        try:
            logger.info(
                f"Executing {self.__class__.__name__} with model {self.model_name}"
            )
            result = chain.invoke(safe_input_vars)
            return result
        except Exception as e:
            logger.error(f"Error executing agent {self.__class__.__name__}: {str(e)}")
            raise e
