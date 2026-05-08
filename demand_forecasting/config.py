# ============================================================
#  config.py — Central Configuration
# ============================================================

# --- JSearch API (RapidAPI) ---
JSEARCH_API_KEY  = "cf2302914dmsh45738bd2ce45ae6p1dc18cjsnf04a3e3e8654"
JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com/search"
JSEARCH_HOST     = "jsearch.p.rapidapi.com"

# --- NewsAPI ---
NEWS_API_KEY  = "5f2f220934974a5484facd2c3d43a353"
NEWS_BASE_URL = "https://newsapi.org/v2/everything"

# --- Skills to Track ---
SKILLS_TO_TRACK = [
    "Python", "SQL", "Machine Learning", "AWS",
    "React", "Docker", "Kubernetes", "Data Engineering",
    "Power BI", "Tableau", "Azure", "Deep Learning"
]

# --- Forecasting Settings ---
FORECAST_PERIODS = 4
HISTORICAL_WEEKS = 12

# --- Output Paths ---
OUTPUT_CSV    = "output/job_skill_demand.csv"
OUTPUT_JSON   = "output/job_skill_demand.json"
OUTPUT_SQLITE = "output/forecasts.db"
OUTPUT_REPORT = "output/validation_report.json"