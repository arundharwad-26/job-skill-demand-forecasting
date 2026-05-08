import logging
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.jsearch_client  import fetch_all_skills_jobs, validate_response
from api.trends_client   import fetch_trends_for_skills, validate_trends_data
from api.news_client     import fetch_all_skills_news, validate_news_response
from processing.cleaner  import clean_jobs_data, clean_trends_data, clean_news_data
from processing.feature_engineer import build_skill_weekly_demand, merge_all_features, add_lag_features
from models.forecaster   import forecast_all_skills
from storage.data_handler import save_to_csv, save_to_json, save_to_sqlite
from validation.validator import validate_features, validate_forecasts, save_validation_report
from config import FORECAST_PERIODS

os.makedirs("demand_forecasting/output", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

def run_pipeline():
    logger.info("=" * 60)
    logger.info("  JOB SKILL DEMAND FORECASTING PIPELINE STARTED")
    logger.info("=" * 60)

    # STEP 1 — Fetch
    logger.info("\n📡 STEP 1: Fetching data from APIs...")
    raw_jobs   = fetch_all_skills_jobs()
    raw_trends = fetch_trends_for_skills()
    raw_news   = fetch_all_skills_news()

    jobs_valid = validate_response(raw_jobs)
    if not jobs_valid:
        logger.error("❌ Job data validation failed.")
        return

    # STEP 2 — Clean
    logger.info("\n🧹 STEP 2: Cleaning data...")
    jobs_df   = clean_jobs_data(raw_jobs)
    trends_df = clean_trends_data(raw_trends)
    news_df   = clean_news_data(raw_news)

    # STEP 3 — Features
    logger.info("\n⚙️  STEP 3: Engineering features...")
    demand_df   = build_skill_weekly_demand(jobs_df)
    features_df = merge_all_features(demand_df, trends_df, news_df)
    features_df = add_lag_features(features_df)

    # STEP 4 — Validate Features
    logger.info("\n✅ STEP 4: Validating features...")
    feature_report = validate_features(features_df)

    # STEP 5 — Forecast
    logger.info(f"\n🔮 STEP 5: Forecasting {FORECAST_PERIODS} weeks ahead...")
    forecasts_df = forecast_all_skills(features_df, periods=FORECAST_PERIODS)

    # STEP 6 — Validate Forecasts
    logger.info("\n✅ STEP 6: Validating forecasts...")
    forecast_report = validate_forecasts(forecasts_df)
    save_validation_report(feature_report, forecast_report)

    # STEP 7 — Save
    logger.info("\n💾 STEP 7: Saving outputs...")
    save_to_csv(jobs_df)
    save_to_json(forecasts_df)
    save_to_sqlite(features_df, forecasts_df)

    # STEP 8 — Summary
    logger.info("\n" + "=" * 60)
    logger.info("  PIPELINE COMPLETE!")
    logger.info("=" * 60)

    if not forecasts_df.empty and "predicted_demand" in forecasts_df.columns:
        top = (
            forecasts_df.groupby("skill")["predicted_demand"]
            .mean().sort_values(ascending=False).head(5)
        )
        logger.info("\n🏆 Top 5 Skills by Forecasted Demand:")
        for i, (skill, score) in enumerate(top.items(), 1):
            logger.info(f"  {i}. {skill:<25} Score: {score:.1f}")

    logger.info("\n📁 Output Files saved to demand_forecasting/output/")

if __name__ == "__main__":
    run_pipeline()