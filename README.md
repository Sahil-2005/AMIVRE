# AMIVRE

Autonomous Market Intelligence & Venture Risk Engine (AMIVRE)

## Overview
AMIVRE is an autonomous, multi-agent AI system that actively scours the internet for real-time market intelligence. It identifies hidden competitors, analyzes public sentiment, assesses market saturation, and stress-tests proposed business models.

## Tech Stack
- Frontend: Next.js 14, TailwindCSS, shadcn/ui
- Backend: FastAPI, Python 3.11+
- Async Tasks: Celery + Redis
- DB: PostgreSQL (SQLAlchemy + Alembic)
- Vector DB: Qdrant
- AI/Agents: LangGraph, OpenAI GPT-4o, Pydantic

## Local Development Setup

1. **Clone & Configure:**
    ```bash
    git clone https://github.com/Dhruv-D-Bhrasadiya/AMIVRE.git
    cd AMIVRE
    cp backend/.env.example backend/.env
    # Fill in your API keys in backend/.env
    ```

2. **Start Infrastructure Services:**
    ```bash
    docker compose -f docker/docker-compose.yml up -d postgres redis qdrant
    ```

3. **Backend Setup:**
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```

4. **Run Database Migrations:**
    ```bash
    alembic upgrade head
    ```

5. **Start the Application:**
    - Terminal 1 (FastAPI): `uvicorn app.main:app --reload`
    - Terminal 2 (Celery): `celery -A app.worker.celery_app worker --loglevel=info`

## Full System Specifications
Read the full system details in [AMIVRE_SRS.docx](./AMIVRE_SRS.docx)

## Team
- Backend, AI Agents, API, Deployment — Senior AI/ML Engineer