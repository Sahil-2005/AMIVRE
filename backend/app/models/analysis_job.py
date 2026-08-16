"""
Module: analysis_job.py
"""

import enum
import uuid

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    PARTIAL = "PARTIAL"


class JobDepth(str, enum.Enum):
    QUICK = "QUICK"
    STANDARD = "STANDARD"
    DEEP = "DEEP"


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    business_idea = Column(Text, nullable=False)
    target_market = Column(String, nullable=False)
    geography = Column(String, nullable=False)
    status = Column(
        Enum(JobStatus, native_enum=False, length=50),
        default=JobStatus.PENDING,
        index=True,
    )
    depth = Column(
        Enum(JobDepth, native_enum=False, length=50), default=JobDepth.STANDARD
    )

    result_json = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", backref="jobs")
