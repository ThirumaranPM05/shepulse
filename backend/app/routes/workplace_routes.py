from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(prefix="/workplace", tags=["Workplace"])


def abstract_readiness(risk_level: str, energy_score: int) -> dict:
    """
    Engine 2 — Privacy-Safe Risk Abstraction
    Converts raw health metrics into non-sensitive readiness indicators.
    No health data is exposed in the output.
    """
    if risk_level == "High" or energy_score < 35:
        readiness = "Low"
        readiness_color = "red"
        summary = "Employee may need reduced workload today."
    elif risk_level == "Medium" or energy_score < 60:
        readiness = "Medium"
        readiness_color = "yellow"
        summary = "Employee is moderately available for standard tasks."
    else:
        readiness = "High"
        readiness_color = "green"
        summary = "Employee is fully available and at peak performance."

    task_adjustments = {
        "Low": [
            "Avoid assigning deep focus or high-complexity tasks",
            "Limit back-to-back meetings",
            "Prefer async communication over live calls",
            "Postpone non-urgent deadlines if possible",
        ],
        "Medium": [
            "Standard task load is appropriate",
            "Limit meetings to under 45 minutes",
            "One complex task per day is manageable",
            "Allow buffer time between tasks",
        ],
        "High": [
            "Full task capacity available",
            "Complex projects and presentations suitable",
            "Collaborative and high-output work recommended",
            "Ideal day for important meetings or reviews",
        ],
    }

    accommodations = {
        "Low": [
            "Flexible start time recommended",
            "Work from home preferred if possible",
            "Quiet workspace or reduced interruptions",
            "Optional: shorter work blocks with breaks",
        ],
        "Medium": [
            "Standard working conditions are fine",
            "Short breaks every 90 minutes recommended",
            "Hybrid or in-office both suitable",
        ],
        "High": [
            "No special accommodations needed",
            "Ideal for in-person collaboration",
            "High-energy environment is suitable",
        ],
    }

    return {
        "readiness": readiness,
        "readiness_color": readiness_color,
        "summary": summary,
        "task_adjustments": task_adjustments[readiness],
        "accommodations": accommodations[readiness],
        "health_data_exposed": False,
        "abstraction_engine": "Engine 2 + 2.1",
    }


@router.get("/{profile_id}")
def get_workplace_readiness(
    profile_id: int,
    db: Session = Depends(get_db)
):
    # ✅ Fetch profile for name only
    profile = db.query(models.UserProfile).filter(
        models.UserProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # ✅ FIXED — Query DailyMetric (not DailyPlan which doesn't exist)
    latest_metric = db.query(models.DailyMetric).filter(
        models.DailyMetric.profile_id == profile_id
    ).order_by(models.DailyMetric.date.desc()).first()

    # ✅ FALLBACK — If no metric, use latest check-in to compute on the fly
    if not latest_metric:
        latest_checkin = db.query(models.DailyCheckIn).filter(
            models.DailyCheckIn.profile_id == profile_id
        ).order_by(models.DailyCheckIn.date.desc()).first()

        if not latest_checkin:
            raise HTTPException(
                status_code=404,
                detail="No data found. Please complete a check-in first."
            )

        # Compute basic energy score from check-in directly
        energy_score = (latest_checkin.energy_level + latest_checkin.mood_level) * 10
        risk_level = "High" if energy_score < 35 else "Medium" if energy_score < 60 else "Low"
        date = str(latest_checkin.date)
    else:
        energy_score = latest_metric.energy_score
        risk_level = latest_metric.risk_level
        date = str(latest_metric.date)

    # ✅ Run Engine 2 abstraction
    abstracted = abstract_readiness(
        risk_level=risk_level,
        energy_score=energy_score,
    )

    return {
        "employee_name": profile.name,
        "date": date,
        **abstracted,
    }