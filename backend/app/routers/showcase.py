from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.routers.auth import verify_token

router = APIRouter(prefix="/api/showcase", tags=["showcase"])

def item_to_dict(item: models.ShowcaseItem):
    return {
        "id": item.id,
        "_id": str(item.id),
        "type": item.type,
        "cat": item.cat,
        "title": item.title,
        "desc": item.desc,
        "ytId": item.ytId or "",
        "color": item.color,
        "image": item.image or "",
        "large": item.large
    }

@router.get("", response_model=List[schemas.ShowcaseItemResponse])
def get_showcase(db: Session = Depends(get_db)):
    items = db.query(models.ShowcaseItem).all()
    return [item_to_dict(i) for i in items]

@router.post("", response_model=schemas.ShowcaseItemResponse)
def create_showcase_item(item: schemas.ShowcaseItemCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = models.ShowcaseItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return item_to_dict(db_item)

@router.put("/{item_id}", response_model=schemas.ShowcaseItemResponse)
def update_showcase_item(item_id: int, item: schemas.ShowcaseItemCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = db.query(models.ShowcaseItem).filter(models.ShowcaseItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Showcase item not found")
    
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return item_to_dict(db_item)

@router.delete("/{item_id}")
def delete_showcase_item(item_id: int, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = db.query(models.ShowcaseItem).filter(models.ShowcaseItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Showcase item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Showcase item deleted"}
