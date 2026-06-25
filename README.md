# P1G katale

Uganda's premier livestock marketplace and escrow platform. Connect buyers and sellers of pigs and livestock with secure payment handling.

## Architecture

```
p1g/
├── client/       React + TypeScript + Vite frontend (Vercel)
├── server/       FastAPI backend (FastAPI Cloud)
└── designs/      UI design assets
```

## Quick start

```bash
# Backend
cd server
cp .env.example .env
pip install -r requirements.txt
fastapi dev

# Frontend
cd client
npm install
cp .env.example .env
npm run dev
```

- **Live site**: https://p1gz.com
- **API**: https://p1g-84c1181e.fastapicloud.dev
- **API docs**: https://p1g-84c1181e.fastapicloud.dev/docs
