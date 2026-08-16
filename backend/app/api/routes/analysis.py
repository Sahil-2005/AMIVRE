"""
Module: analysis.py
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.dependencies import get_current_user, rate_limit
from app.models.analysis_job import AnalysisJob, JobStatus
from app.models.schemas import (
    AnalysisJobResponse,
    AnalysisSubmitRequest,
    PaginatedAnalysisJobs,
)
from app.models.user import User
from app.worker.celery_app import run_analysis_pipeline

router = APIRouter()


@router.post("/submit", status_code=status.HTTP_202_ACCEPTED)
async def submit_analysis(
    req: AnalysisSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: None = Depends(rate_limit),
):
    # Enforce minimum 50 words loosely via length (~200 chars min length was in schema, ensure via split)
    if len(req.business_idea.split()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Business idea description must be at least 50 words.",
        )

    job = AnalysisJob(
        user_id=current_user.id,
        business_idea=req.business_idea,
        target_market=req.target_market,
        geography=req.geography,
        depth=req.depth,
        status=JobStatus.PENDING,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    run_analysis_pipeline.delay(str(job.id))

    return {
        "job_id": str(job.id),
        "status": JobStatus.PENDING.value,
        "message": "Analysis started",
    }


@router.get("/{job_id}", response_model=AnalysisJobResponse)
async def get_analysis(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(AnalysisJob).where(AnalysisJob.id == job_id))
    job = result.scalar_one_or_none()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@router.get("/", response_model=PaginatedAnalysisJobs)
async def list_analyses(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    job_status: JobStatus = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(AnalysisJob).where(AnalysisJob.user_id == current_user.id)
    if job_status:
        query = query.where(AnalysisJob.status == job_status)

    total_result = await db.execute(
        select(func.count(AnalysisJob.id)).where(AnalysisJob.user_id == current_user.id)
    )
    total = total_result.scalar() or 0

    query = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .order_by(AnalysisJob.created_at.desc())
    )
    result = await db.execute(query)
    jobs = result.scalars().all()

    return PaginatedAnalysisJobs(items=jobs, total=total, page=page, limit=limit)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(AnalysisJob).where(AnalysisJob.id == job_id))
    job = result.scalar_one_or_none()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status in [JobStatus.RUNNING, JobStatus.COMPLETED]:
        raise HTTPException(
            status_code=409, detail="Cannot cancel a job that is running or completed."
        )

    await db.delete(job)
    await db.commit()
