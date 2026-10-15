# Campus Marketplace Platform: Architecture

| | |
|---|---|
| **Status** | Draft v0.1 |
| **Scope** | MVP (Phase 1) in detail; Phase 3–4 extension points noted |
| **Inputs** | `product_document.md`, `PRD.md` |
| **Related docs** | Rules.md, Design.md, Tasks.md, Memory.md |
| **Last updated** | 2026-10-10 |

---

## 1. Architecture Goals

1. **Ship the marketplace loop fast:** verified student → listing → discovery → chat → transaction → sold.
2. **Minimal moving parts:** one backend platform (Supabase), one web app (Next.js), one hosting provider (Vercel).
3. **Security in the database:** access control enforced by PostgreSQL Row Level Security (RLS), not only in app code.
4. **Multi-campus from day one in the schema**, single campus in operation. Every campus-scoped table carries `campus_id`.
5. **Extensible without rewrites:** payments, notifications, interest scoring and mobile clients attach to the same data model later.

### Non-goals for MVP
Microservices, custom auth, custom realtime server, search engine clusters, native mobile app, payment processing.

---

## 2. Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS | Responsive, mobile-first web app |
| Backend platform | Supabase | Auth, Postgres, Realtime, Storage, Edge Functions |
| Database | PostgreSQL (via Supabase) | Source of truth, RLS, full-text search |
| Auth | Supabase Auth (email OTP) | College-email verification |
| Storage | Supabase Storage (S3-compatible) | Listing images |
| Realtime chat | Supabase Realtime (Postgres changes) | Buyer–seller messaging |
| Email | Transactional provider (Resend or Supabase SMTP) | OTP and message notifications; recommendation email in Phase 3 |
| Hosting | Vercel | Next.js deployment, preview environments |
| Payments | Razorpay / Stripe | Phase 3 only |
| Mobile | React Native / Flutter | Phase 4 only |

---

## 3. System Overview

```text
                ┌──────────────────────────────┐
                │   Browser (mobile / desktop) │
                │   Next.js app (React + TS)   │
                └───────┬──────────────┬───────┘
                        │              │
          HTTPS (SSR /  │              │  WebSocket
          Server Actions)│              │  (Realtime)
                        ▼              ▼
        ┌─────────────────┐     ┌──────────────────┐
        │ Vercel          │     │ Supabase Realtime│
        │ Next.js server  │     └────────┬─────────┘
        └────────┬────────┘              │
                 │ supabase-js (user JWT) │
                 ▼                        ▼
        ┌──────────────────────────────────────────┐
        │             Supabase project             │
        │  Auth  │  Postgres + RLS  │  Storage     │
        │        │  Edge Functions  │  (images)    │
        └──────────────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Email provider   │
        └──────────────────┘
```

**Request principle:** the browser and the Next.js server talk to Supabase using the signed-in user's JWT, so RLS applies to every query. The service-role key is used only in trusted server code (Edge Functions, admin tasks) and never reaches the client.

---

## 4. Application Structure

### 4.1 Repository Layout
```text
/
├── app/                      # Next.js App Router
│   ├── (auth)/               # sign-in, OTP verify, campus select
│   ├── (marketplace)/        # feed, search, listing detail, create/edit listing
│   ├── chats/                # chat list, chat thread
│   ├── transactions/         # transaction detail
│   ├── profile/              # own profile, public profile
│   ├── admin/                # verification queue, moderation, reports, users
│   └── api/                  # route handlers (webhooks, health)
├── components/               # UI components (see Design.md)
├── lib/
│   ├── supabase/             # browser, server and admin clients
│   ├── auth/                 # session helpers, role guards
│   ├── validators/           # zod schemas shared by client and server
│   └── images/               # client-side compression
├── supabase/
│   ├── migrations/           # SQL migrations (schema, RLS, functions)
│   ├── functions/            # Edge Functions
│   └── seed.sql              # campuses, categories, test data
└── docs/                     # PRD, Architecture, Rules, Design, Tasks, Memory
```

### 4.2 Rendering Strategy
| Page | Strategy |
|---|---|
| Feed, search | Server-rendered with client-side filters; paginated |
| Listing detail | Server-rendered (shareable links) |
| Chat | Client component with Realtime subscription |
| Admin | Server-rendered behind role guard |

### 4.3 Mutations
Writes go through **Server Actions** or **RPC functions** that validate input (zod), then call Supabase under the user's session. Multi-step writes that must be atomic (for example completing a transaction and marking the listing sold) run as a single **Postgres function**.

---

## 5. Data Model

