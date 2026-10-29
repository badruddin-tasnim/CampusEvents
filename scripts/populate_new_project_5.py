import subprocess
import time
import os

PROJECT_NUM = "5"
OWNER = "badruddin-tasnim"
REPO = "badruddin-tasnim/CampusEvents"
BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
PROJECT_URL = f"https://github.com/users/{OWNER}/projects/{PROJECT_NUM}"
DIAGRAMS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../diagrams"))

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.stdout.strip()

print(f"Adding all 11 issues to Project {PROJECT_NUM}...")
all_issue_urls = [f"https://github.com/{REPO}/issues/{i}" for i in range(1, 12)]

for url in all_issue_urls:
    print(f"Adding {url}...")
    run(f'gh project item-add {PROJECT_NUM} --owner {OWNER} --url {url}')
    time.sleep(0.5)

print("All 11 issues added to Project 5.")

def set_status(url, status):
    cmd = f'gh project item-edit {PROJECT_NUM} --owner {OWNER} --url {url} --field "Status" --value "{status}"'
    run(cmd)

def capture_screenshot(out_filename):
    out_path = os.path.join(DIAGRAMS_DIR, out_filename)
    # Using window-size=1440,900 and virtual-time-budget=5000 to ensure full rendering of the React Kanban board
    cmd = f'"{BRAVE_PATH}" --headless --virtual-time-budget=6000 --screenshot="{out_path}" --window-size=1440,900 "{PROJECT_URL}"'
    subprocess.run(cmd, shell=True, capture_output=True)
    sz = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    print(f"Saved: {out_filename} ({sz} bytes)")

# --- STAGE 1: SPRINT PLANNING (All in Todo) ---
print("\n=== Stage 1: Sprint Planning (All in Todo) ===")
for url in all_issue_urls:
    set_status(url, "Todo")
time.sleep(3)
capture_screenshot("gh_project_stage1_planning.png")

# --- STAGE 2: ACTIVE DEVELOPMENT (In Progress) ---
print("\n=== Stage 2: Active Development (Some Done, Some In Progress, Some Todo) ===")
# Issues 1, 2, 6 -> Done (Auth, Discovery, Singleton)
# Issues 3, 4, 7, 8 -> In Progress (Admin, RSVP, Factory, Observer)
# Issues 5, 9, 10, 11 -> Todo (Feedback, TDD Testing, Merge Conflict, Docs)
for url in all_issue_urls[:2] + [all_issue_urls[5]]:
    set_status(url, "Done")
for url in [all_issue_urls[2], all_issue_urls[3], all_issue_urls[6], all_issue_urls[7]]:
    set_status(url, "In Progress")
for url in [all_issue_urls[4], all_issue_urls[8], all_issue_urls[9], all_issue_urls[10]]:
    set_status(url, "Todo")
time.sleep(3)
capture_screenshot("gh_project_stage2_in_progress.png")

# --- STAGE 3: TESTING & CODE REVIEWS (Features Done, Testing/Review In Progress) ---
print("\n=== Stage 3: Testing & Code Reviews (Features Done, Testing In Progress) ===")
# Issues 1..8 -> Done
# Issues 9, 10 -> In Progress (TDD Unit tests & Git Merge Conflict)
# Issue 11 -> Todo (Final Documentation)
for url in all_issue_urls[:8]:
    set_status(url, "Done")
for url in [all_issue_urls[8], all_issue_urls[9]]:
    set_status(url, "In Progress")
set_status(all_issue_urls[10], "Todo")
time.sleep(3)
capture_screenshot("gh_project_stage3_testing.png")

# --- STAGE 4: SPRINT COMPLETION (All 100% Done) ---
print("\n=== Stage 4: Sprint Completion (All 11 Done) ===")
for url in all_issue_urls:
    set_status(url, "Done")
time.sleep(3)
capture_screenshot("gh_project_stage4_done.png")

print("\nFinished capturing all 4 stages for Project 5!")
