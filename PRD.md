# Campus Marketplace Platform: Product Requirements Document (PRD)

| | |
|---|---|
| **Status** | Draft v0.1 |
| **Source** | `product_document.md` |
| **Related docs** | Architecture.md, Rules.md, Design.md, Tasks.md, Memory.md |
| **Last updated** | 2026-10-10 |

---

## 1. Overview

### 1.1 Product Summary
Campus Marketplace is a **campus-verified, hyperlocal marketplace** where students buy and sell used items, new items, handmade products, academic and project materials, and room/hostel items. Transactions happen **face-to-face on campus**. The initial product has no shipping or logistics.

### 1.2 Positioning
> A verified campus exchange network where students can quickly turn unused items into money and find affordable items within their student community.

It is deliberately **not** positioned as "OLX for college students."

### 1.3 Strategy in One Line
> **One campus. One category. High liquidity. Then expand.**

---

## 2. Problem Statement

Students buy and sell through WhatsApp groups, Instagram, general classifieds and word of mouth. This causes:

- Listings that are hard to search and get buried quickly
- No consistent student verification
- Buyers and sellers who don't know each other
- No structured marketplace reputation
- Transactions that are disconnected from campus life
- Poor discovery of what is available nearby

> Students need a trusted, searchable and campus-focused way to discover, buy and sell items within their student community without the complexity of traditional marketplaces.

---

## 3. Goals and Non-Goals

### 3.1 Goals
1. Deliver the smallest complete marketplace loop: **verified student → listing → discovery → chat → transaction → sold**.
2. Achieve repeatable, real transactions on **one pilot campus**.
3. Build trust into the product through verification, reporting and transaction records.
4. Validate demand before adding payments, mobile apps or multi-campus features.

### 3.2 Non-Goals (MVP)
- Shipping or logistics
- Online payments, escrow, commission
- ID OCR verification
- Advanced ratings and reputation
- Interactive safe-zone map and deal check-ins
- Listing boosts and advertising
- Cross-campus discovery
- AI moderation or AI recommendations
- Native mobile app
- Personalized/interest-based notifications (see Phase 3)
- Alumni, campus organizations and local businesses as users

### 3.3 First Major Milestone
> **100–200 verified students → 50+ listings → 20+ completed transactions within 4 weeks.**

Success is not thousands of users. It is students on one campus repeatedly completing real transactions.

---

## 4. Target Users

### 4.1 Primary Users
College and university students, roughly 18–25, living on or near campus, who frequently buy or sell low-to-medium-value items.

### 4.2 Seller Personas
| Persona | Typical items |
|---|---|
| Textbook seller | Used textbooks |
| Project-material seller | Leftover project supplies |
| Hostel mover | Room and hostel items |
| Graduating student | Bulk belongings, electronics |
| Reseller | Electronics and accessories |
| Student maker | Handmade or student-created products |

### 4.3 Buyer Personas
| Persona | Need |
|---|---|
| Budget buyer | Affordable second-hand products |
| First-year student | Setting up a hostel room |
| Academic buyer | Course and academic materials |
| Project buyer | Project supplies |
| Community buyer | Products from within the campus community |

### 4.4 Future Users (out of scope for launch)
Alumni, campus organizations, local businesses serving students.

---

## 5. Product Principles

1. **One account, dual capability.** Every user can buy and sell.
2. **Campus-first, campus-verified.** Trust comes from verified student status.
3. **Meet in person.** No shipping or logistics initially.
4. **Payment flexibility.** Cash/UPI at meetup first; platform payments later.
5. **Liquidity before scale.** Make one campus work before expanding.
6. **Category before catalog.** Dominate one high-demand category first.
7. **Simple first.** Don't build complex features before validating demand.
8. **Trust by design.** Verification, reporting and transaction history are built in.

---

## 6. User Journeys

### 6.1 Buyer
Sign up → verify student status → confirm campus → browse campus feed → search/filter → open listing → message seller → agree price and meetup → meet → complete transaction → mark complete → rate/report if needed.

### 6.2 Seller
Sign up → verify student status → create listing with photos → listing visible → receive buyer messages → agree price and meetup → complete transaction → mark item sold.

### 6.3 Graduation / Leaving Flow (future)
A leaving student lists many belongings quickly. Working idea: *"Leaving Campus? Sell your room contents in one place."*

---

## 7. Scope by Phase

| Phase | Focus | Duration | Primary Goal |
|---|---|---:|---|
| 0 | Validation | 2–3 weeks | Confirm demand, select entry category |
| 1 | MVP Build | 6–8 weeks | Build the complete marketplace loop |
| 2 | Pilot Launch | 4 weeks | Real transactions on one campus |
| 3 | Growth & Payments | 8–12 weeks | Expand to 3–5 campuses, monetize |
| 4 | Scale & Mobile | Ongoing | 10+ campuses, mobile experience |

This PRD specifies Phase 1 (MVP) in detail. Later phases are listed at requirement level only.

---

## 8. Functional Requirements: MVP (Phase 1)

