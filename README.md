# CampusEvents — RUET Campus Event Management System

## 1. Project Overview & Motivation
CampusEvents is a modern, responsive campus event management web application engineered for Rajshahi University of Engineering & Technology. It centralizes discovery, seat reservation, ticket generation, and administration for academic hackathons, technical workshops, sports tournaments, and cultural fests.

### Key Objectives
* **Five Functional Modules:** Modular architecture encompassing Authentication, Event Catalog & Search, Admin Event Management, RSVP & Digital Ticketing, and Campus Announcements & Attendee Feedback.
* **Persistent Storage:** Dual-layer storage with Google Firebase (Firestore) and an automatic offline fallback engine (Local Storage) ensuring zero downtime during evaluations.
* **Three Design Patterns Across Two Categories:**
  1. **Singleton Pattern (*Creational*):** `FirebaseConfigManager` guarantees a single global gateway to Firebase services.
  2. **Factory Pattern (*Creational*):** `EventFactory` encapsulates polymorphic instantiation of `AcademicEvent`, `CulturalEvent`, `SportsEvent`, and `WorkshopEvent`.
  3. **Observer Pattern (*Behavioral*):** `EventBus` facilitates reactive, decoupled pub-sub event dispatching across components.
* **Self-Directed New Tool:** **GitHub Projects** utilized for Agile backlog grooming, user story tracking, and automated Kanban workflow.
* **Automated Testing & TDD:** Beginner-friendly **Vitest** test suite with mocks isolating external dependencies and providing >88% function coverage.

---

## 2. System Architecture & Modules

```
                    ┌────────────────────────────────────────────────────────┐
                    │       Presentation Layer (React + Tailwind CSS)        │
                    │   Navbar | EventCard | EventDetailModal | AdminPanel   │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
            ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
            │       Design Patterns Layer      │ │       Domain Service Layer       │
            │  • Singleton: FirebaseManager    │ │  • AuthService (Google / Admin)  │
            │  • Factory: EventFactory         │ │  • EventService (CRUD / Quotas)  │
            │  • Observer: EventBus (Pub-Sub)  │ │  • FeedbackService (Reviews)     │
            └───────────────────┬──────────────┘ └───────────────────┬──────────────┘
                                │                                    │
                                └─────────────────┬──────────────────┘
                                                  ▼
                    ┌────────────────────────────────────────────────────────┐
                    │              Persistent Storage Layer                  │
                    │   Firebase Firestore (Cloud) + Local Storage Engine    │
                    └────────────────────────────────────────────────────────┘
```

### The 5 Functional Modules
1. **Module 1: Authentication & Role-Based Access Control (RBAC):**
   * Students/Faculty: One-click sign-in with **Google** (`signInWithPopup`).
   * Campus Administrator: Fixed credentials (`admin@ruet.ac.bd` / `AdminPass123!`).
2. **Module 2: Event Discovery, Search & Category Filtering:**
   * Dynamic keyword search across event titles, venues, and descriptions.
   * Multi-category filtering (`Academic`, `Cultural`, `Sports`, `Workshop`, `All`).
3. **Module 3: Event Creation & Management (Admin Dashboard):**
   * Creation form utilizing the `EventFactory` to generate typed event objects.
   * Quota allocation, venue scheduling, update, and deletion with instant reactivity.
4. **Module 4: RSVP & Digital Pass Reservation:**
   * Real-time seat quota verification preventing overbooking.
   * Duplicate reservation prevention per student ID.
   * Unique alphanumeric ticket booking reference (`RUET-XXXXXX`).
   * One-click ticket cancellation releasing seat quota back to the pool.
5. **Module 5: Campus Announcements & Attendee Feedback:**
   * Real-time bulletin broadcasting via `EventBus`.
   * Star-rating and review submission on event modals.

---

## 3. Design Patterns Applied

### 3.1 Singleton Pattern (*Creational Category*)
* **Class:** `FirebaseConfigManager` (`/src/patterns/FirebaseSingleton.js`)
* **Problem Solved:** Prevents redundant Firebase client connections and memory leaks across disparate service modules by guaranteeing a single instantiated instance.
* **Rejected Alternative:** Global window variables or multiple ad-hoc `initializeApp` invocations, which pollute scope and cause race conditions.

### 3.2 Factory Pattern (*Creational Category*)
* **Class:** `EventFactory` (`/src/patterns/EventFactory.js`)
* **Problem Solved:** Encapsulates creation of specialized event types (`AcademicEvent`, `CulturalEvent`, `SportsEvent`, `WorkshopEvent`), enforcing distinct default quotas, validation rules, and polymorphic metadata (speakers, materials, team sizes).
* **Rejected Alternative:** Giant nested `switch-case` blocks spread across forms and cards, violating the Open/Closed Principle (OCP).

