from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from ..database import get_db
from .. import models
from ..services.chat_service import chat_with_openrouter

from ..services.cycle_service import get_cycle_day, get_phase
from ..services.energy_service import calculate_energy_score, risk_from_energy

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/")
def care_chat(payload: dict, db: Session = Depends(get_db)):
    """
    payload expects:
    {
      "profile_id": 1,
      "message": "hi"
    }
    """

    profile_id = payload.get("profile_id")
    message = payload.get("message", "").strip()

    if not profile_id:
        raise HTTPException(status_code=400, detail="profile_id is required")

    if not message:
        raise HTTPException(status_code=400, detail="message is required")

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

    # ✅ FIX: cycle_length added
    cycle_day = get_cycle_day(
        profile.last_period_date,
        today,
        profile.cycle_length,
    )
    phase = get_phase(cycle_day)

    # ✅ energy score + risk
    energy_score = calculate_energy_score(
        phase=phase,
        energy_level=energy_level,
        mood_level=mood_level,
        sleep_hours=sleep_hours,
        symptoms=symptoms,
    )

    risk_level = risk_from_energy(energy_score)

    # ✅ SYSTEM PROMPT
    system_prompt = f"""
You are CareChat 💙, a supportive companion for women during menstrual cycle days.

User Name: {profile.name}
Current Phase: {phase}
Cycle Day: {cycle_day}
Risk Level: {risk_level}
Energy Score: {energy_score}

Rules:
- Be gentle, empathetic, supportive.
- Keep responses short (2–6 lines).
- Give practical suggestions (hydration, rest, breathing, warm water, light walk).
- Avoid medical diagnosis.
- If user reports extreme pain or heavy bleeding, suggest consulting a doctor.
- Never be rude or judgmental.
"""

    reply = chat_with_openrouter(message, system_prompt)

    return {"reply": reply}
