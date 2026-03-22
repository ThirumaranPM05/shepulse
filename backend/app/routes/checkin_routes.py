from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, date as dt_date

from ..database import get_db
from .. import models, schemas

from ..services.cycle_service import get_cycle_day, get_phase
from ..services.energy_service import (
    calculate_energy_score,
    risk_from_energy,
    theme_from_energy,
    classify_fatigue_type
)
from ..services.planner_service import build_plan_blocks
from ..services.email_service import send_risk_email

router = APIRouter(prefix="/checkin", tags=["Check-in"])


@router.post("/{profile_id}")
def add_checkin(
    profile_id: int,
    payload: schemas.CheckInCreate,
    db: Session = Depends(get_db)
):

    profile = db.query(models.UserProfile).filter(
        models.UserProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    today = payload.date

    checkin = models.DailyCheckIn(
        profile_id=profile_id,
        date=today,
        energy_level=payload.energy_level,
        mood_level=payload.mood_level,
        sleep_hours=payload.sleep_hours,
        cramps=payload.cramps,
        headache=payload.headache,
        stress=payload.stress,
        bloating=payload.bloating,
    )

    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    # ---------------- cycle ----------------
    cycle_day = get_cycle_day(
        profile.last_period_date,
        today,
        profile.cycle_length
    )

    phase = get_phase(cycle_day)

    symptoms = {
        "cramps": checkin.cramps,
        "headache": checkin.headache,
        "stress": checkin.stress,
        "bloating": checkin.bloating,
    }

    # ---------------- energy ----------------
    energy_score = calculate_energy_score(
        phase=phase,
        energy_level=checkin.energy_level,
        mood_level=checkin.mood_level,
        sleep_hours=checkin.sleep_hours,
        symptoms=symptoms,
    )

    risk_level = risk_from_energy(energy_score)
    theme = theme_from_energy(energy_score)

    fatigue_type = classify_fatigue_type(
        phase,
        checkin.sleep_hours,
        payload.workload_today
    )

    # ---------------- snapshot metric ----------------
    metric = models.DailyMetric(
        profile_id=profile_id,
        date=today,
        energy_score=energy_score,
        risk_level=risk_level,
        phase=phase,
        fatigue_type=fatigue_type
    )

    db.add(metric)
    db.commit()

    # ---------------- tasks ----------------
    tasks = db.query(models.Task).filter(
        models.Task.profile_id == profile_id
    ).all()

    tasks_payload = [
        {
            "title": t.title,
            "duration_min": t.duration_min,
            "task_type": t.task_type,
            "priority": t.priority,
        }
        for t in tasks
    ]

    blocks = build_plan_blocks(energy_score, tasks_payload)

    # ---------------- warning ----------------
    if str(risk_level).strip().lower() == "high":
        subject = "🚨 TechCrunch Alert: High Burnout Risk"
        body = f"""
Hello {profile.name},

TechCrunch detected HIGH burnout risk today.

Phase: {phase}
Energy Score: {energy_score}
Risk Level: {risk_level}

Recommendation:
- Reduce workload
- Take more breaks
- Prefer light tasks today
"""
        send_risk_email(subject, body)

    return {
        "message": "Check-in saved ✅",
        "cycle_day": cycle_day,
        "phase": phase,
        "energy_score": energy_score,
        "risk_level": risk_level,
        "theme": theme,
        "blocks": blocks,
    }


# -------------------------------------------------------
# Check-in history for graph
# -------------------------------------------------------

@router.get(
    "/history/{profile_id}",
    response_model=list[schemas.CheckInTrendPoint]
)
def checkin_history(
    profile_id: int,
    days: int = 7,
    db: Session = Depends(get_db)
):

    profile = db.query(models.UserProfile).filter(
        models.UserProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if days < 1:
        days = 1
    if days > 60:
        days = 60

    start = dt_date.today() - timedelta(days=days - 1)

    rows = (
        db.query(models.DailyMetric)
        .filter(
            models.DailyMetric.profile_id == profile_id,
            models.DailyMetric.date >= start
        )
        .order_by(models.DailyMetric.date.asc())
        .all()
    )

    result = []

    for r in rows:
        cycle_day = get_cycle_day(
            profile.last_period_date,
            r.date,
            profile.cycle_length
        )

        result.append(
            schemas.CheckInTrendPoint(
                date=r.date,
                cycle_day=cycle_day,
                phase=r.phase,
                energy_score=r.energy_score,
                risk_level=r.risk_level
            )
        )

    return result
