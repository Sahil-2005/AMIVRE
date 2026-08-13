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

The LangGraph orchestration pipeline coordinates five distinct AI agents:

1. 🌐 **Market Scout**: Scrapes Wikipedia and financial domains to calculate TAM/SAM/SOM and market saturation.
2. 💬 **Sentiment Analyst**: Pulls live Reddit discussions and Google Play/App Store reviews to gauge raw user pain points and desires.
3. ⚔️ **Competitor Tracker**: Maps the direct/indirect competitive battlefield and builds a feature matrix using real-world public data.
4. 📈 **Trend Forecaster**: Queries Hacker News chatter and Google Trends to detect rising sub-topics and seasonal demand fluctuations.
5. 🛡️ **Risk Modeller**: Synthesizes the outputs of all other agents into a final Venture Risk Score (0-100) and produces actionable mitigation strategies.

---

## 🛠️ Tech Stack

### Frontend (User Experience)
- **Framework**: Next.js 14 (App Router), React
- **Styling**: TailwindCSS, Shadcn/UI (Dark mode glassmorphism aesthetics)
- **Real-Time**: WebSockets for live-agent progress tracking

### Backend (Intelligence Engine)
- **API**: FastAPI (Python 3.11+)
- **AI/Orchestration**: LangChain, LangGraph, Google Gemini Pro 1.5
- **Scraping**: Playwright, BeautifulSoup, Pytrends, Google Play Scraper
- **Task Queue**: Celery with Redis broker (Async task processing)
- **Database**: PostgreSQL (SQLAlchemy + Alembic async drivers)
- **Vector DB**: Qdrant (Ready for future RAG expansions)

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (if running frontend locally outside Docker)
- A Google Gemini API Key (`GEMINI_API_KEY`)

### 1. Clone & Configure
```bash
git clone https://github.com/Sahil-2005/AMIVRE.git
cd AMIVRE

# Set up backend environment variables
cp backend/.env.example backend/.env
```
*Make sure to add your `GEMINI_API_KEY` to the `backend/.env` file.*

### 2. Run the Entire Stack (Docker)
AMIVRE is fully dockerized for instant deployment. You do not need to install Node.js or Python locally.

```bash
docker compose -f docker/docker-compose.yml up -d --build
```
This single command spins up the entire enterprise stack:
- Next.js Frontend (Available at `http://localhost:3000`)
- FastAPI Backend (Available at `http://localhost:8000`)
- Celery Worker (Async Task Engine)
- Redis (Message Broker)
- PostgreSQL (Database)
- Qdrant (Vector DB)

---

## 📂 Architecture & Dataflow

1. **Submission**: User submits a business idea via the Next.js frontend.
2. **Delegation**: FastAPI enqueues a Celery task.
3. **Orchestration**: Celery triggers the LangGraph state machine.
4. **Live Scraping**: Each agent concurrently fires asynchronous headless browsers and API requests to pull real-time data.
5. **Prompt Injection**: The raw scraped data is token-truncated and injected directly into the Gemini context windows.
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