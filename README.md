<div align="center">
  <a href="https://github.com/Sahil-2005/AMIVRE">
  </a>
  
  <h1 style="font-size: 3.5rem; margin-top: 10px; margin-bottom: 0;">A.M.I.V.R.E.</h1>
  <h3>Autonomous Market Intelligence & Venture Risk Engine</h3>
  
  <p>
    <em>A sophisticated, multi-agent AI framework that autonomously scrapes the live web to stress-test business ideas and map competitive landscapes in real-time.</em>
  </p>
  <br/>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
    <a href="https://python.langchain.com/docs/langgraph/"><img src="https://img.shields.io/badge/LangGraph_Swarm-DD0031?style=for-the-badge&logo=python&logoColor=white" alt="LangGraph" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  </p>
</div>

---

## 📖 Overview

**AMIVRE** is an enterprise-grade, autonomous AI platform designed to stress-test business ideas and map competitive landscapes in real-time. Unlike static RAG applications, AMIVRE deploys a **swarm of specialized AI agents** that actively scrape the live web to build a grounded, evidence-based intelligence report for any venture concept.

### ✨ Key Features
- **Cinematic Real-Time UI**: Watch the AI agents think and work in real-time through a beautifully designed, WebSocket-powered glassmorphism dashboard.
- **Live Web Scraping**: Agents autonomously browse Wikipedia, Hacker News, Reddit, Google Play, and Google Trends to ground their analysis in reality.
- **Multi-Agent Orchestration**: Powered by LangGraph, five specialized AI personas work in parallel to build a comprehensive risk model.
- **Asynchronous Architecture**: Heavy ML workloads and web scraping are pushed to distributed Celery workers, keeping the FastAPI backend lightning fast.

---

## 🧠 The Agent Swarm

The LangGraph orchestration pipeline coordinates a Master Query Node and five distinct AI agents:

0. 🧠 **Master Query Node**: Pre-generates highly targeted Google Search queries for all downstream agents in a single, efficient LLM call.
1. 🌐 **Market Scout**: Executes autonomous web research to calculate TAM/SAM/SOM and market saturation.
2. 💬 **Sentiment Analyst**: Pulls live user discussions and reviews across the web to gauge raw user pain points and desires.
3. ⚔️ **Competitor Tracker**: Maps the direct/indirect competitive battlefield and builds a feature matrix using real-world public data.
4. 📈 **Trend Forecaster**: Queries the web for market momentum, developer chatter, and seasonal demand fluctuations.
5. 🛡️ **Risk Modeller**: Synthesizes the outputs of all other agents into a final Venture Risk Score (0-100) and produces actionable mitigation strategies.

---

## 🛠️ Tech Stack

### Frontend (User Experience)
- **Framework**: Next.js 14 (App Router), React
- **Styling**: TailwindCSS, Shadcn/UI (Dark mode glassmorphism aesthetics)
- **Real-Time**: WebSockets for live-agent progress tracking

### Backend (Intelligence Engine)
- **API**: FastAPI (Python 3.11+)
- **AI/Orchestration**: LangChain, LangGraph, Google Gemini Pro 1.5 Flash
- **Agentic Pipeline**: Tavily Search API, Crawl4AI (Async JS-rendering)
- **Task Queue**: Celery with Redis broker (Async task processing)
- **Database**: PostgreSQL (SQLAlchemy + Alembic async drivers)
- **Vector DB**: Qdrant (Ready for future RAG expansions)

---

## 🚀 Getting Started

To ensure maximum performance on local machines (especially Windows/WSL), AMIVRE uses a split architecture: the heavy backend services run in Docker, while the Next.js frontend runs natively to provide lightning-fast hot-reloading.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Running and active)
- [Node.js 18+](https://nodejs.org/en/) (For the frontend)
- A Google Gemini API Key (`GEMINI_API_KEY`)
- A Tavily API Key (`TAVILY_API_KEY`)

### 1. Clone the Repository
```bash
git clone https://github.com/Sahil-2005/AMIVRE.git
cd AMIVRE
```

### 2. Configure Environment Variables
You need to set up environment variables for **both** the backend and the frontend.

**Backend Configuration:**
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

**Frontend Configuration:**
Create a new file named `.env.local` inside the `frontend` directory:
```bash
# On Windows PowerShell:
New-Item -Path frontend\.env.local -ItemType File

# On Mac/Linux:
touch frontend/.env.local
```
Open `frontend/.env.local` and add the following lines to connect the UI to the Docker backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/v1/ws
```

### 3. Run the Backend Stack (Docker)
We use Docker to spin up the FastAPI server, Celery worker, PostgreSQL, Redis, and Qdrant. 
From the root of the project, run:
```bash
docker compose -f docker/docker-compose.yml up -d --build
```
*Note: The first time you run this, it may take 5-10 minutes to build the Celery worker, as it downloads heavy Machine Learning libraries and Chromium for web scraping.*

You can verify the backend is running by visiting `http://localhost:8000/docs` to see the Swagger UI.

### 4. Run the Frontend (Native)
Open a **new terminal window**, navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The interactive dashboard is now available at `http://localhost:3000`!

## 📂 Architecture & Dataflow

1. **Submission**: User submits a business idea via the Next.js frontend.
2. **Delegation**: FastAPI enqueues a Celery task.
3. **Orchestration**: Celery triggers the LangGraph state machine, starting with the Master Query Node.
4. **Agentic Research**: Each agent takes its generated queries, searches via Tavily, and uses Crawl4AI (headless Chromium) to dynamically render and extract high-quality Markdown from live websites.
5. **Prompt Injection**: The raw extracted Markdown is token-truncated (Quota Mitigation) and injected directly into the Gemini context windows.
6. **Live Streaming**: As agents work, the backend pushes `AGENT_RUNNING` and `AGENT_COMPLETE` WebSocket events to the frontend, powering a real-time progress terminal.
7. **Synthesis**: The Risk Modeller compiles the final report, which is saved to Postgres and displayed elegantly in the UI.

---

## 👨‍💻 Author

**Sahil Gawade**

[![Portfolio](https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://sahil-gawade.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sahil-gawade-920a0a242/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sahil-2005)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com/u/sahilgawade4321/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gawadesahil.dev@gmail.com)

---

## 📜 Specifications
Read the full system details and initial requirements in [AMIVRE_SRS.docx](./AMIVRE_SRS.docx).