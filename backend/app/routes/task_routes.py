from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ✅ ADD TASK
@router.post("/{profile_id}")
def add_task(profile_id: int, payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    task = models.Task(
        profile_id=profile_id,
        title=payload.title,
        task_type=payload.task_type,
        duration_min=payload.duration_min,
        priority=payload.priority,
        created_at=datetime.utcnow(),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# ✅ LIST TASKS
@router.get("/{profile_id}")
def list_tasks(profile_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Task)
        .filter(models.Task.profile_id == profile_id)
        .order_by(models.Task.id.desc())
        .all()
    )


# ✅ UPDATE TASK
@router.put("/{task_id}")
def update_task(task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = payload.title
    task.task_type = payload.task_type
    task.duration_min = payload.duration_min
    task.priority = payload.priority

    db.commit()
    db.refresh(task)
    return task


# ✅ DELETE TASK
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
