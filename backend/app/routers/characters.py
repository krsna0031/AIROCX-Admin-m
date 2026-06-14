from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.routers.auth import verify_token

router = APIRouter(prefix="/api/characters", tags=["characters"])

def char_to_dict(char: models.Character):
    return {
        "id": char.id,
        "_id": str(char.id),
        "name": char.name,
        "role": char.role,
        "desc": char.desc,
        "bio": char.bio,
        "episodes": char.episodes,
        "fans": char.fans,
        "power": char.power,
        "color": char.color,
        "svg": char.svg,
        "image": char.image or "",
        "origin": char.origin or "",
        "quote": char.quote or "",
        "element": char.element or "",
        "abilities": char.abilities or "",
    }

@router.get("", response_model=List[schemas.CharacterResponse])
def get_characters(db: Session = Depends(get_db)):
    chars = db.query(models.Character).all()
    return [char_to_dict(c) for c in chars]

@router.post("", response_model=schemas.CharacterResponse)
def create_character(char: schemas.CharacterCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_char = models.Character(**char.model_dump())
    db.add(db_char)
    db.commit()
    db.refresh(db_char)
    return char_to_dict(db_char)

@router.put("/{char_id}", response_model=schemas.CharacterResponse)
def update_character(char_id: int, char: schemas.CharacterCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_char = db.query(models.Character).filter(models.Character.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    for key, value in char.model_dump().items():
        setattr(db_char, key, value)
    
    db.commit()
    db.refresh(db_char)
    return char_to_dict(db_char)

@router.delete("/{char_id}")
def delete_character(char_id: int, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_char = db.query(models.Character).filter(models.Character.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    db.delete(db_char)
    db.commit()
    return {"message": "Character deleted"}
