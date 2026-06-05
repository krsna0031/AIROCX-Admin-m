from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api", tags=["contact"])

@router.post("/contact", response_model=schemas.ContactMessageResponse)
def submit_contact(msg: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    db_msg = models.ContactMessage(
        name=msg.name,
        email=msg.email,
        subject=msg.subject,
        message=msg.message,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/contact", response_model=list[schemas.ContactMessageResponse])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.id.desc()).all()
