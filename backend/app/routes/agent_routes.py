from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from ..database import get_db
from .. import models

from ..services.cycle_service import get_cycle_day, get_phase
from ..services.energy_service import (
    calculate_energy_score,
    risk_from_energy,
    theme_from_energy,
)
from ..services.planner_service import build_plan_blocks

router = APIRouter(prefix="/agent", tags=["Agent"])


@router.post("/replan/{profile_id}")
def replan(profile_id: int, db: Session = Depends(get_db)):
    """
    Reschedule Agent:
    - reads latest check-in + tasks
    - recalculates energy score + risk
    - regenerates blocks using planner_service
    - returns plan format same as /plan
    """

    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.id == profile_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    today = date.today()

    # ✅ latest check-in
    latest_checkin = (
        db.query(models.DailyCheckIn)
        .filter(models.DailyCheckIn.profile_id == profile_id)
        .order_by(models.DailyCheckIn.created_at.desc())
        .first()
    )

    # ✅ fallback defaults if no checkin
    if latest_checkin is None:
        energy_level = 3
        mood_level = 3
        sleep_hours = None
        symptoms = {
            "cramps": False,
            "headache": False,
            "stress": False,
            "bloating": False,
        }
    else:
        energy_level = latest_checkin.energy_level
        mood_level = latest_checkin.mood_level
        sleep_hours = latest_checkin.sleep_hours
        symptoms = {
            "cramps": latest_checkin.cramps,
            "headache": latest_checkin.headache,
            "stress": latest_checkin.stress,
            "bloating": latest_checkin.bloating,
        }

    # ✅ FIX 1: cycle (cycle_length added)
    cycle_day = get_cycle_day(
        profile.last_period_date,
        today,
        profile.cycle_length,
    )
    phase = get_phase(cycle_day)

    # ✅ energy score
    energy_score = calculate_energy_score(
        phase=phase,
        energy_level=energy_level,
        mood_level=mood_level,
        sleep_hours=sleep_hours,
        symptoms=symptoms,
    )

    risk_level = risk_from_energy(energy_score)
    theme = theme_from_energy(energy_score)

    warning = None
    if str(risk_level).strip().lower() == "high":
        warning = (
            "High burnout risk detected. "
            "Consider reducing tasks and taking more breaks."
        )

    # ✅ fetch tasks
    tasks = (
        db.query(models.Task)
        .filter(models.Task.profile_id == profile_id)
        .all()
    )

    tasks_payload = [
        {
            "title": t.title,
            "duration_min": t.duration_min,
            "task_type": t.task_type,
            "priority": t.priority,
        }
        for t in tasks
    ]

    # ✅ FIX 2: correct argument order
    blocks = build_plan_blocks(tasks_payload, energy_score)

    return {
        "cycle_day": cycle_day,
        "phase": phase,
        "energy_score": energy_score,
        "risk_level": risk_level,
        "theme": theme,
        "warning": warning,
        "blocks": blocks,
    }
