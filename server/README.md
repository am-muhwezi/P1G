# P1G katale — Waitlist API

FastAPI backend for the P1G katale waitlist and admin dashboard.

## Stack

- **FastAPI** — web framework
- **SQLAlchemy** — ORM (SQLite)
- **Uvicorn** — ASGI server
- **python-dotenv** — environment config

## Project structure

```
server/
├── app/
│   ├── main.py           FastAPI app, CORS, startup
│   ├── database.py       SQLAlchemy engine + session
│   ├── models/           ORM models
│   ├── schemas/          Pydantic schemas
│   └── routers/          route handlers
├── .env                  local config (gitignored)
├── .env.example          config template
├── pyproject.toml        project metadata + deps
├── requirements.txt      pip deps
└── Dockerfile            container image
```

## Setup

```bash
cp .env.example .env
# Edit .env: set P1G_WAITLIST_ADMIN_PASSWORD, ALLOWED_ORIGINS

pip install -r requirements.txt
fastapi dev
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `P1G_WAITLIST_ADMIN_PASSWORD` | Yes | Password for admin dashboard |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins |

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/waitlist/auth` | No | Admin login |
| POST | `/api/waitlist` | No | Create waitlist entry |
| GET | `/api/waitlist` | Admin password | List entries |
| GET | `/api/waitlist/stats` | Admin password | Dashboard stats |
| GET | `/api/waitlist/export` | Admin password | CSV export |
| GET | `/health` | No | Health check |

## Deploy

```bash
fastapi deploy

fastapi cloud env set ALLOWED_ORIGINS=https://p1gz.com,https://www.p1gz.com
fastapi cloud env set P1G_WAITLIST_ADMIN_PASSWORD=<password>
```
