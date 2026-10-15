# Campus Marketplace Platform: Tasks

| | |
|---|---|
| **Purpose** | Working backlog, traced to PRD requirements |
| **Inputs** | PRD.md, Architecture.md, Rules.md, Memory.md |
| **Last updated** | 2026-10-10 |

## How to use this file

**Status:** `[ ]` to do · `[~]` in progress · `[x]` done · `[!]` blocked
**Priority:** P0 must ship for pilot · P1 should ship · P2 nice to have
**Size:** S under half a day · M about 1 day · L 2–3 days · XL split it further
**Covers:** the PRD requirement ID(s) the task delivers. Per Rules §3, a task without a PRD ID must not be started.
**Needs:** tasks that must finish first.

Update the status here when work starts and finishes. Record decisions and surprises in Memory.md.

---

## Current Focus

1. Phase 0: School of Planning and Architecture Vijayawada (SPAV) chosen as pilot campus; "Thrift Store / Online Buys" selected as entry category.
2. Next: Set up repository & scaffold Next.js App Router project (T016), Supabase project configuration (T015, T017), and UI implementation.

---

## Phase 0: Validation (2–3 weeks)

**Goal:** prove students want this and pick the entry point.
**Exit criteria:** 15 of 30 interviewed students show meaningful interest · 5+ committed seed sellers · 50+ potential items identified · one entry category chosen.

| ID | Task | Pri | Size | Status | Notes |
|---|---|---|---|---|---|
| T001 | Select the pilot campus | P0 | S | [x] | SPAV (School of Planning and Architecture Vijayawada) (D-21) |
| T002 | Select the primary entry category | P0 | S | [x] | Thrift Store / Online Buys (pre-owned fashion & lifestyle) (D-22) |
| T003 | Write the interview script (current buying/selling channels, typical prices, meetup spots, trust and discovery pain) | P0 | S | [ ] | |
| T004 | Interview 20–30 students and log results | P0 | L | [ ] | Needs T003. Target: 15 of 30 show meaningful interest |
| T005 | Summarize findings: channels used, price ranges, meetup locations, biggest trust and discovery problems | P0 | M | [ ] | Needs T004. Answers OQ-3 (self-coordinated) |
| T006 | Recruit 5–10 seed sellers | P0 | L | [ ] | Needs T001. Target: 5 committed minimum |
| T007 | Build a list of 50+ potential launch items | P0 | M | [ ] | Needs T006 |
| T008 | Draft the banned-items policy | P0 | M | [ ] | Reference Rules §9 and PRD §11. Answers part of OQ-13 |
| T009 | Draft basic Terms of Service | P0 | M | [ ] | Needs T008. Check any college permission required (OQ-13) |
| T010 | Confirm pilot campus email domain(s) and test OTP delivery to them | P0 | S | [ ] | Relaxed for pilot (D-21) |
| T011 | Identify and ask Campus Admin volunteers; agree on response times | P1 | S | [ ] | Answers OQ-6 |
| T012 | Review Phase 0 results against exit criteria and decide go / adjust | P0 | S | [ ] | Needs T005, T006, T007 |

---

## Phase 1: MVP Build (6–8 weeks)

**Goal:** a working, mobile-responsive marketplace with the full loop: verified student → listing → discovery → chat → transaction → sold.

> **Design note:** Design.md is deferred (Memory D-17). Before the first UI task (E3 onward), produce quick wireframes for the three core screens: Feed, Listing Detail, Chat (task T013).

### Epic E0: Setup and Foundations

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T013 | Wireframe the three core screens (Feed, Listing Detail, Chat) at mobile width | Product doc §16 | P0 | M | [ ] | none |
| T014 | Create the GitHub repository, branch protection on `main`, PR template | Rules §7 | P0 | S | [ ] | none |
| T015 | Create Supabase projects: staging and production | Arch §13 | P0 | S | [ ] | none |
| T016 | Scaffold Next.js (App Router) + TypeScript (strict) + Tailwind | Arch §4 | P0 | M | [ ] | T014 |
| T017 | Set up Supabase clients (browser, server, admin) and environment variable handling | Arch §3, Rules S-1, S-2 | P0 | M | [ ] | T015, T016 |
| T018 | Set up CI: type-check, lint, tests, migration dry-run | Rules G-5 | P0 | M | [ ] | T016 |
| T019 | Connect Vercel: preview deploys per PR, production from `main` | Arch §13 | P0 | S | [ ] | T016 |
| T020 | Set up error tracking and basic uptime monitoring | Arch §14 | P1 | S | [ ] | T019 |
| T021 | Set up product analytics and the event list | Arch §14 | P1 | M | [ ] | T019 |

