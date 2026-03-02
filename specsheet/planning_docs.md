# Project Aura: Menstrual Health & Cycle Tracking Platform
## Comprehensive Product Architecture & PRD

---

### 1. Product Vision & Principles

**Product Vision**
Project Aura is a menstrual health and cycle tracking application designed to help users understand their menstrual cycle, fertility patterns, and symptoms over time. As a secondary goal, it enables optional, permission-based partner sharing to foster education and emotional support.

**Core Principles**
*   **Privacy-first:** Health data is sacred. The platform must adhere strictly to minimal data collection, local-first storage where possible, and robust encryption. We do not monetize user data.
*   **Scientific humility:** Predictions are framed as probabilistic estimates, not promises. The system embraces and uncertainty clearly.
*   **Personal baselines over population averages:** Insights and estimates are driven by the individual's unique historical data rather than generalized societal norms.
*   **Calm, reassuring UX:** The interface must never induce panic or alarm. It acts as an objective observer, facilitating understanding rather than diagnosing.

**Explicit Non-Goals**
*   This product will **not** provide medical diagnoses, prescribe treatments, or serve as a certified contraceptive tool (it is not a medical device).
*   We will **not** sell data to third parties, advertisers, or data brokers.

---

### 2. User Personas & Use Cases

#### Persona A: The Period Tracker (Primary)
*   **Description:** An individual tracking only their periods to know when to expect the next one and to manage daily life.
*   **Primary Goals:** Log period start/end dates easily; get accurate estimates for the next period date.
*   **Daily/Weekly Interactions:** Logs in briefly (10-15 seconds) during their period; checks the app occasionally mid-cycle to see how many days are left.
*   **Emotional Context:** Convenience-driven, seeking reassurance and practical planning (e.g., carrying tampons).

#### Persona B: The Fertility Analyzer (Advanced)
*   **Description:** An individual actively trying to conceive or attempting to understand their ovulation windows.
*   **Primary Goals:** Track basal body temperature, cervical mucus, and ovulation test results alongside periods.
*   **Daily/Weekly Interactions:** Daily logging of complex symptoms. Frequent checking of fertile window predictions.
*   **Emotional Context:** High anxiety, highly emotionally invested, seeking control and deep understanding of their body.

#### Persona C: The Companion/Partner (Secondary)
*   **Description:** A partner invited by the primary user to view their cycle status.
*   **Primary Goals:** Understand where their partner is in their cycle to provide emotional support and shared responsibility in family planning.
*   **Daily/Weekly Interactions:** Passive reading. Occasional push notifications ("Aura update: fertile window begins").
*   **Emotional Context:** Eager to help, sometimes confused by biological jargon, desiring actionable ways to support without being intrusive.

---

### 3. Functional Requirements (PRD)

#### Core Features
*   **Cycle Tracking:** Simple toggle/button to log period start and end dates.
*   **Historical Data Entry (Back-logging):** Allow users to input past periods (dates, symptoms, and durations) to immediately establish a personalized baseline and significantly improve initial prediction accuracy.
*   **Symptom Logging:** Selectable chips for daily symptoms (cramps, mood, energy, pain, flow intensity).
*   **Cycle Length Calculation:** Automatic calculation of cycle length based on historical logs.
*   **Period Prediction Window:** Display of expected upcoming period within a date range (e.g., "Expected Oct 12–14").

#### Advanced Features
*   **Ovulation Estimation:** Probabilistic fertile window visualization derived from cycle history.
*   **Fertile Window Visualization:** UI indication of high vs. low fertility days.
*   **Pattern Detection:** Long-term trend analysis (e.g., calculating average cycle variance).
*   **Insight Summaries:** Textual, non-diagnostic observations ("Your cycles vary by an average of 3 days," "You frequently log headaches 2 days before your period").

#### Partner Sharing
*   **Invitation System:** Primary user can invite a partner via a secure, time-limited magic link.
*   **Permission-Based Data:** Primary user controls what is shared (e.g., Share period dates ONLY, or Share period + fertile window).
*   **Partner Education Context:** Simple tooltips explaining cycle phases to the partner.
*   **Read-Only Access:** Partners cannot edit, delete, or add any health logs.

