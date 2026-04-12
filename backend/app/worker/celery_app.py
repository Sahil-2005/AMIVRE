"""
Module: celery_app.py
"""

import asyncio
from celery import Celery
from app.config import settings
from app.db.session import AsyncSessionLocal
from app.models.analysis_job import AnalysisJob, JobStatus
from sqlalchemy import select

celery_app = Celery(
    "worker", broker=settings.CELERY_BROKER_URL, backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


async def _run_analysis_pipeline_stub(job_id: str) -> dict:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(AnalysisJob).where(AnalysisJob.id == job_id)
        )
        job = result.scalar_one_or_none()
        if job:
            job.status = JobStatus.RUNNING
            await session.commit()

            await asyncio.sleep(5)  # Simulate work

            job.status = JobStatus.COMPLETED
            job.result_json = {"message": "Placeholder result"}
            await session.commit()
    return {"status": "success", "job_id": job_id}


@celery_app.task(name="app.worker.celery_app.run_analysis_pipeline")
def run_analysis_pipeline(job_id: str):
    return asyncio.run(_run_analysis_pipeline_stub(job_id))