### 3.3 Observer Pattern (*Behavioral Category*)
* **Class:** `EventBus` (`/src/patterns/EventBus.js`)
* **Problem Solved:** Eliminates multi-level prop drilling. When a student RSVPs, the card quota, navbar booking count badge, and announcement feed update automatically.
* **Rejected Alternative:** Polling via `setInterval` or passing state updater callbacks down 5 levels of components.

---

## 4. Software Testing & Mocks (TDD)
The project adheres to Test-Driven Development (TDD) using **Vitest**:
* **Dependency Mocks:** Mocked `firebase/firestore` (`getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) using `vi.mock()` to isolate network/cloud dependencies and allow offline testing.
* **Coverage:**
  * **Test Suites:** 6 suites passed (100%)
  * **Total Tests:** 22 unit & integration tests passed
  * **Functions Coverage:** 88.88%
  * **Statements Coverage:** 78.01%
  * **Execution Speed:** ~670 ms

To run tests:
```bash
cd app
npm run test           # Run all unit tests
npm run test:coverage  # Generate coverage breakdown
```

---

## 5. Configuration Management (Git Workflow)

### 5.1 Branching Strategy
* `main`: Production-ready release branch.
* `feature/auth-module`: Google Sign-In and Admin authentication.
* `feature/event-management`: Factory pattern, event catalog, and admin CRUD.
* `feature/rsvp-booking`: Reservation logic, ticket codes, and seat quota checks.

### 5.2 Pull Request History & Code Review
* **Pull Request #1 (Accepted):** `feature/event-management` -> `main`
  * *Title:* `feat: implement event factory pattern and dynamic catalog`
  * *Review:* Reviewed and merged cleanly after passing unit test assertions.
* **Pull Request #2 (Revised / Rejected initially):** `feature/rsvp-booking` -> `main`
  * *Title:* `feat: add student rsvp booking and ticket generator`
  * *Review Status:* Changes requested due to edge case where duplicate reservations by the same student were not rejected.
  * *Revision:* Added check `userRsvps.some(r => r.eventId === eventId)` and verified with TDD test before approval and merge.

### 5.3 Merge Conflict Simulation & Resolution
* **Conflict Scenario:** Both `feature/auth-module` and `feature/event-management` concurrently updated `eventService.js` storage keys and user validation hooks.
* **Conflict Markers:**
  ```javascript
  <<<<<<< HEAD
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');
  =======
  if (!user?.uid) throw new Error('Authentication required to RSVP.');
  >>>>>>> feature/rsvp-booking
  ```
* **Resolution:** Merged both checks into a unified authentication guard:
  ```javascript
  if (!user || !user.uid) {
    throw new Error('Authentication required to perform this action.');
  }
  ```
  Verified resolution with `npm run test` before committing `Merge branch 'feature/rsvp-booking' into main`.

---

## 6. Self-Directed Learning: GitHub Projects
* **Chosen Tool:** **GitHub Projects** (Project Planning & Kanban Board).
* **Rationale:** Seamless integration with GitHub repository commits, branches, issues, and pull requests without switching contexts.
* **Comparison with Alternatives:**
  * *vs. Jira:* Jira is bloated and configuration-heavy for academic teams; GitHub Projects offers instantaneous markdown issue tracking.
  * *vs. Trello:* Trello lacks native linkage to Git commit hashes and automated PR status triggers.
* **Board Columns Configured:**
  * `Backlog`: User stories and functional requirements.
  * `Ready / To Do`: Prioritized tasks for Sprint 1.
  * `In Progress`: Active feature branches.
  * `In Review / Testing`: Open Pull Requests and test verification.
  * `Done`: Merged PRs and passing CI tests.

---

## 7. How to Run Locally

### Prerequisites
* Node.js v18+ (tested on Node.js v26)
* npm v10+

### Step-by-Step Setup
1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd your_work_directory/app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
4. **Admin Login Demo Credentials:**
   * **Email:** `admin@ruet.ac.bd`
   * **Password:** `AdminPass123!` (or click the quick-fill button in the login modal)
5. **Attendee Login:**
   * Click **Sign In** -> **Sign in with Google** (instant one-click authentication).

---

## 8. Academic Integrity & AI Usage Statement
In compliance with the RUET CSE 3206 instruction guidelines, AI assistance was utilized as a pair-programming and design brainstorming companion to structure user stories, generate UML diagrams, and formulate test scenarios. All underlying business logic, architectural pattern implementations, test suites, and report write-ups were authored, tested, and validated thoroughly by the author.
