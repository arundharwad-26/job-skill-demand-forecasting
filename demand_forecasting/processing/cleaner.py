import pandas as pd
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def clean_jobs_data(jobs: list) -> pd.DataFrame:
    if not jobs:
        logger.warning("No job data to clean.")
        return pd.DataFrame()
    df = pd.DataFrame(jobs)
    df["date_posted"]  = pd.to_datetime(df["date_posted"], errors="coerce", utc=True)
    df["date_posted"]  = df["date_posted"].dt.tz_localize(None)
    df["salary_min"]   = pd.to_numeric(df["salary_min"], errors="coerce").fillna(0)
    df["salary_max"]   = pd.to_numeric(df["salary_max"], errors="coerce").fillna(0)
    df["location"]     = df["location"].fillna("Remote")
    df["country"]      = df["country"].fillna("Unknown")
    df["is_remote"]    = df["is_remote"].fillna(False).astype(bool)
    before = len(df)
    df = df.drop_duplicates(subset=["job_title","company","skill"])
    logger.info(f"Removed {before - len(df)} duplicates.")
    df["week"] = df["date_posted"].dt.to_period("W").astype(str)
    logger.info(f"✅ Jobs cleaned. Shape: {df.shape}")
    return df

def clean_trends_data(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df
    df = df.dropna(subset=["interest"])
    df["interest"] = df["interest"].clip(lower=0, upper=100)
    df["date"]     = pd.to_datetime(df["date"])
    df["week"]     = df["date"].dt.to_period("W").astype(str)
    logger.info(f"✅ Trends cleaned. Shape: {df.shape}")
    return df

def clean_news_data(articles: list) -> pd.DataFrame:
    if not articles:
        logger.warning("No news data to clean.")
        return pd.DataFrame()
    df = pd.DataFrame(articles)
    df["published_at"] = pd.to_datetime(df["published_at"], errors="coerce", utc=True)
    df["published_at"] = df["published_at"].dt.tz_localize(None)
    df["week"]         = df["published_at"].dt.to_period("W").astype(str)
    news_signal = (
        df.groupby(["skill","week"])
        .size()
        .reset_index(name="news_mentions")
    )
    logger.info(f"✅ News cleaned. {len(news_signal)} records.")
    return news_signal