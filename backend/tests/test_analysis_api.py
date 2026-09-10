import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from app.db.session import get_db
from app.dependencies import get_current_user, rate_limit
from app.main import app
from app.models.analysis_job import JobDepth, JobStatus
from app.models.user import User
from httpx import ASGITransport, AsyncClient


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


@pytest.mark.asyncio
async def test_get_analysis():
    db_session = MagicMock()
    mock_result = MagicMock()
    mock_job = MagicMock()
    test_id = "123e4567-e89b-12d3-a456-426614174000"
    mock_job.id = uuid.UUID(test_id)

    test_user_id = uuid.uuid4()

    async def get_test_user():
        user = User()
        user.id = test_user_id
        user.email = "test@example.com"
        return user

    app.dependency_overrides[get_current_user] = get_test_user
    mock_job.user_id = test_user_id
    mock_job.status = JobStatus.PENDING
    mock_job.depth = JobDepth.STANDARD
    mock_job.business_idea = "word " * 60
    mock_job.target_market = "Tech"
    mock_job.geography = "Global"

    from datetime import datetime

    mock_job.created_at = datetime.utcnow()
    mock_job.completed_at = None
    mock_job.error_message = None
    mock_job.result_json = None

    mock_result.scalar_one_or_none.return_value = mock_job
    db_session.execute = AsyncMock(return_value=mock_result)

    app.dependency_overrides[get_db] = lambda: db_session

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(f"/api/v1/analysis/{test_id}")

    assert res.status_code == 200
    assert res.json()["status"] == "PENDING"


@pytest.mark.asyncio
async def test_delete_analysis():
    db_session = MagicMock()
    mock_result = MagicMock()
    mock_job = MagicMock()
    test_id = "123e4567-e89b-12d3-a456-426614174000"

    test_user_id = uuid.uuid4()

    async def get_test_user():
        user = User()
        user.id = test_user_id
        return user

    app.dependency_overrides[get_current_user] = get_test_user
    mock_job.user_id = test_user_id
    mock_job.status = JobStatus.PENDING  # Can be deleted

    mock_result.scalar_one_or_none.return_value = mock_job
    db_session.execute = AsyncMock(return_value=mock_result)
    db_session.delete = AsyncMock()
    db_session.commit = AsyncMock()

    app.dependency_overrides[get_db] = lambda: db_session

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(f"/api/v1/analysis/{test_id}")

    assert res.status_code == 204