### 5.1 Entity Overview
```text
campuses ─┬─< profiles ─┬─< listings ─┬─< listing_images
          │             │             └─< chats ─┬─< messages
          │             │                        └─< transactions
          │             ├─< reports
          │             ├─< user_interests            (Phase 3)
          │             ├─< notification_preferences  (Phase 3)
          │             └─< notification_events       (Phase 3)
          └─< safe_zones                              (Phase 4 UI; table optional earlier)
```

### 5.2 Enumerations
```sql
create type user_role        as enum ('student', 'campus_admin', 'platform_admin');
create type verification_status as enum ('pending', 'verified', 'rejected');
create type listing_category as enum ('used', 'new', 'handmade', 'student_project');
create type listing_condition as enum ('like_new', 'good', 'fair', 'poor');
create type listing_status   as enum ('active', 'sold', 'removed', 'draft');
create type transaction_status as enum (
  'initiated', 'agreed', 'meetup_scheduled',
  'buyer_arrived', 'seller_arrived',   -- reserved for Phase 4 check-in
  'completed', 'cancelled', 'disputed'
);
create type payment_method   as enum ('cash', 'upi', 'platform');  -- 'platform' in Phase 3
create type report_target    as enum ('listing', 'user', 'message', 'transaction');
create type report_status    as enum ('open', 'reviewing', 'resolved', 'dismissed');
```

### 5.3 Core Tables (MVP)

```sql
-- Campuses
create table campuses (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  city          text,
  email_domains text[] not null,          -- allowed college email domains
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Profiles (1:1 with auth.users)
create table profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  campus_id           uuid references campuses(id),
  full_name           text,
  avatar_url          text,
  role                user_role not null default 'student',
  verification_status verification_status not null default 'pending',
  verified_at         timestamptz,
  is_suspended        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Listings
create table listings (
  id           uuid primary key default gen_random_uuid(),
  campus_id    uuid not null references campuses(id),
  seller_id    uuid not null references profiles(id),
  title        text not null check (char_length(title) between 3 and 120),
  description  text,
  price        numeric(10,2) not null check (price >= 0),
  category     listing_category not null,
  condition    listing_condition,
  status       listing_status not null default 'active',
  search_tsv   tsvector generated always as (
                 to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
               ) stored,
  sold_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table listing_images (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  storage_path text not null,
  position    int not null default 0
);

-- Chats: one chat per (listing, buyer)
create table chats (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  buyer_id    uuid not null references profiles(id),
  seller_id   uuid not null references profiles(id),
  created_at  timestamptz not null default now(),
  last_message_at timestamptz,
  unique (listing_id, buyer_id),
  check (buyer_id <> seller_id)
);

create table messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references chats(id) on delete cascade,
  sender_id  uuid not null references profiles(id),
  body       text not null check (char_length(body) between 1 and 2000),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- Transactions
create table transactions (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references listings(id),
  chat_id          uuid references chats(id),
  buyer_id         uuid not null references profiles(id),
  seller_id        uuid not null references profiles(id),
  agreed_price     numeric(10,2) not null check (agreed_price >= 0),
  payment_method   payment_method not null default 'cash',
  status           transaction_status not null default 'initiated',
  meetup_location  text,
  meetup_at        timestamptz,
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (buyer_id <> seller_id)
);

-- Reports
create table reports (
  id            uuid primary key default gen_random_uuid(),
  reporter_id   uuid not null references profiles(id),
  target_type   report_target not null,
  target_id     uuid not null,
  reason        text not null,
  details       text,
  status        report_status not null default 'open',
  resolved_by   uuid references profiles(id),
  resolved_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- Campus safe zones (data now, map UI in Phase 4)
create table safe_zones (
  id          uuid primary key default gen_random_uuid(),
  campus_id   uuid not null references campuses(id),
  name        text not null,
  description text,
  latitude    double precision,
  longitude   double precision,
  is_active   boolean not null default true
);
```

### 5.4 Phase 3 Tables (personalization and notifications)
Created in a later migration; defined here so the MVP schema does not block them.

```sql
create table user_interests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete cascade,
  category       listing_category,
  keyword        text,
  campus_id      uuid references campuses(id),
  interest_score numeric not null default 0,
  source         text not null check (source in ('search','view','save','chat','purchase','manual')),
  updated_at     timestamptz not null default now()
);

create table notification_preferences (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null unique references profiles(id) on delete cascade,
  email_enabled        boolean not null default false,       -- opt-in
  frequency            text not null default 'weekly'
                         check (frequency in ('instant','daily','weekly','none')),
  categories           listing_category[],
  campus_scope         text not null default 'own' check (campus_scope in ('own','all')),
  price_alerts_enabled boolean not null default false,
  updated_at           timestamptz not null default now()
);

create table notification_events (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  listing_id        uuid references listings(id) on delete set null,
  notification_type text not null,    -- new_listing | wanted_match | price_alert | digest | seller_activity | transactional
  channel           text not null default 'email',
  status            text not null default 'queued',  -- queued | sent | failed | suppressed
  sent_at           timestamptz,
  opened_at         timestamptz,
  created_at        timestamptz not null default now()
);
```

