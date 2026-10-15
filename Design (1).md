# Campus Marketplace Platform: Design

| | |
|---|---|
| **Status** | Draft v0.1 |
| **Direction** | Minimalistic, study-oriented |
| **Inputs** | `PRD.md`, `Architecture.md`, `Rules.md` |
| **Related docs** | Tasks.md (TD01–TD03, T013), Memory.md |
| **Last updated** | 2026-10-10 |

**Items marked "Proposed"** go beyond the current PRD and need a PRD update before being built (see section 14).
**Items marked "Confirm"** are my choices and have not been confirmed (see section 15).

---

## 1. Design Intent

The product is a verified campus exchange for students, and its likely first categories (textbooks, notes, calculators, drawing kits, project materials) are study things. The interface should feel like a **well-kept notebook or library index**: calm, focused, quick to scan, and trustworthy.

### Principles
1. **Quiet over loud.** Content (photos, titles, prices) is the visual interest; the interface stays out of the way.
2. **Scan fast.** A student should understand a listing in about two seconds: photo, title, price, condition.
3. **Trust is visible but plain.** Verification and safety cues are small, consistent text, not flashy badges.
4. **Fast on modest phones.** Light pages, compressed images, almost no motion. Design for mid-range Android on campus Wi-Fi.
5. **Two taps to the goal.** Buying: feed → listing → message. Selling: Sell → listing published.
6. **Mobile first.** Every screen works at 360 px before desktop is considered (Rules F-1).

### Not this
Dense classified-ad clutter, loud promotional banners, gradients, glossy effects, heavy animation, dark patterns, and decorative illustration that slows the page.

---

## 2. Design Tokens

Tokens are defined once (Tailwind theme / CSS variables) and used everywhere. No one-off values (Rules F-5).

### 2.1 Colour (light theme)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8F4` | Page background (warm paper) |
| `--surface` | `#FFFFFF` | Cards, inputs, sheets |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-2` | `#5C5C57` | Secondary text, metadata |
| `--ink-3` | `#8A8A83` | Placeholder, disabled text (never for essential info) |
| `--line` | `#E4E1DA` | Hairline borders and dividers |
| `--accent` | `#1F3A5F` | Primary button, price emphasis, active states, links (ink blue) |
| `--accent-hover` | `#162B47` | Hover/pressed |
| `--accent-soft` | `#E8EDF4` | Selected chips, subtle highlights |
| `--success` | `#2F6B4F` | Completed, verified text |
| `--warning` | `#A86B12` | Pending, caution |
| `--danger` | `#A63D2F` | Errors, destructive actions, report |

**Rules**
- Accent is used sparingly: primary action, price, active tab, links. If everything is blue, nothing is.
- Status colours are always paired with text or an icon, never colour alone.
- Dark mode is **deferred** until after the pilot. Tokens are named semantically so it can be added without rewrites.
- Contrast: body text meets WCAG AA (4.5:1) on `--bg` and `--surface`. `--ink-3` is only for non-essential hints.

### 2.2 Typography

| Role | Font | Fallback |
|---|---|---|
| Headings, listing titles on detail page | **Source Serif 4** (Confirm) | Georgia, serif |
| UI, body, buttons, metadata | **Inter** | system-ui, sans-serif |
| Prices, numbers | Inter with tabular numerals (`font-variant-numeric: tabular-nums`) | |

Self-host fonts with `font-display: swap`; load only the weights used (serif 600; sans 400, 500, 600).

| Style | Size / line height | Weight | Use |
|---|---|---|---|
| Display | 28 / 34 | Serif 600 | Screen titles (mobile) |
| Title | 22 / 28 | Serif 600 | Section titles, listing title on detail |
| Heading | 18 / 24 | Sans 600 | Card group titles |
| Body | 16 / 24 | Sans 400 | Default text, chat messages |
| Body small | 14 / 20 | Sans 400 | Metadata, helper text |
| Caption | 12 / 16 | Sans 500 | Tags, timestamps |
| Price large | 24 / 28 | Sans 600, tabular | Price on listing detail |
| Price card | 18 / 24 | Sans 600, tabular | Price on cards |

Minimum body size is 16 px on mobile inputs (prevents iOS zoom). Desktop display and title sizes scale up by about 4 px.

### 2.3 Spacing, Shape and Elevation

- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64. Page gutter 16 on mobile, 24 on tablet and up.
- **Radius:** 8 px for inputs and buttons, 12 px for cards and sheets, full for avatars and chips.
- **Borders over shadows:** 1 px `--line` hairlines define cards. A single soft shadow is allowed only for floating elements (bottom sheet, toast, modal).
- **Tap targets:** at least 44 × 44 px.
- **Layout width:** content max width 1120 px on desktop, centered; chat and forms max 640 px.

### 2.4 Icons and Imagery

- One consistent line-icon set (1.5 px stroke), for example Lucide. Icons always have text labels in navigation.
- Listing photos use a 4:3 crop in lists and original ratio on detail. Neutral `--line`-coloured placeholder with blur-up while loading.
- No stock imagery, mascots or decorative illustration in the MVP. Empty states use a simple line icon and a sentence.

---

## 3. Layout and Navigation

### 3.1 Mobile (default, 360 px and up)
- **Top bar:** campus name (left, tappable to confirm campus), notification/inbox icon (right). Hairline bottom border.
- **Bottom tab bar (5 items):** Home · Search · **Sell** · Chats · Profile.
  - **Sell** is visually distinct (filled accent circle or pill) but small and flat, not floating and glowing.
  - Unread dot on Chats.
- Active tab: accent colour icon and label; inactive: `--ink-2`.

### 3.2 Desktop (900 px and up)
- Top bar with logo/wordmark, centred search field, and Sell, Chats and Profile on the right. No bottom tab bar.
- Feed becomes a 3 or 4 column grid. Listing detail is two columns: photos left, details and actions right.
- Chat becomes two panes: conversation list left, thread right.

### 3.3 Breakpoints
`sm` 360 · `md` 640 · `lg` 900 · `xl` 1120.

### 3.4 Admin
Separate layout: left sidebar (Verification, Reports, Listings, Users, Audit log), content area as dense tables. Admin is functional and does not need the student-facing polish; it uses the same tokens.

---

## 4. Components

Each component lists its states: default, hover/focus, active/pressed, disabled, loading, error where relevant.

### 4.1 Buttons
| Type | Style | Use |
|---|---|---|
| Primary | Filled `--accent`, white text, 8 px radius, 48 px tall | One per screen: Message seller, Publish, Confirm |
| Secondary | `--surface` with `--line` border, `--ink` text | Cancel, Save draft, Edit |
| Text/link | `--accent` text, no border | Tertiary actions |
| Destructive | `--danger` text or filled for confirm | Delete listing, Cancel deal |

- Focus: 2 px `--accent` outline with 2 px offset (visible on all backgrounds).
- Loading: label replaced by small spinner, width stays fixed, button disabled.
- Disabled: 40% opacity with a reason shown nearby when it is not obvious.

### 4.2 Inputs
- 48 px tall, `--surface`, 1 px `--line` border, 8 px radius. Label above the field (always visible, not placeholder-only).
- Focus: `--accent` border. Error: `--danger` border plus message below in plain language.
- Helper text under the field in Body small `--ink-2`.
- Price input shows the ₹ prefix and numeric keyboard.

### 4.3 Chips (filters and categories)
- Pill, 36 px tall, `--surface` with `--line` border; selected state uses `--accent-soft` background and `--accent` text and border.
- Horizontally scrollable row on mobile; wraps on desktop.

### 4.4 Listing Card
Used in the feed, search, and "my listings".

```text
┌──────────────────────────┐
│ [ photo 4:3 ]            │
│                          │
├──────────────────────────┤
│ Engineering Mathematics  │  ← title, 2 lines max, Inter 500
│ ₹350                     │  ← price, accent, tabular, 600
│ Good · Textbook · 2h ago │  ← metadata, Body small, ink-2
└──────────────────────────┘
```
- Mobile default: **single-column list** (photo left 96 px square, text right) for fast scanning, with a grid toggle in the feed header. Grid view is two columns of the vertical card above.
- Sold: photo desaturated with a "Sold" label; hidden from the feed by default (DSC-5).
- Whole card is one tap target; no inline buttons in MVP.
- Saved/favourite icon is **Phase 3**.

### 4.5 Condition Tag
Caption-size text in a hairline pill: Like new, Good, Fair, Poor. No colour coding that implies a judgement beyond the words.

### 4.6 Verified Line
Small text with a check icon in `--success`: "Verified student · [Campus]". Appears on listing detail, seller profile and chat header. Always the same wording.