Priority: **P0** = must ship for pilot, **P1** = should ship, **P2** = nice to have.

### 8.1 Accounts and Verification
| ID | Requirement | Priority |
|---|---|---|
| ACC-1 | User can sign up with a college email and verify via OTP | P0 |
| ACC-2 | User selects or confirms their campus | P0 |
| ACC-3 | User has a basic profile (name, campus, verification status) | P0 |
| ACC-4 | Verification status is visible and enforced (unverified users cannot list or chat) | P0 |
| ACC-5 | Admin approval workflow for exceptional cases (e.g. email domain not recognized) | P0 |
| ACC-6 | One account can both buy and sell | P0 |

### 8.2 Listings
| ID | Requirement | Priority |
|---|---|---|
| LST-1 | Create a listing with title, description, price, category, condition and photos | P0 |
| LST-2 | Categories: Used, New, Handmade, Student Projects | P0 |
| LST-3 | Conditions: Like New, Good, Fair, Poor | P0 |
| LST-4 | Edit and delete own listing | P0 |
| LST-5 | Mark a listing as sold | P0 |
| LST-6 | Client-side image compression before upload | P1 |
| LST-7 | Listing becomes visible immediately after creation (subject to moderation rules) | P0 |

### 8.3 Discovery
| ID | Requirement | Priority |
|---|---|---|
| DSC-1 | Default feed shows listings from the user's campus | P0 |
| DSC-2 | Keyword search | P0 |
| DSC-3 | Filters by category and price | P0 |
| DSC-4 | Listing detail page | P0 |
| DSC-5 | Sold listings are removed from the feed or clearly marked | P0 |

### 8.4 Communication
| ID | Requirement | Priority |
|---|---|---|
| COM-1 | Real-time buyer–seller chat | P0 |
| COM-2 | Every chat is linked to a specific listing | P0 |
| COM-3 | Basic notifications for new messages | P0 |

### 8.5 Transactions
| ID | Requirement | Priority |
|---|---|---|
| TXN-1 | A transaction can be created from a chat | P0 |
| TXN-2 | Transaction records listing, buyer, seller, agreed price, payment method, meetup location, status | P0 |
| TXN-3 | Status flow: initiated → agreed → meetup_scheduled → completed (MVP subset) | P0 |
| TXN-4 | Alternate outcomes: cancelled, disputed | P0 |
| TXN-5 | Completing a transaction marks the listing as sold | P0 |
| TXN-6 | Payment is settled outside the platform (cash/UPI) | P0 |

`buyer_arrived` and `seller_arrived` states are reserved for the Phase 4 deal check-in feature.

### 8.5 Trust and Safety
| ID | Requirement | Priority |
|---|---|---|
| TNS-1 | Report a listing | P0 |
| TNS-2 | Report a user | P0 |
| TNS-3 | Report a message and a suspicious transaction | P1 |
| TNS-4 | Banned-items policy shown at listing creation | P0 |
| TNS-5 | Recommended public meetup guidance shown in chat/transaction flow | P1 |
| TNS-6 | Roles: Student, Campus Admin, Platform Admin. Campus Admin does not get platform-wide access | P0 |

### 8.6 Admin
| ID | Requirement | Priority |
|---|---|---|
| ADM-1 | User verification queue | P0 |
| ADM-2 | Listing moderation (review, remove) | P0 |
| ADM-3 | Report management | P0 |
| ADM-4 | User management (suspend, restore) | P0 |

---

## 9. Functional Requirements: Later Phases (summary)

### 9.1 Phase 3: Personalized Notifications
An **opt-in, interest-based** system that connects relevant supply with demand. Interests are learned from searches, views, saves, chats, purchases and manually selected interests, using a simple scoring model first.

| Notification type | Description |
|---|---|
| New listing alerts | A new listing strongly matches the user's interests |
| Wanted-item matches | Notify when an item the user searched for (unavailable at the time) is listed |
| Price alerts | A relevant item gets cheaper or falls in a saved price range |
| Category digests | Daily or weekly grouped email instead of one per listing |
| Seller activity | Views, new buyer interest, messages, listing performance |

**Preferences:** instant, daily digest, weekly digest, or no recommendation emails. Transactional notifications are separate from recommendation preferences.

**Frequency controls (required):** per-user frequency limits, relevance threshold, deduplication, digest grouping, quiet periods (later). The goal is *useful discovery, not inbox spam.*

### 9.2 Phase 3: Growth and Payments
- Expand to 2–4 additional campuses with a campus ambassador per college
- Referral system, cross-campus browsing
- **Wanted posts** (e.g. "Wanted: Engineering Drawing Kit, ₹500–₹800")
- Razorpay/Stripe payments, escrow-style workflow where legally appropriate, seller payout, dispute handling
- Monetization: listing boosts, transaction commission (potentially 2–5%), campus advertising

### 9.3 Phase 4: Scale and Mobile
React Native/Flutter app, 10+ campuses, advanced cross-campus discovery, student project showcase, AI-assisted moderation and recommendations, Verified Seller badge, safe-zone map, deal check-in, graduation/bulk listing tools, ID card upload with OCR verification.