### Epic E1: Database and Security Baseline

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T022 | Migration: enums, `campuses`, `profiles` (with privileged-field protection) | ACC-3, TNS-6, Rules P-3 | P0 | M | [ ] | T015 |
| T023 | Migration: `listings`, `listing_images`, indexes, `search_tsv` | LST-1, DSC-2 | P0 | M | [ ] | T022 |
| T024 | Migration: `chats`, `messages` + `last_message_at` trigger | COM-1, COM-2 | P0 | M | [ ] | T023 |
| T025 | Migration: `transactions` with status enum | TXN-2 | P0 | M | [ ] | T024 |
| T026 | Migration: `reports`, `safe_zones`, `admin_audit_log` | TNS-1, TNS-2, ADM-3 | P0 | M | [ ] | T022 |
| T027 | RLS helper functions (`is_verified`, `current_role`, `current_campus`) | Arch §7 | P0 | S | [ ] | T022 |
| T028 | RLS policies for every table, written with each table | Rules D-3 | P0 | L | [ ] | T027, T023–T026 |
| T029 | RLS test suite: users cannot read others' chats or transactions, cannot edit privileged fields, unverified/suspended users blocked | Rules §6 | P0 | L | [ ] | T028 |
| T030 | Seed script: campuses (with email domains), test users, sample listings, safe zones | Arch §4.1 | P1 | M | [ ] | T022 |

### Epic E2: Accounts and Verification

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T031 | Decide email provider (Supabase SMTP vs Resend) and configure OTP emails | ACC-1, OQ-7 | P0 | M | [ ] | T010, T015 |
| T032 | Sign-in with college email + OTP; server-side domain check against `campuses` | ACC-1 | P0 | L | [ ] | T031, T022 |
| T033 | Trigger to create `profiles` row and set campus and verification status | ACC-2, ACC-3 | P0 | M | [ ] | T032 |
| T034 | Campus select/confirm screen | ACC-2 | P0 | S | [ ] | T033 |
| T035 | Profile screen (name, campus, verification status) | ACC-3 | P0 | M | [ ] | T033 |
| T036 | "Request manual review" flow for unrecognized email domains | ACC-5 | P0 | M | [ ] | T032, T040 |
| T037 | Gate: unverified/suspended users cannot list, chat or transact (UI + RLS) | ACC-4 | P0 | M | [ ] | T028, T033 |
| T038 | Route guards and session handling | ACC-4 | P0 | M | [ ] | T032 |

### Epic E3: Admin Basics (needed early for verification)

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T039 | Admin layout and role guard (student / campus_admin / platform_admin, campus-scoped) | TNS-6 | P0 | M | [ ] | T038, T028 |
| T040 | User verification queue (approve / reject) with audit log | ADM-1 | P0 | M | [ ] | T039, T026 |
| T041 | User management (suspend / restore) with audit log | ADM-4 | P0 | M | [ ] | T039 |
| T042 | Platform-admin-only role change function | Rules P-5 | P1 | S | [ ] | T039 |

### Epic E4: Listings

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T043 | Image upload: storage bucket, policies, signed upload URLs | LST-1 | P0 | M | [ ] | T015, T023 |
| T044 | Client-side image compression and preview | LST-6 | P1 | M | [ ] | T043 |
| T045 | Create-listing form (title, description, price, category, condition, photos) with zod validation | LST-1, LST-2, LST-3 | P0 | L | [ ] | T037, T043, T013 |
| T046 | Banned-items notice on the listing form (and keyword check if OQ-10 says yes) | TNS-4 | P0 | S | [ ] | T045, T008 |
| T047 | Edit and delete own listing (including storage cleanup) | LST-4 | P0 | M | [ ] | T045 |
| T048 | Mark listing as sold (through the shared transaction function) | LST-5, TXN-5 | P0 | S | [ ] | T061 |
| T049 | My listings page | LST-4 | P1 | M | [ ] | T045 |

