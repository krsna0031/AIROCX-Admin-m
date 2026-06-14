import base64
import re
from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional
from app.config import settings

SAFE_COLOR = re.compile(
    r"^(#[0-9a-fA-F]{3,8}|linear-gradient\([#(),.%\w\s-]+\)|radial-gradient\([#(),.%\w\s-]+\))$"
)
YOUTUBE_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")

def validate_image(value: str | None) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    if value.startswith("https://"):
        if len(value) > 2048:
            raise ValueError("Image URL is too long")
        return value
    match = re.fullmatch(r"data:image/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)", value)
    if not match:
        raise ValueError("Image must be an HTTPS URL or PNG/JPEG/WebP/GIF data image")
    try:
        decoded_size = len(base64.b64decode(match.group(2), validate=True))
    except ValueError as exc:
        raise ValueError("Image data is invalid") from exc
    if decoded_size > settings.MAX_IMAGE_BYTES:
        raise ValueError("Image exceeds the configured upload limit")
    return value

class ContentBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    @field_validator("color", check_fields=False)
    @classmethod
    def color_is_safe(cls, value: str) -> str:
        if not SAFE_COLOR.fullmatch(value):
            raise ValueError("Use a hex color or a simple CSS gradient")
        return value

    @field_validator("image", check_fields=False)
    @classmethod
    def image_is_safe(cls, value: str | None) -> str:
        return validate_image(value)

# Auth Schemas
class AdminLogin(BaseModel):
    password: str = Field(min_length=1, max_length=200)

class TokenResponse(BaseModel):
    token: str
    message: str

# Character Schemas
class CharacterBase(ContentBase):
    name: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=100)
    desc: str = Field(min_length=1, max_length=500)
    bio: str = Field(min_length=1, max_length=5000)
    episodes: str = Field(min_length=1, max_length=50)
    fans: str = Field(min_length=1, max_length=50)
    power: str = Field(min_length=1, max_length=100)
    color: str = Field(max_length=200)
    svg: str = Field(default="", max_length=20000)
    image: Optional[str] = ""
    origin: str = Field(default="", max_length=300)
    quote: str = Field(default="", max_length=500)
    element: str = Field(default="", max_length=100)
    abilities: str = Field(default="", max_length=1000)

class CharacterCreate(CharacterBase):
    pass

class CharacterResponse(CharacterBase):
    id: int
    mongo_id: str = Field(..., alias="_id")
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

# Showcase Item Schemas
class ShowcaseItemBase(ContentBase):
    type: str = Field(pattern=r"^(video|image)$")
    cat: str = Field(pattern=r"^(video|image|bts)$")
    title: str = Field(min_length=1, max_length=200)
    desc: str = Field(min_length=1, max_length=500)
    ytId: Optional[str] = Field(default="", max_length=100)
    color: str = Field(max_length=100)
    image: Optional[str] = ""
    large: Optional[bool] = False

    @field_validator("ytId")
    @classmethod
    def youtube_id_is_safe(cls, value: str | None) -> str:
        value = (value or "").strip()
        if value and not YOUTUBE_ID.fullmatch(value):
            raise ValueError("YouTube ID must contain exactly 11 valid characters")
        return value

class ShowcaseItemCreate(ShowcaseItemBase):
    pass

class ShowcaseItemResponse(ShowcaseItemBase):
    id: int
    mongo_id: str = Field(..., alias="_id")
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

# Merch Item Schemas
class MerchItemBase(ContentBase):
    name: str = Field(min_length=1, max_length=200)
    cat: str = Field(min_length=1, max_length=100)
    price: float = Field(ge=0, le=100000)
    color: str = Field(max_length=100)
    emoji: str = Field(default="Product", max_length=50)
    image: Optional[str] = ""
    description: str = Field(default="", max_length=500)

class MerchItemCreate(MerchItemBase):
    pass

class MerchItemResponse(MerchItemBase):
    id: int
    mongo_id: str = Field(..., alias="_id")
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

# Contact Message Schemas
class ContactMessageCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=200)
    subject: str = Field(pattern=r"^(licensing|merchandising|press|careers)$")
    message: str = Field(min_length=10, max_length=5000)

    @field_validator("email")
    @classmethod
    def email_is_valid(cls, value: str) -> str:
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email address")
        return value

class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)
