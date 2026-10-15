# Campus Marketplace Platform: Project Memory

| | |
|---|---|
| **Purpose** | Durable project context for developers and AI coding agents: decisions, assumptions, glossary, gotchas, open questions and a session log |
| **Read** | At the start of every working session, after Rules.md |
| **Write** | At the end of any task that produced a decision, assumption, gotcha or open question |
| **Related docs** | PRD.md, Architecture.md, Rules.md, Tasks.md (Design.md pending) |
| **Last updated** | 2026-10-10 |

**How to use this file**
- This file records *what was decided and why*, not what the code does.
- Add entries; do not rewrite history. If a decision changes, add a new entry that supersedes the old one and mark the old one `Superseded by D-xx`.
- Keep entries short. Link to the PRD requirement ID or task ID where relevant.
- Never store secrets, credentials, personal data or real student information here.

---

## 1. Project Snapshot

| Item | Current state |
|---|---|
| Product | Campus-verified, hyperlocal student marketplace (face-to-face transactions) |
| Strategy | One campus. One category. High liquidity. Then expand. |
| Current phase | Phase 0, Validation complete / moving to Phase 1 setup |
| Pilot campus | School of Planning and Architecture Vijayawada (SPAV) |
| Entry category | Thrift Store / Online Buys (pre-owned fashion, accessories, lifestyle gear, dorm essentials) |
| Stack | Next.js + Tailwind, Supabase (Auth, Postgres, Realtime, Storage), Vercel |
| Documents complete | PRD.md, Architecture.md, Rules.md, Memory.md, Tasks.md, Design.md (draft v0.1) |
| Documents pending | None (PRD changes proposed in Design.md §14 still to be applied) |
| First milestone | 100–200 verified students → 50+ listings → 20+ completed transactions within 4 weeks |

---

## 2. Decision Log

Format: `D-xx | date | decision | reason | source`

| ID | Date | Decision | Reason | Source |
|---|---|---|---|---|
| D-01 | 2026-10-10 | Do not position the product as "OLX for college students." Position it as a verified campus exchange network. | Differentiates on trust and campus focus | Product doc §1 |
| D-02 | 2026-10-10 | Launch on one campus and one primary category before expanding. | Liquidity is the main risk; a thin marketplace feels dead | Product doc §5, §15 |
| D-03 | 2026-10-10 | Transactions are in-person only. No shipping or logistics. | Simplicity; fits campus use case | Product doc §5 |
| D-04 | 2026-10-10 | Payments in MVP are outside the platform (cash/UPI). Platform payments, escrow and commission wait for Phase 3. | Avoid payment friction and legal complexity during pilot | Product doc §11 |
| D-05 | 2026-10-10 | One account can both buy and sell. | Reduces friction; matches student behavior | Product doc §5 |
| D-06 | 2026-10-10 | Student verification via college email domain + OTP, with manual admin approval for exceptions. ID OCR is Phase 4. | Fastest credible verification | Product doc §7, §10 |
| D-07 | 2026-10-10 | Supabase as the single backend (Auth, Postgres, Realtime, Storage). | Fewest moving parts for MVP | Architecture §2, §16 |
| D-08 | 2026-10-10 | Authorization enforced with Postgres RLS; privileged profile fields (`role`, `verification_status`, `is_suspended`, `campus_id`) are not user-editable. | Security holds even if app code has a bug | Architecture §7, Rules P-3 |
| D-09 | 2026-10-10 | Transactions are a separate entity from listings and chats. | Supports history, disputes, metrics, later payments | Architecture §5 |
| D-10 | 2026-10-10 | Completing a transaction and marking the listing sold happen atomically in one Postgres function. | Prevents double-selling | Architecture §8.4, Rules P-11 |
| D-11 | 2026-10-10 | One chat per `(listing, buyer)`. | Keeps chats tied to an item | Architecture §16 |
| D-12 | 2026-10-10 | Search in MVP uses Postgres full-text search. | No extra infrastructure | Architecture §16 |
| D-13 | 2026-10-10 | Personalized notifications (interest scoring, alerts, digests) are Phase 3. MVP has only basic transactional notifications (OTP, new message, transaction status). | Source roadmap lists "advanced notifications" as post-pilot; the product doc's MVP also includes "Basic notifications" | PRD §8, §9.1 |
| D-14 | 2026-10-10 | Recommendation emails are opt-in by default, with frequency caps, relevance threshold, deduplication, digests and one-click unsubscribe. | Avoid notification fatigue | Product doc §10 (Personalized Notifications), Rules P-18 to P-21 |
| D-15 | 2026-10-10 | Roles are Student, Campus Admin, Platform Admin. Campus Admin is scoped to their own campus. | Prevent admin abuse | Product doc §10 (Trust & Safety) |
| D-16 | 2026-10-10 | `buyer_arrived` / `seller_arrived` statuses exist in the schema but are hidden from the UI until Phase 4. | Schema ready for check-ins without building them early | Architecture §5.2, Rules P-14 |
| D-17 | 2026-10-10 | Design.md is deferred. The three core screens (Feed, Listing Detail, Chat) still need design before UI build starts. | User chose to prioritize Memory and Tasks first. Superseded by D-19 | Session 2026-10-10 |
| D-19 | 2026-10-10 | Design direction is minimalistic and study-oriented: warm paper background, one muted ink-blue accent, serif headings with sans body, hairline borders, minimal motion, light theme only for MVP. Design.md written. | Audience is students; early categories are study items; keeps the app fast on modest phones | Design.md |
| D-20 | 2026-10-10 | Study-detail listing fields (subject, semester, edition), a single-column list feed default and a tuned category list are proposed but not yet in the PRD. | Support course-specific discovery; needs a PRD update before build | Design.md §14 |
| D-18 | 2026-10-10 | Source product document had duplicate section numbers (two §10, two §11, two §9.3). The PRD renumbers them. | Avoid confusing cross-references | PRD §16 |
| D-21 | 2026-10-15 | Pilot campus is School of Planning and Architecture Vijayawada (SPAV). Student email domain restriction is relaxed/open for pilot testing. | Selected by founder; allows rapid onboarding during pilot | Session 2026-10-15 (OQ-1, OQ-8) |
| D-22 | 2026-10-15 | Primary launch entry category is "Thrift Store / Online Buys" (pre-owned fashion, dorm essentials, lifestyle goods bought online). | High student enthusiasm and liquidity turnover | Session 2026-10-15 (OQ-2) |
| D-23 | 2026-10-15 | Meetup spots are self-coordinated by students instead of enforced predefined campus safe zones. | Reduces friction and matches campus culture | Session 2026-10-15 (OQ-3) |
| D-24 | 2026-10-15 | Enable quick WhatsApp reachout from listings with pre-filled enquiry text (`wa.me/?text=...`) alongside platform messaging. | Students rely heavily on WhatsApp for rapid communication | Session 2026-10-15 (OQ-5) |
| D-25 | 2026-10-15 | Listing expiry window set to 30 days of inactivity. | Keeps marketplace fresh and removes stale inventory | Session 2026-10-15 (OQ-4) |
| D-26 | 2026-10-15 | No automated keyword filtering at listing creation for pilot. Rely on post-creation reporting. | Keeps listing creation fast and frictionless | Session 2026-10-15 (OQ-10) |