### Epic E5: Discovery

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T050 | Campus feed with cursor pagination | DSC-1 | P0 | L | [ ] | T045, T013 |
| T051 | Full-text search | DSC-2 | P0 | M | [ ] | T050 |
| T052 | Category and price filters | DSC-3 | P0 | M | [ ] | T050 |
| T053 | Listing detail page (server-rendered, shareable) | DSC-4 | P0 | M | [ ] | T045, T013 |
| T054 | Hide or mark sold listings in feed | DSC-5 | P0 | S | [ ] | T048 |
| T055 | Loading, empty and error states for feed, search and detail | Rules F-4 | P0 | M | [ ] | T050–T053 |

### Epic E6: Chat

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T056 | "Message seller" action: get-or-create chat per (listing, buyer) | COM-2 | P0 | M | [ ] | T053, T037 |
| T057 | Chat list and chat thread UI with Realtime subscription | COM-1 | P0 | L | [ ] | T056, T013 |
| T058 | New-message notifications (in-app and rate-limited email) | COM-3 | P0 | M | [ ] | T057, T031 |
| T059 | Chat: send failure handling and retry | Rules L-3 | P1 | S | [ ] | T057 |

### Epic E7: Transactions

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T060 | Postgres functions for each state transition, with legality checks | TXN-3, Rules P-12 | P0 | L | [ ] | T025, T028 |
| T061 | `complete_transaction` function: atomic complete + mark listing sold + close others | TXN-5, Rules P-11 | P0 | L | [ ] | T060 |
| T062 | Tests: every legal and illegal transition, plus double-sell | Rules §6 | P0 | M | [ ] | T061 |
| T063 | "Create transaction" from chat; agreed price, payment method, meetup location/time | TXN-1, TXN-2, TXN-6 | P0 | L | [ ] | T057, T060 |
| T064 | Transaction detail screen with status actions (agree, schedule, complete, cancel, dispute) | TXN-3, TXN-4 | P0 | L | [ ] | T063 |
| T065 | Transaction status notifications | COM-3 | P1 | M | [ ] | T064 |
| T066 | Safe-meetup guidance copy in chat and transaction flow | TNS-5 | P1 | S | [ ] | T064, OQ-3 |

### Epic E8: Trust and Safety and Moderation

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T067 | Report listing | TNS-1 | P0 | M | [ ] | T053, T026 |
| T068 | Report user | TNS-2 | P0 | M | [ ] | T035, T026 |
| T069 | Report message and suspicious transaction | TNS-3 | P1 | M | [ ] | T057, T064 |
| T070 | Admin report queue (filter by status, campus; banned-item reports first) | ADM-3 | P0 | L | [ ] | T067, T039 |
| T071 | Admin listing moderation (review, remove with reason, notify seller) | ADM-2 | P0 | M | [ ] | T070 |
| T072 | Admin audit log viewer | Rules S-6 | P1 | M | [ ] | T040 |

### Epic E9: Quality and Pilot Readiness

| ID | Task | Covers | Pri | Size | Status | Needs |
|---|---|---|---|---|---|---|
| T073 | Rate limiting: OTP, messages, listing creation | Rules S-4 | P0 | M | [ ] | T032, T057, T045 |
| T074 | SQL views for liquidity rate, time to sell and transaction funnel | PRD §12 | P1 | M | [ ] | T061 |
| T075 | Admin metrics page (pilot dashboard) | PRD §12 | P1 | M | [ ] | T074, T039 |
| T076 | Mobile pass: test all screens at 360 px on real devices | Rules F-1 | P0 | M | [ ] | all UI tasks |
| T077 | End-to-end test of the full flow on staging with 2 users + 1 admin | Rules T-3 | P0 | M | [ ] | all P0 tasks |
| T078 | Publish Terms of Service and banned-items policy in the app | PRD §11 | P0 | S | [ ] | T008, T009 |
| T079 | Backup and restore test | Rules §13 | P0 | S | [ ] | T015 |
| T080 | Security review: RLS audit, secrets check, service-role key usage | Rules §5 | P0 | M | [ ] | T029 |
| T081 | Define data retention period for messages and reports | Rules R-6, OQ-11 | P1 | S | [ ] | none |
| T082 | Production deployment and smoke test | Arch §13 | P0 | M | [ ] | T077, T080 |

**Phase 1 exit criteria:** all P0 tasks done · Phase 1 Release Gate in Rules §13 satisfied.

---

## Phase 2: Pilot Launch (4 weeks)

**Goal:** real transactions on one campus.
**Targets:** 100–200 verified users · 50+ active listings · 20+ completed transactions · 50–100 listings available at launch.

