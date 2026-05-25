from pydantic import BaseModel, Field
from typing import Optional

# Auth Schemas
class AdminLogin(BaseModel):
    password: str

class TokenResponse(BaseModel):
    token: str
    message: str

# Character Schemas
class CharacterBase(BaseModel):
    name: str
    role: str
    desc: str
    bio: str
    episodes: str
    fans: str
    power: str
    color: str
    svg: str
    image: Optional[str] = ""

class CharacterCreate(CharacterBase):
    pass

class CharacterResponse(CharacterBase):
    id: int
    mongo_id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True

# Showcase Item Schemas
class ShowcaseItemBase(BaseModel):
    type: str  # 'video' or 'image'
    cat: str   # 'video', 'image', 'bts'
    title: str
    desc: str
    ytId: Optional[str] = ""
    color: str
    image: Optional[str] = ""
    large: Optional[bool] = False

class ShowcaseItemCreate(ShowcaseItemBase):
    pass

class ShowcaseItemResponse(ShowcaseItemBase):
    id: int
    mongo_id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True

# Merch Item Schemas
class MerchItemBase(BaseModel):
    name: str
    cat: str
    price: float
    color: str
    emoji: str
    image: Optional[str] = ""

class MerchItemCreate(MerchItemBase):
    pass

class MerchItemResponse(MerchItemBase):
    id: int
    mongo_id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True
