from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

from ..database import get_db
from .. import models

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/last/{profile_id}")
def last_metrics(profile_id: int, days: int = 7, db: Session = Depends(get_db)):

    start = date.today() - timedelta(days=days - 1)

    rows = (
        db.query(models.DailyMetric)
        .filter(
            models.DailyMetric.profile_id == profile_id,
            models.DailyMetric.date >= start
        )
        .order_by(models.DailyMetric.date.asc())
        .all()
    )

    return [
        {
            "date": r.date.isoformat(),
            "energy_score": r.energy_score,
            "risk_level": r.risk_level,
            "phase": r.phase,
            "fatigue_type": r.fatigue_type
        }
        for r in rows
    ]