| ID | Task | Pri | Size | Status | Needs |
|---|---|---|---|---|---|
| T083 | Plan and run Listing Party #1 (5–10 seed sellers → 50+ listings) | P0 | L | [ ] | T006, T082 |
| T084 | Recruit and brief student ambassador(s) | P0 | M | [ ] | T001 |
| T085 | Campus promotion: posters, stall, WhatsApp group seeding | P0 | L | [ ] | T082 |
| T086 | Controlled launch to 100–200 verified students | P0 | M | [ ] | T083 |
| T087 | Weekly feedback sessions with users; log insights in Memory.md | P0 | M | [ ] | T086 |
| T088 | Weekly metrics review: liquidity rate, time to sell, funnel drop-offs, report rate | P0 | S | [ ] | T075 |
| T089 | Triage and fix pilot bugs (rolling) | P0 | L | [ ] | T086 |
| T090 | Moderation duty rota and response-time tracking | P0 | S | [ ] | T011 |
| T091 | Pilot review: compare to targets and decide go / adjust / stop for Phase 3 | P0 | M | [ ] | T088 |

---

## Phase 3: Growth and Payments (backlog, 8–12 weeks)

Do not start until Phase 2 shows repeatable liquidity. Tasks are outlined only; break them down when Phase 3 begins.

| Epic | Scope |
|---|---|
| Personalized notifications | `user_interests`, `notification_preferences`, `notification_events` migrations; interest scoring; new-listing alerts, wanted-item matches, price alerts, digests; preferences screen; frequency caps, deduplication, one-click unsubscribe; notification metrics |
| Saved items | `saved_listings`, `saved_searches` |
| Wanted posts | `wanted_posts` table, UI, matching against new listings |
| Multi-campus expansion | Onboard 2–4 campuses, campus ambassadors, referral system, cross-campus browsing |
| Payments | Razorpay/Stripe integration, `payments` and `payouts`, escrow-style states where legally appropriate, dispute handling (resolve OQ-14 first) |
| Monetization | Listing boosts, transaction commission, campus advertising |

---

## Phase 4: Scale and Mobile (backlog, ongoing)

React Native / Flutter app · 10+ campuses · advanced cross-campus discovery · student project showcase · AI-assisted moderation · advanced recommendations · Verified Seller badge · safe-zone map and deal check-in (`buyer_arrived`, `seller_arrived`) · graduation / bulk listing tools · ID card upload with OCR verification.

---

## Design Backlog (deferred)

| ID | Task | Pri | Status |
|---|---|---|---|
| TD01 | Write Design.md (visual language, components, spacing, copy tone) | P1 | [x] Draft v0.1 done (Memory D-19); confirm open questions in Design.md §15 |
| TD02 | Build a small component library from Design.md | P1 | [ ] Needs TD01 |
| TD03 | Empty-state, error-state and notification copy review | P2 | [ ] Needs TD01 |

---

## Suggested Build Order (Phase 1)

```text
Week 1    E0 setup + E1 database baseline + wireframes (T013)
Week 2    E1 RLS and tests + E2 sign-in and verification
Week 3    E3 admin verification + E4 listings (create, upload, edit)
Week 4    E5 feed, search, filters, detail
Week 5    E6 chat + notifications
Week 6    E7 transactions (functions first, then UI)
Week 7    E8 reports and moderation + E9 rate limits, metrics
Week 8    E9 mobile pass, end-to-end test, security review, deploy
```

Phase 0 runs in parallel with Weeks 1–2 where possible. T010 (OTP delivery test on the real college domain) should happen before T031.

---

## Dependency Highlights

- **T001 / T002 (campus and category)** unblock seed seller recruitment, email domain setup, seed data and launch planning.
- **T028 / T029 (RLS and its tests)** gate every feature that touches user data.
- **T060 / T061 (transaction functions)** gate the "sold" flow and the transaction UI.
- **T013 (wireframes)** gates all UI tasks even though Design.md is deferred.

---

## Progress Summary

| Phase | Tasks | Done | In progress | Blocked |
|---|---:|---:|---:|---:|
| Phase 0 | 12 | 0 | 0 | 0 |
| Phase 1 | 70 | 0 | 0 | 0 |
| Phase 2 | 9 | 0 | 0 | 0 |
| Design backlog | 3 | 0 | 0 | 0 |

*Update these counts when statuses change.*
