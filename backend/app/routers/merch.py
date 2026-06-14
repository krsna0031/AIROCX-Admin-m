from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.routers.auth import verify_token

router = APIRouter(prefix="/api/merch", tags=["merch"])

def merch_to_dict(item: models.MerchItem):
    return {
        "id": item.id,
        "_id": str(item.id),
        "name": item.name,
        "cat": item.cat,
        "price": item.price,
        "color": item.color,
        "emoji": item.emoji,
        "image": item.image or "",
        "description": item.description or "",
    }

@router.get("", response_model=List[schemas.MerchItemResponse])
def get_merch(db: Session = Depends(get_db)):
    items = db.query(models.MerchItem).all()
    return [merch_to_dict(i) for i in items]

@router.post("", response_model=schemas.MerchItemResponse)
def create_merch_item(item: schemas.MerchItemCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = models.MerchItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return merch_to_dict(db_item)

@router.put("/{item_id}", response_model=schemas.MerchItemResponse)
def update_merch_item(item_id: int, item: schemas.MerchItemCreate, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = db.query(models.MerchItem).filter(models.MerchItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Merch item not found")
    
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return merch_to_dict(db_item)

@router.delete("/{item_id}")
def delete_merch_item(item_id: int, db: Session = Depends(get_db), auth=Depends(verify_token)):
    db_item = db.query(models.MerchItem).filter(models.MerchItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Merch item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Merch item deleted"}
