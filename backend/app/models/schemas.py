"""
Module: schemas.py
"""
import uuid
from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.analysis_job import JobStatus, JobDepth

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    exp: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class AnalysisSubmitRequest(BaseModel):
    business_idea: str = Field(..., min_length=200, description="Minimum ~50 words")
    target_market: str
    geography: str
    depth: JobDepth

class AnalysisJobResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    business_idea: str
    target_market: str
    geography: str
    status: JobStatus
    depth: JobDepth
    result_json: Optional[Any] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PaginatedAnalysisJobs(BaseModel):
    items: List[AnalysisJobResponse]
    total: int
    page: int
    limit: int
    
    model_config = ConfigDict(from_attributes=True)