---

## 3. Assumptions

These were made while drafting and have **not been confirmed**. Confirm or correct each one.

| ID | Assumption | Impact if wrong | Status |
|---|---|---|---|
| A-01 | New listings are visible immediately, with moderation after the fact. | Would need a pre-approval queue and "pending" listing state | Unconfirmed |
| A-02 | Image limit is 5 per listing; images compressed in-browser. | UI and storage limits change | Unconfirmed |
| A-03 | Mark-as-completed requires both parties to confirm (seller can mark sold directly, via the same function). | Transaction flow and UI change | Unconfirmed |
| A-04 | Chat email notifications are batched/rate-limited, not sent per message. | Email volume and provider cost | Unconfirmed |
| A-05 | Moderation response targets: same day for banned items and harassment, 2 days for spam/misleading, 3 days for disputes. | Admin staffing expectation | Unconfirmed |
| A-06 | Display currency is INR (₹) and times shown in IST. | Formatting | Likely correct |
| A-07 | Hosting regions and data residency are not constrained. | Supabase/Vercel region choice | Unconfirmed |
| A-08 | The pilot campus uses one or a few email domains that can be listed in `campuses.email_domains`. | Verification flow needs more manual review | Unconfirmed |

---

## 4. Open Questions

Format: `OQ-xx | question | owner | needed by`. Move to the Decision Log once answered.

### Product
| ID | Question | Owner | Needed by | Status |
|---|---|---|---|---|
| OQ-1 | Which campus is the pilot campus? | Founder | Before Phase 0 ends | **Resolved (D-21): SPAV** |
| OQ-2 | Which category is the primary entry category? | Founder | Before Phase 0 ends | **Resolved (D-22): Thrift Store / Online Buys** |
| OQ-3 | What are the real meetup locations on the pilot campus? | Founder | Before Phase 1 UI copy | **Resolved (D-23): Flexible / self-decided by students** |
| OQ-4 | How long should an inactive or sold listing stay visible before expiring? | Founder | Before launch | **Resolved (D-25): 30 days** |
| OQ-5 | Can sellers add a phone or UPI handle to their profile, or does all contact stay in chat? | Founder | Before profile screen | **Resolved (D-24): WhatsApp reachout enabled** |
| OQ-6 | Who are the first Campus Admins, and what response time can they commit to? | Founder | Before pilot | Open |

### Technical
| ID | Question | Owner | Needed by | Status |
|---|---|---|---|---|
| OQ-7 | Email provider: Supabase SMTP vs Resend, and deliverability to college domains? | Dev | Before auth task | Open |
| OQ-8 | How are non-standard college email domains and alumni handled? | Founder + Dev | Before auth task | **Resolved (D-21): Relaxed domain checks for pilot** |
| OQ-9 | Can a transaction exist without a chat (`transactions.chat_id` nullable)? | Dev | Before transaction task | Open |
| OQ-10 | Is a banned-keyword filter needed at listing creation for the pilot? | Founder + Dev | Before listing task | **Resolved (D-26): No filter at creation; post-report** |
| OQ-11 | Retention period for messages and reports. | Founder | Before public launch | Open |
| OQ-12 | Is web push needed before Phase 4? | Founder | Phase 2 review | Open |

