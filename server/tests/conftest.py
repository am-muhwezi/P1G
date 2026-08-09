import os
import tempfile
from pathlib import Path

_TEST_DB = Path(tempfile.mkdtemp(prefix="p1g-test-")) / "test.db"
os.environ["DATABASE_URL"] = f"sqlite:///{_TEST_DB}"
os.environ["ALLOWED_ORIGINS"] = "http://localhost"

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.database import init_db
from app.routers.auth import router as auth_router
from app.routers.seller import router as seller_router
from app.routers.buyer import router as buyer_router

init_db()


@pytest.fixture(scope="session")
def app():
    test_app = FastAPI()
    test_app.include_router(auth_router)
    test_app.include_router(seller_router)
    test_app.include_router(buyer_router)
    return test_app


@pytest.fixture(scope="session")
def client(app):
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def seller_token(client):
    res = client.post(
        "/api/auth/register",
        json={
            "email": "seller@test.com",
            "password": "password123",
            "name": "Test Seller",
            "phone": "+256700000000",
            "role": "seller",
            "farm_name": "Test Farm",
        },
    )
    assert res.status_code == 201, res.text
    return res.json()["token"]


@pytest.fixture
def auth_headers(seller_token):
    return {"x-token": seller_token}
