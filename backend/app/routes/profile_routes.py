from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/profile", tags=["Profile"])


def enrich_profile(profile: models.UserProfile):
    # compute next period date
    next_period = profile.last_period_date + timedelta(days=profile.cycle_length)

    return {
        "id": profile.id,
        "name": profile.name,
        "last_period_date": profile.last_period_date,
        "cycle_length": profile.cycle_length,
        "next_period_date": next_period,
    }


@router.post("/", response_model=schemas.ProfileOut)
def create_profile(payload: schemas.ProfileCreate, db: Session = Depends(get_db)):
    profile = models.UserProfile(
        name=payload.name.strip(),
        last_period_date=payload.last_period_date,
        cycle_length=int(payload.cycle_length),
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return enrich_profile(profile)


@router.get("/{profile_id}", response_model=schemas.ProfileOut)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.id == profile_id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return enrich_profile(profile)
