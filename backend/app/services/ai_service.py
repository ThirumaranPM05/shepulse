import requests
from ..config import OPENROUTER_API_KEY, OPENROUTER_MODEL


def generate_short_explanation(phase: str, energy_score: int, risk_level: str, symptoms: dict):
    """
    Uses OpenRouter small model to generate a very short explanation.
    If key not provided, fallback to simple rule-based explanation.
    """

    # fallback if no API key
    if not OPENROUTER_API_KEY:
        return {
            "phase_explanation": f"{phase} phase is a natural cycle stage that can affect energy and mood.",
            "condition_explanation": f"Energy score is {energy_score}. Risk is {risk_level}. Your plan is adjusted accordingly."
        }

    prompt = f"""
You are a health-aware productivity assistant.
Explain the menstrual phase and today's condition in 1-2 lines each.
No medical claims. Use simple words.

Phase: {phase}
Energy Score: {energy_score}
Risk: {risk_level}
Symptoms: {symptoms}
"""

    try:
        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "user", "content": prompt.strip()}
                ],
                "temperature": 0.4,
                "max_tokens": 120
            },
            timeout=20
        )

        data = res.json()
        text = data["choices"][0]["message"]["content"].strip()

        # simple split into 2 parts
        lines = [l.strip("- ").strip() for l in text.split("\n") if l.strip()]
        phase_expl = lines[0] if len(lines) > 0 else f"{phase} phase affects energy/mood."
        cond_expl = lines[1] if len(lines) > 1 else f"Energy score {energy_score}, risk {risk_level}."

        return {
            "phase_explanation": phase_expl,
            "condition_explanation": cond_expl
        }

    except Exception:
        return {
            "phase_explanation": f"{phase} phase is part of the normal cycle and may change energy.",
            "condition_explanation": f"Energy score is {energy_score}, risk is {risk_level}. Planner adjusted your tasks."
        }
