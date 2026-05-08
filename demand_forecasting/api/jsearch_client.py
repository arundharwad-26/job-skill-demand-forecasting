import requests
import time
import logging
from config import JSEARCH_API_KEY, JSEARCH_BASE_URL, JSEARCH_HOST, SKILLS_TO_TRACK

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def fetch_jobs_for_skill(skill: str, num_pages: int = 1) -> list:
    headers = {
        "X-RapidAPI-Key":  JSEARCH_API_KEY,
        "X-RapidAPI-Host": JSEARCH_HOST
    }
    all_jobs = []
    for page in range(1, num_pages + 1):
        params = {
            "query":     f"{skill} developer",
            "page":      str(page),
            "num_pages": "1",
            "date_posted": "week"
        }
        try:
            logger.info(f"Fetching jobs for skill: '{skill}' | Page {page}")
            response = requests.get(JSEARCH_BASE_URL, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            jobs = data.get("data", [])
            for job in jobs:
                all_jobs.append({
                    "skill":            skill,
                    "job_title":        job.get("job_title", "N/A"),
                    "company":          job.get("employer_name", "N/A"),
                    "location":         job.get("job_city", "Remote"),
                    "country":          job.get("job_country", "N/A"),
                    "employment_type":  job.get("job_employment_type", "N/A"),
                    "date_posted":      job.get("job_posted_at_datetime_utc", "N/A"),
                    "salary_min":       job.get("job_min_salary", None),
                    "salary_max":       job.get("job_max_salary", None),
                    "is_remote":        job.get("job_is_remote", False),
                    "description":      job.get("job_description", "")[:300]
                })
            logger.info(f"  → Got {len(jobs)} jobs for '{skill}'")
            time.sleep(0.5)
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error for '{skill}': {e}")
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error for '{skill}'")
        except requests.exceptions.Timeout:
            logger.error(f"Timeout for '{skill}'")
        except Exception as e:
            logger.error(f"Unexpected error for '{skill}': {e}")
    return all_jobs

def fetch_all_skills_jobs() -> list:
    all_results = []
    logger.info(f"Fetching jobs for {len(SKILLS_TO_TRACK)} skills...")
    for skill in SKILLS_TO_TRACK:
        jobs = fetch_jobs_for_skill(skill)
        all_results.extend(jobs)
        logger.info(f"Total jobs so far: {len(all_results)}")
    logger.info(f"✅ Job fetch complete. Total: {len(all_results)}")
    return all_results

def validate_response(jobs: list) -> bool:
    if not jobs:
        logger.warning("Validation failed: No job records.")
        return False
    required = ["skill", "job_title", "company", "date_posted"]
    for job in jobs[:5]:
        for field in required:
            if field not in job:
                logger.warning(f"Missing field: '{field}'")
                return False
    logger.info(f"✅ Jobs validated. {len(jobs)} records.")
    return True