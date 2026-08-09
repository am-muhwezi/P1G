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
| `VITE_SUPABASE_URL` | — | Supabase project URL (image storage) |
| `VITE_SUPABASE_ANON_KEY` | — | Supabase anon public key (image storage) |

## Image storage

Listing photos are uploaded directly from the browser to a Supabase Storage bucket named
`listing-images` (must be public), and the public URLs are stored on the listing. Create the
bucket in the Supabase dashboard, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
locally and in the Vercel env vars. Without them, sellers see a notice in the listing form and
listings fall back to placeholder images.

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
