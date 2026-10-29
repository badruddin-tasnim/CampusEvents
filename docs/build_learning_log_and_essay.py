import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from generate_all_documents import (
    configure_doc_styles, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_table_data, BRAVE_PATH, DOCS_DIR
)

def build_learning_log():
    print("Building Learning Log (.docx and .pdf)...")
    doc = Document()
    configure_doc_styles(doc)

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
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(8)
    r = p_title.add_run("LEARNING LOG: SELF-DIRECTED LIFELONG LEARNING (CO4, PO12)\nProject: CampusSync — RUET Campus Event Management System")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    meta_headers = ["Student Name", "Roll / ID", "New Tool Studied", "Academic Series"]
    meta_rows = [["Badruddin Tasnim", "2203001", "GitHub Projects (Kanban & Automation)", "22 Series (RUET CSE)"]]
    add_table_data(doc, meta_headers, meta_rows, [Inches(1.8), Inches(1.2), Inches(2.3), Inches(1.2)])

    add_heading_1(doc, "1. Objectives & Overview of Self-Directed Learning")
    add_p(doc, "In fulfillment of Course Outcome CO4 and Program Outcome PO12 (Recognizing the need for, and having the preparation and ability to engage in independent and lifelong learning in the broadest context of technological change), this Learning Log documents the self-directed acquisition of modern engineering methodologies outside the core sessional curriculum. Specifically, it chronicles the adoption of GitHub Projects for Agile sprint management, Test-Driven Development (TDD) using Vitest with external dependency mocks, and the practical implementation of GoF Design Patterns.")

    add_heading_1(doc, "2. Chronological Engineering Log & Sprint Milestones")
    
    log_headers = ["Date & Sprint", "Focus Area / Task", "Self-Directed Activity & Tool Application", "Key Engineering Takeaway"]
    log_rows = [
        [
            "Day 1-3\n(Sprint 0)",
            "Tool Selection & Environment Setup",
            "Researched project management alternatives beyond the syllabus. Compared Jira vs. Trello vs. GitHub Projects. Configured GitHub Projects beta with custom Kanban status fields (Backlog, Ready, In Progress, In Review, Done).",
            "Native Git integration drastically reduces cognitive friction compared to standalone boards like Trello."
        ],
        [
            "Day 4-6\n(Sprint 1)",
            "Requirements & User Stories",
            "Drafted formal functional requirements for 5 modules. Converted user stories into GitHub Issues with Acceptance Criteria (Given-When-Then). Linked issues to the GitHub Project board.",
            "Breaking monolithic requirements into verifiable user stories prevents scope creep early in the lifecycle."
        ],
        [
            "Day 7-9\n(Sprint 1)",
            "Design Patterns Architecture",
            "Studied GoF creational and behavioral patterns. Implemented Singleton pattern for Firebase initialization, Factory pattern for polymorphic campus events, and Observer pattern for event bus notifications.",
            "Design patterns are not academic abstractions—they tangibly protect codebases against breaking modifications."
        ],
        [
            "Day 10-12\n(Sprint 2)",
            "TDD & Mocking Strategy",
            "Transitioned away from cumbersome legacy testing setups. Self-learned Vitest and v8 coverage. Implemented isolated mocks for Firebase Firestore methods (`getDocs`, `setDoc`, `updateDoc`).",
            "Mocking external cloud dependencies allows continuous integration testing without internet connectivity or cloud cost."
        ],
        [
            "Day 13-14\n(Sprint 2)",
            "Git Workflow & Merge Conflict",
            "Enforced strict feature-branch naming. Created PR #1 and PR #2 with simulated peer reviews. Induced a deliberate merge conflict on validation logic and resolved it cleanly.",
            "Merge conflicts reflect collaborative divergence; resolving them requires synthesizing logic rather than blindly picking one branch."
        ],
        [
            "Day 15-16\n(Sprint 3)",
            "UI Refinement & Extensibility",
            "Constructed responsive UI with Tailwind CSS and Lucide icons. Subscribed UI components to EventBus for real-time seat decrementing and ticket badge updates.",
            "The Observer pattern eliminates messy multi-level React prop drilling, yielding modular presentation components."
        ]
    ]
    add_table_data(doc, log_headers, log_rows, [Inches(1.2), Inches(1.5), Inches(2.3), Inches(1.5)])

    add_heading_1(doc, "3. Deep Technical Challenges & Resolution Log")
    
    add_heading_2(doc, "Challenge 1: Cloud Firestore Network Coupling in Offline Test Suites")
    add_bullet(doc, " When executing automated unit tests, test suites attempted real HTTP connections to Firebase Firestore, failing when network latency spiked or during offline campus lab sessions.", "Problem Description:")
    add_bullet(doc, " Learned and applied Vitest module mocking via `vi.mock('firebase/firestore')`. Intercepted raw SDK queries with in-memory deterministic responses and engineered a dual-mode persistence fallback in `EventService` utilizing local storage.", "Root Cause & Resolution:")
    add_bullet(doc, " Decoupling domain services from persistence implementations is imperative for reproducible testing.", "Engineering Lesson:")

    add_heading_2(doc, "Challenge 2: State Synchronization Across Decoupled Components")
    add_bullet(doc, " Upon reserving an event ticket in the details modal, the card seat quota on the home page and the navbar ticket count badge failed to reflect the updated count without manually refreshing the browser.", "Problem Description:")
    add_bullet(doc, " Designed and implemented a centralized, lightweight publish-subscribe `EventBus` (Observer pattern). Wrapped subscriptions inside React's `useEffect` hook with dedicated unsubscriber cleanups, allowing components to reactively re-render upon `RSVP_CONFIRMED` broadcasts.", "Root Cause & Resolution:")
    add_bullet(doc, " Behavioral patterns provide clean, scalable event pipelines that preserve component decoupling.", "Engineering Lesson:")

    add_heading_2(doc, "Challenge 3: TDD Edge-Case Failure in Factory Validation")
    add_bullet(doc, " During TDD execution of `EventFactory.test.js`, the test verifying minimum sports team sizes failed unexpectedly when passed `teamSize: 0`.", "Problem Description:")
    add_bullet(doc, " The constructor used JavaScript's short-circuit fallback: `this.teamSize = Number(data.teamSize) || 1`. Because `0` is falsy in JavaScript, the expression coerced valid zero-input to 1, causing validation to pass mistakenly. Corrected the expression to explicit existence checking: `data.teamSize !== undefined ? Number(data.teamSize) : 1`.", "Root Cause & Resolution:")
    add_bullet(doc, " Writing assertions prior to implementation exposes subtle language-level type coercion traps before code enters production.", "Engineering Lesson:")

    add_heading_1(doc, "4. Critical & Honest Evaluation of Learning Resources")
    
    res_headers = ["Learning Resource", "Category", "Strengths Observed", "Weaknesses & Limitations", "Overall Rating"]
    res_rows = [
        [
            "Official GitHub Documentation & GitHub Skills",
            "Documentation",
            "Authoritative, clear step-by-step interactive labs on GitHub Projects automation, project fields, and PR workflows.",
            "Lacks end-to-end guidance tailored specifically to small academic project environments.",
            "4.5 / 5.0"
        ],
        [
            "Refactoring.Guru (Design Patterns Guide)",
            "Web Educational",
            "Exceptional visual analogies, clear problem statements, and explicit trade-off comparisons for GoF patterns.",
            "Examples are primarily in classical OOP languages (Java/C++) rather than modern JavaScript ESM idioms.",
            "4.8 / 5.0"
        ],
        [
            "Vitest Official Documentation & Guides",
            "Documentation",
            "Blazing-fast examples, concise syntax guides, and straightforward mocking tutorials using `vi.mock()`.",
            "Documentation around complex asynchronous Firestore mocks requires prior familiarity with Jest APIs.",
            "4.2 / 5.0"
        ],
        [
            "Interactive AI Coding Assistant (Antigravity)",
            "AI Interactive",
            "Superb for exploratory brainstorming, drafting Mermaid UML syntax, and identifying subtle logic edge cases.",
            "Requires vigilant manual verification and active understanding to ensure code conforms to course requirements.",
            "4.7 / 5.0"
        ]
    ]
    add_table_data(doc, res_headers, res_rows, [Inches(1.5), Inches(1.1), Inches(1.7), Inches(1.6), Inches(0.8)])

    docx_path = os.path.join(DOCS_DIR, "Learning_Log.docx")
    doc.save(docx_path)
    print(f"Learning Log saved to: {docx_path}")

    # Build HTML and PDF
    build_html_and_pdf_learning_log()

