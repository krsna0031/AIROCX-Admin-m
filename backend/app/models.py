from sqlalchemy import Column, Integer, String, Text, Boolean, Float
from app.database import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    desc = Column(String(500), nullable=False)
    bio = Column(Text, nullable=False)
    episodes = Column(String(50), nullable=False)
    fans = Column(String(50), nullable=False)
    power = Column(String(100), nullable=False)
    color = Column(String(200), nullable=False)
    svg = Column(Text, nullable=False)
    image = Column(String(500), default="", nullable=True)


class ShowcaseItem(Base):
    __tablename__ = "showcase_items"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # 'video' or 'image'
    cat = Column(String(50), nullable=False)   # 'video', 'image', 'bts'
    title = Column(String(200), nullable=False)
    desc = Column(String(500), nullable=False)
    ytId = Column(String(100), default="", nullable=True)
    color = Column(String(100), nullable=False)
    image = Column(String(500), default="", nullable=True)
    large = Column(Boolean, default=False, nullable=False)


class MerchItem(Base):
    __tablename__ = "merch_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    cat = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    color = Column(String(100), nullable=False)
    emoji = Column(String(50), nullable=False)
    image = Column(String(500), default="", nullable=True)
