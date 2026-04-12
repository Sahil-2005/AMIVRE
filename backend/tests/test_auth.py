import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from unittest.mock import AsyncMock, patch, MagicMock

from app.main import app
from app.api.routes.auth import get_db


async def override_get_db():
    yield AsyncMock()


app.dependency_overrides[get_db] = override_get_db


@pytest.mark.asyncio
async def test_register_user_success():
    with patch("app.api.routes.auth.select"):
        db_session = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        db_session.execute = AsyncMock(return_value=mock_result)
        db_session.commit = AsyncMock()
        db_session.add = MagicMock()

        async def mock_refresh(obj):
            obj.id = "123e4567-e89b-12d3-a456-426614174000"

        db_session.refresh = AsyncMock(side_effect=mock_refresh)

        app.dependency_overrides[get_db] = lambda: db_session

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.post(
                "/api/v1/auth/register",
                json={"email": "test@example.com", "password": "password123"},
            )

        assert res.status_code == status.HTTP_201_CREATED
        assert "user_id" in res.json()
        assert res.json()["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_register_user_duplicate():
    db_session = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = object()
    db_session.execute = AsyncMock(return_value=mock_result)
    app.dependency_overrides[get_db] = lambda: db_session

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "password123"},
        )

    assert res.status_code == status.HTTP_409_CONFLICT
    assert res.json()["detail"] == "Email already exists"


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    db_session = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    db_session.execute = AsyncMock(return_value=mock_result)
    app.dependency_overrides[get_db] = lambda: db_session

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            "/api/v1/auth/login",
            data={"username": "test@example.com", "password": "wrongpassword"},
        )

    assert res.status_code == status.HTTP_401_UNAUTHORIZED
