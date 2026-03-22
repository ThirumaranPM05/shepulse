def phase_base_energy(phase: str) -> int:
    if phase == "Menstrual":
        return 40
    if phase == "Follicular":
        return 70
    if phase == "Ovulation":
        return 80
    return 55


def calculate_energy_score(
    phase: str,
    energy_level: int,
    mood_level: int,
    sleep_hours,
    symptoms: dict
) -> int:

    score = phase_base_energy(phase)

    score += (energy_level - 3) * 10
    score += (mood_level - 3) * 5

    if sleep_hours is not None:
        if sleep_hours >= 8:
            score += 8
        elif sleep_hours <= 5:
            score -= 10

    penalty = 0
    for _, v in symptoms.items():
        if v:
            penalty += 6

    score -= penalty

    return max(0, min(100, score))


def risk_from_energy(score: int) -> str:
    if score >= 70:
        return "Low"
    if score >= 40:
        return "Medium"
    return "High"


def classify_fatigue_type(
    phase: str,
    sleep_hours,
    workload_today: int | None
) -> str:
    """
    cycle vs stress separation
    """

    if phase in ["Follicular", "Ovulation"] and sleep_hours is not None:
        if sleep_hours >= 7 and workload_today is not None and workload_today >= 4:
            return "stress"

    return "cycle"


def theme_from_energy(score: int) -> str:
    if score >= 70:
        return "green"
    if score >= 40:
        return "yellow"
    return "red"