### 4.7 Search Field
- 48 px, magnifier icon, clear button. Recent searches shown on focus (stored locally).
- Results update on submit (not per keystroke) to keep queries light.

### 4.8 Filter Sheet
Bottom sheet on mobile, popover on desktop. Contents (MVP): Category, Price range (min/max), Condition. **Proposed:** Subject, Semester, Edition. Footer has "Clear" (text) and "Show N items" (primary).

### 4.9 Bottom Sheet and Modal
Used for filters, report, confirmations. Sheet slides up (150 ms), has a clear title, close button and, for destructive confirmations, a plain explanation of what will happen.

### 4.10 Toast
Short confirmation at the bottom above the tab bar ("Listing published"), auto-dismiss in 4 s, with Undo where reversible.

### 4.11 Message Bubble
- Own messages: right-aligned, `--accent-soft` background. Other's messages: left-aligned, `--surface` with `--line` border. 12 px radius, max width 80%.
- Timestamp grouped under clusters of messages, not under each one. Delivery failure shows "Not sent · Retry".

### 4.12 Deal Card (in chat)
A structured card inserted in the thread when a transaction is created.

```text
┌─────────────────────────────────┐
│ Deal                  ● Agreed  │
│ Engineering Mathematics         │
│ ₹350 · Cash or UPI              │
│ Meet: Library entrance, Sat 4pm │
│ [ Mark complete ]  [ Cancel ]   │
└─────────────────────────────────┘
```
Status shown as text plus a small dot: Initiated, Agreed, Meetup set, Completed, Cancelled, Disputed. Buttons shown depend on the viewer's role and current status (Architecture §8.4).

### 4.13 Status Badge (generic)
Text with a small dot; colours: neutral (initiated), accent (agreed, meetup set), success (completed), warning (pending, disputed), danger (removed, rejected).

### 4.14 Skeleton, Empty and Error States
- **Loading:** grey skeleton blocks that match the layout (no spinners for page loads).
- **Empty:** line icon, one sentence, one action. Example: "Nothing here yet. Be the first to list something on your campus." → Sell an item.
- **Error:** plain sentence with a Retry button. Example: "Couldn't load listings. Check your connection and try again." Never show technical errors (Rules L-1).

### 4.15 Avatar
Circle, 32 or 48 px. If no photo: initial letter on `--accent-soft`.

---

## 5. Screens

Wireframe-level descriptions for the three core screens required by Tasks T013, plus the supporting screens.

### 5.1 Sign-in and Verification
1. **Welcome:** wordmark, one sentence ("Buy and sell with students on your campus."), field for college email, Continue.
2. **Enter code:** 6-digit OTP input, resend after 30 s, "Wrong email?" link.
3. **Campus confirm:** campus detected from the domain; confirm or choose manually.
4. **Not recognised email:** explains why, offers "Request manual review" (ACC-5) and sets expectations ("We usually review within a day").
5. **Pending verification:** read-only browsing allowed; Sell and Message disabled with a clear explanation (ACC-4).

### 5.2 Feed (Home)
- Top: campus name, inbox icon.
- Search field (taps through to Search).
- Category chip row: All, Textbooks, Notes, Electronics, Hostel, Project materials, Handmade (final set follows the entry category; Confirm).
- Sort/toggle row: "Newest" and list/grid toggle.
- Listing cards, cursor-paginated with "Load more" on scroll.
- Empty campus state encourages the first listing.

### 5.3 Search and Filters
Search field focused with recents, results list with a Filter button showing an active-filter count. No-results state suggests clearing filters and (Phase 3) posting a Wanted request.

### 5.4 Listing Detail
```text
[ photo carousel, dots ]
Engineering Mathematics (Serif title)
₹350                                   (accent, large)
Good · Textbook · Posted 2h ago

Description text...

Seller
(Avatar) Name
✓ Verified student · [Campus]

Safety tip: meet in a public campus area.
[ Report ]

──────────────────────────
[ Message seller ]  (sticky primary button)
```
- Own listing: sticky area shows Edit, Mark as sold instead.
- Sold listing: banner "This item has been sold", message button hidden.
- Report is a small text link, not a prominent button.
- **Proposed:** optional "Subject · Semester · Edition" line under the meta row when filled.

