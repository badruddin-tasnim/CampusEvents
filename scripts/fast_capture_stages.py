import subprocess
import time
import os

PROJECT_ID = "PVT_kwHOBcG5_s4BpOuZ"
FIELD_ID = "PVTSSF_lAHOBcG5_s4BpOuZzhnrSDk"
TODO_ID = "f75ad846"
IN_PROGRESS_ID = "47fc9ee4"
DONE_ID = "98236657"

ITEMS = [
    "PVTI_lAHOBcG5_s4BpOuZzhEYtJA",  # 1: US-01 Auth
    "PVTI_lAHOBcG5_s4BpOuZzhEYtMM",  # 2: US-02 Discovery
    "PVTI_lAHOBcG5_s4BpOuZzhEYtSI",  # 3: US-03 Creation & Admin
    "PVTI_lAHOBcG5_s4BpOuZzhEYtec",  # 4: US-04 RSVP
    "PVTI_lAHOBcG5_s4BpOuZzhEYthM",  # 5: US-05 Announcements
    "PVTI_lAHOBcG5_s4BpOuZzhEYtoQ",  # 6: Singleton Pattern
    "PVTI_lAHOBcG5_s4BpOuZzhEYtqQ",  # 7: Factory Pattern
    "PVTI_lAHOBcG5_s4BpOuZzhEYttw",  # 8: Observer Pattern
    "PVTI_lAHOBcG5_s4BpOuZzhEYtxo",  # 9: TDD Mocks
    "PVTI_lAHOBcG5_s4BpOuZzhEYt1c",  # 10: Git Conflict
    "PVTI_lAHOBcG5_s4BpOuZzhEYt6k"   # 11: Docs & Report
]

BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
PROJECT_URL = "https://github.com/users/badruddin-tasnim/projects/5"
DIAGRAMS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../diagrams"))

def batch_update_status(item_opt_pairs):
    mutations = []
    for idx, (item_id, opt_id) in enumerate(item_opt_pairs):
        mutations.append(f"""  m{idx}: updateProjectV2ItemFieldValue(
    input: {{
      projectId: "{PROJECT_ID}"
      itemId: "{item_id}"
      fieldId: "{FIELD_ID}"
      value: {{ singleSelectOptionId: "{opt_id}" }}
    }}
  ) {{ projectV2Item {{ id }} }}""")
    query = "mutation {\n" + "\n".join(mutations) + "\n}"
    res = subprocess.run(["gh", "api", "graphql", "-f", f"query={query}"], capture_output=True, text=True)
    if res.returncode != 0:
        print("Batch update error:", res.stderr)

def capture_screenshot(filename):
    out_path = os.path.join(DIAGRAMS_DIR, filename)
    cmd = [
        BRAVE_PATH,
        "--headless",
        "--virtual-time-budget=6000",
        f"--screenshot={out_path}",
        "--window-size=1440,900",
        PROJECT_URL
    ]
    subprocess.run(cmd, capture_output=True)
    sz = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    print(f"Captured {filename}: {sz} bytes")

print("1. Configuring Stage 1: Sprint Planning (All in Todo)...")
batch_update_status([(it, TODO_ID) for it in ITEMS])
time.sleep(3)
capture_screenshot("gh_project_stage1_planning.png")

print("2. Configuring Stage 2: Active Development (Some Done, Some In Progress, Some Todo)...")
stage2_pairs = []
# Items 1, 2, 6 -> Done
for it in [ITEMS[0], ITEMS[1], ITEMS[5]]:
    stage2_pairs.append((it, DONE_ID))
# Items 3, 4, 7, 8 -> In Progress
for it in [ITEMS[2], ITEMS[3], ITEMS[6], ITEMS[7]]:
    stage2_pairs.append((it, IN_PROGRESS_ID))
# Items 5, 9, 10, 11 -> Todo
for it in [ITEMS[4], ITEMS[8], ITEMS[9], ITEMS[10]]:
    stage2_pairs.append((it, TODO_ID))

batch_update_status(stage2_pairs)
time.sleep(3)
capture_screenshot("gh_project_stage2_in_progress.png")

print("3. Configuring Stage 3: Testing & Code Reviews (Features Done, Testing In Progress)...")
stage3_pairs = []
for it in ITEMS[:8]:
    stage3_pairs.append((it, DONE_ID))
for it in [ITEMS[8], ITEMS[9]]:
    stage3_pairs.append((it, IN_PROGRESS_ID))
stage3_pairs.append((ITEMS[10], TODO_ID))

batch_update_status(stage3_pairs)
time.sleep(3)
capture_screenshot("gh_project_stage3_testing.png")

print("4. Configuring Stage 4: Sprint Completion (All 11 in Done)...")
batch_update_status([(it, DONE_ID) for it in ITEMS])
time.sleep(3)
capture_screenshot("gh_project_stage4_done.png")

print("ALL 4 STAGES CAPTURED SUCCESSFULLY FOR BRAND NEW PROJECT 5!")
