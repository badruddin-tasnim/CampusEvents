import subprocess
import time
import os

PROJECT_NUM = "2"
OWNER = "badruddin-tasnim"
REPO = "badruddin-tasnim/CampusEvents"
BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
PROJECT_URL = "https://github.com/users/badruddin-tasnim/projects/2"
DIAGRAMS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../diagrams"))

ISSUES_DEF = [
    {
        "num": 2,
        "title": "US-02: Module 2 - Event Discovery, Search & Category Filtering",
        "body": "Dynamic event catalog with keyword search and category filters (Academic, Cultural, Sports, Workshop).",
        "label": "enhancement"
    },
    {
        "num": 3,
        "title": "US-03: Module 3 - Event Creation & Admin Management Dashboard",
        "body": "Administrator console to create, edit, delete events, set capacity quotas, and manage schedules.",
        "label": "enhancement"
    },
    {
        "num": 4,
        "title": "US-04: Module 4 - RSVP & Digital Seat Reservation System",
        "body": "One-click ticket reservation, duplicate booking prevention, ticket code generation, and cancellation.",
        "label": "enhancement"
    },
    {
        "num": 5,
        "title": "US-05: Module 5 - Campus Announcements & Attendee Feedback System",
        "body": "Observer-powered broadcast announcements and attendee rating/reviews submission.",
        "label": "enhancement"
    },
    {
        "num": 6,
        "title": "SE-Task: Implement Singleton Pattern for Firebase Configuration",
        "body": "Encapsulate Firebase and Firestore initialization inside FirebaseConfigManager.",
        "label": "architecture"
    },
    {
        "num": 7,
        "title": "SE-Task: Implement Factory Pattern for Polymorphic Campus Events",
        "body": "Create EventFactory producing AcademicEvent, CulturalEvent, SportsEvent, WorkshopEvent.",
        "label": "architecture"
    },
    {
        "num": 8,
        "title": "SE-Task: Implement Observer Pattern (EventBus) for Reactive State",
        "body": "Pub-sub event emitter decoupling components and notifying on RSVP/announcements.",
        "label": "architecture"
    },
    {
        "num": 9,
        "title": "SE-Task: Author TDD Unit Test Suite with Firestore & Network Mocks",
        "body": "Vitest test suite isolating database dependencies via mocks, targeting >80% coverage.",
        "label": "testing"
    },
    {
        "num": 10,
        "title": "SE-Task: Configure Git Workflow, PRs, and Resolve Merge Conflict",
        "body": "Feature branches, code reviews, conflict simulation and resolution on main.",
        "label": "git"
    },
    {
        "num": 11,
        "title": "SE-Task: Generate Project Report, Learning Log & Reflection Essay",
        "body": "Compile 10-12 page report, learning log, and reflection essay in DOCX & PDF formats.",
        "label": "documentation"
    }
]

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.stdout.strip()

print("Step 1: Creating issues and adding them to Project 2...")
all_issue_urls = ["https://github.com/badruddin-tasnim/CampusEvents/issues/1"]

for item in ISSUES_DEF:
    cmd_create = f'gh issue create --repo {REPO} --title "{item["title"]}" --body "{item["body"]}"'
    url = run(cmd_create)
    print(f"Created issue: {url}")
    all_issue_urls.append(url)
    
    cmd_add = f'gh project item-add {PROJECT_NUM} --owner {OWNER} --url {url}'
    run(cmd_add)
    time.sleep(0.5)

print(f"Total {len(all_issue_urls)} issues added to Project 2.")

def capture_screenshot(out_filename):
    out_path = os.path.join(DIAGRAMS_DIR, out_filename)
    # Using Brave to capture full board
    cmd = f'"{BRAVE_PATH}" --headless --virtual-time-budget=5000 --screenshot="{out_path}" --window-size=1440,900 "{PROJECT_URL}"'
    subprocess.run(cmd, shell=True, capture_output=True)
    print(f"Screenshot saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def set_status(url, status):
    cmd = f'gh project item-edit {PROJECT_NUM} --owner {OWNER} --url {url} --field "Status" --value "{status}"'
    run(cmd)

# --- STAGE 1: SPRINT PLANNING (All in Todo) ---
print("\n--- Configuring Stage 1: Sprint Planning (Backlog / Todo) ---")
for url in all_issue_urls:
    set_status(url, "Todo")
time.sleep(2)
capture_screenshot("gh_project_stage1_planning.png")

# --- STAGE 2: ACTIVE DEVELOPMENT (Mid-Sprint) ---
print("\n--- Configuring Stage 2: Active Development (In Progress) ---")
# First 3 to Done, middle 4 to In Progress, rest in Todo
for url in all_issue_urls[:3]:
    set_status(url, "Done")
for url in all_issue_urls[3:7]:
    set_status(url, "In Progress")
for url in all_issue_urls[7:]:
    set_status(url, "Todo")
time.sleep(2)
capture_screenshot("gh_project_stage2_in_progress.png")

# --- STAGE 3: TESTING & CODE REVIEWS (Late-Sprint) ---
print("\n--- Configuring Stage 3: Testing & Code Reviews ---")
for url in all_issue_urls[:7]:
    set_status(url, "Done")
for url in all_issue_urls[7:10]:
    set_status(url, "In Progress")
for url in all_issue_urls[10:]:
    set_status(url, "Todo")
time.sleep(2)
capture_screenshot("gh_project_stage3_testing.png")

# --- STAGE 4: SPRINT COMPLETION (All Done) ---
print("\n--- Configuring Stage 4: Sprint Completion (All Done) ---")
for url in all_issue_urls:
    set_status(url, "Done")
time.sleep(2)
capture_screenshot("gh_project_stage4_done.png")

print("\nAll 4 stages configured and captured successfully!")
