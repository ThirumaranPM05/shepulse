from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "techcrunch.db"

APP_NAME = "TechCrunch API"

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemma-2-2b-it")
