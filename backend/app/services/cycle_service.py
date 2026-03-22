from datetime import date


def get_cycle_day(last_period_date: date, today: date, cycle_length: int) -> int:
    delta = (today - last_period_date).days
    if delta < 0:
        return 1

    return (delta % cycle_length) + 1


def get_phase(cycle_day: int) -> str:
    if 1 <= cycle_day <= 5:
        return "Menstrual"
    if 6 <= cycle_day <= 13:
        return "Follicular"
    if 14 <= cycle_day <= 16:
        return "Ovulation"
    return "Luteal"