Also planned for Phase 3: `saved_listings`, `saved_searches`, `wanted_posts`.

### 5.5 Indexes
```sql
create index listings_feed_idx   on listings (campus_id, status, created_at desc);
create index listings_seller_idx on listings (seller_id);
create index listings_search_idx on listings using gin (search_tsv);
create index listings_price_idx  on listings (campus_id, category, price) where status = 'active';
create index messages_chat_idx   on messages (chat_id, created_at);
create index chats_buyer_idx     on chats (buyer_id);
create index chats_seller_idx    on chats (seller_id);
create index txn_buyer_idx       on transactions (buyer_id);
create index txn_seller_idx      on transactions (seller_id);
create index txn_listing_idx     on transactions (listing_id);
create index reports_status_idx  on reports (status, created_at desc);
```

---

## 6. Authentication and Verification

### 6.1 Flow
```text
1. User enters college email
2. Server checks the email domain against campuses.email_domains
     ├─ match      → send OTP via Supabase Auth
     └─ no match   → offer "request manual review" (creates a pending profile + admin queue item)
3. User enters OTP → session issued
4. A database trigger creates the profiles row (campus_id from domain match)
5. Matching domain + OTP success → verification_status = 'verified'
   Manual review → stays 'pending' until an admin approves
```

### 6.2 Rules
- Domain matching is done server-side against the `campuses` table, never trusted from the client.
- Only `verified` and non-suspended users may create listings, start chats or create transactions (enforced in RLS).
- Later (Phase 4): ID card upload and OCR as an additional verification path. The `verification_status` model already supports it.

### 6.3 Roles
| Role | Capabilities |
|---|---|
| `student` | Buy, sell, chat, report |
| `campus_admin` | Verification queue, moderation and reports **for their own campus only** |
| `platform_admin` | All campuses, user and role management |

A Campus Admin is scoped by `profiles.campus_id`. Role changes are only possible through a `platform_admin`-only function.

---

## 7. Authorization (Row Level Security)

RLS is enabled on every table. Helper functions keep policies readable:

```sql
create function is_verified() returns boolean language sql stable security definer as $$
  select exists (select 1 from profiles
                 where id = auth.uid() and verification_status = 'verified' and not is_suspended)
$$;

create function current_role() returns user_role language sql stable security definer as $$
  select role from profiles where id = auth.uid()
$$;

create function current_campus() returns uuid language sql stable security definer as $$
  select campus_id from profiles where id = auth.uid()
$$;
```

### 7.1 Policy Summary
| Table | Read | Write |
|---|---|---|
| `campuses` | Any signed-in user | Platform admin |
| `profiles` | Own full row; limited public fields for same-campus users | Own row (non-privileged fields only); admins for verification/suspension |
| `listings` | Active listings of own campus; own listings in any status; admins by scope | Insert/update/delete: verified owner only |
| `listing_images` | Same as parent listing | Owner of parent listing |
| `chats` | Participants only (buyer or seller); admins when resolving a report | Verified buyer creates; no deletes |
| `messages` | Chat participants only | Participant inserts as themselves; no edits |
| `transactions` | Participants only; admins by scope | Created and updated via RPC functions only |
| `reports` | Reporter sees own; admins by scope | Any verified user inserts; admins update status |
| `safe_zones` | Same-campus users | Campus/platform admin |

### 7.2 Privileged Fields
Users must not be able to change `role`, `verification_status`, `is_suspended` or `campus_id` on their own profile. This is enforced with a column-level restriction (trigger or restricted RPC), not just UI hiding.

---

## 8. Core Flows

### 8.1 Create Listing
```text
Client: select photos → compress in browser → request signed upload URLs
Client: upload images to Storage (bucket: listing-images)
Server Action: validate (zod) → insert listings + listing_images
RLS: verified, same-campus, seller_id = auth.uid()
Result: listing is 'active' and appears in the campus feed
```

