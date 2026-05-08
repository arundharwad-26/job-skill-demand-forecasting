import pandas as pd
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def build_skill_weekly_demand(jobs_df: pd.DataFrame) -> pd.DataFrame:
    if jobs_df.empty:
        return pd.DataFrame()
    demand = (
        jobs_df.groupby(["skill","week"])
        .agg(
            job_count        = ("job_title",  "count"),
            remote_count     = ("is_remote",  "sum"),
            avg_salary_min   = ("salary_min", "mean"),
            avg_salary_max   = ("salary_max", "mean"),
            unique_companies = ("company",    "nunique"),
        )
        .reset_index()
    )
    demand["demand_score"] = (
        demand.groupby("skill")["job_count"]
        .transform(lambda x: (x / x.max()) * 100 if x.max() > 0 else 0)
    ).round(2)
    logger.info(f"✅ Weekly demand built. Shape: {demand.shape}")
    return demand

def merge_all_features(demand_df, trends_df, news_df) -> pd.DataFrame:
    if demand_df.empty:
        return pd.DataFrame()
    df = demand_df.copy()
    if not trends_df.empty:
        trends_agg = (
            trends_df.groupby(["skill","week"])["interest"]
            .mean().reset_index()
            .rename(columns={"interest":"google_interest"})
        )
        df = df.merge(trends_agg, on=["skill","week"], how="left")
        df["google_interest"] = df["google_interest"].fillna(0)
    else:
        df["google_interest"] = 0
    if not news_df.empty:
        df = df.merge(news_df, on=["skill","week"], how="left")
        df["news_mentions"] = df["news_mentions"].fillna(0)
    else:
        df["news_mentions"] = 0
    df["composite_demand"] = (
        0.60 * df["demand_score"] +
        0.25 * df["google_interest"] +
        0.15 * df["news_mentions"].clip(upper=20) * 5
    ).round(2)
    df = df.sort_values(["skill","week"]).reset_index(drop=True)
    logger.info(f"✅ Features merged. Shape: {df.shape}")
    return df

def add_lag_features(df: pd.DataFrame, lags: list = [1,2,4]) -> pd.DataFrame:
    df = df.copy()
    for lag in lags:
        df[f"demand_lag_{lag}w"] = (
            df.groupby("skill")["composite_demand"].shift(lag)
        )
    df["rolling_mean_4w"] = (
        df.groupby("skill")["composite_demand"]
        .transform(lambda x: x.rolling(4, min_periods=1).mean())
    ).round(2)
    logger.info(f"✅ Lag features added.")
    return df