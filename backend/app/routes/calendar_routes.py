from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from ..database import get_db
from .. import models
from ..services.cycle_service import get_cycle_day, get_phase

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.get("/{profile_id}")
def get_cycle_calendar(
    profile_id: int,
    days: int = 28,
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(
        models.UserProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    today = date.today()
    data = []

    for i in range(days):
        d = today + timedelta(days=i)

        cycle_day = get_cycle_day(
            profile.last_period_date,
            d,
            profile.cycle_length
        )

        phase = get_phase(cycle_day)

        data.append({
            "date": d.isoformat(),
            "cycle_day": cycle_day,
            "phase": phase,
            "is_today": d == today   # ✅ FIX
        })

    return data
