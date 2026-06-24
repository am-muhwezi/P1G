import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers.waitlist import router as waitlist_router

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


@app.on_event("startup")
def on_startup():
    pw = os.getenv("P1G_WAITLIST_ADMIN_PASSWORD")
    if not pw:
        raise RuntimeError(
            "P1G_WAITLIST_ADMIN_PASSWORD env var is required. "
            "Create a .env file or set it in the environment."
        )
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}
