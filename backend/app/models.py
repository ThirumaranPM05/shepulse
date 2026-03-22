from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, default="User")
    last_period_date = Column(Date, nullable=False)
    cycle_length = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    checkins = relationship("DailyCheckIn", back_populates="profile", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="profile", cascade="all, delete-orphan")


class DailyCheckIn(Base):
    __tablename__ = "daily_checkins"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)

    date = Column(Date, nullable=False)
    energy_level = Column(Integer, nullable=False)   # 1-5
    mood_level = Column(Integer, nullable=False)     # 1-5
    sleep_hours = Column(Integer, nullable=True)     # optional

    cramps = Column(Boolean, default=False)
    headache = Column(Boolean, default=False)
    stress = Column(Boolean, default=False)
    bloating = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="checkins")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)

    title = Column(String, nullable=False)
    duration_min = Column(Integer, nullable=False)  # minutes
    priority = Column(Integer, nullable=False)      # 1-5
    task_type = Column(String, default="light")     # deep / light

    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="tasks")
class DailyMetric(Base):
    __tablename__ = "daily_metrics"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)

    date = Column(Date, nullable=False)

    energy_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    phase = Column(String, nullable=False)
    fatigue_type = Column(String, nullable=False)   # cycle / stress

    created_at = Column(DateTime, default=datetime.utcnow)
