# Phase 3 Completion: AI Agent Development

The core AI engine has been fully orchestrated! Here is a breakdown of what was implemented and how to manually verify the functionality.

## What was implemented

### 1. LangGraph Orchestrator (`app/orchestrator/graph.py`)
We built a parallel AI pipeline utilizing `StateGraph`. The graph begins by broadcasting the user's business idea to 4 specialist agents simultaneously:
- `MarketScoutAgent`
- `SentimentAnalystAgent`
- `CompetitorTrackerAgent`
- `TrendForecasterAgent`

Once all 4 finish executing and populate their sections of the `AgentState` schema, the graph converges (Fans In) to the `RiskModellerAgent` which synthesizes a final Risk Score and recommendation.

### 2. Gemini 1.5 Structured Outputs (`app/agents/base_agent.py`)
Each agent node is powered by Gemini and guarantees strictly-structured JSON outputs matching strict explicit Pydantic Models for its respective segment (e.g. `TrendOutput`, `CompetitorOutput`).

### 3. Celery Async Task Execution (`app/worker/celery_app.py`)
The pipeline is invoked as an asynchronous celery background task. The task receives the `job_id`, fetches the data, triggers `graph.invoke`, serializes everything to JSON, and updates your relational database with `JobStatus.COMPLETED`.

> [!NOTE]
> Mocks vs Real Web Scrapers: The structural skeleton handles any kind of data. Currently, the prompts instruct the LLM to *simulate* having retrieved live data in order to perfect the state handling without eating into rate limits. In later phases, we will inject the actual retrieved texts (from Reddit, ProductHunt, etc.) into the context parameters.

---

## How to Perform Manual Verification

To test the entire flow end-to-end exactly as a user would, follow these steps locally:

1. **Fire up the backend ecosystem:**
   Open two terminal windows.
   - Terminal 1 (Run Celery Worker): `celery -A app.worker.celery_app worker --loglevel=info -P gevent` (Windows requires gevent or threads config).
   - Terminal 2 (Run FastAPI): `uvicorn app.main:app --reload`
   Make sure Redis, PostgreSQL, and Qdrant containers are running via Docker.

2. **Trigger the Analysis Job (via API or Swagger UI)**:
   Navigate your browser to `http://127.0.0.1:8000/docs`. Under the Auth section, register or login a user to get your Bearer Token, and then Authorize the Swagger UI.
   Submit a raw payload to `POST /api/v1/analysis/submit`.
   ```json
   {
     "business_idea": "An AI-powered coffee mug that heats up when you start typing code, and cools down when your IDE goes idle.",
     "target_market": "Software Engineers",
     "geography": "Global",
     "depth": "Standard"
   }
   ```
   *You will receive a `job_id` back.*

> 1. Go to backend\app\config.py and fill 
DATABASE_URL: str = ""
GEMINI_API_KEY: str = ""
SECRET_KEY: str = "" (Run to get key -  python -c "import secrets; print(secrets.token_urlsafe(32))")
> 2. resolve dependencies - pip install psycopg2
pip install psycopg2
> 3. Get redis image - docker run -d -p 6379:6379 --name redis redis
> 4. Get postgress image - docker run -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=amivre --name postgres postgres


3. **Check Celery Output**:
   Check Terminal 1. You should see Celery acknowledge the task, execute the parallel graphs (indicated by the logger), and then complete the task. This processing takes anywhere from 5 to 15 seconds.

4. **Verify The Results via API**:
   In the Swagger UI, hit `GET /api/v1/analysis/{job_id}`.
   You will receive the complete analysis report. Look for the `result_json` payload at the bottom of the response. It should map precisely to the 5 layers:
   - `market_data`
   - `sentiment_data`
   - `competitor_data`
   - `trend_data`
   - `risk_assessment` (including the 0-100 risk score and list of mitigations).
