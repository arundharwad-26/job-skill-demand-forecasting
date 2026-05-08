import time
import logging
import pandas as pd
from config import SKILLS_TO_TRACK, HISTORICAL_WEEKS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def fetch_trends_for_skills(skills: list = None, timeframe: str = None) -> pd.DataFrame:
    if skills is None:
        skills = SKILLS_TO_TRACK
    if timeframe is None:
        timeframe = f"today {HISTORICAL_WEEKS}-w"
    try:
        from pytrends.request import TrendReq
        pytrends  = TrendReq(hl="en-US", tz=330)
        all_trends = []
        batches    = [skills[i:i+5] for i in range(0, len(skills), 5)]
        for batch_num, batch in enumerate(batches):
            logger.info(f"Fetching trends batch {batch_num+1}: {batch}")
            try:
                pytrends.build_payload(batch, cat=0, timeframe=timeframe, geo="", gprop="")
                df = pytrends.interest_over_time()
                if df.empty:
                    continue
                df = df.drop(columns=["isPartial"], errors="ignore").reset_index()
                df_melted = df.melt(id_vars=["date"], var_name="skill", value_name="interest")
                all_trends.append(df_melted)
                logger.info(f"  → Got {len(df)} weeks of data")
                time.sleep(1)
            except Exception as e:
                logger.error(f"Trends error for batch {batch}: {e}")
        if not all_trends:
            return pd.DataFrame(columns=["date","skill","interest"])
        result = pd.concat(all_trends, ignore_index=True)
        result["date"] = pd.to_datetime(result["date"])
        logger.info(f"✅ Trends complete. {len(result)} records.")
        return result
    except ImportError:
        logger.warning("pytrends not installed. Returning empty trends.")
        return pd.DataFrame(columns=["date","skill","interest"])

def validate_trends_data(df: pd.DataFrame) -> bool:
    if df.empty:
        logger.warning("Trends empty.")
        return False
    required = ["date","skill","interest"]
    for col in required:
        if col not in df.columns:
            return False
    logger.info(f"✅ Trends validated. Shape: {df.shape}")
    return True