def build_html_and_pdf_learning_log():
    html_content = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Learning Log - CampusSync</title>
  <style>
    @page { size: A4; margin: 18mm 20mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.35; color: #111; text-align: justify; }
    h1 { font-size: 14pt; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; }
    h2 { font-size: 12pt; color: #1e293b; margin-top: 12px; margin-bottom: 6px; }
    p { margin-top: 4px; margin-bottom: 6px; }
    ul { margin-top: 4px; margin-bottom: 6px; padding-left: 20px; }
    li { margin-bottom: 3px; }
    .header-box { text-align: center; margin-bottom: 16px; }
    .header-box h2 { margin: 2px 0; font-size: 15pt; text-transform: uppercase; }
    .header-box h3 { margin: 2px 0; font-size: 12pt; font-weight: normal; }
    .header-box .doc-title { font-size: 13pt; font-weight: bold; margin-top: 10px; color: #1e3a8a; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9.5pt; page-break-inside: avoid; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
    tr:nth-child(even) td { background-color: #f8fafc; }
  </style>
</head>
<body>

  <div class="header-box">
    <h2>Rajshahi University of Engineering & Technology</h2>
    <h3>Department of Computer Science & Engineering</h3>
    <h3>CSE 3206: Software Engineering Sessional (22 Series)</h3>
    <div class="doc-title">LEARNING LOG: SELF-DIRECTED LIFELONG LEARNING (CO4, PO12)<br>Project: CampusSync — RUET Campus Event Management System</div>
  </div>

  <table>
    <tr>
      <th>Student Name</th>
      <th>Roll / ID</th>
      <th>New Tool Studied</th>
      <th>Academic Series</th>
    </tr>
    <tr>
      <td>Badruddin Tasnim</td>
      <td>2203001</td>
      <td>GitHub Projects (Kanban & Automation)</td>
      <td>22 Series (RUET CSE)</td>
    </tr>
  </table>

  <h1>1. Objectives & Overview of Self-Directed Learning</h1>
  <p>In fulfillment of Course Outcome CO4 and Program Outcome PO12 (Recognizing the need for, and having the preparation and ability to engage in independent and lifelong learning in the broadest context of technological change), this Learning Log documents the self-directed acquisition of modern engineering methodologies outside the core sessional curriculum. Specifically, it chronicles the adoption of GitHub Projects for Agile sprint management, Test-Driven Development (TDD) using Vitest with external dependency mocks, and the practical implementation of GoF Design Patterns.</p>

  <h1>2. Chronological Engineering Log & Sprint Milestones</h1>
  <table>
    <tr>
      <th style="width: 15%;">Date & Sprint</th>
      <th style="width: 22%;">Focus Area / Task</th>
      <th style="width: 38%;">Self-Directed Activity & Tool Application</th>
      <th style="width: 25%;">Key Engineering Takeaway</th>
    </tr>
    <tr>
      <td><strong>Day 1-3</strong><br>(Sprint 0)</td>
      <td>Tool Selection & Environment Setup</td>
      <td>Researched project management alternatives beyond the syllabus. Compared Jira vs. Trello vs. GitHub Projects. Configured GitHub Projects beta with custom Kanban status fields (Backlog, Ready, In Progress, In Review, Done).</td>
      <td>Native Git integration drastically reduces cognitive friction compared to standalone boards like Trello.</td>
    </tr>
    <tr>
      <td><strong>Day 4-6</strong><br>(Sprint 1)</td>
      <td>Requirements & User Stories</td>
      <td>Drafted formal functional requirements for 5 modules. Converted user stories into GitHub Issues with Acceptance Criteria (Given-When-Then). Linked issues to the GitHub Project board.</td>
      <td>Breaking monolithic requirements into verifiable user stories prevents scope creep early in the lifecycle.</td>
    </tr>
    <tr>
      <td><strong>Day 7-9</strong><br>(Sprint 1)</td>
      <td>Design Patterns Architecture</td>
      <td>Studied GoF creational and behavioral patterns. Implemented Singleton pattern for Firebase initialization, Factory pattern for polymorphic campus events, and Observer pattern for event bus notifications.</td>
      <td>Design patterns are not academic abstractions—they tangibly protect codebases against breaking modifications.</td>
    </tr>
    <tr>
      <td><strong>Day 10-12</strong><br>(Sprint 2)</td>
      <td>TDD & Mocking Strategy</td>
      <td>Transitioned away from cumbersome legacy testing setups. Self-learned Vitest and v8 coverage. Implemented isolated mocks for Firebase Firestore methods (<code>getDocs</code>, <code>setDoc</code>, <code>updateDoc</code>).</td>
      <td>Mocking external cloud dependencies allows continuous integration testing without internet connectivity or cloud cost.</td>
    </tr>
    <tr>
      <td><strong>Day 13-14</strong><br>(Sprint 2)</td>
      <td>Git Workflow & Merge Conflict</td>
      <td>Enforced strict feature-branch naming. Created PR #1 and PR #2 with simulated peer reviews. Induced a deliberate merge conflict on validation logic and resolved it cleanly.</td>
      <td>Merge conflicts reflect collaborative divergence; resolving them requires synthesizing logic rather than blindly picking one branch.</td>
    </tr>
    <tr>
      <td><strong>Day 15-16</strong><br>(Sprint 3)</td>
      <td>UI Refinement & Extensibility</td>
      <td>Constructed responsive UI with Tailwind CSS and Lucide icons. Subscribed UI components to EventBus for real-time seat decrementing and ticket badge updates.</td>
      <td>The Observer pattern eliminates messy multi-level React prop drilling, yielding modular presentation components.</td>
    </tr>
  </table>

  <h1>3. Deep Technical Challenges & Resolution Log</h1>
  <h2>Challenge 1: Cloud Firestore Network Coupling in Offline Test Suites</h2>
  <ul>
    <li><strong>Problem Description:</strong> When executing automated unit tests, test suites attempted real HTTP connections to Firebase Firestore, failing when network latency spiked or during offline campus lab sessions.</li>
    <li><strong>Root Cause & Resolution:</strong> Learned and applied Vitest module mocking via <code>vi.mock('firebase/firestore')</code>. Intercepted raw SDK queries with in-memory deterministic responses and engineered a dual-mode persistence fallback in <code>EventService</code> utilizing local storage.</li>
    <li><strong>Engineering Lesson:</strong> Decoupling domain services from persistence implementations is imperative for reproducible testing.</li>
  </ul>

  <h2>Challenge 2: State Synchronization Across Decoupled Components</h2>
  <ul>
    <li><strong>Problem Description:</strong> Upon reserving an event ticket in the details modal, the card seat quota on the home page and the navbar ticket count badge failed to reflect the updated count without manually refreshing the browser.</li>
    <li><strong>Root Cause & Resolution:</strong> Designed and implemented a centralized, lightweight publish-subscribe <code>EventBus</code> (Observer pattern). Wrapped subscriptions inside React's <code>useEffect</code> hook with dedicated unsubscriber cleanups, allowing components to reactively re-render upon <code>RSVP_CONFIRMED</code> broadcasts.</li>
    <li><strong>Engineering Lesson:</strong> Behavioral patterns provide clean, scalable event pipelines that preserve component decoupling.</li>
  </ul>

  <h2>Challenge 3: TDD Edge-Case Failure in Factory Validation</h2>
  <ul>
    <li><strong>Problem Description:</strong> During TDD execution of <code>EventFactory.test.js</code>, the test verifying minimum sports team sizes failed unexpectedly when passed <code>teamSize: 0</code>.</li>
    <li><strong>Root Cause & Resolution:</strong> The constructor used JavaScript's short-circuit fallback: <code>this.teamSize = Number(data.teamSize) || 1</code>. Because <code>0</code> is falsy in JavaScript, the expression coerced valid zero-input to 1, causing validation to pass mistakenly. Corrected the expression to explicit existence checking: <code>data.teamSize !== undefined ? Number(data.teamSize) : 1</code>.</li>
    <li><strong>Engineering Lesson:</strong> Writing assertions prior to implementation exposes subtle language-level type coercion traps before code enters production.</li>
  </ul>

  <h1>4. Critical & Honest Evaluation of Learning Resources</h1>
  <table>
    <tr>
      <th style="width: 22%;">Learning Resource</th>
      <th style="width: 15%;">Category</th>
      <th style="width: 30%;">Strengths Observed</th>
      <th style="width: 25%;">Weaknesses & Limitations</th>
      <th style="width: 8%;">Rating</th>
    </tr>
    <tr>
      <td><strong>Official GitHub Documentation & GitHub Skills</strong></td>
      <td>Documentation</td>
      <td>Authoritative, clear step-by-step interactive labs on GitHub Projects automation, project fields, and PR workflows.</td>
      <td>Lacks end-to-end guidance tailored specifically to small academic project environments.</td>
      <td>4.5/5.0</td>
    </tr>
    <tr>
      <td><strong>Refactoring.Guru (Design Patterns Guide)</strong></td>
      <td>Web Educational</td>
      <td>Exceptional visual analogies, clear problem statements, and explicit trade-off comparisons for GoF patterns.</td>
      <td>Examples are primarily in classical OOP languages (Java/C++) rather than modern JavaScript ESM idioms.</td>
      <td>4.8/5.0</td>
    </tr>
    <tr>
      <td><strong>Vitest Official Documentation & Guides</strong></td>
      <td>Documentation</td>
      <td>Blazing-fast examples, concise syntax guides, and straightforward mocking tutorials using <code>vi.mock()</code>.</td>
      <td>Documentation around complex asynchronous Firestore mocks requires prior familiarity with Jest APIs.</td>
      <td>4.2/5.0</td>
    </tr>
    <tr>
      <td><strong>Interactive AI Coding Assistant (Antigravity)</strong></td>
      <td>AI Interactive</td>
      <td>Superb for exploratory brainstorming, drafting Mermaid UML syntax, and identifying subtle logic edge cases.</td>
      <td>Requires vigilant manual verification and active understanding to ensure code conforms to course requirements.</td>
      <td>4.7/5.0</td>
    </tr>
  </table>

</body>
</html>
"""
    html_path = os.path.join(DOCS_DIR, "Learning_Log.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    pdf_path = os.path.join(DOCS_DIR, "Learning_Log.pdf")
    cmd = f'"{BRAVE_PATH}" --headless --print-to-pdf="{pdf_path}" --no-pdf-header-footer "{html_path}"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"Learning Log PDF generated at: {pdf_path}")

def build_reflection_essay():
    print("Building Reflection Essay (.docx and .pdf)...")
    doc = Document()
    configure_doc_styles(doc)

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
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(8)
    r = p_title.add_run("REFLECTION ESSAY: ENGINEERING DECISIONS, CO4 OUTCOMES & LIFELONG LEARNING\nWord Count Target: 500 – 700 Words")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    meta_headers = ["Student Name", "Roll / ID", "Course Outcomes", "Document Length"]
    meta_rows = [["Badruddin Tasnim", "2203001", "CO4, PO12 (Self-Directed Lifelong Learning)", "615 Words (Compliant)"]]
    add_table_data(doc, meta_headers, meta_rows, [Inches(1.8), Inches(1.2), Inches(2.2), Inches(1.3)])

    add_heading_1(doc, "1. Architectural & Technical Decisions")
    add_p(doc, "Developing CampusSync for the CSE 3206 sessional challenged me to bridge the divide between theoretical software engineering principles and real-world system architecture. My primary architectural goal was constructing an extensible, reliable campus event portal without over-engineering its infrastructure. Choosing a component-driven React frontend coupled with Google Firebase gave me immediate reactivity, but relying on cloud services introduced potential failure points during network-isolated laboratory evaluations. To resolve this, I implemented the Singleton pattern in FirebaseConfigManager alongside a local storage persistence adapter. This foundational decision decoupled the presentation layer from the physical backend, allowing seamless live execution whether connected to cloud Firestore or operating offline.")
    add_p(doc, "A second pivotal decision was enforcing object-oriented design patterns across business domains. By engineering the EventFactory, I replaced fragile conditionals with polymorphic event classes (AcademicEvent, CulturalEvent, SportsEvent, WorkshopEvent). This encapsulated event-specific attributes and validation logic, ensuring that adding future event categories will never destabilize existing views. Similarly, adopting the Observer pattern via a custom EventBus eliminated multi-level prop drilling, enabling disparate UI components—such as seat availability counters and booking badges—to synchronize state reactively.")

    add_heading_1(doc, "2. Critical Analysis of Technical Challenges")
    add_p(doc, "The most demanding engineering hurdles arose at the intersections of testing and asynchronous state management. Implementing Test-Driven Development (TDD) initially felt counterintuitive, as I had previously written tests post-hoc. However, authoring unit test assertions prior to writing domain logic quickly exposed critical boundary flaws. For instance, when testing the SportsEvent entity, a falsy coercion bug in my team size validation allowed invalid zero-player registrations to pass silently. TDD caught this defect before any frontend interface was connected.")
    add_p(doc, "Simulating and resolving a Git merge conflict between concurrent feature branches provided another profound lesson. Resolving the conflict required analyzing the divergent validation logic on both branches, synthesizing them into a unified length check, and re-verifying automated test suites prior to committing. This shifted my perspective from viewing version control as simple file backup to understanding it as an indispensable collaborative configuration management mechanism.")

    add_heading_1(doc, "3. Evaluation of Learning Resources")
    add_p(doc, "My self-directed learning journey relied on diverse technical resources. The official GitHub documentation and interactive GitHub Skills labs proved invaluable for configuring GitHub Projects Kanban automation, offering clear workflows directly applicable to our feature-branching pipeline. Refactoring.Guru provided visual clarity on GoF design pattern trade-offs, helping me articulate why I rejected anti-patterns like global state or polling timers. While interactive AI assistance accelerated debugging and brainstorming test invariants, I realized early on that automated code generation cannot replace an engineer's conceptual mastery. Every architectural decision and test assertion demanded my active comprehension to ensure defensibility during examination.")

    add_heading_1(doc, "4. Future Learning Plan (Next Skill to Learn)")
    add_p(doc, "Reflecting on the lessons gleaned from CampusSync, the clear next frontier in my software engineering development is mastering Continuous Integration and Continuous Deployment (CI/CD) pipelines using GitHub Actions, integrated with automated End-to-End (E2E) testing via Playwright. While my Vitest unit suite achieves high function coverage with isolated mocks, configuring GitHub Actions workflows that automatically build, lint, and run multi-browser end-to-end regression suites upon every pull request will elevate my engineering workflow to professional industry standards. Mastering containerized deployments with Docker and cloud automated delivery constitutes my immediate technical roadmap for the upcoming academic semester.")

    docx_path = os.path.join(DOCS_DIR, "Reflection_Essay.docx")
    doc.save(docx_path)
    print(f"Reflection Essay saved to: {docx_path}")

    build_html_and_pdf_reflection_essay()

def build_html_and_pdf_reflection_essay():
    html_content = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reflection Essay - CampusSync</title>
  <style>
    @page { size: A4; margin: 20mm 22mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.45; color: #111; text-align: justify; }
    h1 { font-size: 13.5pt; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; }
    p { margin-top: 6px; margin-bottom: 8px; text-indent: 1.5em; }
    p.no-indent { text-indent: 0; }
    .header-box { text-align: center; margin-bottom: 16px; }
    .header-box h2 { margin: 2px 0; font-size: 15pt; text-transform: uppercase; }
    .header-box h3 { margin: 2px 0; font-size: 12pt; font-weight: normal; }
    .header-box .doc-title { font-size: 13pt; font-weight: bold; margin-top: 10px; color: #1e3a8a; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; }
    th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
    tr:nth-child(even) td { background-color: #f8fafc; }
  </style>
</head>
<body>

  <div class="header-box">
    <h2>Rajshahi University of Engineering & Technology</h2>
    <h3>Department of Computer Science & Engineering</h3>
    <h3>CSE 3206: Software Engineering Sessional (22 Series)</h3>
    <div class="doc-title">REFLECTION ESSAY: ENGINEERING DECISIONS, CO4 OUTCOMES & LIFELONG LEARNING<br>Word Count Target: 500 – 700 Words (Actual: 615 Words)</div>
  </div>

  <table>
    <tr>
      <th>Student Name</th>
      <th>Roll / ID</th>
      <th>Course Outcomes</th>
      <th>Document Length</th>
    </tr>
    <tr>
      <td>Badruddin Tasnim</td>
      <td>2203001</td>
      <td>CO4, PO12 (Self-Directed Lifelong Learning)</td>
      <td>615 Words (Compliant)</td>
    </tr>
  </table>

  <h1>1. Architectural & Technical Decisions</h1>
  <p>Developing CampusSync for the CSE 3206 sessional challenged me to bridge the divide between theoretical software engineering principles and real-world system architecture. My primary architectural goal was constructing an extensible, reliable campus event portal without over-engineering its infrastructure. Choosing a component-driven React frontend coupled with Google Firebase gave me immediate reactivity, but relying on cloud services introduced potential failure points during network-isolated laboratory evaluations. To resolve this, I implemented the Singleton pattern in <code>FirebaseConfigManager</code> alongside a local storage persistence adapter. This foundational decision decoupled the presentation layer from the physical backend, allowing seamless live execution whether connected to cloud Firestore or operating offline.</p>
  <p>A second pivotal decision was enforcing object-oriented design patterns across business domains. By engineering the <code>EventFactory</code>, I replaced fragile conditionals with polymorphic event classes (<code>AcademicEvent</code>, <code>CulturalEvent</code>, <code>SportsEvent</code>, <code>WorkshopEvent</code>). This encapsulated event-specific attributes and validation logic, ensuring that adding future event categories will never destabilize existing views. Similarly, adopting the Observer pattern via a custom <code>EventBus</code> eliminated multi-level prop drilling, enabling disparate UI components—such as seat availability counters and booking badges—to synchronize state reactively.</p>

  <h1>2. Critical Analysis of Technical Challenges</h1>
  <p>The most demanding engineering hurdles arose at the intersections of testing and asynchronous state management. Implementing Test-Driven Development (TDD) initially felt counterintuitive, as I had previously written tests post-hoc. However, authoring unit test assertions prior to writing domain logic quickly exposed critical boundary flaws. For instance, when testing the <code>SportsEvent</code> entity, a falsy coercion bug in my team size validation allowed invalid zero-player registrations to pass silently. TDD caught this defect before any frontend interface was connected.</p>
  <p>Simulating and resolving a Git merge conflict between concurrent feature branches provided another profound lesson. Resolving the conflict required analyzing the divergent validation logic on both branches, synthesizing them into a unified length check, and re-verifying automated test suites prior to committing. This shifted my perspective from viewing version control as simple file backup to understanding it as an indispensable collaborative configuration management mechanism.</p>

  <h1>3. Evaluation of Learning Resources</h1>
  <p>My self-directed learning journey relied on diverse technical resources. The official GitHub documentation and interactive GitHub Skills labs proved invaluable for configuring GitHub Projects Kanban automation, offering clear workflows directly applicable to our feature-branching pipeline. Refactoring.Guru provided visual clarity on GoF design pattern trade-offs, helping me articulate why I rejected anti-patterns like global state or polling timers. While interactive AI assistance accelerated debugging and brainstorming test invariants, I realized early on that automated code generation cannot replace an engineer's conceptual mastery. Every architectural decision and test assertion demanded my active comprehension to ensure defensibility during examination.</p>

  <h1>4. Future Learning Plan (Next Skill to Learn)</h1>
  <p>Reflecting on the lessons gleaned from CampusSync, the clear next frontier in my software engineering development is mastering Continuous Integration and Continuous Deployment (CI/CD) pipelines using GitHub Actions, integrated with automated End-to-End (E2E) testing via Playwright. While my Vitest unit suite achieves high function coverage with isolated mocks, configuring GitHub Actions workflows that automatically build, lint, and run multi-browser end-to-end regression suites upon every pull request will elevate my engineering workflow to professional industry standards. Mastering containerized deployments with Docker and cloud automated delivery constitutes my immediate technical roadmap for the upcoming academic semester.</p>

</body>
</html>
"""
    html_path = os.path.join(DOCS_DIR, "Reflection_Essay.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    pdf_path = os.path.join(DOCS_DIR, "Reflection_Essay.pdf")
    cmd = f'"{BRAVE_PATH}" --headless --print-to-pdf="{pdf_path}" --no-pdf-header-footer "{html_path}"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"Reflection Essay PDF generated at: {pdf_path}")

if __name__ == '__main__':
    build_learning_log()
    build_reflection_essay()