### 8.2 Discovery
- **Feed:** `listings` filtered by `campus_id = current_campus()` and `status = 'active'`, ordered by `created_at desc`, cursor-paginated.
- **Search:** Postgres full-text search on `search_tsv` using `websearch_to_tsquery`, combined with category and price filters.
- Search relevance can be upgraded later (trigram similarity, a dedicated search service) without changing the UI contract.

### 8.3 Chat
```text
Buyer taps "Message seller" on a listing
   → get-or-create chat (unique on listing_id + buyer_id)
   → messages inserted by participants
   → Supabase Realtime pushes new rows to the other participant
   → Notification: email (and later push) for new messages, rate-limited
```
- Realtime subscription is per chat; RLS ensures participants only receive their own rows.
- `chats.last_message_at` is updated by a trigger for chat list ordering.

### 8.4 Transaction Lifecycle
```text
initiated ─► agreed ─► meetup_scheduled ─► completed
    │           │              │
    └───────────┴──────────────┴──► cancelled
                                └──► disputed

(Phase 4 inserts buyer_arrived → seller_arrived before completed)
```

| Action | Who | Effect |
|---|---|---|
| Create from chat | Buyer or seller | `initiated` |
| Agree price | Both confirm | `agreed`, sets `agreed_price` |
| Set meetup | Either | `meetup_scheduled`, sets location/time |
| Mark completed | Both confirm (or seller, with buyer confirm) | `completed`, sets `completed_at` |
| Cancel | Either | `cancelled` |
| Dispute | Either (after agreed) | `disputed`, creates a report |

**Atomic completion:** a Postgres function `complete_transaction(txn_id)` verifies the caller is a participant, checks the transition is legal, sets `completed`, marks the listing `sold` (with `sold_at`) and closes other open transactions for that listing, all in one transaction. This prevents double-selling.

**Transition rules** are enforced in the database function, not only in the UI.

### 8.5 Reporting and Moderation
- Any verified user can insert a report against a listing, user, message or transaction.
- Admins work a queue per campus, with actions: dismiss, remove listing, warn, suspend user.
- Admin actions are written to an `admin_audit_log` table (who, what, target, when).

---

## 9. Storage

| Bucket | Access | Notes |
|---|---|---|
| `listing-images` | Public read via CDN-style URLs, owner write | Path: `{campus_id}/{listing_id}/{uuid}.webp` |
| `avatars` | Public read, owner write | Optional in MVP |

- Client-side compression and resize before upload (target long edge about 1280 px, WebP/JPEG).
- Limits: max 5 images per listing, max size per image enforced by bucket policy and client check.
- Deleting a listing removes its storage objects (via function or scheduled cleanup).

---

## 10. Notifications

### 10.1 MVP
- **Transactional email and in-app:** OTP, new chat message (rate-limited and batched so a long chat does not send one email per message), transaction status changes.

### 10.2 Phase 3: Personalized Notifications
```text
User activity (search / view / save / chat / purchase / manual)
        ↓
user_interests (interest_score updated)
        ↓
New listing created ──► matcher (Edge Function / scheduled job)
        ↓
Relevance threshold + deduplication + frequency limits
        ↓
notification_events (queued / suppressed)
        ↓
Instant send, or batched into daily / weekly digest
        ↓
Email provider
```

**Scoring (initial, no ML):** each activity type adds a weighted increment to the `(user, category, keyword)` score, with time decay. Weights, for example: purchase > chat > save > view > search. A listing is notified only if its match score exceeds a configurable threshold.

**Protections against spam:**
- Opt-in by default (`email_enabled = false`)
- Per-user daily/weekly send caps
- Deduplication on `(user_id, listing_id, notification_type)`
- Digest grouping
- One-click unsubscribe in every email
- Transactional emails sent independently of recommendation preferences

**Execution:** scheduled via Supabase Cron (`pg_cron`) invoking Edge Functions for digests; database triggers or a queue for instant alerts.

---

## 11. Security

| Area | Approach |
|---|---|
| Transport | HTTPS everywhere (Vercel, Supabase) |
| Authorization | RLS on all tables; admin actions via role-checked functions |
| Secrets | Service-role key only in server env (Vercel/Edge Functions); never in client bundles |
| Input validation | zod on every Server Action and route handler; DB constraints as backstop |
| Rate limiting | OTP requests, message sends and listing creation (Supabase limits plus app-level or edge rate limiting) |
| XSS | React escaping; no raw HTML rendering of user content |
| File uploads | MIME and size checks; storage path scoped by campus and listing |
| Privacy | No phone numbers or emails exposed on public listings; contact happens through in-app chat |
| Abuse | Reports, suspension, banned-item checks at listing creation (keyword list first) |
| Audit | `admin_audit_log` for all moderation and role actions |
| Backups | Supabase daily backups; test a restore before public launch |