---

## 10. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Platform | Responsive web app, mobile-first layout |
| Performance | Feed and search feel instant on typical campus mobile networks; images compressed client-side |
| Realtime | Chat messages delivered in real time |
| Security | Row-level access control on all user data; admin actions scoped by role |
| Privacy | Collect only what is needed; students' personal contact details are not exposed by default |
| Reliability | Basic error handling and retry for uploads and chat |
| Accessibility | Usable on low-end phones; readable contrast and tap targets |
| Compliance | Terms of Service and banned-item policy in place before public launch |

Detailed schemas, APIs and implementation choices live in Architecture.md.

---

## 11. Trust and Safety Requirements

- **Verification:** college email domain verification now; ID upload and OCR later.
- **Safe meetups:** recommend public, well-lit, CCTV-covered areas with regular student activity. Full safe-zone map after the pilot.
- **Banned items:** alcohol, drugs, weapons, exam papers, fake IDs, and other prohibited or illegal goods.
- **Reporting:** listings, users, messages, suspicious transactions.
- **Admin separation:** Campus Admin and Platform Admin are distinct roles.

---

## 12. Success Metrics

### 12.1 Pilot Targets
| Metric | Target |
|---|---|
| Verified users | 100–200 |
| Active listings | 50+ |
| Completed transactions | 20+ in 4 weeks |
| Listings at launch | 50–100 |
| Seed sellers | 5–10 |

### 12.2 Metric Groups
- **Acquisition:** verified signups per campus, signup → first action rate, acquisition source
- **Supply:** active listings, listings per week, listings per 100 verified users, % of listings still active
- **Engagement:** views, listing → chat conversion, chats per listing, active buyers and sellers
- **Liquidity:** liquidity rate (listings with a completed transaction ÷ listings created), time to sell, successful transaction rate
- **Transaction funnel:** listings → views → chats → deals agreed → meetups → completed
- **Trust and safety:** report rate, dispute rate, no-show rate, verification rejection rate, repeat transaction rate
- **Notifications (Phase 3):** opt-in rate, open rate, CTR, notification → view/chat/transaction conversion, unsubscribe rate, spam complaints, average notifications per active user, % meeting relevance threshold
- **Business (Phase 3+):** average transaction value, revenue per transaction, boost conversion, CAC, campus-level revenue

---

## 13. Launch Plan

| Stage | Activity |
|---|---|
| 0. Validation | Select pilot campus and entry category, interview 20–30 students (target: 15+ meaningful interest), recruit 5+ committed seed sellers, identify 50+ potential items, draft banned-item policy and Terms |
| 1. Seed supply | Recruit 5–10 seed sellers, 50+ listings in the entry category, run **Listing Parties** (5–10 seed sellers → 50+ listings) |
| 2. Controlled launch | Launch to 100–200 verified students; watch searches, listings, time to first chat, chat → transaction rate |
| 3. Improve liquidity | Better categories, search, listing quality, more supply, wanted posts, campus promotion |
| 4. Expand | Only after the first campus shows repeatable transaction activity |

**Launch checklist:** 50+ listings, 5–10 seed sellers, verified accounts, working listing flow, search, chat, transaction tracking, basic moderation, reporting, mobile-responsive UI.

---

## 14. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Fake students | College email verification; later ID verification |
| No listings / empty marketplace | Seed sellers, Listing Parties, launch with 50–100 listings |
| Low demand | Focus on one high-demand entry category |
| No-show meetups | Transaction tracking, reporting, future check-ins |
| Low trust | Verification, reputation, safe meetup guidance |
| Users stay on WhatsApp | Better search, discovery and structured listings |
| Scope creep | Strict MVP scope (section 3.2) |
| Payment complexity | Start with direct cash/UPI |
| Legal liability | Clear Terms, banned-item policy, dispute process |
| Poor liquidity | Track time to sell and successful transaction rate |
| Notification fatigue | Opt-in, relevance thresholds, frequency limits, digests |
| Irrelevant recommendations | Activity-based scoring, feedback signals, suppression rules |
| Admin abuse | Separate Student, Campus Admin, Platform Admin roles |

---

## 15. Open Questions

1. Which campus is the pilot campus?
2. Which category is the primary entry category? (Textbooks, electronics and hostel items are candidates.)
3. Which college email domains are accepted, and how are non-standard domains handled?
4. Is the listing visible immediately or after moderation? (Assumed immediate with after-the-fact moderation.)
5. How long should a sold or inactive listing stay visible before expiring?
6. Is the chat the only place contact details are shared, or can sellers add a phone/UPI handle to their profile?
7. What are the actual meetup locations on the pilot campus?
8. Should basic notifications (new message) be in-app only or also email in the MVP?

## 16. Document Notes

The source product document has duplicated section numbers (two sections numbered 10 and 11, and two numbered 9.3). This PRD renumbers them. It also treats personalized notifications as **Phase 3**, consistent with the source's roadmap and its list of "advanced notifications" as post-pilot, while MVP includes only basic message notifications.
