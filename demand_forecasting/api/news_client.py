import requests
import logging
from datetime import datetime, timedelta
from config import NEWS_API_KEY, NEWS_BASE_URL, SKILLS_TO_TRACK

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def fetch_news_for_skill(skill: str, days_back: int = 30) -> list:
    from_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
    params = {
        "q":        f"{skill} jobs hiring demand",
        "from":     from_date,
        "sortBy":   "relevancy",
        "language": "en",
        "pageSize": 10,
        "apiKey":   NEWS_API_KEY
    }
    articles = []
    try:
        logger.info(f"Fetching news for: '{skill}'")
        response = requests.get(NEWS_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("status") != "ok":
            logger.warning(f"NewsAPI error for '{skill}': {data.get('message')}")
            return []
        for article in data.get("articles", []):
            articles.append({
                "skill":        skill,
                "title":        article.get("title", "N/A"),
                "source":       article.get("source", {}).get("name", "N/A"),
                "published_at": article.get("publishedAt", "N/A"),
                "description":  article.get("description", "")[:200],
                "url":          article.get("url", "")
            })
        logger.info(f"  → Got {len(articles)} articles for '{skill}'")
    except Exception as e:
        logger.error(f"News error for '{skill}': {e}")
    return articles

def fetch_all_skills_news() -> list:
    all_articles = []
    for skill in SKILLS_TO_TRACK:
        articles = fetch_news_for_skill(skill)
        all_articles.extend(articles)
    logger.info(f"✅ News fetch complete. Total: {len(all_articles)}")
    return all_articles

def validate_news_response(articles: list) -> bool:
    if not articles:
        logger.warning("No articles returned.")
        return False
    required = ["skill", "title", "source", "published_at"]
    for article in articles[:5]:
        for field in required:
            if field not in article:
                logger.warning(f"Missing field: '{field}'")
                return False
    logger.info(f"✅ News validated. {len(articles)} articles.")
    return True