### 5.5 Create / Edit Listing
Single scrolling form, in this order:
1. Photos (up to 5; first is cover; compress and preview)
2. Title
3. Price
4. Category (chips)
5. Condition (chips)
6. Description (optional but encouraged)
7. **Proposed:** Subject, Semester, Edition (optional, collapsed under "Add study details")
8. Banned-items notice (one line with a link to the policy, TNS-4)
9. Publish (primary, sticky)

The goal is a first listing in about a minute. Inline validation, draft is kept if the user leaves.

### 5.6 Chat List
List of conversations: listing thumbnail, other person's name, last message, time, unread dot. Empty state explains how to start one.

### 5.7 Chat Thread
- Header: other person's name, verified line, listing summary strip (photo, title, price; tappable).
- Messages as in 4.11. Deal card appears inline.
- Composer: text field, send. A "Make a deal" button above the composer opens the transaction sheet (price, payment method, meetup place from the campus safe-zone list, time).
- A one-time safe-meetup tip at the top of each new chat.
- Overflow menu: Report user, Report conversation.

### 5.8 Transaction Detail
Reached from the Deal card or the profile. Shows the listing, agreed price, payment method (Cash or UPI), meetup place and time, a status timeline, and the actions allowed for the viewer. Completed state shows a simple confirmation line (no confetti) and, in Phase 4, a rating prompt.

### 5.9 Profile
Own profile: name, campus, verification status, my listings, my deals, settings (notification preferences in Phase 3), sign out. Public profile: name, verified line, active listings, report link. No phone or email shown (Rules P-15).

### 5.10 Report Flow
Bottom sheet: pick a reason (Banned item, Misleading, Spam, Harassment, Other), optional details, Submit. Confirmation: "Thanks, we'll review this." Never reveals the reported person's reaction.

### 5.11 Admin Screens
Verification queue, report queue (banned-item and harassment reports sorted first), listing moderation, user management, audit log. Table layouts with filters by campus and status; every destructive action requires a reason.

---

## 6. Content and Voice

- **Tone:** friendly, brief, direct, like a helpful senior. No slang overload, no exclamation spam.
- **Sentence case** everywhere (not Title Case). Verbs on buttons: "Message seller", "Publish listing", "Mark as sold".
- **Currency:** ₹ with Indian grouping (₹1,250). No decimals unless needed.
- **Time:** relative for recent ("2h ago"), date for older ("12 Oct"); meetup times in local time with day name.
- **Errors:** say what happened and what to do next. Never blame the user.
- **Examples**

| Situation | Copy |
|---|---|
| Empty feed | "Nothing listed yet. Be the first on your campus." |
| Unverified user taps Sell | "Verify your student email to start selling." |
| Listing published | "Listing published." |
| Item sold | "Marked as sold. Nice one." |
| Upload failed | "That photo didn't upload. Try again." |
| Safety tip | "Meet in a public, well-lit place on campus." |
| Banned item notice | "Alcohol, drugs, weapons, exam papers and fake IDs aren't allowed." |

---

## 7. Motion

Minimal, functional, and fast on low-end phones.

| Moment | Motion | Duration |
|---|---|---|
| Page transition | Fade | 120 ms |
| Bottom sheet | Slide up | 150 ms |
| Button press | Slight darken (no scale) | instant |
| Toast | Fade and rise | 150 ms |
| Image load | Blur-up to sharp | 200 ms |
| List loading | Static skeleton (no shimmer) | n/a |

- No parallax, confetti, bouncing or looping animation.
- Respect `prefers-reduced-motion`: transitions become instant.

---

## 8. Accessibility

