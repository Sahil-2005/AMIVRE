# SOFTWARE REQUIREMENTS SPECIFICATION

**Autonomous Market Intelligence & Venture Risk Engine (AMIVRE)**

**Version:** 1.0.0 — Final Year Project  
**Date:** April 2026  
**Standard:** IEEE 830 / ISO/IEC 25010  
**Status:** Draft — For Academic Review

Final Year Project — B.Tech / B.E. Computer Science / AI-ML

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Project Overview](#12-project-overview)
  - [1.3 Scope](#13-scope)
  - [1.4 Document Conventions](#14-document-conventions)
  - [1.5 Intended Audience](#15-intended-audience)
- [2. The Problem & Motivation](#2-the-problem--motivation)
  - [2.1 Problem Statement](#21-problem-statement)
  - [2.2 Why Build AMIVRE?](#22-why-build-amivre)
    - [Academic Value](#academic-value)
    - [Real-World Impact](#real-world-impact)
    - [Technical Ambition](#technical-ambition)
- [3. System Architecture](#3-system-architecture)
  - [3.1 Architecture Overview](#31-architecture-overview)
  - [3.2 The Five Specialist Agents](#32-the-five-specialist-agents)
  - [3.3 Data Flow](#33-data-flow)
- [4. Tech Stack](#4-tech-stack)
  - [4.1 Complete Technology Stack](#41-complete-technology-stack)
    - [4.1.1 Frontend](#411-frontend)
    - [4.1.2 Backend](#412-backend)
    - [4.1.3 AI / LLM Layer](#413-ai--llm-layer)
    - [4.1.4 Databases & Storage](#414-databases--storage)
    - [4.1.5 DevOps & Infrastructure](#415-devops--infrastructure)
- [5. Functional Requirements](#5-functional-requirements)
  - [5.1 User Management](#51-user-management)
  - [5.2 Business Idea Submission](#52-business-idea-submission)
  - [5.3 Market Scout Agent](#53-market-scout-agent)
  - [5.4 Sentiment Analyst Agent](#54-sentiment-analyst-agent)
  - [5.5 Competitor Tracker Agent](#55-competitor-tracker-agent)
  - [5.6 Trend Forecaster Agent](#56-trend-forecaster-agent)
  - [5.7 Risk Modeller Agent](#57-risk-modeller-agent)
  - [5.8 Report & Dashboard](#58-report--dashboard)
- [6. Non-Functional Requirements](#6-non-functional-requirements)
  - [6.1 Performance](#61-performance)
  - [6.2 Reliability & Availability](#62-reliability--availability)
  - [6.3 Security](#63-security)
  - [6.4 Scalability](#64-scalability)
  - [6.5 Maintainability](#65-maintainability)
- [7. Project Deliverables](#7-project-deliverables)
  - [7.1 Core Deliverables](#71-core-deliverables)
  - [7.2 Academic Deliverables](#72-academic-deliverables)
- [8. Project Timeline & Milestones](#8-project-timeline--milestones)
  - [8.1 6-Month Roadmap](#81-6-month-roadmap)
- [9. Risk Management](#9-risk-management)
  - [9.1 Technical Risks](#91-technical-risks)
  - [9.2 Project Risks](#92-project-risks)
- [10. How to Build It — Development Guide](#10-how-to-build-it--development-guide)
  - [10.1 Getting Started (Local Development)](#101-getting-started-local-development)
  - [10.2 Recommended Build Order](#102-recommended-build-order)
  - [10.3 Project Repository Structure](#103-project-repository-structure)
- [11. Evaluation Criteria & Success Metrics](#11-evaluation-criteria--success-metrics)
  - [11.1 Academic Evaluation Criteria](#111-academic-evaluation-criteria)
  - [11.2 Technical Success Metrics](#112-technical-success-metrics)
- [12. References & Resources](#12-references--resources)
  - [12.1 Key Academic References](#121-key-academic-references)
  - [12.2 Key Tools & Documentation](#122-key-tools--documentation)
  - [12.3 Estimated Monthly Costs (MVP)](#123-estimated-monthly-costs-mvp)
- [Appendix A: Glossary](#appendix-a-glossary)
- [Appendix B: Version History](#appendix-b-version-history)

SOFTWARE REQUIREMENTS SPECIFICATION

Autonomous Market Intelligence &

Venture Risk Engine

(AMIVRE)

| Version: | 1.0.0 — Final Year Project |
| --- | --- |
| Date: | April 2026 |
| Standard: | IEEE 830 / ISO/IEC 25010 |
| Status: | Draft — For Academic Review |

Final Year Project — B.Tech / B.E. Computer Science / AI-ML

# Table of Contents

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for the Autonomous Market Intelligence & Venture Risk Engine (AMIVRE). It is intended as the authoritative reference for development, academic evaluation, and project planning throughout the final year project lifecycle.

This document follows the IEEE 830-1998 standard and incorporates quality attributes from ISO/IEC 25010.

## 1.2 Project Overview

| AMIVRE is an autonomous, multi-agent AI system that actively scours the internet for real-time market intelligence. It identifies hidden competitors, analyzes public sentiment, assesses market saturation, and stress-tests proposed business models — empowering entrepreneurs and investors to validate ideas before committing capital. |
| --- |

## 1.3 Scope

AMIVRE covers the following capabilities:

- Real-time internet scraping and structured data extraction from forums, reviews, news, and social platforms
- Multi-agent orchestration: specialized AI agents working in parallel for competitive analysis, sentiment analysis, trend detection, and risk modelling
- Automated report generation with actionable insights, scoring, and business model stress-test results
- A web-based dashboard interface for entrepreneurs, investors, and analysts
- An API layer for potential integration with third-party tools
## 1.4 Document Conventions

| Term | Meaning |
| --- | --- |
| AMIVRE | Autonomous Market Intelligence & Venture Risk Engine |
| Agent | A specialized AI module responsible for a distinct analytical task |
| Orchestrator | The master controller that coordinates all agents |
| SR | Stakeholder Requirement |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| LLM | Large Language Model (e.g., GPT-4o, Claude 3.5, Gemini) |
| RAG | Retrieval-Augmented Generation |
| MVP | Minimum Viable Product |

## 1.5 Intended Audience

- Final year student (primary author and developer)
- Academic supervisors and examiners
- Potential collaborators or open-source contributors
- Early-stage entrepreneurs and seed investors (end users)
# 2. The Problem & Motivation

## 2.1 Problem Statement

Entrepreneurs and investors face a consistent, costly challenge: validating new business ideas accurately before investing time and money. The traditional approaches are broken in four ways:

| Failure Mode | Root Cause | Business Impact |
| --- | --- | --- |
| Stale research | Reports from McKinsey/Gartner are 12–18 months old by publication | Misses disruptive market shifts |
| Generic opinions | Surveys and focus groups reflect stated, not actual behavior | False demand signals |
| Hidden competitors | Niche or stealth startups don't appear in standard directories | Underestimated competition |
| Missed pain signals | Critical user frustrations buried in Reddit threads and app reviews | Product-market fit failures |
| No stress testing | No systematic way to challenge a business model's assumptions | Costly pivots post-launch |

## 2.2 Why Build AMIVRE?

This project is compelling for three intersecting reasons:

### Academic Value

- Combines cutting-edge research areas: multi-agent AI systems, LLM orchestration, NLP, web scraping, and real-time data pipelines
- Produces a working system demonstrating graduate-level integration of multiple complex technologies
- Addresses a gap in academic literature around autonomous business intelligence agents
### Real-World Impact

- Startup failure rate is approximately 90%, with poor market research cited as a top reason
- A tool that provides real-time, unbiased market intelligence can directly reduce this failure rate
- Democratizes access to deep market research previously only available to large corporations
### Technical Ambition

- Designing a multi-agent system with clear separation of concerns is a rigorous software engineering challenge
- Handling unstructured web data at scale requires robust NLP pipelines
- LLM prompt engineering for structured analytical outputs is a rapidly evolving, valuable skill
# 3. System Architecture

## 3.1 Architecture Overview

AMIVRE follows a multi-agent microservices architecture with a central orchestrator. The system is composed of five layers:

| Layer 1 — User Interface Layer:<br>React/Next.js web dashboard where users input their business idea and receive reports.<br>Layer 2 — API Gateway:<br>FastAPI backend that handles authentication, request routing, rate limiting, and WebSocket connections for live progress updates.<br>Layer 3 — Orchestration Layer:<br>LangGraph/CrewAI orchestrator that plans, delegates tasks to agents, resolves conflicts, and synthesizes outputs.<br>Layer 4 — Agent Layer:<br>Five specialized AI agents operating in parallel: Market Scout, Sentiment Analyst, Competitor Tracker, Trend Forecaster, and Risk Modeller.<br>Layer 5 — Data Layer:<br>PostgreSQL for structured data, Redis for caching and task queuing, Qdrant/Pinecone for vector embeddings, and S3-compatible storage for raw scraped data. |
| --- |

## 3.2 The Five Specialist Agents

| Agent Name | Role | Data Sources | Output |
| --- | --- | --- | --- |
| Market Scout | Discovers market size, growth rate, and key dynamics | Statista, industry blogs, Google Trends, news APIs | Market size estimate, TAM/SAM/SOM breakdown |
| Sentiment Analyst | Mines user frustrations and desires in public conversations | Reddit, Trustpilot, App Store reviews, Twitter/X | Pain point clusters, desire map, sentiment score |
| Competitor Tracker | Identifies known and hidden competitors, their pricing and weaknesses | ProductHunt, Crunchbase, SimilarWeb, G2, LinkedIn | Competitor matrix, gap analysis |
| Trend Forecaster | Detects emerging signals and regulatory shifts | Google Trends, Hacker News, SEC filings, patent databases | Trend timeline, risk flags, opportunity windows |
| Risk Modeller | Stress-tests the proposed business model against real data | Outputs from all other agents | Risk score, failure point analysis, mitigation recommendations |

## 3.3 Data Flow

1. User submits a business idea description via the dashboard.

2. The API Gateway validates the input and creates a job in the task queue (Redis).

3. The Orchestrator picks up the job, decomposes it into sub-tasks, and dispatches them to the five agents concurrently.

4. Each agent uses its toolchain (web scrapers, APIs, LLM calls) to gather and process data.

5. Agent results are streamed back to the orchestrator, stored in the database, and partially embedded in the vector store.

6. The Risk Modeller agent ingests all other agents' outputs to produce the stress-test report.

7. The orchestrator synthesizes a unified JSON report which the backend renders into a structured dashboard view and downloadable PDF.

8. The user receives a live WebSocket progress feed during processing and a push notification upon completion.

# 4. Tech Stack

## 4.1 Complete Technology Stack

### 4.1.1 Frontend

| Technology | Purpose | Why This Choice |
| --- | --- | --- |
| Next.js 14 (App Router) | Web application framework | Server components, excellent SEO, API routes built-in |
| TypeScript | Type-safe JavaScript | Reduces runtime errors in complex data structures |
| Tailwind CSS | Utility-first styling | Rapid UI development, consistent design system |
| shadcn/ui | Component library | Accessible, composable components built on Radix UI |
| Recharts / D3.js | Data visualization | Competitor matrices, trend charts, risk radar charts |
| Zustand | State management | Lightweight, simple for dashboard state |
| React Query (TanStack) | Server state & caching | Handles async data, polling, and cache invalidation |
| Socket.IO Client | Real-time updates | Live progress feed as agents run |

### 4.1.2 Backend

| Technology | Purpose | Why This Choice |
| --- | --- | --- |
| Python 3.11+ | Primary backend language | Best ecosystem for AI/ML and async libraries |
| FastAPI | REST + WebSocket API framework | High performance, async-native, auto OpenAPI docs |
| Celery + Redis | Distributed task queue | Run agent tasks asynchronously and in parallel |
| LangGraph | Agent orchestration | Stateful multi-agent graphs, cycle support, built on LangChain |
| CrewAI (alternative) | Agent orchestration | Higher-level abstraction for role-based agents |
| LangChain | LLM tooling & chains | Tool use, memory, RAG pipelines |
| Pydantic v2 | Data validation | Schema enforcement for all agent inputs and outputs |
| JWT (python-jose) | Authentication | Stateless auth for the API |
| Playwright / Scrapy | Web scraping | JavaScript-rendered pages and structured crawling |

### 4.1.3 AI / LLM Layer

| Technology | Purpose | Why This Choice |
| --- | --- | --- |
| OpenAI GPT-4o | Primary LLM for reasoning and synthesis | Best-in-class reasoning, tool use, and structured output |
| Claude 3.5 Sonnet (fallback) | Secondary LLM / cross-validation | Alternative perspective, strong at analysis |
| Sentence-Transformers | Text embedding generation | Open-source, runs locally, good quality embeddings |
| NLTK / VADER | Lexicon-based sentiment analysis | Fast, interpretable, no API cost |
| spaCy | NLP preprocessing (NER, tokenization) | Industrial-strength NLP pipeline |
| Hugging Face Transformers | Fine-tuned sentiment models | Domain-specific models for reviews |
| OpenAI Whisper (optional) | Audio/podcast transcription | Extend data sources to audio content |

### 4.1.4 Databases & Storage

| Technology | Purpose | Why This Choice |
| --- | --- | --- |
| PostgreSQL 16 | Primary relational database | ACID compliance, JSONB support for semi-structured data |
| SQLAlchemy 2.0 (async) | ORM | Type-safe, async-capable, excellent FastAPI integration |
| Redis 7 | Cache, task queue, session store | Sub-millisecond reads, Celery broker/backend |
| Qdrant | Vector database for embeddings | Open-source, self-hostable, high-performance similarity search |
| MinIO / AWS S3 | Raw data object storage | Stores raw scraped HTML, screenshots, documents |

### 4.1.5 DevOps & Infrastructure

| Technology | Purpose | Why This Choice |
| --- | --- | --- |
| Docker + Docker Compose | Containerization | Consistent dev/prod environments, easy local setup |
| GitHub Actions | CI/CD pipeline | Automated testing, linting, and deployment |
| Railway / Render (MVP) | Cloud hosting | Free tier available, simple deployment, good for FYP |
| Nginx | Reverse proxy | SSL termination, load balancing |
| Prometheus + Grafana | Monitoring & metrics | Agent performance, API latency, error rates |
| Sentry | Error tracking | Real-time exception monitoring |

# 5. Functional Requirements

## 5.1 User Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-UM-01 | Users shall be able to register with email and password | Must Have |
| FR-UM-02 | Users shall be able to log in using JWT-based authentication | Must Have |
| FR-UM-03 | Users shall be able to reset their password via email | Must Have |
| FR-UM-04 | System shall support Google OAuth 2.0 sign-in | Should Have |
| FR-UM-05 | Users shall have a profile page showing their analysis history | Must Have |

## 5.2 Business Idea Submission

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-BS-01 | User shall submit a business idea via a structured form (name, description, target market, geography) | Must Have |
| FR-BS-02 | System shall validate that the description is at least 50 words | Must Have |
| FR-BS-03 | User shall be able to select the depth of analysis: Quick (5 min), Standard (15 min), Deep (30+ min) | Should Have |
| FR-BS-04 | System shall provide a real-time progress tracker showing which agents are running | Must Have |
| FR-BS-05 | User shall receive an email notification when analysis is complete | Should Have |
| FR-BS-06 | User shall be able to pause and resume a running analysis | Could Have |

## 5.3 Market Scout Agent

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-MS-01 | Agent shall estimate the Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) | Must Have |
| FR-MS-02 | Agent shall identify the top 3-5 market verticals within the business idea | Must Have |
| FR-MS-03 | Agent shall retrieve current market growth rate with source citations | Must Have |
| FR-MS-04 | Agent shall identify key regulatory considerations for the target market | Should Have |
| FR-MS-05 | Agent shall flag markets deemed saturated with a justification | Must Have |

## 5.4 Sentiment Analyst Agent

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-SA-01 | Agent shall scrape and analyze Reddit threads, Trustpilot reviews, and App Store/Play Store reviews | Must Have |
| FR-SA-02 | Agent shall extract and cluster the top 10 user pain points using NLP topic modelling | Must Have |
| FR-SA-03 | Agent shall produce a sentiment score (-1.0 to +1.0) for each pain point cluster | Must Have |
| FR-SA-04 | Agent shall identify top 5 user desires (positive wishes expressed in reviews) | Must Have |
| FR-SA-05 | Agent shall cite the original source URL for each pain point with a verbatim example quote | Should Have |
| FR-SA-06 | Agent shall filter out fake/spam reviews using heuristic rules | Should Have |

## 5.5 Competitor Tracker Agent

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-CT-01 | Agent shall identify a minimum of 5 direct competitors and 3 indirect competitors | Must Have |
| FR-CT-02 | Agent shall extract competitor pricing information where publicly available | Must Have |
| FR-CT-03 | Agent shall produce a feature comparison matrix for the top 5 competitors | Must Have |
| FR-CT-04 | Agent shall identify each competitor's primary weakness based on public reviews | Must Have |
| FR-CT-05 | Agent shall flag stealth startups identified from ProductHunt, AngelList, and GitHub | Should Have |
| FR-CT-06 | Agent shall estimate competitor funding stage (bootstrapped, seed, Series A/B+) from Crunchbase | Should Have |

## 5.6 Trend Forecaster Agent

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-TF-01 | Agent shall pull 12-month search volume trend data from Google Trends | Must Have |
| FR-TF-02 | Agent shall detect rising sub-topics within the market using Hacker News and tech publications | Must Have |
| FR-TF-03 | Agent shall flag any related patents filed in the last 24 months | Could Have |
| FR-TF-04 | Agent shall detect seasonal demand patterns and flag them in the report | Should Have |
| FR-TF-05 | Agent shall assess whether the market is in: Emerging, Growing, Mature, or Declining phase | Must Have |

## 5.7 Risk Modeller Agent

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-RM-01 | Agent shall receive synthesized outputs from all other agents as context | Must Have |
| FR-RM-02 | Agent shall produce a Business Model Canvas stress-test with at least 5 identified failure points | Must Have |
| FR-RM-03 | Agent shall assign a Venture Risk Score (0-100) with a breakdown by category: Market, Competition, Timing, Execution, Regulatory | Must Have |
| FR-RM-04 | Agent shall generate specific, actionable mitigation strategies for each identified risk | Must Have |
| FR-RM-05 | Agent shall compare the proposed model against the top 3 relevant failed startups from CB Insights dead pool | Should Have |
| FR-RM-06 | Agent shall output a 'Go / Proceed with Caution / No-Go' recommendation with justification | Must Have |

## 5.8 Report & Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-RD-01 | System shall render a structured HTML dashboard with all agent outputs organized in tabs | Must Have |
| FR-RD-02 | User shall be able to export the full report as a PDF | Must Have |
| FR-RD-03 | User shall be able to share a report via a unique public link | Should Have |
| FR-RD-04 | Dashboard shall include interactive charts: risk radar, competitor matrix heatmap, trend line chart | Must Have |
| FR-RD-05 | User shall be able to annotate any section of the report with personal notes | Could Have |
| FR-RD-06 | System shall allow users to re-run only specific agents (e.g., re-run Competitor Tracker after 30 days) | Could Have |

# 6. Non-Functional Requirements

## 6.1 Performance

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-P-01 | Standard analysis (all 5 agents) shall complete within | 15 minutes |
| NFR-P-02 | API endpoint response time for non-agent requests | < 300ms (p95) |
| NFR-P-03 | Dashboard initial page load time | < 2 seconds |
| NFR-P-04 | System shall support concurrent analysis jobs | 10 simultaneous jobs (MVP) |
| NFR-P-05 | WebSocket progress update frequency | Every 5 seconds |

## 6.2 Reliability & Availability

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-R-01 | System uptime (excluding planned maintenance) | 99.5% |
| NFR-R-02 | Agent failure shall not crash the entire pipeline; partial results must be returned | Graceful degradation |
| NFR-R-03 | All agent tasks shall be retried up to 3 times on failure with exponential backoff | 3 retries |
| NFR-R-04 | Analysis jobs shall be persisted; a server restart shall not lose queued jobs | Job persistence |

## 6.3 Security

| ID | Requirement | Implementation |
| --- | --- | --- |
| NFR-S-01 | All API endpoints shall require JWT authentication (except /auth routes) | FastAPI middleware |
| NFR-S-02 | All data in transit shall be encrypted | TLS 1.3 (HTTPS/WSS) |
| NFR-S-03 | Passwords shall be hashed using bcrypt with cost factor >= 12 | passlib[bcrypt] |
| NFR-S-04 | API keys (OpenAI, etc.) shall never be exposed in frontend code or logs | Server-side env vars |
| NFR-S-05 | Rate limiting: max 10 analysis requests per user per day | Redis-based rate limiter |
| NFR-S-06 | All user-submitted text shall be sanitized to prevent prompt injection attacks | Input validation layer |

## 6.4 Scalability

- The system shall use horizontal scaling for the Celery worker pool (add more workers as load increases).
- Agent code shall be stateless — all state persisted in the database, not in-memory — enabling multiple instances.
- The vector database (Qdrant) shall be deployed in a separate service to allow independent scaling.
- The architecture shall support migrating from Railway (MVP) to AWS/GCP without code changes (12-factor app principles).
## 6.5 Maintainability

- All agent prompts shall be stored as version-controlled configuration files (YAML), not hardcoded strings.
- Code coverage shall be maintained at >= 70% for all backend modules.
- All public API endpoints shall be documented via auto-generated OpenAPI (Swagger UI) documentation.
- Each agent shall be independently testable via a mock data interface.
# 7. Project Deliverables

## 7.1 Core Deliverables

| # | Deliverable | Format | Timeline |
| --- | --- | --- | --- |
| D1 | This SRS Document | PDF/Word | Month 1 |
| D2 | System Architecture Diagram (C4 Model) | Diagram + Document | Month 1 |
| D3 | Working MVP: All 5 agents + basic dashboard | Web Application | Month 3 |
| D4 | Agent Test Suite with mock data | Python test files | Month 3 |
| D5 | Full Feature Release with PDF export and visualizations | Web Application | Month 5 |
| D6 | Performance & Security Test Report | PDF Document | Month 5 |
| D7 | Final Project Report (FYP Dissertation) | Word/PDF Document | Month 6 |
| D8 | Project Demonstration Video (5–10 min) | MP4 Video | Month 6 |
| D9 | Source Code Repository (public/private GitHub) | Git Repository | Ongoing |

## 7.2 Academic Deliverables

- Literature review covering multi-agent systems, LLM orchestration, and market intelligence automation
- Comparative evaluation of LangGraph vs CrewAI for this use case
- Ablation study: system performance with vs. without each agent
- User study: 5-10 entrepreneurs testing the MVP and providing structured feedback
# 8. Project Timeline & Milestones

## 8.1 6-Month Roadmap

| Phase | Duration | Key Activities | Milestone |
| --- | --- | --- | --- |
| Phase 0: Foundation | Weeks 1–2 | SRS finalization, architecture design, dev environment setup, API key procurement | Architecture sign-off |
| Phase 1: Data Layer | Weeks 3–4 | Database schema design, Scraper prototypes (Reddit, Trustpilot), data pipeline setup | Data ingestion working |
| Phase 2: Agent Development | Weeks 5–10 | Build all 5 agents individually with mock data, write unit tests for each | All agents tested in isolation |
| Phase 3: Orchestration | Weeks 11–13 | LangGraph orchestration, agent communication, parallel execution, error handling | End-to-end pipeline working |
| Phase 4: Frontend & UX | Weeks 14–16 | Next.js dashboard, charts, PDF export, WebSocket progress feed, auth flow | MVP demo-ready |
| Phase 5: Testing & Polish | Weeks 17–20 | Performance testing, security audit, user study, bug fixes, optimization | Production-ready build |
| Phase 6: Submission | Weeks 21–24 | Dissertation writing, demo video, presentation prep, final code cleanup | Final submission |

# 9. Risk Management

## 9.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| LLM API rate limits causing agent timeouts | High | High | Implement exponential backoff, caching of similar queries, and LLM fallback (e.g., GPT-4o → Claude) |
| Web scraping blocked by anti-bot measures | High | Medium | Use rotating proxies, respect robots.txt, add to Terms of Service review; use official APIs where available |
| LLM hallucination producing false market data | Medium | High | Always cite sources; implement a validation agent that cross-checks claims against raw data |
| Agent orchestration deadlocks or infinite loops | Low | High | Set hard timeout limits (5 min per agent); use LangGraph's built-in cycle detection |
| OpenAI API cost exceeds student budget | Medium | Medium | Use GPT-4o-mini for initial agent steps; reserve GPT-4o for final synthesis only |

## 9.2 Project Risks

| Risk | Likelihood | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Scope creep delays core deliverables | High | High | Strict MoSCoW prioritization; defer 'Could Have' features to Phase 5+ |
| Third-party API deprecation or pricing changes | Low | Medium | Abstract all external API calls behind an adapter pattern for easy swapping |
| Team single-point-of-failure (solo project) | High | High | Detailed documentation throughout; weekly commits to GitHub with clear commit messages |

# 10. How to Build It — Development Guide

## 10.1 Getting Started (Local Development)

| Prerequisites: Python 3.11+, Node.js 20+, Docker Desktop, Git, OpenAI API Key<br>Step 1: Clone the repository and copy .env.example to .env, filling in all API keys.<br>Step 2: Run docker compose up -d to start PostgreSQL, Redis, and Qdrant.<br>Step 3: In the /backend folder, create a virtualenv, activate it, and run pip install -r requirements.txt.<br>Step 4: Run alembic upgrade head to apply database migrations.<br>Step 5: Run celery -A app.worker worker --loglevel=info in one terminal.<br>Step 6: Run uvicorn app.main:app --reload in another terminal.<br>Step 7: In /frontend, run npm install && npm run dev. |
| --- |

## 10.2 Recommended Build Order

1. Set up the monorepo structure: /backend, /frontend, /agents, /tests, /docs, /docker
1. Build the FastAPI skeleton with health check, auth endpoints, and the job submission endpoint
1. Set up Celery with Redis and confirm task dispatch works end-to-end with a dummy task
1. Build the Market Scout agent first (simplest data sources), test it in isolation
1. Build the Sentiment Analyst agent with Reddit scraping and VADER sentiment
1. Build the Competitor Tracker agent with a web search tool
1. Build the Trend Forecaster agent connecting to Google Trends
1. Build the Risk Modeller agent that consumes other agents' JSON outputs
1. Wire all agents through the LangGraph orchestrator with parallel execution
1. Build the Next.js frontend: auth, submission form, progress feed, and results dashboard
1. Implement charts (risk radar, competitor matrix, trend chart)
1. Add PDF export using Playwright headless browser screenshot or WeasyPrint
1. Write integration tests, run performance tests, and harden security
## 10.3 Project Repository Structure

| amivre/<br>├── backend/              # FastAPI application<br>│   ├── app/<br>│   │   ├── agents/      # One file per agent<br>│   │   ├── orchestrator/ # LangGraph pipeline<br>│   │   ├── scrapers/    # Web scraping modules<br>│   │   ├── api/         # FastAPI routers<br>│   │   ├── models/      # SQLAlchemy models<br>│   │   └── prompts/     # YAML prompt configs<br>│   └── tests/<br>├── frontend/             # Next.js application<br>│   ├── app/             # App Router pages<br>│   ├── components/      # Reusable UI components<br>│   └── lib/             # API client, utils<br>├── docker/              # Dockerfiles + compose<br>├── docs/               # Architecture diagrams, SRS<br>└── README.md |
| --- |

# 11. Evaluation Criteria & Success Metrics

## 11.1 Academic Evaluation Criteria

| Criterion | Weight | Target |
| --- | --- | --- |
| Technical complexity & innovation | 25% | Multi-agent system with real-time orchestration fully implemented |
| Software engineering quality | 20% | >= 70% test coverage, clean architecture, documented API |
| Working demonstration | 20% | Live system analyzing a real business idea end-to-end |
| Report & dissertation quality | 20% | IEEE-standard SRS, clear literature review, ablation study |
| User evaluation & feedback | 10% | Positive usability feedback from >= 5 real users |
| Presentation & viva performance | 5% | Clear explanation of all design decisions |

## 11.2 Technical Success Metrics

- All 5 agents successfully complete analysis on 95% of valid inputs
- Risk Score accuracy validated against 10 historical startup outcomes (from CB Insights data)
- Standard analysis completes in under 15 minutes on average
- User satisfaction score >= 4.0 / 5.0 in post-demo survey
- Zero critical security vulnerabilities in OWASP Top 10 audit
# 12. References & Resources

## 12.1 Key Academic References

- Park et al. (2023). 'Generative Agents: Interactive Simulacra of Human Behavior.' arXiv:2304.03442
- Wei et al. (2022). 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.' NeurIPS 2022
- Yao et al. (2023). 'ReAct: Synergizing Reasoning and Acting in Language Models.' ICLR 2023
- Lewis et al. (2020). 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.' NeurIPS 2020
## 12.2 Key Tools & Documentation

- LangGraph Documentation: https://langchain-ai.github.io/langgraph/
- CrewAI Documentation: https://docs.crewai.com/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Next.js 14 Documentation: https://nextjs.org/docs
- Qdrant Documentation: https://qdrant.tech/documentation/
## 12.3 Estimated Monthly Costs (MVP)

| Service | Usage Estimate | Monthly Cost (USD) |
| --- | --- | --- |
| OpenAI API (GPT-4o) | ~500 analysis runs | $40–80 |
| Railway / Render Hosting | Backend + DB + Redis | $10–25 |
| Qdrant Cloud (free tier) | Up to 1M vectors | $0 |
| SerpAPI (for web search) | 1000 queries | $50 (student plan) |
| Proxycurl / Apify | Scraping proxies | $20–40 |
| Total Estimate |  | $120–195 / month |

| Cost Optimization Tip: Apply for the OpenAI Researcher Access Program and the GitHub Student Developer Pack for free API credits. Use GPT-4o-mini for intermediate agent steps and reserve GPT-4o only for final synthesis. This can reduce API costs by 60-70%. |
| --- |

# Appendix A: Glossary

| Term | Definition |
| --- | --- |
| Agent | An autonomous AI module with a specific role, its own tools, and a defined output schema |
| Orchestrator | The master controller (LangGraph graph) that coordinates agent execution, manages state, and synthesizes outputs |
| TAM/SAM/SOM | Total/Serviceable/Obtainable Addressable Market — nested market sizing framework |
| RAG | Retrieval-Augmented Generation — augmenting LLM responses with relevant retrieved documents |
| Vector Store | A database optimized for storing and searching high-dimensional embedding vectors |
| Prompt Injection | A security attack where malicious text in scraped data attempts to hijack LLM instructions |
| Dead Pool | CB Insights database of failed startups with documented failure reasons |
| MoSCoW | Requirements prioritization framework: Must Have, Should Have, Could Have, Won't Have |

# Appendix B: Version History

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 0.1 | April 2026 | Student Author | Initial draft |
| 1.0 | April 2026 | Student Author | Complete SRS — all sections finalized |

---

Confidential — Final Year Project          Page N
