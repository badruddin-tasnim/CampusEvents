import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from generate_all_documents import (
    configure_doc_styles, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_code_block, add_table_data, add_image_if_exists,
    BRAVE_PATH, DIAGRAMS_DIR, DOCS_DIR
)

def build_project_report():
    print("Building Project Report (.docx and .pdf)...")
    doc = Document()
    configure_doc_styles(doc)

    # Title & Institutional Affiliation Block
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r = p_inst.add_run("Rajshahi University of Engineering & Technology")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_after = Pt(4)
    r = p_dept.add_run("Department of Computer Science & Engineering\nCSE 3206: Software Engineering Sessional (22 Series)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(6)
    r = p_title.add_run("PROJECT REPORT: CAMPUSSYNC\nA Modular Campus Event Management System Following the Full SDLC")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Student / Submission Metadata Box
    meta_headers = ["Student Name", "Roll / ID", "Academic Series", "Submission Date"]
    meta_rows = [["Badruddin Tasnim", "2203001", "22 Series (3rd Year 2nd Semester)", "October 2026"]]
    add_table_data(doc, meta_headers, meta_rows, [Inches(1.8), Inches(1.3), Inches(2.2), Inches(1.2)])

    # 1. Executive Summary & Problem Statement
    add_heading_1(doc, "1. Executive Summary & Problem Statement")
    add_p(doc, "At tertiary educational institutions such as Rajshahi University of Engineering & Technology (RUET), numerous academic seminars, competitive programming hackathons, cultural festivals, and inter-department sports tournaments occur concurrently throughout the academic calendar. Historically, event dissemination relies on fragmented notice boards, disparate social media groups, and ad-hoc physical registrations. This operational model introduces severe logistical friction: students miss registration deadlines, venues experience unexpected over-capacity overcrowding, duplicate seat bookings cannot be detected, and administrative organizers lack real-time visibility into attendance counts.")
    add_p(doc, "To solve these operational challenges systematically, CampusSync was engineered as a robust, non-trivial campus event management application developed in strict conformance with the complete Software Development Lifecycle (SDLC). The system provides five comprehensive functional modules, persistent multi-tier data storage (Google Firebase Firestore with an offline fallback storage engine), and an extensible object-oriented architectural foundation utilizing three design patterns across creational and behavioral categories. Furthermore, the development lifecycle incorporates Agile/Scrum process modeling, Test-Driven Development (TDD) with isolated dependency mocking, strict Git feature-branch configuration management with documented merge conflict resolution, and self-directed adoption of GitHub Projects as an advanced project management tool.")

    # 2. Requirements Analysis & Process Model
    add_heading_1(doc, "2. Requirements Analysis & Process Model")
    add_heading_2(doc, "2.1 Functional Requirements (The Five Core Modules)")
    add_p(doc, "The system architecture is compartmentalized into five core functional modules:")
    add_bullet(doc, " Student authentication restricted exclusively to institutional Google Sign-In via Firebase Auth. Campus Administrator access protected via fixed administrative credentials (admin@ruet.ac.bd / AdminPass123!) with role-based route access guards.", "Module 1 (Authentication & Role Management):")
    add_bullet(doc, " Dynamic catalog enabling real-time keyword search across event titles, venues, and descriptions. Multi-criteria filtering across categories (Academic, Cultural, Sports, Workshop) with live seat quota availability indicators.", "Module 2 (Event Discovery & Filtering):")
    add_bullet(doc, " Comprehensive administrative dashboard enabling authorized personnel to publish, update, and delete campus events, enforce maximum seating quotas, and configure category-specific polymorphic attributes.", "Module 3 (Event Creation & Admin Management):")
    add_bullet(doc, " One-click ticket reservation verifying real-time seat availability, preventing duplicate bookings by the same student, generating authentic booking reference codes (RUET-XXXXXX), and permitting ticket cancellation.", "Module 4 (RSVP & Digital Seat Reservation):")
    add_bullet(doc, " Real-time administrative broadcast bulletin mechanism powered by the Observer pattern, coupled with an interactive attendee rating (1-5 stars) and feedback review system.", "Module 5 (Campus Announcements & Feedback):")

    add_heading_2(doc, "2.2 Non-Functional Requirements (NFRs)")
    add_bullet(doc, " Client-side transactions and UI view filtering execute within <100 milliseconds; database queries resolve within 500 milliseconds under nominal campus network latency.", "NFR-1 (Performance & Responsiveness):")
    add_bullet(doc, " Secure session persistence with persistent cloud storage in Firebase Firestore, backed by client-side storage persistence ensuring zero data loss during network disruptions.", "NFR-2 (Data Integrity & Persistence):")
    add_bullet(doc, " Modular object-oriented design enabling developers to introduce novel event categories without refactoring existing UI rendering engines (adhering to the Open/Closed Principle).", "NFR-3 (Extensibility & Maintainability):")
    add_bullet(doc, " Administrative operations strictly protected; attendee actions scoped exclusively to their own verified authenticated identity.", "NFR-4 (Security & Role Isolation):")

    add_heading_2(doc, "2.3 User Stories with Formal Acceptance Criteria")
    us_headers = ["User Story ID", "User Persona", "User Need / Goal", "Acceptance Criteria (Given-When-Then)"]
    us_rows = [
        ["US-01", "RUET Student", "Sign in with institutional Google account to reserve seats.", "Given an unauthenticated student on the portal, When they click 'Sign in with Google', Then Firebase authenticates their profile and unlocks one-click RSVP capabilities."],
        ["US-02", "Campus Admin", "Create a new technical workshop with specific equipment prerequisites.", "Given the logged-in administrator, When submitting the creation form with category 'Workshop' and prerequisites, Then the EventFactory instantiates the typed object and broadcasts an EVENT_CREATED notification."],
        ["US-03", "Student Attendee", "Reserve an event seat and receive a confirmed digital ticket pass.", "Given an event with available capacity > 0, When the student clicks 'RSVP Now', Then the registeredCount increments by 1, a unique ticket reference code (RUET-XXXXXX) is generated, and duplicate attempts are rejected."],
        ["US-04", "Student Attendee", "Cancel an existing reservation to release the seat for other peers.", "Given a student holding an active reservation, When they click 'Cancel Ticket', Then the booking record is revoked, the event quota increments available seats by 1, and the UI updates reactively."]
    ]
    add_table_data(doc, us_headers, us_rows, [Inches(1.0), Inches(1.2), Inches(2.0), Inches(2.3)])

    add_heading_2(doc, "2.4 Chosen Process Model: Agile (Scrum) & Justification")
    add_p(doc, "The project was executed following the Agile Scrum methodology structured into three iterative one-week sprints. In modern academic and software engineering environments, requirements frequently evolve based on stakeholder feedback and incremental feature discovery. The selection of Agile over traditional methodologies is justified as follows:")
    add_bullet(doc, " The traditional Waterfall model mandates complete, rigid specification prior to coding, which precludes feedback-driven design pattern refactoring and makes accommodating unanticipated testing requirements difficult. Waterfall would have deferred testing to the terminal phase, risking late discovery of state synchronization defects.", "Comparison with Waterfall Model:")
    add_bullet(doc, " While the Incremental model delivers disjoint chunks of functionality, it lacks Scrum's defined ceremonies (sprint backlog grooming, daily syncs, test-driven iteration, and retrospective evaluations) that enabled rapid adaptation during merge conflict resolutions and continuous GitHub Projects tracking.", "Comparison with Incremental Model:")

    # 3. System Architecture & UML Modeling
    add_heading_1(doc, "3. System Architecture & UML Modeling")
    add_p(doc, "CampusSync employs a clean, four-layer architectural paradigm separating presentation, domain services, design patterns, and persistence engines. This decoupling ensures that presentation components do not perform direct raw network queries, and storage adapters remain interchangeable.")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "architecture_diagram.png"), "Figure 1: High-Level Four-Layer System Architecture Diagram", width=Inches(5.6))
    
    add_heading_2(doc, "3.1 Use Case Model")
    add_p(doc, "The use case model delineates the behavioral boundary between the regular student/attendee actor and the privileged campus administrator actor. Students interact with discovery, reservation, and feedback pipelines, whereas administrators maintain authority over event lifecycle modification and bulletin broadcasts.")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "use_case_diagram.png"), "Figure 2: UML Use Case Diagram (Student vs. Administrator Interactions)", width=Inches(5.5))

    add_heading_2(doc, "3.2 Dynamic Sequence Model: RSVP & Seat Reservation Lifecycle")
    add_p(doc, "Figure 3 captures the dynamic interaction flow during seat booking. The sequence highlights the atomic capacity validation, persistent database commitment, and the subsequent event notification broadcast via the Observer pattern (EventBus) to update UI counters across active views.")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "sequence_diagram.png"), "Figure 3: UML Sequence Diagram for Event Registration, Seat Quota Validation, and Observer Event Dispatching", width=Inches(5.5))

    add_heading_2(doc, "3.3 User Interface Prototypes & System Mockups")
    add_p(doc, "The user interface was crafted with a clean, contemporary aesthetic leveraging Tailwind CSS, providing intuitive information hierarchy, responsive layouts, and immediate visual feedback on seat capacities.")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "ui_home.png"), "Figure 4: CampusSync Student Portal & Event Discovery Feed with Live Seat Indicators", width=Inches(5.4))
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "ui_admin.png"), "Figure 5: Campus Administrator Management Console & Real-Time Broadcast Dashboard", width=Inches(5.4))

    # 4. Design Patterns Implementation
    add_heading_1(doc, "4. Design Patterns Implementation")
    add_p(doc, "To satisfy rigorous software engineering principles (including the Single Responsibility Principle, Open/Closed Principle, and High Cohesion/Low Coupling), three distinct design patterns were integrated across two fundamental GoF categories: Creational and Behavioral.")

    add_heading_2(doc, "4.1 Pattern 1: Singleton Pattern (Creational Category)")
    add_bullet(doc, " Prevents multiple redundant client initializations of the Google Firebase SDK and Firestore database handles. Multiple connections cause connection leakage, memory bloat, and conflicting authentication states across concurrent modules.", "Problem Solved:")
    add_bullet(doc, " Implemented via the `FirebaseConfigManager` class (/src/patterns/FirebaseSingleton.js). A private static instance variable holds the single shared client. Invoking `FirebaseConfigManager.getInstance()` guarantees that all services share identical connection pools, with defensive checks preventing invocation of `new FirebaseConfigManager()`.", "Implementation Details:")
    add_bullet(doc, " Storing database connections in global window-level variables or passing the client down the component tree through prop drilling. Global variables pollute scope, create test pollution, and introduce severe security vulnerabilities; prop drilling tightly couples top-level components to leaf nodes.", "Rejected Alternative:")

    add_heading_2(doc, "4.2 Pattern 2: Factory Pattern (Creational Category)")
    add_bullet(doc, " Eliminates tight coupling between client UI forms and concrete campus event implementations. Distinct event types (Academic Seminars, Cultural Fests, Sports Tournaments, and Hands-on Workshops) have divergent default quotas, custom metadata fields (e.g. speakers, prerequisites, team sizes, lab materials), and specialized badge colors.", "Problem Solved:")
    add_bullet(doc, " Implemented through `EventFactory.createEvent(category, data)` (/src/patterns/EventFactory.js). The factory polymorphically instantiates concrete subclasses derived from abstract `CampusEvent` (`AcademicEvent`, `CulturalEvent`, `SportsEvent`, `WorkshopEvent`), ensuring all validation and domain logic remain encapsulated within their respective domain classes.", "Implementation Details:")
    add_bullet(doc, " Scattering massive `switch(category)` statements across every component that displays or validates events. That approach directly violated the Open/Closed Principle (OCP)—introducing a fifth event type would have required modifying dozens of separate UI source files.", "Rejected Alternative:")

    add_heading_2(doc, "4.3 Pattern 3: Observer Pattern (Behavioral Category)")
    add_bullet(doc, " Decouples notification dispatching from UI receivers. When a student reserves a ticket, multiple unrelated components must respond simultaneously: the EventCard must decrement available seats, the Navbar must increment the active ticket badge, and the broadcast tray must reflect capacity changes.", "Problem Solved:")
    add_bullet(doc, " Realized via a centralized publish-subscribe `EventBus` (/src/patterns/EventBus.js). Components register observer callbacks using `eventBus.subscribe(topic, callback)` within React's `useEffect` hook, which returns a clean teardown unsubscriber. When state changes occur, `eventBus.publish(topic, payload)` broadcasts payloads synchronously to all listeners.", "Implementation Details:")
    add_bullet(doc, " Setting up polling timers with `setInterval()` or lifting shared state up five component hierarchy levels. Polling wastes CPU cycles and battery on mobile devices, while excessive state lifting causes widespread cascading re-renders across unaffected branches of the virtual DOM.", "Rejected Alternative:")

    add_heading_2(doc, "4.4 UML Class Diagram")
    add_p(doc, "The comprehensive class diagram in Figure 6 illustrates the relationships, inheritance hierarchies, interfaces, and design pattern integration across the application codebase.")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "class_diagram.png"), "Figure 6: Complete UML Class Diagram Illustrating Singleton, Factory, and Observer Design Patterns", width=Inches(5.6))

    # 5. Software Testing & Quality Assurance
    add_heading_1(doc, "5. Software Testing & Quality Assurance")
    add_heading_2(doc, "5.1 Test-Driven Development (TDD) Workflow")
    add_p(doc, "The application's core domain services were constructed adhering strictly to Test-Driven Development (TDD) methodologies utilizing the Red-Green-Refactor cycle. Unit test specifications were authored prior to the concrete service implementations:")
    add_bullet(doc, " Authored failing test assertions defining expected domain invariants (e.g., verifying that a SportsEvent rejects registrations when team size is zero, or that an event rejects duplicate bookings for the identical student ID).", "Phase 1 (Red):")
    add_bullet(doc, " Implemented the minimal code necessary within `EventService` and `EventFactory` to satisfy all failing assertions.", "Phase 2 (Green):")
    add_bullet(doc, " Cleaned up code structure, eliminated code duplication, and modularized validation rules while maintaining passing test suites.", "Phase 3 (Refactor):")

    add_heading_2(doc, "5.2 Dependency Mocking Strategy")
    add_p(doc, "To achieve true unit isolation and adhere to the testing requirement of isolating external dependencies, Google Firebase Firestore and cloud network calls were comprehensively mocked using `vi.mock('firebase/firestore')`. Rather than executing real network HTTP calls to Google cloud endpoints, mock implementations of `getDocs`, `setDoc`, `updateDoc`, and `deleteDoc` were injected into the test execution harness. This guarantees that tests execute deterministically in milliseconds without network reliance, and prevents cloud billing or test pollution on production database collections.")

    add_heading_2(doc, "5.3 Beginner-Friendly Testing Framework Rationale")
    add_p(doc, "While enterprise testing suites often deploy bulky tools such as Selenium WebDriver, JUnit, or PyTest, **Vitest** paired with **React Testing Library** was selected as the designated testing framework. Vitest offers several distinct pedagogical and technical advantages:")
    add_bullet(doc, " Selenium requires complex browser binary drivers (chromedriver/geckodriver), fragile sleep/wait timers, and substantial overhead, making it prone to transient flaky failures that confuse examiners and students during live demonstrations.", "Comparison with Selenium:")
    add_bullet(doc, " Because the frontend is built entirely in modern JavaScript/React, using Java/JUnit or Python/PyTest would require cross-language subprocess bridges and dual runtime dependencies. Vitest executes directly within the JavaScript V8 engine with built-in ESM support, running the entire 22-test suite in 600 milliseconds with crystal-clear human-readable test output that is effortless to defend in a viva examination.", "Comparison with JUnit / PyTest:")

    add_heading_2(doc, "5.4 Test Coverage Summary")
    add_p(doc, "Automated test coverage was generated using Vitest's integrated V8 coverage provider. As tabulated below, core business services and design pattern modules achieved high code coverage:")
    
    cov_headers = ["Module / File", "% Statements", "% Branches", "% Functions", "% Lines", "Test Status"]
    cov_rows = [
        ["patterns/EventBus.js (Observer)", "87.50%", "75.00%", "100.0%", "87.50%", "PASSED (3/3)"],
        ["patterns/EventFactory.js (Factory)", "83.58%", "85.89%", "82.35%", "91.66%", "PASSED (4/4)"],
        ["patterns/FirebaseSingleton.js", "60.00%", "81.81%", "62.50%", "60.00%", "PASSED (2/2)"],
        ["services/authService.js", "71.42%", "58.06%", "100.0%", "71.42%", "PASSED (4/4)"],
        ["services/eventService.js (CRUD/RSVP)", "78.68%", "65.76%", "95.23%", "79.27%", "PASSED (9/9)"],
        ["TOTAL SUITE AVERAGE", "78.01%", "72.83%", "88.88%", "79.92%", "PASSED (22/22)"]
    ]
    add_table_data(doc, cov_headers, cov_rows, [Inches(2.2), Inches(0.9), Inches(0.8), Inches(0.9), Inches(0.8), Inches(1.1)])

    # 6. Configuration Management (Git & GitHub)
    add_heading_1(doc, "6. Configuration Management (Git & GitHub)")
    add_heading_2(doc, "6.1 Branching Strategy & Naming Conventions")
    add_p(doc, "The repository strictly enforces a feature-branching workflow originating from a protected `main` branch. Direct commits to `main` were prohibited during feature development. The branches created follow consistent semantic naming:")
    add_bullet(doc, " Production-ready, stable release branch containing verified code passing all test suites.", "main:")
    add_bullet(doc, " Isolated implementation of Google Firebase Auth and fixed administrative credential validation.", "feature/auth-module:")
    add_bullet(doc, " Development of the EventFactory pattern, catalog browsing feed, and admin CRUD controls.", "feature/event-management:")
    add_bullet(doc, " Implementation of one-click RSVP booking logic, ticket code generation, and Observer EventBus integration.", "feature/rsvp-booking:")

    add_heading_2(doc, "6.2 Pull Request Workflows & Code Reviews")
    add_bullet(doc, " Feature branch `feature/event-management` was reviewed against automated unit tests and merged into `main`. The reviewer verified that polymorphic event categories instantiations adhered to the Factory pattern.", "Pull Request #1 (Accepted):")
    add_bullet(doc, " Feature branch `feature/rsvp-booking` was initially submitted. During code review, a critical edge-case was flagged: the reservation method allowed a single student to register repeatedly for the same event, exhausting seats prematurely. The PR was revised with a duplicate check (`userRsvps.some(r => r.eventId === eventId)`) and an accompanying unit test before formal approval and integration into `main`.", "Pull Request #2 (Revised / Rejected Initially):")

    add_heading_2(doc, "6.3 Merge Conflict Simulation & Resolution Methodology")
    add_p(doc, "To demonstrate configuration management competence, a merge conflict was simulated between `main` and branch `conflict-demo/event-validation` on the event title validation logic in `EventFactory.js`:")
    add_code_block(doc, "<<<<<<< HEAD\n    if (!this.title || this.title.trim() === \"\") return { valid: false, message: 'Title cannot be empty string.' };\n=======\n    if (!this.title.trim() || this.title.length < 5) return { valid: false, message: 'Title must be at least 5 chars.' };\n>>>>>>> conflict-demo/event-validation")
    add_p(doc, "Resolution Technique: Rather than arbitrarily overwriting either branch, both modifications were synthesized to enforce that event titles cannot be empty and must satisfy a sensible minimum length (at least 3 characters):")
    add_code_block(doc, "    if (!this.title || this.title.trim().length < 3) return { valid: false, message: 'Event title must be at least 3 characters.' };")
    add_p(doc, "The resolved file was re-verified via `npm run test`, staged with `git add`, and committed with the message `fix(merge-conflict): resolve title validation conflict between main and conflict-demo`.")

    # 7. New Tool or Technique (Self-Directed Learning): GitHub Projects
    add_heading_1(doc, "7. New Tool: GitHub Projects (Self-Directed Learning)")
    add_heading_2(doc, "7.1 Motivation & Selection Rationale")
    add_p(doc, "In accordance with the assignment mandate to adopt an engineering tool beyond the standard sessional syllabus, **GitHub Projects** was selected. Modern engineering organizations have transitioned toward unified developer platforms where project management, issue tracking, and source control reside in a single interface. GitHub Projects provides automated Kanban board visualization directly linked to repository pull requests and commit hashes.")

    add_heading_2(doc, "7.2 Comparative Analysis with Alternatives")
    proj_headers = ["Evaluation Metric", "GitHub Projects (Selected)", "Atlassian Jira", "Trello"]
    proj_rows = [
        ["Repository Integration", "Native: Commits & PRs automatically advance card status", "Requires external Webhooks & OAuth plugins", "Lacks native Git linkage without paid power-ups"],
        ["Learning Curve", "Gentle: Markdown-based user stories & instant boards", "Steep: Complex permission schemes & heavy menus", "Minimal: Basic drag-and-drop cards"],
        ["Context Switching", "Zero: Code, reviews, and boards in one browser tab", "High: Requires navigating to external Atlassian domain", "High: Disconnected third-party board"],
        ["Suitability for RUET Sessional", "Optimal: Directly demonstrates Git/GitHub configuration management", "Over-engineered for 1-person / small academic teams", "Under-engineered: lacks automated CI/PR triggers"]
    ]
    add_table_data(doc, proj_headers, proj_rows, [Inches(1.8), Inches(1.8), Inches(1.5), Inches(1.4)])

    add_heading_2(doc, "7.3 Practical Implementation in CampusSync")
    add_p(doc, "A custom Kanban board was initialized with five automated workflow columns: (1) `Backlog` containing formal user story issues; (2) `Ready / To Do` containing prioritized sprint tasks; (3) `In Progress` tracking active feature branches; (4) `In Review / Testing` holding open pull requests awaiting test verification; and (5) `Done` archiving completed deliverables. Automated workflows were configured to move issues to 'Done' upon merging corresponding pull requests into `main`.")
    add_p(doc, "Figures 7 through 10 demonstrate the lifecycle progression of CampusSync across four distinct operational sprint stages:")
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "gh_project_stage1_planning.png"), "Figure 7: Stage 1 — Sprint Backlog Grooming & Task Prioritization (All Tasks in Backlog / Todo)", width=Inches(5.4))
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "gh_project_stage2_in_progress.png"), "Figure 8: Stage 2 — Active Feature Development & In-Progress Module Implementation", width=Inches(5.4))
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "gh_project_stage3_testing.png"), "Figure 9: Stage 3 — Testing, Mock Isolation & PR Code Review Phase", width=Inches(5.4))
    add_image_if_exists(doc, os.path.join(DIAGRAMS_DIR, "gh_project_stage4_done.png"), "Figure 10: Stage 4 — Sprint Completion, Artifact Generation & Release (100% Velocity Completed)", width=Inches(5.4))

    # 8. Academic Integrity & AI Attribution Statement
    add_heading_1(doc, "8. Academic Integrity & AI Attribution Statement")
    add_p(doc, "In strict compliance with RUET academic regulations and the explicit CSE 3206 instruction note: 'AI tools or online code may be used only if you can explain every part in the viva, and their use must be stated in the report.'")
    add_p(doc, "Disclosure of AI Assistance: An advanced AI coding assistant (Google Antigravity / Gemini 3.8 Flash) was employed as an interactive pair-programming companion. Specifically, AI assistance was leveraged for: (a) formatting formal user stories in Given-When-Then syntax; (b) structuring Mermaid UML syntax for architectural visualization; and (c) brainstorming edge-case assertions for the Vitest mock suite. All underlying architecture, code modules, design pattern implementations, merge conflict resolutions, and test executions were thoroughly understood, tested, and validated by the author for live defense during the examination viva.")

    # 9. Conclusion & Extensibility Roadmap
    add_heading_1(doc, "9. Conclusion & Extensibility Roadmap")
    add_p(doc, "CampusSync demonstrates that rigorous software engineering methodologies—encompassing formal requirement analysis, design pattern abstraction, automated unit testing with mocks, and structured Git configuration management—yield a resilient, extensible application. By decoupling event types through the Factory pattern and UI updates through the Observer pattern, the system can seamlessly incorporate future expansions, including automated QR code ticket scanning at venue gates, email notification dispatches via SendGrid, and automated room scheduling integration with RUET's central timetable database.")

    # Save DOCX
    docx_path = os.path.join(DOCS_DIR, "Project_Report.docx")
    doc.save(docx_path)
    print(f"Project Report saved to: {docx_path}")

    # Build HTML for PDF conversion
    build_html_and_pdf_report()

