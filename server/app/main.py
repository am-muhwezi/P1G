import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, SessionLocal
from app.seed import seed_all
from app.routers.waitlist import router as waitlist_router
from app.routers.auth import router as auth_router
from app.routers.seller import router as seller_router
from app.routers.buyer import router as buyer_router
from app.routers.admin import router as admin_router

load_dotenv()

app = FastAPI(title="P1G katale — Waitlist API", version="0.1.0")

origins = os.getenv("ALLOWED_ORIGINS")
if not origins:
    raise RuntimeError("ALLOWED_ORIGINS env var is required. Set it to a comma-separated list of allowed origins.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(waitlist_router)
app.include_router(auth_router)
app.include_router(seller_router)
app.include_router(buyer_router)
app.include_router(admin_router)


@app.on_event("startup")
def on_startup():
    init_db()
    db = SessionLocal()
    try:
        seed_all(db)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db():
    from sqlalchemy import text
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}
    finally:
        db.close()