#### Edge Cases Addressed
*   **Irregular Cycles:** If cycle variance exceeds a high threshold (e.g., >8 days), predictions dynamically shift to display wider confidence intervals rather than fixed dates.
*   **Missed Logs:** If a period exceeds typical limits (e.g., user forgets to log the 'end' date), the system automatically ends the period after 10 days and flags it for user review.
*   **Postpartum/Hormonal Changes:** Provide a "Pause tracking" or "Restart baseline" feature to prevent broken historical averages from ruining future predictions.
*   **Account Dormancy:** User stops tracking for 4 months; predictions temporarily suspend until two new cycles are logged to re-establish a baseline.

---

## 0. High-Level System Overview

**Project Aura** is a web-first, privacy-centric menstrual health and cycle tracking platform. It is designed as an **offline-capable Progressive Web App (PWA)** with a **node js architecture**, using **Firebase** as the backend infrastructure.

### Architectural Goals
- Privacy-first handling of sensitive health data
- Offline-first UX with eventual consistency
- Predictable and scalable cost structure
- Minimal backend surface area
- Clear separation between raw logs, derived aggregates, and predictions


---

### 4. UX / UI System

#### Design Language
*   **Aesthetic:** Soft, neutral, non-gendered (avoiding stereotypical hot pinks). Focus on calming tones like sage green, slate, warm terracotta, and off-white.
*   **Typography:** highly legible, modern sans-serif. Minimal, non-clinical.
*   **Vibe:** Data feels "observed" intentionally; charts look like gentle waves rather than rigid medical graphs.

#### Key Screens
*   **Onboarding:** 
    *   *Primary Action:* Enter date of last period and average cycle length.
    *   *Secondary Action:* Option to quickly log multiple previous cycles (bulk entry) to generate instant insights.
    *   *Data Density:* Very low (one question per screen).
    *   *Emotional Goal:* Welcoming, safe, zero friction.
*   **Daily Log Screen:**
    *   *Primary Action:* Log period flow or symptoms.
    *   *Data Density:* Medium (gridded chips).
    *   *Emotional Goal:* Efficient, frictionless, non-judgmental.
*   **Cycle Calendar View / Ring View (Home):**
    *   *Primary Action:* View current cycle day.
    *   *Data Density:* Medium.
    *   *Emotional Goal:* Clarity and immediate spatial understanding of time.
*   **Insights & Trends Dashboard:**
    *   *Primary Action:* Review past 6 months' cycle lengths.
    *   *Data Density:* High (charts, averages).
    *   *Emotional Goal:* Educational, empowering.
*   **Partner View:**
    *   *Primary Action:* View current cycle phase.
    *   *Data Density:* Minimal.
    *   *Emotional Goal:* Informative, supportive.
*   **Privacy & Data Control:**
    *   *Primary Action:* Export data, delete account, revoke partner access.
    *   *Data Density:* Medium.
    *   *Emotional Goal:* Transparent, trustworthy, in-control.

#### Reusable UI Components
*   **Cycle Ring:** A circular visualization of the cycle, filling up as the month progresses. Customizable segments for period, follicular, fertile, and luteal phases.
*   **Symptom Chips:** Pill-shaped toggle buttons with a minimalist icon and text (e.g., 🪫 Low Energy).
*   **Timeline/Calendar Grid:** A horizontal scrolling week view (for daily logging) expanding into a standard month grid.
*   **Insight Cards:** Softly rounded rectangular cards containing brief textual insights with a subtle gradient background.

---

### 5. Frontend Architecture

**Tech Stack:**
*   **Framework:** React with TypeScript.
*   **State Management:** Zustand for global UI state; TanStack Query (React Query) for server state caching and offline mutations.
*   **Styling:** Tailwind CSS (configured heavily for our custom design tokens) + Framer Motion for subtle, organic animations.
*   **Data Visualization:** D3.js combined with React (or Visx) for custom, soft-edged charts.
*   **Calendar Handling:** `date-fns` for lightweight, immutable date math. `date-fns-tz` for timezone handling.

