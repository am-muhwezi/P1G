# P1G Market — Architecture Reference

> Deep technical reference for engineers building on this codebase. For API contracts, payment flows, and deployment, see [`README.md`](./README.md).

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Tech Stack (exact versions)](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Frontend Architecture](#5-frontend-architecture)
   - [Routing & Auth Guard](#51-routing--auth-guard)
   - [State Management](#52-state-management)
   - [Data Layer](#53-data-layer)
   - [Design System](#54-design-system)
   - [Page Inventory](#55-page-inventory)
6. [Data Model](#6-data-model)
   - [TypeScript Types](#61-typescript-types)
   - [Planned PostgreSQL Schema](#62-planned-postgresql-schema)
7. [Component Patterns](#7-component-patterns)
   - [Hand-rolled Components](#71-hand-rolled-components)
   - [AppShell Layout System](#72-appshell-layout-system)
8. [Backend Architecture (Planned — FastAPI)](#8-backend-architecture)
   - [Service Layer Design](#81-service-layer-design)
   - [Auth Strategy](#82-auth-strategy)
   - [Real-Time Layer (WebSocket)](#83-real-time-layer)
9. [Frontend → Backend Migration](#9-frontend--backend-migration)
10. [Environment Variables](#10-environment-variables)
11. [Local Development](#11-local-development)

---

## 1. System Overview

P1G Market is a multi-role marketplace for Uganda's piggery sector connecting:

| Role | What they do |
|------|-------------|
| **Buyer** | Browse marketplace, view listings, place orders, track orders |
| **Seller** | Create listings (subject to admin approval), manage orders, track earnings |
| **Admin** | Approve/suspend users and listings, view platform KPIs, manage platform settings |

Currency is always **UGX (Ugandan Shilling)** — stored and displayed as integers (no decimals).
Payment methods: **MTN Mobile Money**, **Airtel Money**, Bank Transfer, Cash on Delivery.

**Current state**: Frontend complete with mock/static data. Backend is unbuilt — FastAPI + PostgreSQL planned.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
│  React 19 + Vite + TypeScript + Tailwind v4                     │
│  Zustand (auth) │ React Router v7 │ Recharts │ lucide-react     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST (JSON)
                             │ WSS  (real-time events)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI (Python 3.12)                         │
│  Auth (JWT) │ Listings │ Orders │ Admin │ Payments (webhook)     │
│  SQLAlchemy async │ Alembic migrations │ Celery + Redis          │
└──────┬─────────────────────┬──────────────────────┬─────────────┘
       │                     │                      │
       ▼                     ▼                      ▼
  PostgreSQL 16         Redis (pub/sub,        MTN MoMo API
  (primary store)       WebSocket broker,      Airtel Money API
                        job queue, cache)       (payment callbacks)
```

**REST vs WebSocket split:**

| Use REST for | Use WebSocket for |
|-------------|------------------|
| All CRUD (listings, orders, users) | Order status updates (buyer watching their order) |
| Auth (login, refresh, logout) | New message notifications |
| File uploads | Admin real-time dashboard ticks |
| Payment initiation | Seller gets notified when their listing is approved |
| Admin moderation actions | Buyer gets payment confirmation push |

---

## 3. Tech Stack

### Frontend (current, locked)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.6 | UI framework |
| `react-dom` | 19.2.6 | DOM renderer |
| `react-router-dom` | 7.18.0 | Client-side routing |
| `vite` | 8.0.12 | Build tool / dev server |
| `typescript` | ~6.0.2 | Type checking |
| `tailwindcss` | 4.3.1 | Utility-first CSS (v4 — no config file) |
| `@tailwindcss/vite` | 4.3.1 | Tailwind Vite plugin (replaces PostCSS in v4) |
| `zustand` | 5.0.14 | Global state (auth) |
| `recharts` | 3.8.1 | Charts (bar, pie) |
| `lucide-react` | 1.21.0 | Icons (seller dashboard) |
| `@vitejs/plugin-react` | 6.0.1 | Vite React plugin |

**External CSS/Fonts loaded via @import in `src/index.css`:**
- Google Material Symbols Outlined — icons for public pages
- Google Plus Jakarta Sans — primary typeface

### Backend (planned)

| Package | Purpose |
|---------|---------|
| `fastapi` | Web framework |
| `uvicorn[standard]` | ASGI server |
| `sqlalchemy[asyncio]` | ORM (async) |
| `alembic` | DB migrations |
| `asyncpg` | PostgreSQL async driver |
| `python-jose[cryptography]` | JWT tokens |
| `passlib[bcrypt]` | Password hashing |
| `celery[redis]` | Background tasks (payment polling, email) |
| `redis` | Pub/sub broker for WebSocket fan-out |
| `httpx` | Async HTTP client (MTN/Airtel API calls) |
| `pydantic-settings` | Env var config |

---

## 4. Project Structure

```
P1G/
├── README.md                    ← API contracts, payments, deployment guide
├── architecture.md              ← This file (frontend patterns, schema, migration)
│
├── client/                      ← React SPA
│   ├── index.html
│   ├── vite.config.ts           ← Vite config with Tailwind plugin + @ alias
│   ├── tsconfig.json            ← Root TS config (path aliases here too)
│   ├── package.json
│   └── src/
│       ├── main.tsx             ← Entry: mounts <App />, imports CSS + fonts
│       ├── index.css            ← Tailwind v4 @import, CSS variables (design tokens), font imports
│       ├── App.tsx              ← All routes, RequireAuth guard
│       │
│       ├── lib/
│       │   └── data.ts          ← ALL types, mock data, formatters (→ replace with API)
│       │
│       ├── store/
│       │   └── auth.ts          ← Zustand auth (persisted: "p1g-auth")
│       │
│       ├── context/
│       │   └── ThemeContext.tsx  ← Dark/light theme provider
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx       ← Public top nav (Marketplace, How It Works, Listings)
│       │   │   ├── BottomNav.tsx    ← Mobile bottom nav
│       │   │   ├── Layout.tsx       ← Wraps public pages with Header + BottomNav
│       │   │   └── AppShell.tsx     ← Seller sidebar layout
│       │   │
│       │   ├── auth/
│       │   │   └── RequireAuth.tsx  ← Route guard (redirects to /login if unauthenticated)
│       │   │
│       │   ├── features/
│       │   │   ├── Hero.tsx         ← Landing page hero
│       │   │   ├── CategoryGrid.tsx ← Category browse grid
│       │   │   ├── ProductCard.tsx  ← Listing card for marketplace
│       │   │   ├── FilterBar.tsx    ← Marketplace filter chips
│       │   │   ├── EscrowTimeline.tsx  → DEPRECATED (replaced by OrderTimeline.tsx)
│       │   │   ├── TrustSection.tsx → DEPRECATED (replaced by inline How It Works)
│       │   │   └── TransactionLog.tsx  ← Order activity log
│       │   │
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Badge.tsx
│       │       ├── Chip.tsx
│       │       ├── Input.tsx
│       │       ├── Card.tsx
│       │       └── GlassCard.tsx
│       │
│       └── pages/
│           ├── Landing.tsx          ← Public landing (hero, categories, featured, how it works, footer)
│           ├── Marketplace.tsx      ← Browse all listings with search + filter
│           ├── ProductDetail.tsx    ← Single listing detail view
│           ├── OrderTracking.tsx    ← Order status + timeline
│           ├── Login.tsx            ← Unified login (all 3 roles) + demo quick-login
│           │
│           ├── auth/
│           │   └── Login.tsx        ← (symlinked or same as above)
│           │
│           └── seller/
│               ├── SellerDashboard.tsx  ← KPI cards + active listings + recent orders
│               ├── SellerListings.tsx   ← CRUD table + add/edit dialog
│               └── SellerOrders.tsx     ← Incoming orders with expandable rows
│
└── server/                      ← FastAPI backend (to be built)
    ├── app/
    │   ├── main.py              ← FastAPI app, CORS, WebSocket, lifespan
    │   ├── config.py            ← pydantic-settings env config
    │   ├── database.py          ← SQLAlchemy async engine + session
    │   ├── models/              ← SQLAlchemy ORM models
    │   │   ├── user.py
    │   │   ├── listing.py
    │   │   ├── order.py
    │   │   └── payment.py
    │   ├── schemas/             ← Pydantic request/response schemas
    │   ├── routers/             ← Route handlers (auth, listings, orders, admin, ws)
    │   ├── services/            ← Business logic (payment, notification, approval)
    │   └── workers/             ← Celery tasks (payment polling, email)
    ├── alembic/                 ← DB migrations
    ├── requirements.txt
    └── .env
```

---

## 5. Frontend Architecture

### 5.1 Routing & Auth Guard

All routes are defined in `src/App.tsx`. The `RequireAuth` component handles two checks:

```tsx
function RequireAuth({ children, role }: { children?: React.ReactNode; role?: string }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  if (role && auth.role !== role) return <Navigate to={`/${auth.role}`} replace />
  return children ? <>{children}</> : <Outlet />
}
```

- **No auth** → redirect to `/login`
- **Wrong role** → redirect to `/{their-actual-role}` (e.g. a buyer visiting `/seller` goes to `/login`)
- The `role` prop is optional — omit it for pages accessible to any authenticated user

Role → base path mapping:

| Role | Base path |
|------|----------|
| `buyer` | `/buyer` (not built yet) |
| `seller` | `/seller` |
| `admin` | `/admin` (not built yet) |

Route structure:

| Path | Component | Auth |
|------|-----------|------|
| `/` | `Landing.tsx` | Public |
| `/market` | `Marketplace.tsx` | Public |
| `/product/:id` | `ProductDetail.tsx` | Public |
| `/order/:orderId` | `OrderTracking.tsx` | Public |
| `/login` | `Login.tsx` | Public |
| `/seller` | `SellerDashboard.tsx` | RequireAuth(role="seller") |
| `/seller/listings` | `SellerListings.tsx` | RequireAuth(role="seller") |
| `/seller/orders` | `SellerOrders.tsx` | RequireAuth(role="seller") |

### 5.2 State Management

One Zustand store with `persist` middleware (localStorage):

**Auth store** — `src/store/auth.ts`, key: `"p1g-auth"`

```typescript
interface AuthState {
  isAuthenticated: boolean
  role: Role | null          // "buyer" | "seller" | "admin"
  userId: string | null
  name: string | null
  login: (role: Role, userId: string, name: string) => void
  logout: () => void
}
```

**When wiring the backend**: Replace `login()` to call `POST /auth/login`, store the JWT access token in memory (not localStorage — XSS risk). Refresh token goes in an `httpOnly` cookie. The Zustand store should only hold the decoded user info, not the raw token.

### 5.3 Data Layer

`src/lib/data.ts` is the single source of truth for:
- All TypeScript types (do not duplicate them)
- Mock data arrays: `MOCK_USERS`, `MOCK_LISTINGS`, `MOCK_ORDERS`
- Formatters: `formatUGX()`, `CATEGORY_LABELS`, `CATEGORY_EMOJI`
- Demo credentials: `DEMO_ACCOUNTS`

**Migration pattern** — each mock array maps to a React Query hook:

```typescript
// Before (mock)
const [listings, setListings] = useState(MOCK_LISTINGS.filter(l => l.sellerId === userId))

// After (API)
const { data: listings } = useQuery({
  queryKey: ["listings", { sellerId: userId }],
  queryFn: () => api.get(`/listings?seller_id=${userId}`).then(r => r.data),
})
```

Keep the TypeScript interfaces unchanged — they match the API response shapes.

### 5.4 Design System

**All design tokens are defined in `src/index.css`** under the `@theme` block (no tailwind.config.js).

Primary palette:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0d631b` | Buttons, links, accents |
| `--color-primary-container` | `#2e7d32` | Seller sidebar background |
| `--color-surface` | `#e8fff0` | Page background (light green tint) |
| `--color-surface-container-lowest` | `#ffffff` | Cards, modals |
| `--color-on-surface` | `#002114` | Body text |
| `--color-on-surface-variant` | `#40493d` | Secondary text |
| `--color-outline` | `#707a6c` | Borders, dividers |
| `--color-outline-variant` | `#bfcaba` | Subtle borders |
| `--color-warm-beige` | `#f5f0e6` | Input backgrounds |

**Typography**: Plus Jakarta Sans (loaded via Google Fonts @import). Token-based sizing:
- `display-lg`: 48px/700
- `headline-lg`: 32px/600
- `headline-md`: 24px/600
- `body-lg`: 18px/400
- `body-md`: 16px/400
- `label-lg`: 14px/600
- `label-sm`: 12px/500

**Icons**: Two systems — public pages use Google Material Symbols Outlined (`material-symbols-outlined` CSS class), seller dashboard uses `lucide-react` components. Category icons use Unicode emoji.

**Dark mode**: Toggled via `ThemeContext`. Every Tailwind color token has a `dark:` variant using the Material 3 dark palette defined in `@theme`.

**Radius**: `rounded-xl` (0.75rem) for cards, `rounded-2xl` (1rem) for modals, `rounded-full` for pills.

**Currency**: Always use `formatUGX(amount)` → `"UGX 950,000"`. Never format manually. Amount is always an integer — no decimals.

**Border standard**: Card borders use `border-outline-variant/20` (light) / `dark:border-surface-container` (dark). Tables use `border-outline-variant/20` for dividers.

### 5.5 Page Inventory

| Path | Component | Role | Status |
|------|-----------|------|--------|
| `/` | `Landing.tsx` | Public | Complete |
| `/market` | `Marketplace.tsx` | Public | Complete |
| `/product/:id` | `ProductDetail.tsx` | Public | Complete |
| `/order/:orderId` | `OrderTracking.tsx` | Public | Complete |
| `/login` | `Login.tsx` | Public | Complete |
| `/seller` | `SellerDashboard.tsx` | seller | Complete |
| `/seller/listings` | `SellerListings.tsx` | seller | Complete |
| `/seller/orders` | `SellerOrders.tsx` | seller | Complete |
| `/seller/messages` | — | seller | Not built |
| `/seller/earnings` | — | seller | Not built |
| `/seller/settings` | — | seller | Not built |
| `/buyer/*` | — | buyer | Not built |
| `/admin/*` | — | admin | Not built |

---

## 6. Data Model

### 6.1 TypeScript Types

Canonical source: `src/lib/data.ts`. These types are the contract between frontend and backend.

```typescript
export type Role = "buyer" | "seller" | "admin"
export type UserStatus = "active" | "pending" | "suspended"
export type ListingStatus = "active" | "pending" | "rejected"
export type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled"
export type Category = "live_pigs" | "semen" | "feed" | "medicines" | "vets" | "pork"

export interface User {
  id: string
  name: string
  email: string
  phone: string           // stored as "0772 345 678" in UI; normalise to "256772345678" in backend
  role: Role
  status: UserStatus
  district: string        // Uganda district name
  joinedAt: string        // ISO date "YYYY-MM-DD"
  lastActive: string      // ISO date "YYYY-MM-DD"
  avatar?: string         // URL (future: S3/Cloudflare R2)
}

export interface Listing {
  id: string
  sellerId: string
  sellerName: string
  sellerVerified: boolean  // true if seller status === "active" and KYC passed
  title: string
  description: string
  category: Category
  price: number            // UGX integer, no decimals
  stock: number            // integer units available
  unit: string             // "pig", "bag", "bottle", "dose", "visit", etc.
  district: string
  status: ListingStatus
  views: number
  rating: number           // 0–5, average of reviews
  reviewCount: number
  createdAt: string        // ISO date
  image?: string           // URL (future: S3/Cloudflare R2)
}

export interface CartItem {
  listingId: string
  title: string
  price: number            // snapshot of price at time of add-to-cart
  quantity: number
  sellerName: string
  unit: string
}

export interface Order {
  id: string               // "ORD-001" format; backend: UUID
  buyerId: string
  buyerName: string
  items: CartItem[]        // embedded snapshot (denormalised for display)
  total: number            // UGX: sum of (price × qty) for all items
  deliveryFee: number      // UGX flat fee
  status: OrderStatus
  paymentMethod: string    // "MTN Mobile Money" | "Airtel Money" | "Bank Transfer" | "Cash on Delivery"
  address: string
  district: string
  notes?: string
  createdAt: string        // ISO datetime
  updatedAt: string        // ISO datetime
}
```

### 6.2 Planned PostgreSQL Schema

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(200) UNIQUE NOT NULL,
  phone_e164  VARCHAR(20) UNIQUE NOT NULL,   -- e.g. "+256772345678"
  password_hash TEXT NOT NULL,
  role        VARCHAR(10) NOT NULL CHECK (role IN ('buyer','seller','admin')),
  status      VARCHAR(12) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('active','pending','suspended')),
  district    VARCHAR(60),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active TIMESTAMPTZ
);

-- Listings
CREATE TABLE listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  category    VARCHAR(20) NOT NULL
              CHECK (category IN ('live_pigs','semen','feed','medicines','vets','pork')),
  price_ugx   INTEGER NOT NULL CHECK (price_ugx > 0),
  stock       INTEGER NOT NULL DEFAULT 0,
  unit        VARCHAR(30) NOT NULL,
  district    VARCHAR(60),
  status      VARCHAR(12) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('active','pending','rejected')),
  rejection_reason TEXT,
  views       INTEGER NOT NULL DEFAULT 0,
  rating      NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE listing_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  sort_order SMALLINT DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id        UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(14) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','in_transit','delivered','cancelled')),
  total_ugx       INTEGER NOT NULL,
  delivery_fee_ugx INTEGER NOT NULL DEFAULT 0,
  payment_method  VARCHAR(30) NOT NULL,
  delivery_address TEXT,
  district        VARCHAR(60),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id    UUID REFERENCES listings(id) ON DELETE SET NULL,
  title_snapshot VARCHAR(200) NOT NULL,   -- denormalised — listing title at time of order
  unit_price_ugx INTEGER NOT NULL,
  quantity       INTEGER NOT NULL,
  seller_id      UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Payments
CREATE TABLE payment_transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES orders(id),
  provider         VARCHAR(20) NOT NULL CHECK (provider IN ('mtn','airtel','bank','cod')),
  provider_ref     VARCHAR(100),           -- MTN/Airtel transaction reference
  idempotency_key  VARCHAR(100) UNIQUE,    -- our own key for dedup
  amount_ugx       INTEGER NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'initiated'
                   CHECK (status IN ('initiated','pending','successful','failed')),
  raw_callback     JSONB,                  -- full webhook payload stored for audit
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messaging
CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id    UUID NOT NULL REFERENCES users(id),
  seller_id   UUID NOT NULL REFERENCES users(id),
  listing_id  UUID REFERENCES listings(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (buyer_id, seller_id, listing_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id),
  body            TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin audit
CREATE TABLE admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES users(id),
  action      VARCHAR(50) NOT NULL,       -- e.g. "approve_listing", "suspend_user"
  target_type VARCHAR(20) NOT NULL,       -- "listing" | "user" | "order"
  target_id   UUID NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_listings_seller     ON listings(seller_id);
CREATE INDEX idx_listings_status_cat ON listings(status, category);
CREATE INDEX idx_orders_buyer        ON orders(buyer_id);
CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_seller  ON order_items(seller_id);
CREATE INDEX idx_messages_conv       ON messages(conversation_id, created_at);
CREATE INDEX idx_payment_order       ON payment_transactions(order_id);
```

---

## 7. Component Patterns

### 7.1 Hand-rolled Components

All UI components in `src/components/ui/` are hand-rolled — no ShadCN or headless library dependency.

**Pattern**: Each component accepts standard React props + a `className` string for Tailwind overrides:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'px-6 py-4 rounded-xl font-label-lg text-label-lg transition-all active:scale-95'
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 shadow-md',
    secondary: 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container',
    tertiary: 'text-primary hover:bg-primary/5',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
}
```

**Status pill pattern** (used across seller pages):

```tsx
const statusColor: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  confirmed: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20",
  in_transit: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  delivered: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  cancelled: "text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20",
}
```

### 7.2 AppShell Layout System

`src/components/layout/AppShell.tsx` is the core layout wrapper for authenticated pages.

**Desktop**: Fixed `w-60` sidebar on the left (`hidden lg:flex`). Sidebar uses `bg-primary-container` with `text-on-primary-container`. Main content has `lg:pl-60`.

**Mobile**: Fixed top bar (`h-14`) with hamburger menu opening a full-height drawer overlaid on the content.

**Navigation array** (in `AppShell.tsx`):

```tsx
const SELLER_NAV: NavItem[] = [
  { to: "/seller", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/seller/listings", label: "My Listings", icon: <Package size={20} /> },
  { to: "/seller/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
  { to: "/seller/messages", label: "Messages", icon: <MessageSquare size={20} /> },
  { to: "/seller/earnings", label: "Earnings", icon: <DollarSign size={20} /> },
  { to: "/seller/settings", label: "Settings", icon: <Settings size={20} /> },
]
```

**Reserved visual patterns** (shared across all pages):

| Pattern | Usage |
|---------|-------|
| `bg-surface-container-lowest` + `border-outline-variant/20` | Cards |
| `bg-warm-beige` | Input backgrounds (Login, listing forms) |
| `bg-surface-container` | Mobile topbar, subtle backgrounds |
| `border-b border-outline-variant/20` | Table row dividers |
| `bg-primary text-on-primary` + `rounded-xl` | Primary buttons |
| `justify-between items-center p-4 lg:p-6 max-w-container-max mx-auto` | Page content wrapper |

---

## 8. Backend Architecture

### 8.1 Service Layer Design

Structure FastAPI with a clean separation:

```
routers/     ← HTTP + WebSocket handlers only (validate input, call service, return response)
services/    ← Business logic (no HTTP concerns — testable in isolation)
models/      ← SQLAlchemy ORM models
schemas/     ← Pydantic in/out schemas (map 1:1 with TypeScript interfaces in data.ts)
workers/     ← Celery async tasks
```

Key services to build:

| Service | Responsibilities |
|---------|----------------|
| `AuthService` | Password hash/verify, JWT issue/verify, refresh token rotation |
| `ListingService` | CRUD, approval workflow, view count increment |
| `OrderService` | Create from cart, status transitions, seller notification |
| `PaymentService` | MTN/Airtel initiation, idempotency, webhook processing |
| `NotificationService` | WebSocket event fan-out via Redis pub/sub |
| `AdminService` | User/listing moderation, KPI aggregation, audit log write |

### 8.2 Auth Strategy

**Tokens**:
- Access token: JWT, 15 minutes, HS256 (dev) / RS256 (prod)
- Refresh token: UUID stored in `httpOnly; SameSite=Strict` cookie, 30 days, rotated on each use

**Payload** (access token):
```json
{ "sub": "uuid", "role": "seller", "name": "John Mukasa", "exp": 1234567890 }
```

**Middleware**: FastAPI dependency `get_current_user` decodes JWT from `Authorization: Bearer <token>` header. Role-specific dependencies: `require_seller`, `require_admin`.

**Seller approval gate**: Sellers with `status = "pending"` can log in and see their dashboard but cannot create listings until approved (check in `ListingService.create()`).

### 8.3 Real-Time Layer

Use Redis pub/sub as the message broker so WebSocket connections can fan out across multiple server instances.

```
Client WebSocket ↔ FastAPI WS handler → publish to Redis channel
                                              ↓
                              All FastAPI instances subscribe → push to connected clients
```

**Event schema** (JSON over WS):
```json
{
  "type": "order.status_changed",
  "payload": {
    "order_id": "uuid",
    "new_status": "in_transit",
    "updated_at": "2025-04-15T10:00:00Z"
  }
}
```

**Channel naming**:
- `user:{user_id}` — personal notifications (order updates, listing approval)
- `admin:dashboard` — platform-wide events for admin overview
- `conversation:{conversation_id}` — chat messages

**Frontend connection point**: After `login()` in `src/store/auth.ts`, open a WebSocket to `wss://api.p1gmarket.ug/ws?token={access_token}`. Close on `logout()`. Reconnect with exponential backoff on drop.

---

## 9. Frontend → Backend Migration

Replace mock data piece by piece — the app stays functional throughout.

### Phase 1 — Auth (start here, unblocks everything)

Replace `Login.tsx` hardcoded check against `DEMO_ACCOUNTS`:
```typescript
// POST /auth/login → { access_token, refresh_token, role, user_id, name }
// Store access token in memory (module-level var, not localStorage)
// auth store: call login(role, userId, name) — same signature, no change needed
```

Add axios/fetch interceptor: on 401, call `POST /auth/refresh` → retry original request.

### Phase 2 — Listings (buyer sees real data)

`Marketplace.tsx`: replace `MOCK_LISTINGS` filter with `GET /listings?status=active&category=&search=`.
`SellerListings.tsx`: replace local `useState(MOCK_LISTINGS...)` with mutations to `POST /listings`, `PATCH /listings/{id}`, `DELETE /listings/{id}`.

### Phase 3 — Orders (checkout flows through backend)

`ProductDetail.tsx`: on "Buy Now", call `POST /orders` with listing details. On success, redirect to order tracking.
`SellerOrders.tsx`: replace `MOCK_ORDERS` with `GET /orders?seller_id=me`.

### Phase 4 — Admin (real moderation)

Admin user management and listing approval pages need to be built.

### Phase 5 — Payments (wire mobile money)

Add `POST /payments/initiate` call from checkout flow.
Implement polling or WebSocket listener for payment status → update order status in UI.
Add `POST /payments/webhook` endpoint on backend (MTN and Airtel call this).

### Phase 6 — Real-Time (polish)

Open WebSocket on login. Subscribe buyer to `user:{id}` for order updates.
Subscribe admin to `admin:dashboard` for live KPI ticks.
Build Messages feature using `conversation:{id}` channel.

---

## 10. Environment Variables

### `client/.env`
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### `server/.env`
```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/p1g

# Security
JWT_SECRET=change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30

# Redis
REDIS_URL=redis://localhost:6379/0

# MTN Mobile Money Uganda
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your-key
MTN_MOMO_API_USER=uuid-you-create
MTN_MOMO_API_KEY=your-api-key
MTN_MOMO_ENVIRONMENT=sandbox   # → "mtncongo" or "mtnuganda" in production

# Airtel Money Uganda
AIRTEL_BASE_URL=https://openapi.airtel.africa
AIRTEL_CLIENT_ID=your-client-id
AIRTEL_CLIENT_SECRET=your-secret
AIRTEL_COUNTRY=UG
AIRTEL_CURRENCY=UGX

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://p1gmarket.ug

# File storage (future)
S3_BUCKET=p1g-assets
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 11. Local Development

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.12
- PostgreSQL 16
- Redis 7

### Run the frontend
```bash
cd client
npm install
npm run dev          # → http://localhost:5173
```

Demo login credentials (no backend needed — works with mock data):
- **Admin**: `admin@p1gmarket.ug` / `admin123`
- **Seller**: `seller@p1gmarket.ug` / `seller123`
- **Buyer**: `buyer@p1gmarket.ug` / `buyer123`

Or use the quick-login buttons on the login screen.

### Run the backend (once built)
```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in values

# Apply migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload --port 8000

# Start Celery worker (separate terminal)
celery -A app.workers worker --loglevel=info
```

### Type checking
```bash
cd client
npx tsc --noEmit    # must produce 0 errors
npm run build       # full build check
```
