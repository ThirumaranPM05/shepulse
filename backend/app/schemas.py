from pydantic import BaseModel
from datetime import date
from typing import Optional, List


# ---------------- Profile ----------------

class ProfileCreate(BaseModel):
    name: str
    last_period_date: date
    cycle_length: int


class ProfileOut(BaseModel):
    id: int
    name: str
    last_period_date: date
    cycle_length: int

    next_period_date: date

    class Config:
        from_attributes = True


# ---------------- Daily Check-in ----------------

class CheckInCreate(BaseModel):
    date: date
    energy_level: int
    mood_level: int
    sleep_hours: Optional[int] = None

    cramps: bool = False
    headache: bool = False
    stress: bool = False
    bloating: bool = False

    # ✅ NEW (for fatigue type detection & stress vs cycle logic)
    workload_today: Optional[int] = None   # 1–5 (optional)



class CheckInOut(CheckInCreate):
    id: int
    profile_id: int

    class Config:
        from_attributes = True


# ✅ NEW: Trend Point (for Graph)

class CheckInTrendPoint(BaseModel):
    date: date
    cycle_day: int
    phase: str
    energy_score: int
    risk_level: str


# ---------------- Tasks ----------------

class TaskCreate(BaseModel):
    title: str
    duration_min: int
    priority: int
    task_type: str = "light"  # deep/light


class TaskOut(TaskCreate):
    id: int
    profile_id: int

    class Config:
        from_attributes = True


# ---------------- Plan Output ----------------

class PlanBlock(BaseModel):
    start: str
    end: str
    label: str
    block_type: str  # deep/light/break


class PlanOut(BaseModel):
    cycle_day: int
    phase: str
    energy_score: int
    risk_level: str
    theme: str
    warning: Optional[str] = None
    phase_explanation: str | None = None
    condition_explanation: str | None = None
    blocks: List[PlanBlock]


# ---------------- Task Update ----------------

class TaskUpdate(BaseModel):
    title: str
    task_type: str
    duration_min: int
    priority: int