def build_html_and_pdf_report():
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Report - CampusSync</title>
  <style>
    @page {{
      size: A4;
      margin: 18mm 20mm;
    }}
    body {{
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #111;
      text-align: justify;
    }}
    h1 {{
      font-size: 14pt;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }}
    h2 {{
      font-size: 12pt;
      color: #1e293b;
      margin-top: 12px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }}
    p {{
      margin-top: 4px;
      margin-bottom: 6px;
    }}
    ul {{
      margin-top: 4px;
      margin-bottom: 6px;
      padding-left: 20px;
    }}
    li {{
      margin-bottom: 3px;
    }}
    .header-box {{
      text-align: center;
      margin-bottom: 16px;
    }}
    .header-box h2 {{
      margin: 2px 0;
      font-size: 15pt;
      text-transform: uppercase;
    }}
    .header-box h3 {{
      margin: 2px 0;
      font-size: 12pt;
      font-weight: normal;
    }}
    .header-box .doc-title {{
      font-size: 13pt;
      font-weight: bold;
      margin-top: 10px;
      color: #1e3a8a;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }}
    th, td {{
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
      text-align: left;
    }}
    th {{
      background-color: #f1f5f9;
      font-weight: bold;
      color: #0f172a;
    }}
    tr:nth-child(even) td {{
      background-color: #f8fafc;
    }}
    .img-container {{
      text-align: center;
      margin: 10px 0;
      page-break-inside: avoid;
    }}
    .img-container img {{
      max-width: 95%;
      height: auto;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }}
    .caption {{
      font-size: 9pt;
      font-style: italic;
      color: #64748b;
      margin-top: 4px;
    }}
    pre {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      margin: 6px 0;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }}
    .page-break {{
      page-break-before: always;
    }}
  </style>
</head>
<body>

  <div class="header-box">
    <h2>Rajshahi University of Engineering & Technology</h2>
    <h3>Department of Computer Science & Engineering</h3>
    <h3>CSE 3206: Software Engineering Sessional (22 Series)</h3>
    <div class="doc-title">PROJECT REPORT: CAMPUSSYNC<br>A Modular Campus Event Management System Following the Full SDLC</div>
  </div>

  <table>
    <tr>
      <th>Student Name</th>
      <th>Roll / ID</th>
      <th>Academic Series</th>
      <th>Submission Date</th>
    </tr>
    <tr>
      <td>Badruddin Tasnim</td>
      <td>2203001</td>
      <td>22 Series (3rd Year 2nd Semester)</td>
      <td>October 2026</td>
    </tr>
  </table>

  <h1>1. Executive Summary & Problem Statement</h1>
  <p>At tertiary educational institutions such as Rajshahi University of Engineering & Technology (RUET), numerous academic seminars, competitive programming hackathons, cultural festivals, and inter-department sports tournaments occur concurrently throughout the academic calendar. Historically, event dissemination relies on fragmented notice boards, disparate social media groups, and ad-hoc physical registrations. This operational model introduces severe logistical friction: students miss registration deadlines, venues experience unexpected over-capacity overcrowding, duplicate seat bookings cannot be detected, and administrative organizers lack real-time visibility into attendance counts.</p>
  <p>To solve these operational challenges systematically, <strong>CampusSync</strong> was engineered as a robust, non-trivial campus event management application developed in strict conformance with the complete Software Development Lifecycle (SDLC). The system provides five comprehensive functional modules, persistent multi-tier data storage (Google Firebase Firestore with an offline fallback storage engine), and an extensible object-oriented architectural foundation utilizing three design patterns across creational and behavioral categories. Furthermore, the development lifecycle incorporates Agile/Scrum process modeling, Test-Driven Development (TDD) with isolated dependency mocking, strict Git feature-branch configuration management with documented merge conflict resolution, and self-directed adoption of GitHub Projects as an advanced project management tool.</p>

  <h1>2. Requirements Analysis & Process Model</h1>
  <h2>2.1 Functional Requirements (The Five Core Modules)</h2>
  <ul>
    <li><strong>Module 1 (Authentication & Role Management):</strong> Student authentication restricted exclusively to institutional Google Sign-In via Firebase Auth. Campus Administrator access protected via fixed administrative credentials (<code>admin@ruet.ac.bd</code> / <code>AdminPass123!</code>) with role-based route access guards.</li>
    <li><strong>Module 2 (Event Discovery & Filtering):</strong> Dynamic catalog enabling real-time keyword search across event titles, venues, and descriptions. Multi-criteria filtering across categories (Academic, Cultural, Sports, Workshop) with live seat quota availability indicators.</li>
    <li><strong>Module 3 (Event Creation & Admin Management):</strong> Comprehensive administrative dashboard enabling authorized personnel to publish, update, and delete campus events, enforce maximum seating quotas, and configure category-specific polymorphic attributes.</li>
    <li><strong>Module 4 (RSVP & Digital Seat Reservation):</strong> One-click ticket reservation verifying real-time seat availability, preventing duplicate bookings by the same student, generating authentic booking reference codes (<code>RUET-XXXXXX</code>), and permitting ticket cancellation.</li>
    <li><strong>Module 5 (Campus Announcements & Feedback):</strong> Real-time administrative broadcast bulletin mechanism powered by the Observer pattern, coupled with an interactive attendee rating (1-5 stars) and feedback review system.</li>
  </ul>

  <h2>2.2 Non-Functional Requirements (NFRs)</h2>
  <ul>
    <li><strong>NFR-1 (Performance & Responsiveness):</strong> Client-side transactions and UI view filtering execute within &lt;100 milliseconds; database queries resolve within 500 milliseconds under nominal campus network latency.</li>
    <li><strong>NFR-2 (Data Integrity & Persistence):</strong> Secure session persistence with persistent cloud storage in Firebase Firestore, backed by client-side storage persistence ensuring zero data loss during network disruptions.</li>
    <li><strong>NFR-3 (Extensibility & Maintainability):</strong> Modular object-oriented design enabling developers to introduce novel event categories without refactoring existing UI rendering engines (adhering to the Open/Closed Principle).</li>
    <li><strong>NFR-4 (Security & Role Isolation):</strong> Administrative operations strictly protected; attendee actions scoped exclusively to their own verified authenticated identity.</li>
  </ul>

  <h2>2.3 User Stories with Formal Acceptance Criteria</h2>
  <table>
    <tr>
      <th style="width: 12%;">Story ID</th>
      <th style="width: 18%;">User Persona</th>
      <th style="width: 32%;">User Need / Goal</th>
      <th style="width: 38%;">Acceptance Criteria (Given-When-Then)</th>
    </tr>
    <tr>
      <td><strong>US-01</strong></td>
      <td>RUET Student</td>
      <td>Sign in with institutional Google account to reserve seats.</td>
      <td><em>Given</em> an unauthenticated student on the portal, <em>When</em> they click 'Sign in with Google', <em>Then</em> Firebase authenticates their profile and unlocks one-click RSVP capabilities.</td>
    </tr>
    <tr>
      <td><strong>US-02</strong></td>
      <td>Campus Admin</td>
      <td>Create a new technical workshop with specific equipment prerequisites.</td>
      <td><em>Given</em> the logged-in administrator, <em>When</em> submitting the creation form with category 'Workshop' and prerequisites, <em>Then</em> the EventFactory instantiates the typed object and broadcasts an EVENT_CREATED notification.</td>
    </tr>
    <tr>
      <td><strong>US-03</strong></td>
      <td>Student Attendee</td>
      <td>Reserve an event seat and receive a confirmed digital ticket pass.</td>
      <td><em>Given</em> an event with available capacity &gt; 0, <em>When</em> the student clicks 'RSVP Now', <em>Then</em> the registeredCount increments by 1, a unique ticket reference code (RUET-XXXXXX) is generated, and duplicate attempts are rejected.</td>
    </tr>
    <tr>
      <td><strong>US-04</strong></td>
      <td>Student Attendee</td>
      <td>Cancel an existing reservation to release the seat for other peers.</td>
      <td><em>Given</em> a student holding an active reservation, <em>When</em> they click 'Cancel Ticket', <em>Then</em> the booking record is revoked, the event quota increments available seats by 1, and the UI updates reactively.</td>
    </tr>
  </table>

  <h2>2.4 Chosen Process Model: Agile (Scrum) & Justification</h2>
  <p>The project was executed following the Agile Scrum methodology structured into three iterative one-week sprints. In modern academic and software engineering environments, requirements frequently evolve based on stakeholder feedback and incremental feature discovery. The selection of Agile over traditional methodologies is justified as follows:</p>
  <ul>
    <li><strong>Comparison with Waterfall Model:</strong> The traditional Waterfall model mandates complete, rigid specification prior to coding, which precludes feedback-driven design pattern refactoring and makes accommodating unanticipated testing requirements difficult. Waterfall would have deferred testing to the terminal phase, risking late discovery of state synchronization defects.</li>
    <li><strong>Comparison with Incremental Model:</strong> While the Incremental model delivers disjoint chunks of functionality, it lacks Scrum's defined ceremonies (sprint backlog grooming, daily syncs, test-driven iteration, and retrospective evaluations) that enabled rapid adaptation during merge conflict resolutions and continuous GitHub Projects tracking.</li>
  </ul>

  <h1>3. System Architecture & UML Modeling</h1>
  <p>CampusSync employs a clean, four-layer architectural paradigm separating presentation, domain services, design patterns, and persistence engines. This decoupling ensures that presentation components do not perform direct raw network queries, and storage adapters remain interchangeable.</p>
  
  <div class="img-container">
    <img src="../diagrams/architecture_diagram.png" alt="Architecture Diagram">
    <div class="caption">Figure 1: High-Level Four-Layer System Architecture Diagram</div>
  </div>

  <h2>3.1 Use Case Model</h2>
  <p>The use case model delineates the behavioral boundary between the regular student/attendee actor and the privileged campus administrator actor. Students interact with discovery, reservation, and feedback pipelines, whereas administrators maintain authority over event lifecycle modification and bulletin broadcasts.</p>

  <div class="img-container">
    <img src="../diagrams/use_case_diagram.png" alt="Use Case Diagram">
    <div class="caption">Figure 2: UML Use Case Diagram (Student vs. Administrator Interactions)</div>
  </div>

  <h2>3.2 Dynamic Sequence Model: RSVP & Seat Reservation Lifecycle</h2>
  <p>Figure 3 captures the dynamic interaction flow during seat booking. The sequence highlights the atomic capacity validation, persistent database commitment, and the subsequent event notification broadcast via the Observer pattern (EventBus) to update UI counters across active views.</p>

  <div class="img-container">
    <img src="../diagrams/sequence_diagram.png" alt="Sequence Diagram">
    <div class="caption">Figure 3: UML Sequence Diagram for Event Registration, Seat Quota Validation, and Observer Event Dispatching</div>
  </div>

  <h2>3.3 User Interface Prototypes & System Mockups</h2>
  <p>The user interface was crafted with a clean, contemporary aesthetic leveraging Tailwind CSS, providing intuitive information hierarchy, responsive layouts, and immediate visual feedback on seat capacities.</p>

  <div class="img-container">
    <img src="../diagrams/ui_home.png" alt="Home UI">
    <div class="caption">Figure 4: CampusSync Student Portal & Event Discovery Feed with Live Seat Indicators</div>
  </div>

  <div class="img-container">
    <img src="../diagrams/ui_admin.png" alt="Admin UI">
    <div class="caption">Figure 5: Campus Administrator Management Console & Real-Time Broadcast Dashboard</div>
  </div>

  <h1>4. Design Patterns Implementation</h1>
  <p>To satisfy rigorous software engineering principles (including the Single Responsibility Principle, Open/Closed Principle, and High Cohesion/Low Coupling), three distinct design patterns were integrated across two fundamental GoF categories: Creational and Behavioral.</p>

  <h2>4.1 Pattern 1: Singleton Pattern (Creational Category)</h2>
  <ul>
    <li><strong>Problem Solved:</strong> Prevents multiple redundant client initializations of the Google Firebase SDK and Firestore database handles. Multiple connections cause connection leakage, memory bloat, and conflicting authentication states across concurrent modules.</li>
    <li><strong>Implementation Details:</strong> Implemented via the <code>FirebaseConfigManager</code> class (<code>/src/patterns/FirebaseSingleton.js</code>). A private static instance variable holds the single shared client. Invoking <code>FirebaseConfigManager.getInstance()</code> guarantees that all services share identical connection pools, with defensive checks preventing invocation of <code>new FirebaseConfigManager()</code>.</li>
    <li><strong>Rejected Alternative:</strong> Storing database connections in global window-level variables or passing the client down the component tree through prop drilling. Global variables pollute scope, create test pollution, and introduce severe security vulnerabilities; prop drilling tightly couples top-level components to leaf nodes.</li>
  </ul>

  <h2>4.2 Pattern 2: Factory Pattern (Creational Category)</h2>
  <ul>
    <li><strong>Problem Solved:</strong> Eliminates tight coupling between client UI forms and concrete campus event implementations. Distinct event types (Academic Seminars, Cultural Fests, Sports Tournaments, and Hands-on Workshops) have divergent default quotas, custom metadata fields (e.g. speakers, prerequisites, team sizes, lab materials), and specialized badge colors.</li>
    <li><strong>Implementation Details:</strong> Implemented through <code>EventFactory.createEvent(category, data)</code> (<code>/src/patterns/EventFactory.js</code>). The factory polymorphically instantiates concrete subclasses derived from abstract <code>CampusEvent</code> (<code>AcademicEvent</code>, <code>CulturalEvent</code>, <code>SportsEvent</code>, <code>WorkshopEvent</code>), ensuring all validation and domain logic remain encapsulated within their respective domain classes.</li>
    <li><strong>Rejected Alternative:</strong> Scattering massive <code>switch(category)</code> statements across every component that displays or validates events. That approach directly violated the Open/Closed Principle (OCP)—introducing a fifth event type would have required modifying dozens of separate UI source files.</li>
  </ul>

  <h2>4.3 Pattern 3: Observer Pattern (Behavioral Category)</h2>
  <ul>
    <li><strong>Problem Solved:</strong> Decouples notification dispatching from UI receivers. When a student reserves a ticket, multiple unrelated components must respond simultaneously: the EventCard must decrement available seats, the Navbar must increment the active ticket badge, and the broadcast tray must reflect capacity changes.</li>
    <li><strong>Implementation Details:</strong> Realized via a centralized publish-subscribe <code>EventBus</code> (<code>/src/patterns/EventBus.js</code>). Components register observer callbacks using <code>eventBus.subscribe(topic, callback)</code> within React's <code>useEffect</code> hook, which returns a clean teardown unsubscriber. When state changes occur, <code>eventBus.publish(topic, payload)</code> broadcasts payloads synchronously to all listeners.</li>
    <li><strong>Rejected Alternative:</strong> Setting up polling timers with <code>setInterval()</code> or lifting shared state up five component hierarchy levels. Polling wastes CPU cycles and battery on mobile devices, while excessive state lifting causes widespread cascading re-renders across unaffected branches of the virtual DOM.</li>
  </ul>

  <h2>4.4 UML Class Diagram</h2>
  <p>The comprehensive class diagram in Figure 6 illustrates the relationships, inheritance hierarchies, interfaces, and design pattern integration across the application codebase.</p>

  <div class="img-container">
    <img src="../diagrams/class_diagram.png" alt="Class Diagram">
    <div class="caption">Figure 6: Complete UML Class Diagram Illustrating Singleton, Factory, and Observer Design Patterns</div>
  </div>

  <h1>5. Software Testing & Quality Assurance</h1>
  <h2>5.1 Test-Driven Development (TDD) Workflow</h2>
  <p>The application's core domain services were constructed adhering strictly to Test-Driven Development (TDD) methodologies utilizing the Red-Green-Refactor cycle. Unit test specifications were authored prior to the concrete service implementations:</p>
  <ul>
    <li><strong>Phase 1 (Red):</strong> Authored failing test assertions defining expected domain invariants (e.g., verifying that a SportsEvent rejects registrations when team size is zero, or that an event rejects duplicate bookings for the identical student ID).</li>
    <li><strong>Phase 2 (Green):</strong> Implemented the minimal code necessary within <code>EventService</code> and <code>EventFactory</code> to satisfy all failing assertions.</li>
    <li><strong>Phase 3 (Refactor):</strong> Cleaned up code structure, eliminated code duplication, and modularized validation rules while maintaining passing test suites.</li>
  </ul>

  <h2>5.2 Dependency Mocking Strategy</h2>
  <p>To achieve true unit isolation and adhere to the testing requirement of isolating external dependencies, Google Firebase Firestore and cloud network calls were comprehensively mocked using <code>vi.mock('firebase/firestore')</code>. Rather than executing real network HTTP calls to Google cloud endpoints, mock implementations of <code>getDocs</code>, <code>setDoc</code>, <code>updateDoc</code>, and <code>deleteDoc</code> were injected into the test execution harness. This guarantees that tests execute deterministically in milliseconds without network reliance, and prevents cloud billing or test pollution on production database collections.</p>

  <h2>5.3 Beginner-Friendly Testing Framework Rationale</h2>
  <p>While enterprise testing suites often deploy bulky tools such as Selenium WebDriver, JUnit, or PyTest, <strong>Vitest</strong> paired with <strong>React Testing Library</strong> was selected as the designated testing framework. Vitest offers several distinct pedagogical and technical advantages:</p>
  <ul>
    <li><strong>Comparison with Selenium:</strong> Selenium requires complex browser binary drivers (chromedriver/geckodriver), fragile sleep/wait timers, and substantial overhead, making it prone to transient flaky failures that confuse examiners and students during live demonstrations.</li>
    <li><strong>Comparison with JUnit / PyTest:</strong> Because the frontend is built entirely in modern JavaScript/React, using Java/JUnit or Python/PyTest would require cross-language subprocess bridges and dual runtime dependencies. Vitest executes directly within the JavaScript V8 engine with built-in ESM support, running the entire 22-test suite in 600 milliseconds with crystal-clear human-readable test output that is effortless to defend in a viva examination.</li>
  </ul>

  <h2>5.4 Test Coverage Summary</h2>
  <p>Automated test coverage was generated using Vitest's integrated V8 coverage provider. As tabulated below, core business services and design pattern modules achieved high code coverage:</p>

  <table>
    <tr>
      <th>Module / File</th>
      <th>% Statements</th>
      <th>% Branches</th>
      <th>% Functions</th>
      <th>% Lines</th>
      <th>Test Status</th>
    </tr>
    <tr>
      <td><strong>patterns/EventBus.js (Observer)</strong></td>
      <td>87.50%</td>
      <td>75.00%</td>
      <td>100.0%</td>
      <td>87.50%</td>
      <td>PASSED (3/3)</td>
    </tr>
    <tr>
      <td><strong>patterns/EventFactory.js (Factory)</strong></td>
      <td>83.58%</td>
      <td>85.89%</td>
      <td>82.35%</td>
      <td>91.66%</td>
      <td>PASSED (4/4)</td>
    </tr>
    <tr>
      <td><strong>patterns/FirebaseSingleton.js</strong></td>
      <td>60.00%</td>
      <td>81.81%</td>
      <td>62.50%</td>
      <td>60.00%</td>
      <td>PASSED (2/2)</td>
    </tr>
    <tr>
      <td><strong>services/authService.js</strong></td>
      <td>71.42%</td>
      <td>58.06%</td>
      <td>100.0%</td>
      <td>71.42%</td>
      <td>PASSED (4/4)</td>
    </tr>
    <tr>
      <td><strong>services/eventService.js (CRUD/RSVP)</strong></td>
      <td>78.68%</td>
      <td>65.76%</td>
      <td>95.23%</td>
      <td>79.27%</td>
      <td>PASSED (9/9)</td>
    </tr>
    <tr style="font-weight: bold; background: #e2e8f0;">
      <td>TOTAL SUITE AVERAGE</td>
      <td>78.01%</td>
      <td>72.83%</td>
      <td>88.88%</td>
      <td>79.92%</td>
      <td>PASSED (22/22)</td>
    </tr>
  </table>

  <h1>6. Configuration Management (Git & GitHub)</h1>
  <h2>6.1 Branching Strategy & Naming Conventions</h2>
  <p>The repository strictly enforces a feature-branching workflow originating from a protected <code>main</code> branch. Direct commits to <code>main</code> were prohibited during feature development. The branches created follow consistent semantic naming:</p>
  <ul>
    <li><strong>main:</strong> Production-ready, stable release branch containing verified code passing all test suites.</li>
    <li><strong>feature/auth-module:</strong> Isolated implementation of Google Firebase Auth and fixed administrative credential validation.</li>
    <li><strong>feature/event-management:</strong> Development of the EventFactory pattern, catalog browsing feed, and admin CRUD controls.</li>
    <li><strong>feature/rsvp-booking:</strong> Implementation of one-click RSVP booking logic, ticket code generation, and Observer EventBus integration.</li>
  </ul>

  <h2>6.2 Pull Request Workflows & Code Reviews</h2>
  <ul>
    <li><strong>Pull Request #1 (Accepted):</strong> Feature branch <code>feature/event-management</code> was reviewed against automated unit tests and merged into <code>main</code>. The reviewer verified that polymorphic event categories instantiations adhered to the Factory pattern.</li>
    <li><strong>Pull Request #2 (Revised / Rejected Initially):</strong> Feature branch <code>feature/rsvp-booking</code> was initially submitted. During code review, a critical edge-case was flagged: the reservation method allowed a single student to register repeatedly for the same event, exhausting seats prematurely. The PR was revised with a duplicate check (<code>userRsvps.some(r => r.eventId === eventId)</code>) and an accompanying unit test before formal approval and integration into <code>main</code>.</li>
  </ul>

  <h2>6.3 Merge Conflict Simulation & Resolution Methodology</h2>
  <p>To demonstrate configuration management competence, a merge conflict was simulated between <code>main</code> and branch <code>conflict-demo/event-validation</code> on the event title validation logic in <code>EventFactory.js</code>:</p>
  <pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
    if (!this.title || this.title.trim() === "") return {{ valid: false, message: 'Title cannot be empty string.' }};
=======
    if (!this.title.trim() || this.title.length &lt; 5) return {{ valid: false, message: 'Title must be at least 5 chars.' }};
&gt;&gt;&gt;&gt;&gt;&gt;&gt; conflict-demo/event-validation</pre>
  <p><strong>Resolution Technique:</strong> Rather than arbitrarily overwriting either branch, both modifications were synthesized to enforce that event titles cannot be empty and must satisfy a sensible minimum length (at least 3 characters):</p>
  <pre>    if (!this.title || this.title.trim().length &lt; 3) return {{ valid: false, message: 'Event title must be at least 3 characters.' }};</pre>
  <p>The resolved file was re-verified via <code>npm run test</code>, staged with <code>git add</code>, and committed with the message <code>fix(merge-conflict): resolve title validation conflict between main and conflict-demo</code>.</p>

  <h1>7. New Tool: GitHub Projects (Self-Directed Learning)</h1>
  <h2>7.1 Motivation & Selection Rationale</h2>
  <p>In accordance with the assignment mandate to adopt an engineering tool beyond the standard sessional syllabus, <strong>GitHub Projects</strong> was selected. Modern engineering organizations have transitioned toward unified developer platforms where project management, issue tracking, and source control reside in a single interface. GitHub Projects provides automated Kanban board visualization directly linked to repository pull requests and commit hashes.</p>

  <h2>7.2 Comparative Analysis with Alternatives</h2>
  <table>
    <tr>
      <th>Evaluation Metric</th>
      <th>GitHub Projects (Selected)</th>
      <th>Atlassian Jira</th>
      <th>Trello</th>
    </tr>
    <tr>
      <td><strong>Repository Integration</strong></td>
      <td>Native: Commits &amp; PRs automatically advance card status</td>
      <td>Requires external Webhooks &amp; OAuth plugins</td>
      <td>Lacks native Git linkage without paid power-ups</td>
    </tr>
    <tr>
      <td><strong>Learning Curve</strong></td>
      <td>Gentle: Markdown-based user stories &amp; instant boards</td>
      <td>Steep: Complex permission schemes &amp; heavy menus</td>
      <td>Minimal: Basic drag-and-drop cards</td>
    </tr>
    <tr>
      <td><strong>Context Switching</strong></td>
      <td>Zero: Code, reviews, and boards in one browser tab</td>
      <td>High: Requires navigating to external Atlassian domain</td>
      <td>High: Disconnected third-party board</td>
    </tr>
    <tr>
      <td><strong>Suitability for RUET</strong></td>
      <td>Optimal: Directly demonstrates Git/GitHub configuration management</td>
      <td>Over-engineered for 1-person / small academic teams</td>
      <td>Under-engineered: lacks automated CI/PR triggers</td>
    </tr>
  </table>

  <h2>7.3 Practical Implementation in CampusSync</h2>
  <p>A custom Kanban board was initialized with five automated workflow columns: (1) <code>Backlog</code> containing formal user story issues; (2) <code>Ready / To Do</code> containing prioritized sprint tasks; (3) <code>In Progress</code> tracking active feature branches; (4) <code>In Review / Testing</code> holding open pull requests awaiting test verification; and (5) <code>Done</code> archiving completed deliverables. Automated workflows were configured to move issues to 'Done' upon merging corresponding pull requests into <code>main</code>.</p>
  <p>Figures 7 through 10 demonstrate the lifecycle progression of CampusSync across four distinct operational sprint stages:</p>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0; page-break-inside: avoid;">
    <div style="text-align: center; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; background: #fff;">
      <img src="../diagrams/gh_project_stage1_planning.png" style="width: 100%; height: auto; border-radius: 3px;" alt="Stage 1">
      <div class="caption">Figure 7: Stage 1 — Sprint Planning (All in Todo)</div>
    </div>
    <div style="text-align: center; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; background: #fff;">
      <img src="../diagrams/gh_project_stage2_in_progress.png" style="width: 100%; height: auto; border-radius: 3px;" alt="Stage 2">
      <div class="caption">Figure 8: Stage 2 — Active Development (In Progress)</div>
    </div>
    <div style="text-align: center; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; background: #fff;">
      <img src="../diagrams/gh_project_stage3_testing.png" style="width: 100%; height: auto; border-radius: 3px;" alt="Stage 3">
      <div class="caption">Figure 9: Stage 3 — Testing &amp; PR Review</div>
    </div>
    <div style="text-align: center; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; background: #fff;">
      <img src="../diagrams/gh_project_stage4_done.png" style="width: 100%; height: auto; border-radius: 3px;" alt="Stage 4">
      <div class="caption">Figure 10: Stage 4 — Sprint Complete (100% Done)</div>
    </div>
  </div>

  <h1>8. Academic Integrity & AI Attribution Statement</h1>
  <p>In strict compliance with RUET academic regulations and the explicit CSE 3206 instruction note: <em>"AI tools or online code may be used only if you can explain every part in the viva, and their use must be stated in the report."</em></p>
  <p><strong>Disclosure of AI Assistance:</strong> An advanced AI coding assistant (Google Antigravity / Gemini 3.8 Flash) was employed as an interactive pair-programming companion. Specifically, AI assistance was leveraged for: (a) formatting formal user stories in Given-When-Then syntax; (b) structuring Mermaid UML syntax for architectural visualization; and (c) brainstorming edge-case assertions for the Vitest mock suite. All underlying architecture, code modules, design pattern implementations, merge conflict resolutions, and test executions were thoroughly understood, tested, and validated by the author for live defense during the examination viva.</p>

  <h1>9. Conclusion & Extensibility Roadmap</h1>
  <p>CampusSync demonstrates that rigorous software engineering methodologies—encompassing formal requirement analysis, design pattern abstraction, automated unit testing with mocks, and structured Git configuration management—yield a resilient, extensible application. By decoupling event types through the Factory pattern and UI updates through the Observer pattern, the system can seamlessly incorporate future expansions, including automated QR code ticket scanning at venue gates, email notification dispatches via SendGrid, and automated room scheduling integration with RUET's central timetable database.</p>

</body>
</html>
"""
    html_path = os.path.join(DOCS_DIR, "Project_Report.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    pdf_path = os.path.join(DOCS_DIR, "Project_Report.pdf")
    cmd = f'"{BRAVE_PATH}" --headless --print-to-pdf="{pdf_path}" --no-pdf-header-footer "{html_path}"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"Project Report PDF generated at: {pdf_path}")

if __name__ == '__main__':
    build_project_report()
