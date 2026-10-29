import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from build_project_report import build_project_report
from build_learning_log_and_essay import build_unified_learning_log_and_essay

def main():
    print("Building all project documentation (.docx and .pdf)...")
    build_project_report()
    build_unified_learning_log_and_essay()
    print("All documents generated successfully!")

if __name__ == '__main__':
    main()
