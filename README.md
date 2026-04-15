# P1G Market 🐷

> **Uganda's #1 Piggery Marketplace** — connecting pig farmers, feed suppliers, veterinarians, and buyers nationwide.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Quick Start](#2-quick-start)
3. [Project Structure](#3-project-structure)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [API Design — REST + WebSocket](#6-api-design--rest--websocket)
7. [Database Schema](#7-database-schema)
8. [Authentication & Roles](#8-authentication--roles)
9. [Payments — MTN & Airtel MoMo](#9-payments--mtn--airtel-momo)
10. [Environment Variables](#10-environment-variables)
11. [Frontend → Backend Migration Checklist](#11-frontend--backend-migration-checklist)
12. [Deployment](#12-deployment)
13. [Contributing](#13-contributing)

---

## 1. Project Overview

P1G Market is a multi-role marketplace platform built for Uganda. All prices are in **UGX (Ugandan Shilling)**.

| Role | What they do |
|------|-------------|
| **Buyer** | Browse listings, add to cart, checkout via Mobile Money, track orders |
| **Seller** | List products/services (pigs, feed, semen, medicines, vet services), manage orders |
| **Admin** | Approve/reject sellers and listings, onboard/offboard users, view platform analytics |

**Marketplace categories:** Live Pigs · Breeding Semen · Pig Feed · Medicines · Vet Services · Pork Products

**Payment methods:** MTN Mobile Money · Airtel Money · Bank Transfer · Cash on Delivery

---

## 2. Quick Start

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- PostgreSQL ≥ 15

### Frontend (React + Vite)

```bash
cd client
npm install
cp .env.example .env          # set VITE_API_BASE_URL
npm run dev                   # http://localhost:5173
```

### Backend (FastAPI) — *not yet implemented*

```bash
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill all secrets
alembic upgrade head          # run migrations
uvicorn main:app --reload     # http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Demo Credentials (frontend only, while on mock data)

| Role   | Email                      | Password    |
|--------|----------------------------|-------------|
| Buyer  | `buyer@p1gmarket.ug`       | `buyer123`  |
| Seller | `seller@p1gmarket.ug`      | `seller123` |
| Admin  | `admin@p1gmarket.ug`       | `admin123`  |

---

## 3. Project Structure

```
P1G/
├── client/                        # React frontend
│   ├── src/
│   │   ├── App.tsx                # Route definitions + RequireAuth guard
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Design tokens (Tailwind v4 + ShadCN)
│   │   ├── lib/
│   │   │   ├── data.ts            # ⚠️  All types + mock data (replace with API calls)
│   │   │   └── utils.ts           # cn() classname helper
│   │   ├── store/
│   │   │   ├── auth.ts            # Zustand auth (persisted to localStorage)
│   │   │   └── cart.ts            # Zustand cart (persisted to localStorage)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AppShell.tsx   # Sidebar, TopBar, StatCard, StatusBadge, RoleBadge
│   │   │   └── ui/                # ShadCN UI components (@base-ui/react)
│   │   └── pages/
│   │       ├── Landing.tsx        # Public homepage
│   │       ├── Login.tsx          # Unified login (all roles)
│   │       ├── Signup.tsx         # 3-step registration
│   │       ├── Placeholder.tsx    # Stub for unbuilt pages
│   │       ├── buyer/
│   │       │   ├── BuyerHome.tsx  # Marketplace + search + categories
│   │       │   ├── Cart.tsx       # Cart + checkout + payment selection
│   │       │   └── BuyerOrders.tsx# Order list + tracking timeline
│   │       ├── seller/
│   │       │   ├── SellerDashboard.tsx  # Metrics + charts
│   │       │   └── SellerListings.tsx   # CRUD listings
│   │       └── admin/
│   │           ├── AdminDashboard.tsx        # KPIs + activity feed
│   │           ├── AdminUsers.tsx             # User management
│   │           └── AdminListingApprovals.tsx  # Listing review queue
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.app.json
│
├── server/                        # FastAPI backend (to be built)
│   ├── app/
│   │   ├── main.py                # FastAPI app + router registration
│   │   ├── config.py              # Settings (pydantic-settings)
│   │   ├── database.py            # SQLAlchemy engine + session
│   │   ├── models/                # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── listing.py
│   │   │   ├── order.py
│   │   │   └── payment.py
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── routers/               # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── listings.py
│   │   │   ├── orders.py
│   │   │   ├── payments.py
│   │   │   └── admin.py
│   │   ├── services/              # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── listing_service.py
│   │   │   ├── order_service.py
│   │   │   └── payment_service.py
│   │   ├── websocket/             # WebSocket handlers
│   │   │   ├── manager.py         # Connection manager
│   │   │   └── handlers.py
│   │   └── utils/
│   │       ├── security.py        # JWT helpers
│   │       └── momo.py            # Mobile Money helpers
│   ├── alembic/                   # DB migrations
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── README.md                      # ← you are here
└── architecture.md                # Deep technical reference
```

---

## 4. Frontend Architecture

### Stack

| Concern | Library | Notes |
|---------|---------|-------|
| UI Framework | React 19 | Hooks only, no class components |
| Build Tool | Vite 8 | HMR, path alias `@` → `src/` |
| Language | TypeScript 6 | Strict mode, `noUnusedLocals` |
| Styling | Tailwind CSS v4 | Utility-first, design tokens in `index.css` |
| Components | ShadCN UI (`@base-ui/react`) | Headless, no `asChild` prop, `onValueChange` → `string \| null` |
| State | Zustand 5 | `persist` middleware → localStorage |
| Routing | React Router v7 | `<RequireAuth>` wrapper for protected routes |
| Charts | Recharts | Bar, Pie charts in dashboards |
| Icons | Lucide React | |
| Toasts | Sonner | `toast.success()` / `toast.error()` |

### Route Protection

```tsx
// src/App.tsx
function RequireAuth({ children, role }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" />
  if (role && auth.role !== role) return <Navigate to={`/${auth.role}`} />
  return children
}
```

Role → default path: `buyer → /buyer`, `seller → /seller`, `admin → /admin`

### Design Tokens (key values)

```css
Primary green:    #2D6A2D  (buttons, active nav, links)
Dark sidebar:     #1A3F1A  (sidebar background)
Secondary amber:  #F59E0B  (CTAs, seller actions, warnings)
Info blue:        #0EA5E9  (order tracking, informational)
Border radius:    rounded-xl (12px) / rounded-2xl (16px) on cards
Font:             Geist Variable
Currency:         formatUGX(950000) → "UGX 950,000"
```

### State Stores

**Auth store** (`src/store/auth.ts`) — persisted as `p1g-auth`:
```ts
{ isAuthenticated, role, userId, name }
// actions: login(role, userId, name), logout()
```

**Cart store** (`src/store/cart.ts`) — persisted as `p1g-cart`:
```ts
{ items: CartItem[] }
// actions: addItem, removeItem, updateQty, clearCart, total()
```

### Shared Components (`src/components/layout/AppShell.tsx`)

| Export | Usage |
|--------|-------|
| `AppShell` | Wraps every authenticated page — renders sidebar (desktop) + mobile topbar |
| `BuyerTopBar` | Search + cart badge + notifications for buyer desktop |
| `StatCard` | KPI card with icon — `color: "green" \| "amber" \| "blue" \| "red"` |
| `StatusBadge` | Pill badge for `active/pending/rejected/in_transit/delivered/cancelled` |
| `RoleBadge` | Pill badge for `buyer/seller/admin` |
| `AdminPageHeader` | Page title + subtitle + optional action button |

---

## 5. Backend Architecture

### Recommended Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | **FastAPI** | Async-first, auto OpenAPI docs, Pydantic validation |
| ORM | **SQLAlchemy 2.0** + **SQLModel** | Type-safe models, async sessions |
| Database | **PostgreSQL 15** | JSONB for metadata, full-text search for listings |
| Migrations | **Alembic** | Schema versioning |
| Auth | **JWT** (python-jose) | Stateless, RS256 recommended for prod |
| Task Queue | **Celery + Redis** | Payment status polling, email/SMS notifications |
| WebSocket | **FastAPI WebSocket** | Built-in, no extra library needed |
| Caching | **Redis** | Session invalidation, rate limiting |
| File Storage | **Cloudinary** or **Supabase Storage** | Listing images |

### Key Design Decisions

1. **Async everywhere** — use `async def` for all route handlers; `asyncpg` as DB driver
2. **Service layer** — business logic lives in `services/`, not in routers
3. **Dependency injection** — use FastAPI `Depends()` for auth, DB sessions, pagination
4. **Idempotency** — all payment endpoints require `Idempotency-Key` header
5. **Soft deletes** — users and listings use `is_deleted` flag, not hard `DELETE`

---

## 6. API Design — REST + WebSocket

### Decision: REST for CRUD, WebSocket for Real-Time

Use **REST (HTTP/JSON)** for:
- All CRUD operations (listings, users, orders)
- Authentication (login, refresh, logout)
- Admin actions (approve/reject/suspend)
- Payment initiation and status polling
- File uploads

Use **WebSocket** for:
- Real-time order status updates (buyer sees delivery moving)
- In-app messaging (buyer ↔ seller)
- Admin live notifications (new seller registration, new listing pending)

### Base URL

```
REST:      https://api.p1gmarket.ug/v1
WebSocket: wss://api.p1gmarket.ug/ws
```

### REST API Reference

#### Authentication — `/auth`

```
POST   /auth/register          Create new user account
POST   /auth/login             Returns access_token + refresh_token + role
POST   /auth/refresh           Exchange refresh_token for new access_token
POST   /auth/logout            Invalidate refresh token (server-side blacklist)
POST   /auth/forgot-password   Send reset link via SMS
POST   /auth/reset-password    Submit new password with reset token
```

**Register request:**
```json
{
  "name": "John Mukasa",
  "email": "john@farmug.com",
  "phone": "0753123456",
  "password": "securePass123",
  "role": "seller",
  "district": "Kampala"
}
```

**Login response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "uuid",
    "name": "John Mukasa",
    "role": "seller",
    "status": "pending"
  }
}
```

> **Note:** Seller accounts return `status: "pending"` after registration — they cannot list until admin approves.

---

#### Listings — `/listings`

```
GET    /listings                     Public browse (filters: category, status, district, search, page, limit)
GET    /listings/{id}                Public listing detail
POST   /listings                     Seller only — creates with status: "pending"
PATCH  /listings/{id}                Seller (own) or Admin
DELETE /listings/{id}                Seller (own) or Admin — soft delete
GET    /listings/me                  Seller's own listings
POST   /listings/{id}/images         Upload listing image (multipart/form-data)
```

**GET /listings query params:**
```
?category=live_pigs&status=active&district=Kampala&search=boar&page=1&limit=20
```

**POST /listings request:**
```json
{
  "title": "Large White Boar — 8 months",
  "description": "Healthy, vaccinated boar...",
  "category": "live_pigs",
  "price_ugx": 950000,
  "stock": 3,
  "unit": "pig",
  "district": "Kampala"
}
```

---

#### Orders — `/orders`

```
POST   /orders                       Buyer places order
GET    /orders                       Buyer: own orders | Seller: orders with their items | Admin: all
GET    /orders/{id}                  Order detail with items + tracking events
PATCH  /orders/{id}/status           Seller/Admin updates status
POST   /orders/{id}/cancel           Buyer cancels (only if status = pending)
```

**POST /orders request:**
```json
{
  "items": [
    { "listing_id": "uuid", "quantity": 1 },
    { "listing_id": "uuid", "quantity": 2 }
  ],
  "delivery_address": "Plot 14, Kampala Road",
  "district": "Wakiso",
  "payment_method": "mtn_momo",
  "phone_number": "0772345678",
  "notes": "Call before delivery"
}
```

**Order status flow:**
```
pending → confirmed → in_transit → delivered
        ↘ cancelled (buyer/admin only)
```

---

#### Admin — `/admin`

```
GET    /admin/stats                         Platform KPIs
GET    /admin/users                         All users (filter: role, status, search)
PATCH  /admin/users/{id}/status             approve | suspend | reinstate
DELETE /admin/users/{id}                    Soft delete (offboard)
GET    /admin/listings?status=pending       Listings awaiting approval
PATCH  /admin/listings/{id}/approve         Approve listing → status: active
PATCH  /admin/listings/{id}/reject          Reject with reason
GET    /admin/orders                        All platform orders
```

**PATCH /admin/listings/{id}/reject request:**
```json
{
  "reason": "Images do not meet quality standards. Please upload clear photos."
}
```

---

#### Payments — `/payments`

See [Section 9](#9-payments--mtn--airtel-momo) for full detail.

```
POST   /payments/initiate            Start MoMo payment for an order
GET    /payments/{reference}/status  Poll payment status
POST   /payments/webhook/mtn         MTN callback (public, signature-verified)
POST   /payments/webhook/airtel      Airtel callback (public, signature-verified)
```

---

### WebSocket API

#### Connection

```
wss://api.p1gmarket.ug/ws?token=<access_token>
```

The server authenticates via the token query parameter on connect.

#### Message Format

All messages use this envelope:
```json
{
  "type": "event_type",
  "payload": { ... },
  "timestamp": "2025-04-15T10:30:00Z"
}
```

#### Events (Server → Client)

| Event type | Who receives | Payload |
|------------|-------------|---------|
| `order.status_changed` | Buyer, Seller | `{ order_id, new_status, updated_at }` |
| `message.received` | Buyer or Seller | `{ from_user_id, message, conversation_id }` |
| `listing.approved` | Seller | `{ listing_id, listing_title }` |
| `listing.rejected` | Seller | `{ listing_id, reason }` |
| `admin.new_seller` | Admin | `{ user_id, name, district }` |
| `admin.new_listing` | Admin | `{ listing_id, seller_name, category }` |
| `payment.confirmed` | Buyer | `{ order_id, amount_ugx, method }` |
| `payment.failed` | Buyer | `{ order_id, reason }` |

#### Events (Client → Server)

| Event type | Usage |
|------------|-------|
| `message.send` | Send a chat message |
| `ping` | Keep-alive heartbeat |

#### Connection Management

```python
# server/app/websocket/manager.py
class ConnectionManager:
    # Maps user_id → list of WebSocket connections (multi-tab support)
    active_connections: dict[str, list[WebSocket]]

    async def connect(user_id, websocket)
    async def disconnect(user_id, websocket)
    async def send_to_user(user_id, message)      # personal notification
    async def broadcast_to_role(role, message)    # e.g. all admins
```

> **Reconnection:** Client should implement exponential backoff (1s, 2s, 4s, 8s, max 30s). Send a `ping` every 30 seconds to detect stale connections.

---

### HTTP Standards

| Concern | Convention |
|---------|-----------|
| Auth header | `Authorization: Bearer <token>` |
| Content type | `Content-Type: application/json` |
| Pagination | `?page=1&limit=20` → `{ items, total, page, limit, pages }` |
| Idempotency | `Idempotency-Key: <uuid>` on POST /orders and POST /payments/initiate |
| Errors | `{ "detail": "message", "code": "ERROR_CODE" }` |
| Dates | ISO 8601 UTC: `2025-04-15T10:30:00Z` |
| Currency | Always integers in UGX: `950000` (not `9500.00`) |

**Standard error codes:**
```
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
AUTH_INSUFFICIENT_ROLE
USER_NOT_FOUND
USER_ACCOUNT_SUSPENDED
USER_PENDING_APPROVAL
LISTING_NOT_FOUND
LISTING_NOT_ACTIVE
ORDER_NOT_FOUND
ORDER_CANNOT_CANCEL
PAYMENT_INITIATION_FAILED
PAYMENT_TIMEOUT
STOCK_INSUFFICIENT
VALIDATION_ERROR
```

---

## 7. Database Schema

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('buyer','seller','admin')),
  status        VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','pending','suspended')),
  district      VARCHAR(100),
  is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Note: sellers start with status='pending' until admin approves

-- Listings
CREATE TABLE listings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id      UUID NOT NULL REFERENCES users(id),
  title          VARCHAR(300) NOT NULL,
  description    TEXT,
  category       VARCHAR(50) NOT NULL
                 CHECK (category IN ('live_pigs','semen','feed','medicines','vets','pork')),
  price_ugx      INTEGER NOT NULL CHECK (price_ugx > 0),
  stock          INTEGER NOT NULL DEFAULT 0,
  unit           VARCHAR(50) NOT NULL DEFAULT 'unit',
  district       VARCHAR(100),
  status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('active','pending','rejected')),
  rejection_reason TEXT,
  views          INTEGER NOT NULL DEFAULT 0,
  rating_sum     INTEGER NOT NULL DEFAULT 0,
  review_count   INTEGER NOT NULL DEFAULT 0,
  is_deleted     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listing images
CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id         UUID NOT NULL REFERENCES users(id),
  status           VARCHAR(30) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','in_transit','delivered','cancelled')),
  total_ugx        INTEGER NOT NULL,
  delivery_fee_ugx INTEGER NOT NULL DEFAULT 0,
  payment_method   VARCHAR(50) NOT NULL,
  payment_status   VARCHAR(30) NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_reference VARCHAR(100),
  delivery_address TEXT NOT NULL,
  district         VARCHAR(100),
  notes            TEXT,
  is_deleted       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order line items
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id   UUID NOT NULL REFERENCES listings(id),
  seller_id    UUID NOT NULL REFERENCES users(id),
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_ugx INTEGER NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id),
  provider          VARCHAR(30) NOT NULL CHECK (provider IN ('mtn_momo','airtel_money','bank','cod')),
  external_reference VARCHAR(200),       -- provider's transaction ID
  idempotency_key   VARCHAR(100) UNIQUE NOT NULL,
  amount_ugx        INTEGER NOT NULL,
  status            VARCHAR(30) NOT NULL DEFAULT 'initiated'
                    CHECK (status IN ('initiated','pending','successful','failed','refunded')),
  phone_number      VARCHAR(20),
  failure_reason    TEXT,
  initiated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  raw_response      JSONB          -- store full provider response for debugging
);

-- Conversations (for messaging)
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id   UUID NOT NULL REFERENCES users(id),
  seller_id  UUID NOT NULL REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(buyer_id, seller_id, listing_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id       UUID NOT NULL REFERENCES users(id),
  body            TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin audit log
CREATE TABLE admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,  -- e.g. 'APPROVE_SELLER', 'REJECT_LISTING'
  target_type VARCHAR(50),            -- 'user' | 'listing' | 'order'
  target_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listings_category_status ON listings(category, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_listings_seller          ON listings(seller_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_buyer             ON orders(buyer_id);
CREATE INDEX idx_order_items_seller       ON order_items(seller_id);
CREATE INDEX idx_order_items_order        ON order_items(order_id);
CREATE INDEX idx_payment_idempotency      ON payment_transactions(idempotency_key);
CREATE INDEX idx_messages_conversation    ON messages(conversation_id, created_at DESC);
```

---

## 8. Authentication & Roles

### JWT Token Strategy

```
Access token:   15 minutes (used on every API request)
Refresh token:  30 days    (stored httpOnly cookie OR secure localStorage)
Algorithm:      HS256 (dev) / RS256 (production recommended)
```

**Access token payload:**
```json
{
  "sub": "user-uuid",
  "role": "seller",
  "status": "active",
  "name": "John Mukasa",
  "iat": 1713175800,
  "exp": 1713176700
}
```

### Roles & Permissions Matrix

| Action | Buyer | Seller | Admin |
|--------|-------|--------|-------|
| Browse listings (active) | ✅ | ✅ | ✅ |
| View listing detail | ✅ | ✅ | ✅ |
| Add to cart / place order | ✅ | ❌ | ❌ |
| Create listing | ❌ | ✅ (→ pending) | ✅ |
| Edit own listing | ❌ | ✅ | ✅ |
| Delete own listing | ❌ | ✅ | ✅ |
| View own orders | ✅ | ✅ (orders with their items) | ✅ |
| Update order status | ❌ | ✅ (confirmed→in_transit) | ✅ |
| Cancel order | ✅ (if pending) | ❌ | ✅ |
| Approve/reject listing | ❌ | ❌ | ✅ |
| Approve/suspend user | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |
| Send messages | ✅ | ✅ | ❌ |

### Seller Account Flow

```
Registration → status: "pending" (cannot list or receive orders)
     ↓ Admin approves
status: "active" (can create listings, listings go to pending)
     ↓ Admin approves listing
listing.status: "active" (visible to buyers)
```

### FastAPI Auth Dependencies

```python
# app/utils/security.py
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User: ...
async def require_buyer(user = Depends(get_current_user)) -> User: ...
async def require_seller(user = Depends(get_current_user)) -> User: ...
async def require_admin(user = Depends(get_current_user)) -> User: ...
async def require_active_seller(user = Depends(require_seller)) -> User:
    if user.status != "active":
        raise HTTPException(403, "Seller account pending approval")
    return user
```

---

## 9. Payments — MTN & Airtel MoMo

### Overview

Both MTN Mobile Money and Airtel Money Uganda use a **push-to-pay (USSD popup)** model:
1. Your server calls their API → user's phone receives a USSD prompt
2. User enters PIN → provider calls your webhook
3. Your server verifies signature → marks order as paid

**Critical principles:**
- Always use **idempotency keys** (UUID per payment attempt) to prevent double-charges
- Never trust the webhook alone — also **poll** the status endpoint as a fallback
- Store the **full raw API response** in `payment_transactions.raw_response` (JSONB) for debugging
- All amounts in **integer UGX** — no decimals

---

### MTN Mobile Money (MoMo) Uganda

**API Base:** `https://proxy.momoapi.mtn.com` (sandbox: `https://sandbox.momodeveloper.mtn.com`)

**Auth:** OAuth2 client credentials → bearer token (expires hourly, cache it)

**Flow:**

```
1. POST /collection/v1_0/requesttopay
   Headers:
     Authorization: Bearer <token>
     X-Reference-Id: <idempotency_key>          ← your UUID
     X-Target-Environment: production
     Ocp-Apim-Subscription-Key: <subscription_key>
   Body:
     {
       "amount": "95000",                        ← string UGX
       "currency": "UGX",
       "externalId": "<your_order_id>",
       "payer": {
         "partyIdType": "MSISDN",
         "partyId": "256772345678"               ← 256 format, no leading 0
       },
       "payerMessage": "P1G Market - Order #ORD-001",
       "payeeNote": "Payment for pigs and feed"
     }
   Response: 202 Accepted (async — not paid yet)

2. GET /collection/v1_0/requesttopay/<idempotency_key>
   → Poll until status is "SUCCESSFUL" or "FAILED"
   Status values: PENDING | SUCCESSFUL | FAILED

3. Webhook (POST to your /payments/webhook/mtn):
   Verify X-Callback-Signature header
   Update payment_transactions.status
   If SUCCESSFUL: mark order.payment_status = "paid", trigger order.status = "confirmed"
```

**Phone number format:** Strip leading `0`, add `256`. E.g. `0772345678` → `256772345678`

**Sandbox testing:** Use `256765409975` with any PIN.

---

### Airtel Money Uganda

**API Base:** `https://openapi.airtel.africa` (sandbox: same host, different credentials)

**Auth:** OAuth2 client credentials (same pattern as MTN)

**Flow:**

```
1. POST /merchant/v2/payments/
   Headers:
     Authorization: Bearer <token>
     X-Currency: UGX
     X-Country: UG
   Body:
     {
       "reference": "<idempotency_key>",
       "subscriber": {
         "country": "UG",
         "currency": "UGX",
         "msisdn": "256785123456"                ← 256 format
       },
       "transaction": {
         "amount": 95000,                        ← integer UGX
         "id": "<your_order_id>",
         "country": "UG",
         "currency": "UGX"
       }
     }
   Response: { "status": { "code": "200", "message": "SUCCESS" }, "data": { "transaction": { "id": "...", "status": "DP_INITIATED" } } }

2. GET /standard/v1/payments/<transaction_id>
   → Poll for status: DP_INITIATED | TS (successful) | TF (failed)

3. Webhook: Same pattern as MTN
```

---

### Payment Service Implementation

```python
# server/app/services/payment_service.py

class PaymentService:
    async def initiate_payment(order_id, method, phone, amount_ugx, idempotency_key) -> PaymentTransaction:
        """
        1. Create payment_transactions record (status: initiated)
        2. Call provider API
        3. Update record with external_reference
        4. Enqueue Celery task to poll status every 10s for up to 5 minutes
        """

    async def handle_mtn_webhook(payload, signature) -> None:
        """
        1. Verify HMAC-SHA256 signature against MTN_WEBHOOK_SECRET
        2. Find transaction by external_reference
        3. Update status: successful or failed
        4. If successful: update order payment_status + trigger WS notification to buyer
        """

    async def handle_airtel_webhook(payload, signature) -> None:
        """Same pattern as MTN"""

    async def poll_payment_status(transaction_id) -> str:
        """
        Called by Celery beat every 10s.
        Stops polling after 5 minutes — marks as FAILED if still pending.
        """
```

### Payment Considerations Checklist

- [ ] **Idempotency keys** — generate UUID per attempt, store in DB, reject duplicate keys
- [ ] **Timeout handling** — if user ignores USSD prompt, mark failed after 5 min
- [ ] **Retry logic** — exponential backoff on provider API errors (network issues)
- [ ] **Signature verification** — validate every webhook; reject unsigned callbacks
- [ ] **Phone normalisation** — always convert to `256XXXXXXXXX` before calling providers
- [ ] **Partial payment guard** — validate `amount` in webhook matches DB amount before confirming
- [ ] **Refunds** — MTN: `POST /collection/v1_0/refund`; Airtel: contact support for reversals
- [ ] **Test in sandbox first** — both providers have free sandbox environments
- [ ] **Log everything** — store full raw request/response in `raw_response JSONB` column
- [ ] **Celery worker** — run background polling independently of web workers
- [ ] **Webhook IP whitelist** — restrict `/payments/webhook/*` to provider IP ranges in production
- [ ] **COD orders** — skip payment initiation; confirm order immediately, mark `payment_status: pending`

---

## 10. Environment Variables

### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=P1G Market
```

### `server/.env`

```env
# App
APP_ENV=development         # development | production
SECRET_KEY=change-me-to-random-256-bit-string
ALLOWED_ORIGINS=http://localhost:5173,https://p1gmarket.ug

# Database
DATABASE_URL=postgresql+asyncpg://p1g:password@localhost:5432/p1gmarket

# JWT
JWT_SECRET=change-me-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30

# Redis (Celery + caching)
REDIS_URL=redis://localhost:6379/0

# MTN Mobile Money
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your-subscription-key
MTN_MOMO_API_USER=your-api-user-uuid
MTN_MOMO_API_KEY=your-api-key
MTN_MOMO_ENVIRONMENT=sandbox       # sandbox | production
MTN_WEBHOOK_SECRET=your-webhook-secret

# Airtel Money
AIRTEL_BASE_URL=https://openapi.airtel.africa
AIRTEL_CLIENT_ID=your-client-id
AIRTEL_CLIENT_SECRET=your-client-secret
AIRTEL_WEBHOOK_SECRET=your-webhook-secret

# File storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# SMS notifications (Africa's Talking)
AT_USERNAME=your-username
AT_API_KEY=your-api-key
AT_SENDER_ID=P1GMARKET
```

---

## 11. Frontend → Backend Migration Checklist

Replace mock data in `src/lib/data.ts` with real API calls in this order:

### Phase 1 — Auth (unblocks everything else)
- [ ] Replace `useAuth` login/logout with `POST /auth/login` and `POST /auth/logout`
- [ ] Add JWT refresh logic (intercept 401 → refresh → retry)
- [ ] Replace `Signup.tsx` form submit with `POST /auth/register`
- [ ] Handle `status: "pending"` for sellers (show "awaiting approval" screen)

### Phase 2 — Listings (buyer + seller core flow)
- [ ] `BuyerHome.tsx`: replace `MOCK_LISTINGS` with `GET /listings?status=active`
- [ ] `SellerListings.tsx`: replace state with `GET /listings/me`
- [ ] Add listing creation: `POST /listings`
- [ ] Add listing edit: `PATCH /listings/{id}`
- [ ] Add listing delete: `DELETE /listings/{id}`

### Phase 3 — Orders & Cart
- [ ] `Cart.tsx` checkout: replace setTimeout with `POST /orders`
- [ ] `BuyerOrders.tsx`: replace `MOCK_ORDERS` with `GET /orders`
- [ ] Connect payment selection to `POST /payments/initiate`
- [ ] Poll `GET /payments/{reference}/status` or subscribe to WS `payment.confirmed`

### Phase 4 — Admin
- [ ] `AdminUsers.tsx`: replace `MOCK_USERS` with `GET /admin/users`
- [ ] Wire approve/suspend/remove to `PATCH /admin/users/{id}/status`
- [ ] `AdminListingApprovals.tsx`: replace `MOCK_LISTINGS` with `GET /admin/listings?status=pending`
- [ ] Wire approve/reject to `PATCH /admin/listings/{id}/approve|reject`
- [ ] `AdminDashboard.tsx`: replace `PLATFORM_STATS` with `GET /admin/stats`

### Phase 5 — Real-Time
- [ ] Connect WebSocket in `AppShell.tsx` after login
- [ ] Handle `order.status_changed` → update `BuyerOrders.tsx`
- [ ] Handle `listing.approved` / `listing.rejected` → toast notification for seller
- [ ] Handle `admin.new_seller` / `admin.new_listing` → badge counter in admin sidebar

---

## 12. Deployment

### Recommended Stack

| Service | Provider |
|---------|---------|
| Frontend | Vercel / Netlify |
| Backend API | Railway / Render / DigitalOcean App Platform |
| Database | Supabase (PostgreSQL) or Railway Postgres |
| Redis | Upstash Redis (serverless) or Railway Redis |
| File Storage | Cloudinary (free tier generous) |
| DNS | Cloudflare (Uganda CDN nodes help with latency) |

### Environment-Specific Notes

- **CORS**: In production, restrict `ALLOWED_ORIGINS` to `https://p1gmarket.ug` only
- **HTTPS**: Required by both MTN and Airtel webhooks in production
- **Webhook URLs**: Register `https://api.p1gmarket.ug/v1/payments/webhook/mtn` with MTN portal before going live
- **Rate limiting**: Apply `slowapi` on auth endpoints (max 5 login attempts / minute / IP)

---

## 13. Contributing

### Branch Strategy

```
main          → production
develop       → staging / integration
feature/*     → new features (branch from develop)
fix/*         → bug fixes
```

### Commit Convention

```
feat: add MTN MoMo payment integration
fix: resolve cart quantity update bug
chore: update dependencies
docs: add WebSocket event reference
```

### Before Submitting a PR

**Frontend:**
```bash
npm run lint
npm run build        # must pass with zero TypeScript errors
```

**Backend:**
```bash
pytest tests/
ruff check app/
mypy app/
```

---

*Last updated: April 2025 · Built for Uganda 🇺🇬*