- WCAG 2.1 AA as the baseline.
- All interactive elements keyboard reachable with a visible focus ring.
- Every image has alt text (listing photos: listing title; avatars: person's name).
- Form fields have visible labels and programmatic error associations.
- Status is never colour-only.
- Tap targets at least 44 × 44 px; spacing prevents accidental taps.
- Text can scale to 200% without breaking layouts.
- Semantic landmarks (`header`, `nav`, `main`) and logical heading order.
- Chat is announced with `aria-live` for new messages.

---

## 9. Responsive Behaviour

| Element | Mobile (under 640) | Tablet (640–899) | Desktop (900+) |
|---|---|---|---|
| Navigation | Bottom tab bar | Bottom tab bar | Top bar |
| Feed | Single-column list (grid toggle: 2 columns) | 2–3 columns | 3–4 columns |
| Listing detail | Stacked, sticky action bar | Stacked | Two columns |
| Chat | Full-screen list then thread | Two panes | Two panes |
| Filters | Bottom sheet | Bottom sheet | Popover or side panel |
| Create listing | Single column | Single column, max 640 | Single column, max 640 |

---

## 10. Performance Budget (design-related)

- Largest Contentful Paint under 2.5 s on a mid-range phone on 4G.
- Feed first view loads at most 12 listings with lazy-loaded images below the fold.
- Images served in WebP at sizes matched to the layout (about 400 px wide for list thumbnails, up to 1280 px on detail).
- Two font families, at most five font files, self-hosted.
- No client-side animation libraries in MVP.

---

## 11. Naming and Implementation Notes

- Build with Tailwind using the tokens above as the theme (`colors`, `fontFamily`, `borderRadius`, `spacing`).
- Components live in `components/` following Rules §11 naming: `ListingCard`, `FilterSheet`, `DealCard`, `ChatBubble`, `StatusBadge`, `VerifiedLine`.
- Keep a single `Button`, `Input`, `Chip` and `Sheet` implementation; do not fork per screen.
- Document each component's states in Storybook or a simple `/dev/components` page (P2).

---

## 12. Phase Boundaries

| Phase | Design scope |
|---|---|
| Phase 1 (MVP) | Everything in sections 2–9, light theme only |
| Phase 3 | Saved items, Wanted posts, notification preferences screen, digest email template, referral UI |
| Phase 4 | Dark mode, safe-zone map, deal check-in UI, ratings, Verified Seller badge, native mobile adaptation |

---

## 13. Email Design (MVP)

Plain, text-first emails with one button, using the same tokens: warm-white background, serif title, one accent button, short footer.

- OTP email: code in large tabular type, expiry, "Didn't request this? Ignore this email."
- New-message email: sender first name, listing title, first line of the message, button "Open chat". Rate-limited (Architecture §10.1).
- Transaction status email: status line, listing, meetup details, button "View deal".
- Phase 3 digests add an unsubscribe link in the footer (Rules P-20).

---

## 14. Proposed PRD Changes

The study-oriented direction suggests the following. None are built until the PRD is updated.

| ID | Change | Reason | Impact |
|---|---|---|---|
| PC-1 | Optional listing fields: **subject**, **semester/year**, **edition** (shown under "Add study details") | Lets students find course-specific items quickly | New nullable columns on `listings`, filter additions (DSC-3), form fields (LST-1) |
| PC-2 | Feed default is a single-column list with a grid toggle | Faster scanning for text-heavy items | UI only |
| PC-3 | Category list tuned to the entry category (for example Textbooks, Notes, Calculators, Drawing kits, Lab gear, Project materials, Hostel) | Matches study focus | Category enum may need more values than `used / new / handmade / student_project`, or a separate tag field; decide with the entry category (OQ-2) |

Note: PC-3 is a real data-model question. The PRD's four categories (Used, New, Handmade, Student Projects) describe *kind of item*, whereas the chips above describe *what it is*. They likely need to be two separate fields: **kind** (existing enum) and **topic/category** (new).

---

## 15. Open Design Questions

1. **Accent colour:** ink blue (`#1F3A5F`) assumed. Alternative: a calm green. Confirm.
2. **Typeface:** Source Serif 4 plus Inter assumed. Confirm, or choose a different pairing.
3. **Product name and logo:** none exist yet. A simple wordmark in the serif is the placeholder.
4. **Entry category** (OQ-2) decides the final chip row and any category-specific listing fields.
5. **Feed default:** list vs grid on mobile. List assumed (PC-2); test with real students.
6. **Meetup locations** (OQ-3) are needed to populate the safe-zone picker in the deal sheet.
7. **Do we want the study-detail fields (PC-1) in the MVP**, or only after the pilot shows demand?
8. **Dark mode:** deferred to Phase 4; confirm that is acceptable for students who use dark mode system-wide.

---

## 16. Design Task Mapping

| Task | Relationship to this document |
|---|---|
| T013 | Wireframes for Feed, Listing Detail and Chat: use sections 5.2, 5.4, 5.7 |
| TD01 | This document |
| TD02 | Build the component library from section 4 and the tokens in section 2 |
| TD03 | Review empty, error and notification copy against section 6 |