### Legal and operational
| ID | Question | Owner | Needed by |
|---|---|---|---|
| OQ-13 | Terms of Service and banned-items policy wording; any college permission needed to operate on campus? | Founder | Before public launch |
| OQ-14 | Legal and tax implications of platform payments and commission (Phase 3). | Founder | Phase 3 planning |

---

## 5. Glossary

| Term | Meaning |
|---|---|
| Campus-first | Default feed and search show only the user's own campus |
| Liquidity | How reliably listings turn into completed transactions |
| Liquidity rate | Listings with a completed transaction ÷ listings created × 100 |
| Time to sell | Average time from listing creation to completed transaction |
| Seed seller | A student recruited before launch to provide initial listings |
| Listing Party | Campus event where students are helped to list several items quickly (target: 5–10 seed sellers → 50+ listings) |
| Entry category | The single category the launch focuses on |
| Wanted post | Buyer-created request for an item that is not currently listed (Phase 3) |
| Deal check-in | Both parties confirm arrival at the meetup before completion (Phase 4) |
| Safe zone | Recommended public meetup location on a campus |
| Campus Admin | Moderator scoped to one campus |
| Platform Admin | Admin with platform-wide access |
| RLS | PostgreSQL Row Level Security, the main authorization layer |
| Transactional notification | Required message such as OTP, new message or transaction update |
| Recommendation notification | Optional, opt-in message based on interests |

---

## 6. Gotchas and Lessons

Add entries as they are discovered. Seed items below come from design review, not from implementation yet.

| ID | Gotcha | Why it matters |
|---|---|---|
| G-01 | RLS can silently return zero rows instead of an error when a policy blocks access. | Debug by testing as a specific user, not with the service role |
| G-02 | Supabase Realtime respects RLS; a missing or wrong policy can mean chat messages do not arrive. | Test chat with two real accounts |
| G-03 | Using the service-role key bypasses RLS. | Keep it server-only; never use it for ordinary user requests |
| G-04 | A generated `tsvector` column is only updated when its source columns change. | Re-index after changing the search expression |
| G-05 | Per-message emails will spam users in an active chat. | Batch or rate-limit chat notifications |
| G-06 | College email domains may be strict about OTP delivery (spam filters). | Test delivery on the real pilot domain early |
| G-07 | Offset pagination degrades and shows duplicates as the feed changes. | Use cursor pagination |

---

## 7. Risks Being Watched

| Risk | Early signal | Response |
|---|---|---|
| Empty marketplace at launch | Fewer than 50 listings a week before launch | More Listing Parties; delay public launch |
| Low conversion from chat to transaction | Many chats, few completed deals | Review transaction funnel; add meetup/reminder nudges |
| Users stay on WhatsApp | Seed sellers keep posting elsewhere | Make listing faster; share listings out to WhatsApp |
| Fake or unverified users | Reports or manual-review volume rising | Tighten verification; add ID check earlier |
| Admin overload | Report queue age growing | Add Campus Admin volunteers; automate banned-keyword checks |
| Scope creep | Tasks without a PRD requirement ID | Enforce Rules.md §3 |

---

## 8. Session Log

Newest first. One entry per working session.

### 2026-10-15
- Phase 0 validation alignment with founder:
  - Selected School of Planning and Architecture Vijayawada (SPAV) as pilot campus (D-21).
  - Selected "Thrift Store / Online Buys" (pre-owned fashion, lifestyle gear, dorm essentials) as primary entry category (D-22).
  - Adopted flexible student-decided meetup spots (D-23).
  - Decided on WhatsApp quick-outreach integration with pre-filled enquiry text (D-24).
  - Set listing expiry window to 30 days (D-25).
  - Kept listing creation unfiltered for frictionless posting, relying on reporting (D-26).
- Next: Update Tasks.md, then proceed to scaffold Next.js app and Supabase setup (Phase 1).

### 2026-10-10
- Drafted PRD.md, Architecture.md and Rules.md from `product_document.md`.
- Created Memory.md and Tasks.md.
- Skipped Design.md for now (D-17).
- Interpretation notes: Rules.md was written as developer/AI-agent rules plus enforceable product rules (the community-facing guidelines are summarized in Rules §9); PRD renumbers the source doc's duplicate sections (D-18).
- Next: decide pilot campus and entry category (OQ-1, OQ-2), then begin Phase 0 tasks in Tasks.md.

---

## 9. Entry Template

Copy for new entries.

```text
Decision:   D-xx | date | decision | reason | source
Assumption: A-xx | assumption | impact if wrong | status
Question:   OQ-xx | question | owner | needed by
Gotcha:     G-xx | gotcha | why it matters
Session:    ### YYYY-MM-DD, what was done, what changed, what is next
```