---

## 12. Performance and Scalability

- Expected MVP scale: hundreds of users, thousands of listings. A single Supabase project is more than sufficient.
- Feed queries use the composite index `(campus_id, status, created_at desc)`; cursor pagination, not offset.
- Images compressed client-side and served from Storage with caching headers.
- Realtime subscriptions are scoped per chat to limit fan-out.
- **Growth path:** read replicas and connection pooling (Supabase pooler) → dedicated search (Typesense/Meilisearch/pg_trgm) → queue worker for notifications → separate mobile client against the same API and schema.

---

## 13. Environments and Deployment

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | Supabase CLI local stack, `.env.local` |
| Preview | Per pull request | Vercel preview + shared staging Supabase project |
| Staging | Pre-release testing | Separate Supabase project with seed data |
| Production | Pilot campus | Separate Supabase project and Vercel production deployment |

- **Schema changes:** SQL migrations in `supabase/migrations`, applied via CI; never edited by hand in production.
- **CI:** type-check, lint, unit tests, and migration dry-run on every pull request.
- **Config:** environment variables for Supabase URL/keys, email provider key, and (Phase 3) payment keys.

---

## 14. Observability

| Need | Tool |
|---|---|
| Frontend errors | Sentry (or equivalent) |
| Server and Edge Function logs | Vercel and Supabase logs |
| Product analytics | PostHog or similar, tracking the funnel events below |
| Uptime | Basic uptime monitor on the production URL |

### Analytics Events (mapped to PRD metrics)
`signup_started`, `email_verified`, `listing_created`, `listing_viewed`, `search_performed`, `chat_started`, `message_sent`, `transaction_created`, `deal_agreed`, `meetup_scheduled`, `transaction_completed`, `report_submitted`.

Liquidity rate, time to sell and the transaction funnel can be computed from the database (`listings`, `chats`, `transactions`) via SQL views, so they do not depend on client analytics being complete.

---

## 15. Phase 3 and 4 Extension Points

| Future feature | How the architecture accommodates it |
|---|---|
| Platform payments (Razorpay/Stripe) | `payment_method = 'platform'`, new `payments` and `payouts` tables, webhook route handler, escrow states added to `transaction_status` |
| Cross-campus browsing | Remove the campus filter via a user preference; RLS read policy widened to approved campuses |
| Wanted posts | New `wanted_posts` table, matched against new listings by the notification matcher |
| Deal check-in and safe-zone map | `buyer_arrived` and `seller_arrived` states and `safe_zones` table already exist; UI added later |
| Mobile app | Same Supabase backend and RLS; shared zod validators and API surface |
| AI moderation | Async job on listing creation writing to a `moderation_flags` table; admin queue consumes it |
| ID OCR verification | New verification path writing to `verification_status`; image stored in a private bucket |
| Listing boosts | `boosted_until` column on listings; feed ordering updated |

---

## 16. Key Decisions

| # | Decision | Rationale | Trade-off |
|---|---|---|---|
| 1 | Supabase as the single backend | Auth, DB, Realtime and Storage in one place; fastest path to MVP | Vendor coupling; mitigated by standard Postgres |
| 2 | RLS as the main authorization layer | Enforced even if app code has a bug | Policies need careful testing |
| 3 | Postgres full-text search for MVP | No extra infrastructure | Less typo-tolerant than a search engine |
| 4 | One chat per (listing, buyer) | Keeps conversations tied to an item | Buyer messaging the same seller about several items has several chats |
| 5 | Transactions modeled separately from listings | Supports history, disputes, metrics and later payments | Extra table and state machine |
| 6 | State transitions in Postgres functions | Atomic, no double-selling | Logic in SQL needs tests |
| 7 | Personalization via simple scoring | Fast, explainable, no ML infrastructure | Lower accuracy than ML; acceptable for pilot scale |
| 8 | Web-first, mobile later | Validates demand cheaper | Fewer native features (push) initially |

---

## 17. Open Technical Questions

1. Email provider: Supabase built-in SMTP vs Resend (deliverability to college domains)?
2. How are non-standard college email domains and alumni handled during verification?
3. Should listings expire automatically after N days of inactivity?
4. Can a seller sell to a buyer who never chatted (for example an in-person agreement)? If yes, `transactions.chat_id` stays nullable.
5. Is profanity or banned-keyword filtering needed at listing creation for the pilot?
6. Data retention: how long are messages and reports kept after a transaction closes?
7. Is push notification support (web push) needed before Phase 4?
