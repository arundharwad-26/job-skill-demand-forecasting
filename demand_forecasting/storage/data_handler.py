import os
import json
import sqlite3
import logging
import pandas as pd
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

os.makedirs("demand_forecasting/output", exist_ok=True)

OUTPUT_CSV    = "demand_forecasting/output/job_skill_demand.csv"
OUTPUT_JSON   = "demand_forecasting/output/job_skill_demand.json"
OUTPUT_SQLITE = "demand_forecasting/output/forecasts.db"


def save_to_csv(df: pd.DataFrame) -> None:
    try:
        df.to_csv(OUTPUT_CSV, index=False)
        logger.info(f"✅ CSV saved → {OUTPUT_CSV}")
    except Exception as e:
        logger.error(f"CSV error: {e}")


def save_to_json(df: pd.DataFrame) -> None:
    try:
        output = {
            "metadata": {
                "generated_at":   datetime.now().isoformat(),
                "total_records":  len(df),
                "skills_tracked": df["skill"].nunique() if "skill" in df.columns else 0
            },
            "data": json.loads(
                df.to_json(orient="records", date_format="iso", default_handler=str)
            )
        }
        with open(OUTPUT_JSON, "w") as f:
            json.dump(output, f, indent=2)
        logger.info(f"✅ JSON saved → {OUTPUT_JSON}")
    except Exception as e:
        logger.error(f"JSON error: {e}")


def _clean_df_for_sqlite(df: pd.DataFrame) -> pd.DataFrame:
    """Convert all non-SQLite-compatible columns to string."""
    df = df.copy()
    for col in df.columns:
        try:
            if pd.api.types.is_period_dtype(df[col]):
                df[col] = df[col].astype(str)
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].astype(str)
            elif pd.api.types.is_timedelta64_dtype(df[col]):
                df[col] = df[col].astype(str)
        except Exception:
            pass
    return df


def save_to_sqlite(features_df: pd.DataFrame, forecasts_df: pd.DataFrame) -> None:
    try:
        conn = sqlite3.connect(OUTPUT_SQLITE)

        if not features_df.empty:
            features_clean = _clean_df_for_sqlite(features_df)
            features_clean.to_sql("skill_features", conn, if_exists="replace", index=False)
            logger.info(f"  → skill_features: {len(features_clean)} rows")

        if not forecasts_df.empty:
            forecasts_clean = _clean_df_for_sqlite(forecasts_df)
            forecasts_clean.to_sql("skill_forecasts", conn, if_exists="replace", index=False)
            logger.info(f"  → skill_forecasts: {len(forecasts_clean)} rows")

        conn.commit()
        conn.close()
        logger.info(f"✅ SQLite saved → {OUTPUT_SQLITE}")

    except Exception as e:
        logger.error(f"SQLite error: {e}")


def load_from_sqlite(table: str) -> pd.DataFrame:
    try:
        conn = sqlite3.connect(OUTPUT_SQLITE)
        df   = pd.read_sql(f"SELECT * FROM {table}", conn)
        conn.close()
        logger.info(f"✅ Loaded '{table}': {len(df)} rows")
        return df
    except Exception as e:
        logger.error(f"Load error: {e}")
        return pd.DataFrame()