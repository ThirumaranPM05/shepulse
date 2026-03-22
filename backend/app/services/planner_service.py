# planner_service.py
from datetime import datetime, timedelta

def build_plan_blocks(tasks, energy_score: int):
    if not isinstance(tasks, list) or not tasks:
        return []

    tasks_sorted = sorted(
        tasks,
        key=lambda t: (int(t.get("priority", 3)), int(t.get("duration_min", 30)))
    )

    break_min = 10 if energy_score >= 40 else 15

    current_time = datetime.now().replace(
        hour=9, minute=0, second=0, microsecond=0
    )

    blocks = []

    for t in tasks_sorted:
        duration = int(t.get("duration_min", 30))
        start = current_time
        end = start + timedelta(minutes=duration)

        blocks.append({
            "label": t.get("title", "Task"),
            "start": start.strftime("%H:%M"),
            "end": end.strftime("%H:%M"),
            "block_type": t.get("task_type", "light"),
        })

        break_end = end + timedelta(minutes=break_min)
        blocks.append({
            "label": "Break",
            "start": end.strftime("%H:%M"),
            "end": break_end.strftime("%H:%M"),
            "block_type": "break",
        })

        current_time = break_end

    return blocks
