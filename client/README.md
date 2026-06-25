# P1G katale — Frontend

React + TypeScript frontend for the P1G katale marketplace platform.

## Stack

- **React 19** — UI library
- **TypeScript** — type safety
- **Vite** — build tool
- **Tailwind CSS 4** — styling
- **React Router 7** — routing
- **Zustand** — state management
- **Recharts** — charts
- **Lucide React** — icons

## Project structure

```
src/
├── pages/           route-level components
│   ├── admin/       admin dashboard pages
│   ├── auth/        login pages
│   └── ComingSoon.tsx  public landing page
├── components/      shared UI components
│   └── layout/      AdminLayout, nav
├── store/           Zustand stores
├── context/         React contexts
├── lib/             utilities
└── data/            static data
```

## Setup

```bash
npm install

# Create .env with API URL (default: http://localhost:8000)
VITE_API_URL=http://localhost:8000

npm run dev
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Deploy

The frontend is deployed on Vercel with SPA rewrites configured in `vercel.json`.

```bash
vercel deploy

# Set VITE_API_URL in Vercel dashboard env vars
```