**Technical Strategies:**
*   **Offline-First:** Service workers and IndexedDB (via localForage) store the user's recent logs. If a user logs cramps while on the subway, TanStack Query immediately updates the UI (optimistic update) and defers the API sync until the network returns.
*   **Timezone Handling:** All dates are stored in the backend in standard ISO-8601 UTC. The frontend converts dates based on the user's localized device timezone (using `Intl.DateTimeFormat().resolvedOptions().timeZone`) to ensure a period logged at 11 PM stays on the correct calendar day during travel.
*   **Prediction Updates:** Predictions are fetched with a stable `queryKey`. When new logs correspond to a UI change, the query is invalidated silently in the background, smoothly transitioning the UI without layout shifts.
*   **Accessibility (WCAG):** All symptom chips use standard `aria-pressed` ARIA roles. The Cycle Ring must be paired with visually hidden text explicitly stating, "You are on day 14 of your cycle." Colors maintain a minimum 4.5:1 contrast ratio.

**Component Hierarchy (Text Diagram):**
```text
AppRoot
 ├── ErrorBoundary
 ├── AuthProvider
 ├── MainLayout
 │    ├── TopNavigation / UserProfileAvatar
 │    ├── LayoutContent
 │    │    ├── DashboardView
 │    │    │    ├── CycleRingWidget (Current Phase, Days Left)
 │    │    │    ├── QuickLogTray (Log Period / Flow)
 │    │    │    └── DailySymptomSummary
 │    │    ├── CalendarExpandedView
 │    │    └── InsightsView
 │    │         ├── CycleLengthChart
 │    │         └── InsightCardsList
 │    └── BottomTabBar (Home, Calendar, Insights, Settings)
```

---

### 6. Backend Architecture

**Tech Stack:**
*   **Runtime:** Node.js / TypeScript.
*   **API Style:** RESTful API (simpler for caching and offline-sync patterns compared to GraphQL in this context).
*   **Database:** PostgreSQL (relational is ideal for querying specific user histories).
*   **Hosting:** AWS or Vercel/Supabase.

**Auth & Security:**
*   **Authentication:** Passwordless magic links (via email) to reduce friction and eliminate password storage. Optional Apple/Google OAuth. 
*   **Authorization:** Middleware checks JWT claims for `userId` and `role`. Partners receive a distinct JWT with a `role: 'partner'` and a `linkedUserId` claim, specifically hardcoded to a read-only router.
*   **Rate Limiting & Abuse:** Redis-based rate limiting on auth routes (e.g., 5 magic link requests per 15 minutes). Standard API limits (100 req/min) per IP.

**System Mechanics:**
*   **Cycle Data Storage:** Stored continuously. We don't overwrite logs; we append updates with timestamps (`updated_at`).
*   **Prediction Recalculation:** Triggered asynchronously via a queue (e.g., BullMQ) whenever a user logs a new period start or end. The backend computes the new rolling averages and saves the prediction cache so the API responds instantly on future loads.
*   **Partner Access Scoping:** Permissions are mapped in a join table (`PartnerLink`). If a user revokes access, the `PartnerLink.is_active` flag is set to false, instantly causing `403 Forbidden` responses to any active partner sessions.
*   **Audit Logs:** Critical actions (exporting data, sharing with partner, deleting data) are written to an immutable `SecurityEventLogs` table for compliance.

---

### 7. Data Models (Conceptual)

**User**
*   `id` (UUID, Required, PK)
*   `email` (String, Required, Unique, Encrypted at rest)
*   `created_at` (Timestamp, Required)
*   `timezone_preference` (String, Default IST)
*   `is_active` (Boolean, default True)
*   `is_partner` (Boolean, default False)

<!-- **Cycle**
*(A computed aggregate table for fast insight queries)*
*   `id` (UUID, Required, PK)
*   `user_id` (UUID, Required, FK, Indexed)
*   `start_date` (Date, Required)
*   `end_date` (Date, Optional - null if ongoing)
*   `length_days` (Int, Optional)
* -->

**PeriodLog**
*(Raw point-in-time logging)*
*   `id` (UUID, Required, PK)
*   `user_id` (UUID, Required, FK, Indexed)
*   `date` (Date, Required)
*   `flow_intensity` (Enum: Light, Medium, Heavy, Spotting, Required)

**SymptomLog**
*   `id` (UUID, Required, PK)
*   `user_id` (UUID, Required, FK, Indexed)
*   `date` (Date, Required)
*   `symptom_type` (Enum: cramps, mood, sleep, etc. Required)
*   `severity` (Int 1-3, Optional)

