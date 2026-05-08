import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

OUTPUT_REPORT = "demand_forecasting/output/validation_report.json"

def validate_features(df: pd.DataFrame) -> dict:
    report = {
        "timestamp":    datetime.now().isoformat(),
        "total_rows":   len(df),
        "total_skills": df["skill"].nunique() if "skill" in df.columns else 0,
        "checks":       {}
    }
    report["checks"]["not_empty"] = not df.empty
    required = ["skill","week","job_count","demand_score","composite_demand"]
    missing  = [c for c in required if c not in df.columns]
    report["checks"]["required_columns"] = {
        "passed":  len(missing) == 0,
        "missing": missing
    }
    if "composite_demand" in df.columns:
        neg = (df["composite_demand"] < 0).sum()
        report["checks"]["no_negative_demand"] = {
            "passed": int(neg) == 0,
            "count":  int(neg)
        }
    passed = sum(
        1 for v in report["checks"].values()
        if (v is True) or (isinstance(v, dict) and v.get("passed", False))
    )
    report["summary"] = f"{passed}/{len(report['checks'])} checks passed"
    logger.info(f"✅ Feature validation: {report['summary']}")
    return report

def validate_forecasts(forecasts_df: pd.DataFrame) -> dict:
    report = {
        "timestamp":       datetime.now().isoformat(),
        "forecast_rows":   len(forecasts_df),
        "skills_forecast": forecasts_df["skill"].nunique() if "skill" in forecasts_df.columns else 0,
        "checks":          {}
    }
    if "predicted_demand" in forecasts_df.columns:
        neg = (forecasts_df["predicted_demand"] < 0).sum()
        report["checks"]["no_negative_forecasts"] = {
            "passed": int(neg) == 0,
            "count":  int(neg)
        }
    if all(c in forecasts_df.columns for c in ["lower_bound","predicted_demand","upper_bound"]):
        valid = (
            (forecasts_df["lower_bound"] <= forecasts_df["predicted_demand"]) &
            (forecasts_df["predicted_demand"] <= forecasts_df["upper_bound"])
        ).all()
        report["checks"]["valid_bounds"] = bool(valid)
    if "predicted_demand" in forecasts_df.columns:
        top5 = (
            forecasts_df.groupby("skill")["predicted_demand"]
            .mean().sort_values(ascending=False)
            .head(5).reset_index()
        )
        report["top_5_skills"] = top5.to_dict(orient="records")
    passed = sum(
        1 for v in report["checks"].values()
        if (v is True) or (isinstance(v, dict) and v.get("passed", False))
    )
    report["summary"] = f"{passed}/{len(report['checks'])} checks passed"
    logger.info(f"✅ Forecast validation: {report['summary']}")
    return report

def save_validation_report(feature_report: dict, forecast_report: dict) -> None:
    combined = {
        "feature_validation":  feature_report,
        "forecast_validation": forecast_report
    }
    try:
        with open(OUTPUT_REPORT, "w") as f:
            json.dump(combined, f, indent=2, default=str)
        logger.info(f"✅ Report saved → {OUTPUT_REPORT}")
    except Exception as e:
        logger.error(f"Report error: {e}")