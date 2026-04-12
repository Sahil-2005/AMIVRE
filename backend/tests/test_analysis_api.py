import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock

from app.main import app
from app.db.session import get_db
from app.dependencies import get_current_user, rate_limit
from app.models.user import User
from app.models.analysis_job import JobDepth, JobStatus


async def override_rate_limit():
    return None


async def override_get_current_user():
    user = User()
    user.id = uuid.uuid4()
    user.email = "test@example.com"
    return user


app.dependency_overrides[rate_limit] = override_rate_limit
app.dependency_overrides[get_current_user] = override_get_current_user


@pytest.mark.asyncio
async def test_submit_analysis_short_idea():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            "/api/v1/analysis/submit",
            json={
                "business_idea": "Too short",
                "target_market": "Tech",
                "geography": "Global",
                "depth": JobDepth.STANDARD.value,
            },
        )
    assert res.status_code == 422
    assert "at least 200 character" in str(
        res.json()["detail"]
    )  # Pydantic min_length error message


@pytest.mark.asyncio
@patch("app.api.routes.analysis.run_analysis_pipeline")
async def test_submit_analysis_success(mock_pipeline):
    db_session = MagicMock()
    db_session.add = MagicMock()
    db_session.commit = AsyncMock()

    async def mock_refresh(obj):
        obj.id = "123e4567-e89b-12d3-a456-426614174000"

    db_session.refresh = AsyncMock(side_effect=mock_refresh)
    app.dependency_overrides[get_db] = lambda: db_session

    long_idea = "word " * 60

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            "/api/v1/analysis/submit",
            json={
                "business_idea": long_idea,
                "target_market": "Tech",
                "geography": "Global",
                "depth": JobDepth.STANDARD.value,
            },
        )
    assert res.status_code == 202
    assert "job_id" in res.json()
    assert res.json()["status"] == JobStatus.PENDING.value
