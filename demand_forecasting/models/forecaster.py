import pandas as pd
import numpy as np
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def _linear_fallback(skill_df: pd.DataFrame, skill: str, periods: int = 4) -> pd.DataFrame:
    from sklearn.linear_model import LinearRegression
    df = skill_df[["composite_demand"]].dropna().reset_index(drop=True)
    if len(df) < 2:
        last_val  = df["composite_demand"].iloc[-1] if not df.empty else 50.0
        forecasts = [last_val] * periods
    else:
        X = np.arange(len(df)).reshape(-1, 1)
        y = df["composite_demand"].values
        model     = LinearRegression().fit(X, y)
        future_X  = np.arange(len(df), len(df) + periods).reshape(-1, 1)
        forecasts = model.predict(future_X).clip(min=0)

    last_date      = datetime.now()
    forecast_dates = [last_date + timedelta(weeks=i+1) for i in range(periods)]
    result = pd.DataFrame({
        "forecast_date":    forecast_dates,
        "predicted_demand": [round(float(f), 2) for f in forecasts],
        "lower_bound":      [max(0, round(float(f)*0.85, 2)) for f in forecasts],
        "upper_bound":      [round(float(f)*1.15, 2) for f in forecasts],
        "skill":            skill,
        "method":           "LinearRegression"
    })
    logger.info(f"  ✅ Linear forecast done for '{skill}'")
    return result

def forecast_with_prophet(skill_df: pd.DataFrame, skill: str, periods: int = 4) -> pd.DataFrame:
    try:
        from prophet import Prophet
        prophet_df = skill_df[["week","composite_demand"]].copy()
        prophet_df["ds"] = pd.to_datetime(
            prophet_df["week"].str.split("/").str[0]
        )
        prophet_df = prophet_df.rename(columns={"composite_demand":"y"})
        prophet_df = prophet_df[["ds","y"]].dropna()

        if len(prophet_df) < 4:
            return _linear_fallback(skill_df, skill, periods)

        model = Prophet(
            weekly_seasonality=True,
            yearly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        model.fit(prophet_df)
        future   = model.make_future_dataframe(periods=periods, freq="W")
        forecast = model.predict(future)
        result   = forecast[["ds","yhat","yhat_lower","yhat_upper"]].tail(periods).copy()
        result["skill"]  = skill
        result["method"] = "Prophet"
        result = result.rename(columns={
            "ds":         "forecast_date",
            "yhat":       "predicted_demand",
            "yhat_lower": "lower_bound",
            "yhat_upper": "upper_bound"
        })
        result["predicted_demand"] = result["predicted_demand"].clip(lower=0).round(2)
        result["lower_bound"]      = result["lower_bound"].clip(lower=0).round(2)
        result["upper_bound"]      = result["upper_bound"].round(2)
        logger.info(f"  ✅ Prophet forecast done for '{skill}'")
        return result
    except ImportError:
        return _linear_fallback(skill_df, skill, periods)
    except Exception as e:
        logger.error(f"Prophet error for '{skill}': {e}")
        return _linear_fallback(skill_df, skill, periods)

def forecast_all_skills(features_df: pd.DataFrame, periods: int = 4) -> pd.DataFrame:
    if features_df.empty:
        return pd.DataFrame()
    all_forecasts = []
    skills = features_df["skill"].unique()
    logger.info(f"Forecasting {len(skills)} skills for {periods} weeks...")
    for skill in skills:
        skill_df = features_df[features_df["skill"] == skill].copy()
        forecast = forecast_with_prophet(skill_df, skill, periods)
        all_forecasts.append(forecast)
    combined = pd.concat(all_forecasts, ignore_index=True)
    combined["demand_rank"] = combined.groupby("forecast_date")["predicted_demand"].rank(
        ascending=False, method="dense"
    ).astype(int)
    logger.info(f"✅ Forecasting complete. {len(combined)} records.")
    return combined