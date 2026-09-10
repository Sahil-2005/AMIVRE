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
- **Investor Discovery Phase 2**: Matches the analyzed venture against top VC funds and angels by scanning the web for investment focuses and recent deals.

---

## 🚀 Getting Started (Foolproof Guide)

We use a split architecture for maximum performance and developer experience: the heavy backend services run completely within Docker, while the Next.js frontend runs natively to provide lightning-fast hot-reloading.

**The setup process is designed to be completely automatic. You do not need to manually configure databases or run migrations.**

### Prerequisites
Before you start, make sure you have:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. [Node.js 18+](https://nodejs.org/en/) installed.
3. API Keys for the AI agents:
   - **Google Gemini API Key**: [Get one here (free)](https://aistudio.google.com/app/apikey)
   - **Tavily Search API Key**: [Get one here (free)](https://tavily.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sahil-2005/AMIVRE.git
cd AMIVRE
```

### Step 2: Configure Environment Variables
You must set up environment variables for both the backend and frontend. We have provided templates for both.

**For the Backend:**
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` in your code editor and insert your actual API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

**For the Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
```
The frontend `.env.local` is pre-configured with the default local endpoints (`http://localhost:8000/api/v1`), so you don't need to change anything unless you are modifying ports.

### Step 3: Manage the Backend (Docker)
From the root of the project, you can use the following commands to manage the backend containers:

**To build and start the containers in the background:**
```bash
docker compose -f docker/docker-compose.yml up -d --build
```
*Note: The first time you run this, it may take a few minutes to download the PostgreSQL/Redis images and install the Playwright Chromium browser for the web scraping worker.*

**To start existing containers (without rebuilding):**
```bash
docker compose -f docker/docker-compose.yml up -d
```

**To stop and remove the containers:**
```bash
docker compose -f docker/docker-compose.yml down
```

> 💡 **Automated Migrations:** Once the containers start, the backend container will automatically run the database migrations (`alembic upgrade head`). You don't need to manually configure any tables!

You can verify the backend is running properly by visiting [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to see the API swagger documentation.

### Step 4: Start the Frontend (Native)
Open a **new terminal window**, navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

That's it! 🎉 The interactive dashboard is now live at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Troubleshooting

- **"WebSocket connection failed" in the browser console:**
  Ensure the backend container is running (`docker ps`) and that `NEXT_PUBLIC_WS_URL` in your `frontend/.env.local` is exactly `ws://localhost:8000/api/v1/ws`.
- **Database Connection Errors:**
  If the FastAPI container complains about connecting to Postgres, it might be starting too fast. Docker Compose handles the dependencies, but you can always restart the backend container: `docker compose -f docker/docker-compose.yml restart backend worker`.
- **"asyncio.run() cannot be called from a running event loop":**
  This happens if you run the worker outside of Docker natively. The Celery worker must be run inside Docker using the provided `Dockerfile.celery` to manage thread boundaries correctly.

---

## 👨‍💻 Author

**Sahil Gawade**

[![Portfolio](https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://sahil-gawade.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sahil-gawade-920a0a242/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sahil-2005)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com/u/sahilgawade4321/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gawadesahil.dev@gmail.com)