"""
Module: celery_app.py
"""

import asyncio
import json
import logging
from celery import Celery
from app.config import settings
from app.db.session import AsyncSessionLocal
from app.models import AnalysisJob, JobStatus
from sqlalchemy import select

logger = logging.getLogger(__name__)

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


async def _publish(job_id: str, payload: dict):
    """Publish a progress event to the Redis pub/sub channel for this job."""
    try:
        import redis
        sync_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        sync_redis.publish(f"progress:{job_id}", json.dumps(payload))
        sync_redis.close()
    except Exception as e:
        logger.warning(f"Failed to publish Redis event for job {job_id}: {e}")


async def _run_analysis_pipeline_stub(job_id: str) -> dict:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(AnalysisJob).where(AnalysisJob.id == job_id)
        )
        job = result.scalar_one_or_none()
        if job:
            job.status = JobStatus.RUNNING
            await session.commit()

            # Signal frontend: all parallel agents are starting
            await _publish(job_id, {"status": "RUNNING", "agent_name": None, "message": "Initializing intelligence agents..."})

            try:
                from app.orchestrator.graph import graph

                initial_state = {
                    "business_idea": job.business_idea,
                    "target_market": job.target_market,
                    "geography": job.geography,
                    "depth": (
                        job.depth.value
                        if hasattr(job.depth, "value")
                        else str(job.depth)
                    ),
                    # Pass job_id so agents can publish their own AGENT_RUNNING events
                    "_job_id": str(job_id),
                    "scraped_data": {},
                }

                final_state = await asyncio.to_thread(graph.invoke, initial_state)

                def serialize_pydantic(obj):
                    if hasattr(obj, "model_dump"):
                        return obj.model_dump()
                    if isinstance(obj, dict):
                        return {k: serialize_pydantic(v) for k, v in obj.items()}
                    return obj

                job.result_json = serialize_pydantic(final_state)
                job.status = JobStatus.COMPLETED

                # Signal frontend: fully done
                await _publish(job_id, {"status": "COMPLETED", "agent_name": None, "message": "Analysis complete."})

            except Exception as e:
                logger.error(f"Job {job_id} failed: {e}")
                job.status = JobStatus.FAILED
                job.error_message = str(e)
                await _publish(job_id, {"status": "FAILED", "agent_name": None, "message": str(e)})
            finally:
                await session.commit()
    return {"status": "success", "job_id": job_id}


try:
    loop = asyncio.get_event_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)


@celery_app.task(name="app.worker.celery_app.run_analysis_pipeline")
def run_analysis_pipeline(job_id: str):
    return loop.run_until_complete(_run_analysis_pipeline_stub(job_id))