**Prediction**
*(Cache for frontend rendering)*
*   `id` (UUID, Required, PK)
*   `user_id` (UUID, Required, FK, Indexed)
*   `predicted_next_period_start` (Date, Required)
*   `predicted_next_period_end` (Date, Required)
*   `confidence_interval_days` (Int, Required - e.g., ±2 days)

**PartnerLink**
*   `id` (UUID, Required, PK)
*   `created_at` (Timestamp, Required)
*   `primary_user_id` (UUID, Required, FK)
*   `partner_user_id` (UUID, Required, FK)
*   `permissions_flag` (JSON/Int bitmask - e.g., `["period", "symptoms"]`, Required)
*   `is_active` (Boolean, Required)

---

### 8. Prediction Logic (High-Level)

**Core Algorithm Concept:**
Our engine relies on weighted rolling averages rather than fixed normative data (like the generic "28-day cycle" myth).

1.  **Baseline Extraction:** Take the last 6 completed cycles.
2.  **Weighted Recent Cycles:** Apply a heavy weight (e.g., 40%) to the most recent cycle, 30% to the second most recent, and decay backward. This immediately adapts to recent hormonal shifts.
3.  **Outlier Trimming:** If a cycle is vastly outside the user's standard deviation (e.g., an 80-day cycle for someone who averages 30, perhaps due to stress/illness), tag it as an outlier and exclude it from the active rolling average to protect future predictions.
4.  **Confidence Ranges:** Instead of outputting *Oct 12*, the algorithm calculates the standard deviation across the history. If variance is high, the output expands to a window: *Oct 10 – Oct 15*.
5.  **Plain Language Surfacing:** The UI explicitly says, "Based on your last 3 cycles varying by 4 days, your period is most likely to start between Tuesday and Friday."

---

### 9. Privacy, Security & Compliance

As a health data company, our security must be unimpeachable.

*   **Encryption:** 
    *   *Transit:* TLS 1.3 enforced for all traffic.
    *   *At Rest:* Database-level encryption (AES-256) for all storage volumes. Personally Identifiable Information (PII) like email addresses must be encrypted using deterministic or application-level encryption before resting in the DB.
*   **Minimal Data Collection:** We do not ask for real names, dates of birth, or geographic location (beyond timezone for calendar math).
*   **No Ad Tracking:** Absolute zero inclusion of Meta Pixel, Google Analytics, or third-party ad brokers. Telemetry is limited to self-hosted, anonymized analytics (e.g., Plausible Analytics).
*   **Data Export/Deletion:** A one-click "Export My Data" (generates CSV/JSON) and a one-click "Delete Account & All Data" must exist in the settings and execute immediately.
*   **Consent Flows:** Inviting a partner requires an explicit, multi-stage confirmation warning the primary user exactly what data will be visible. 

---

### 10. Non-Functional Requirements

*   **Performance:** 
    *   Client Time to Interactive (TTI) < 1.5 seconds on 3G mobile networks.
    *   API response time P95 < 200ms.
*   **Uptime:** Target 99.9% uptime. Fallback offline capabilities on the frontend guarantee user access to their own cached data even during a backend outage.
*   **Scalability:** The database must be heavily indexed on `user_id` and `date`. Serverless backend functions allow for massive auto-scaling during unpredictable traffic spikes.
*   **Observability:** Implement structured JSON logging (e.g., Datadog or ELK stack). Track metrics heavily around app crash rates, API latency, and database query times. *Crucially, omit all payload parameters in logs to protect health data.*

---

### 11. Future Extensions (Clearly Separated)

*   **Local-Only Mode:** allow users to strip Cloud sync entirely, storing data purely in their device's SQLite/IndexedDB environment via a Local-First architecture.
*   **Apple Health / Google Fit Integration:** Bi-directional syncing of basal body temperature or sleep data explicitly via OS-level consent.
*   **AI-Generated Insights (Explainable):** LLM integration that writes weekly plain-text summaries (e.g., "You typically register poor sleep in the late luteal phase"). The LLM prompt must be isolated and completely devoid of user PII.
*   **Perimenopause Persona:** Specific tracking and UX modifications designed for users experiencing cycle phase-out.