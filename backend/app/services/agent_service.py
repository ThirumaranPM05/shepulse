from datetime import date

from .cycle_service import get_cycle_day, get_phase
from .energy_service import calculate_energy_score, risk_from_energy, theme_from_energy
from .planner_service import build_plan_blocks
from .ai_service import generate_short_explanation


def reschedule_agent(profile, latest_checkin, tasks):

    today = date.today()

    cycle_day = get_cycle_day(
        profile.last_period_date,
        today,
        profile.cycle_length
    )

    phase = get_phase(cycle_day)

    if latest_checkin is None:
        energy_level = 3
        mood_level = 3
        sleep_hours = None
        symptoms = {
            "cramps": False,
            "headache": False,
            "stress": False,
            "bloating": False
        }
    else:
        energy_level = latest_checkin.energy_level
        mood_level = latest_checkin.mood_level
        sleep_hours = latest_checkin.sleep_hours
        symptoms = {
            "cramps": latest_checkin.cramps,
            "headache": latest_checkin.headache,
            "stress": latest_checkin.stress,
            "bloating": latest_checkin.bloating
        }

    energy_score = calculate_energy_score(
        phase=phase,
        energy_level=energy_level,
        mood_level=mood_level,
        sleep_hours=sleep_hours,
        symptoms=symptoms
    )

    risk_level = risk_from_energy(energy_score)
    theme = theme_from_energy(energy_score)

    warning = None
    if risk_level == "High":
        warning = "High burnout risk detected. Switching to Recovery Mode."

    explain = generate_short_explanation(
        phase=phase,
        energy_score=energy_score,
        risk_level=risk_level,
        symptoms=symptoms
    )

    tasks_payload = [
        {
            "title": t.title,
            "duration_min": t.duration_min,
            "task_type": t.task_type,
            "priority": t.priority
        }
        for t in tasks
    ]

    # reduce overload automatically
    if risk_level == "High" and len(tasks_payload) > 3:
        tasks_payload = sorted(
            tasks_payload,
            key=lambda x: x["priority"]
        )[:3]

    blocks = build_plan_blocks(energy_score, tasks_payload)

    return {
        "cycle_day": cycle_day,
        "phase": phase,
        "energy_score": energy_score,
        "risk_level": risk_level,
        "theme": theme,
        "warning": warning,
        "phase_explanation": explain.get("phase_explanation"),
        "condition_explanation": explain.get("condition_explanation"),
        "blocks": blocks
    }
