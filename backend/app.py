from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/airocx")
client = MongoClient(MONGO_URL)
db = client.airocx

# Collections
characters_col = db.characters
showcase_col = db.showcase_items
merch_col = db.merch_items
admin_col = db.admin_users

# Auth
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET", "airocx-super-secret-key-2025")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "AIROCXIP06")

# Pydantic Models
class Character(BaseModel):
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

class ShowcaseItem(BaseModel):
    type: str  # 'video' or 'image'
    cat: str   # 'video', 'image', 'bts'
    title: str
    desc: str
    ytId: Optional[str] = ""
    color: str
    image: Optional[str] = ""
    large: Optional[bool] = False

class MerchItem(BaseModel):
    name: str
    cat: str
    price: float
    color: str
    emoji: str
    image: Optional[str] = ""

class AdminLogin(BaseModel):
    password: str

# Helper Functions
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Seed Data
def seed_database():
    # Check if already seeded
    if characters_col.count_documents({}) > 0:
        return
    
    # Seed Characters
    characters = [
        {
            "name": "Blobby",
            "role": "The Dreamer",
            "desc": "An endlessly curious spirit who sees wonder in everything — the heart and soul of the AIROCX world.",
            "bio": "Born from a cosmic cloud of stardust, Blobby floats through life with an infectious sense of wonder. Every mundane moment becomes magical through their eyes. They collect stories, memories, and dreams — storing them in their translucent form like fireflies in a jar.",
            "episodes": "24",
            "fans": "1.2M",
            "power": "Dreamweaving",
            "color": "linear-gradient(135deg,#c084fc,#6c5ce7)",
            "svg": "<svg width=\"70\" height=\"85\" viewBox=\"0 0 220 260\"><ellipse cx=\"110\" cy=\"140\" rx=\"75\" ry=\"90\" fill=\"#d8b4fe\"/><circle cx=\"85\" cy=\"120\" r=\"20\" fill=\"white\"/><circle cx=\"135\" cy=\"120\" r=\"20\" fill=\"white\"/><circle cx=\"90\" cy=\"118\" r=\"10\" fill=\"#1a1a2e\"/><circle cx=\"140\" cy=\"118\" r=\"10\" fill=\"#1a1a2e\"/><circle cx=\"93\" cy=\"114\" r=\"4\" fill=\"white\"/><circle cx=\"143\" cy=\"114\" r=\"4\" fill=\"white\"/><ellipse cx=\"110\" cy=\"158\" rx=\"16\" ry=\"9\" fill=\"#1a1a2e\"/><circle cx=\"60\" cy=\"175\" r=\"12\" fill=\"#f472b6\"/><circle cx=\"160\" cy=\"175\" r=\"12\" fill=\"#f472b6\"/></svg>",
            "image": ""
        },
        {
            "name": "Ferno",
            "role": "The Spark",
            "desc": "Hot-headed but warm-hearted, Ferno brings the energy and courage when things get tough.",
            "bio": "Forged in the heart of a volcano, Ferno's fiery temperament masks a deeply loyal soul. Quick to anger but even quicker to forgive, they charge headfirst into danger to protect their friends. Their flames burn brightest when hope seems lost.",
            "episodes": "22",
            "fans": "980K",
            "power": "Ember Burst",
            "color": "linear-gradient(135deg,#f472b6,#ef4444)",
            "svg": "<svg width=\"70\" height=\"85\" viewBox=\"0 0 220 260\"><rect x=\"60\" y=\"80\" width=\"100\" height=\"130\" rx=\"20\" fill=\"#fca5a5\"/><circle cx=\"90\" cy=\"130\" r=\"16\" fill=\"white\"/><circle cx=\"140\" cy=\"130\" r=\"16\" fill=\"white\"/><circle cx=\"93\" cy=\"128\" r=\"8\" fill=\"#1a1a2e\"/><circle cx=\"143\" cy=\"128\" r=\"8\" fill=\"#1a1a2e\"/><rect x=\"95\" y=\"155\" width=\"30\" height=\"8\" rx=\"4\" fill=\"#1a1a2e\"/><polygon points=\"110,60 90,90 130,90\" fill=\"#fca5a5\"/></svg>",
            "image": ""
        },
        {
            "name": "Aqui",
            "role": "The Thinker",
            "desc": "Calm, analytical, and deeply empathetic — Aqui flows through problems with graceful logic.",
            "bio": "Rising from the depths of the Crystal Tides, Aqui observes the world with patient wisdom. They believe every conflict has a solution if you look deep enough. Their fluid nature allows them to adapt to any situation, finding harmony where others see chaos.",
            "episodes": "20",
            "fans": "1.1M",
            "power": "Tidal Mind",
            "color": "linear-gradient(135deg,#67e8f9,#06b6d4)",
            "svg": "<svg width=\"70\" height=\"85\" viewBox=\"0 0 220 260\"><ellipse cx=\"110\" cy=\"150\" rx=\"60\" ry=\"75\" fill=\"#a5f3fc\"/><circle cx=\"90\" cy=\"130\" r=\"18\" fill=\"white\"/><circle cx=\"130\" cy=\"130\" r=\"18\" fill=\"white\"/><circle cx=\"93\" cy=\"128\" r=\"9\" fill=\"#1a1a2e\"/><circle cx=\"133\" cy=\"128\" r=\"9\" fill=\"#1a1a2e\"/><path d=\"M95 165 Q110 180 125 165\" stroke=\"#1a1a2e\" stroke-width=\"3\" fill=\"none\"/><ellipse cx=\"70\" cy=\"100\" rx=\"20\" ry=\"8\" fill=\"#a5f3fc\" transform=\"rotate(-20 70 100)\"/><ellipse cx=\"150\" cy=\"100\" rx=\"20\" ry=\"8\" fill=\"#a5f3fc\" transform=\"rotate(20 150 100)\"/></svg>",
            "image": ""
        },
        {
            "name": "Zolt",
            "role": "The Inventor",
            "desc": "A quick-witted genius who can build anything from nothing — and accidentally blow it up twice.",
            "bio": "Powered by lightning and caffeine, Zolt's mind moves faster than their hands. They see solutions in scraps, potential in chaos. Sure, half their inventions malfunction spectacularly — but the other half change everything. Failure is just data.",
            "episodes": "21",
            "fans": "950K",
            "power": "Circuit Storm",
            "color": "linear-gradient(135deg,#fbbf24,#f59e0b)",
            "svg": "<svg width=\"70\" height=\"85\" viewBox=\"0 0 220 260\"><polygon points=\"110,50 40,180 180,180\" fill=\"#fde68a\"/><circle cx=\"95\" cy=\"140\" r=\"14\" fill=\"white\"/><circle cx=\"135\" cy=\"140\" r=\"14\" fill=\"white\"/><circle cx=\"97\" cy=\"138\" r=\"7\" fill=\"#1a1a2e\"/><circle cx=\"137\" cy=\"138\" r=\"7\" fill=\"#1a1a2e\"/><rect x=\"100\" y=\"160\" width=\"20\" height=\"6\" rx=\"3\" fill=\"#1a1a2e\"/><line x1=\"110\" y1=\"50\" x2=\"110\" y2=\"30\" stroke=\"#fde68a\" stroke-width=\"6\"/><circle cx=\"110\" cy=\"24\" r=\"8\" fill=\"#fbbf24\"/></svg>",
            "image": ""
        }
    ]
    
    # Seed Showcase
    showcase = [
        {"type": "video", "cat": "video", "title": "Season 1 Trailer", "desc": "Official launch trailer", "ytId": "dQw4w9WgXcQ", "color": "#6c5ce7", "image": "", "large": True},
        {"type": "image", "cat": "image", "title": "Blobby Concept Art", "desc": "Original character design", "ytId": "", "color": "#c084fc", "image": "", "large": False},
        {"type": "image", "cat": "bts", "title": "Studio Timelapse", "desc": "Behind the scenes at AIROCX HQ", "ytId": "", "color": "#f472b6", "image": "", "large": False},
        {"type": "video", "cat": "video", "title": "Episode 1: The Awakening", "desc": "Pilot episode clip", "ytId": "dQw4w9WgXcQ", "color": "#ef4444", "image": "", "large": False},
        {"type": "image", "cat": "image", "title": "World of Ember Isles", "desc": "Environment artwork", "ytId": "", "color": "#f59e0b", "image": "", "large": False},
        {"type": "video", "cat": "bts", "title": "Making of Aqui", "desc": "Character design process", "ytId": "dQw4w9WgXcQ", "color": "#06b6d4", "image": "", "large": False},
        {"type": "image", "cat": "image", "title": "Crystal Tides Panorama", "desc": "Panoramic scene artwork", "ytId": "", "color": "#67e8f9", "image": "", "large": False},
        {"type": "video", "cat": "video", "title": "Season 2 Teaser", "desc": "Coming this fall", "ytId": "dQw4w9WgXcQ", "color": "#a855f7", "image": "", "large": False}
    ]
    
    # Seed Merch
    merch = [
        {"name": "Blobby Plush Toy", "cat": "Collectibles", "price": 34.99, "color": "#c084fc", "emoji": "🧸", "image": ""},
        {"name": "Ferno Graphic Tee", "cat": "Apparel", "price": 29.99, "color": "#f472b6", "emoji": "👕", "image": ""},
        {"name": "AIROCX Enamel Pin Set", "cat": "Accessories", "price": 18.99, "color": "#fbbf24", "emoji": "📌", "image": ""},
        {"name": "Crystal Tides Art Print", "cat": "Art & Posters", "price": 24.99, "color": "#67e8f9", "emoji": "🖼️", "image": ""},
        {"name": "Zolt Inventor Kit", "cat": "Toys & Games", "price": 49.99, "color": "#f59e0b", "emoji": "🔧", "image": ""},
        {"name": "Aqui Water Bottle", "cat": "Accessories", "price": 22.99, "color": "#06b6d4", "emoji": "💧", "image": ""},
        {"name": "AIROCX Hoodie", "cat": "Apparel", "price": 59.99, "color": "#a855f7", "emoji": "🧥", "image": ""},
        {"name": "Character Sticker Pack", "cat": "Collectibles", "price": 9.99, "color": "#ec4899", "emoji": "✨", "image": ""}
    ]
    
    characters_col.insert_many(characters)
    showcase_col.insert_many(showcase)
    merch_col.insert_many(merch)
    print("✓ Database seeded successfully!")

# Routes
@app.on_event("startup")
async def startup_event():
    seed_database()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AIROCX API"}

# Admin Auth
@app.post("/api/auth/login")
def admin_login(creds: AdminLogin):
    if creds.password == ADMIN_PASSWORD:
        token = create_token({"admin": True})
        return {"token": token, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid password")

# Characters API
@app.get("/api/characters")
def get_characters():
    chars = list(characters_col.find())
    for c in chars:
        c["_id"] = str(c["_id"])
    return chars

@app.post("/api/characters")
def create_character(char: Character, auth=Depends(verify_token)):
    result = characters_col.insert_one(char.dict())
    return {"_id": str(result.inserted_id), **char.dict()}

@app.put("/api/characters/{char_id}")
def update_character(char_id: str, char: Character, auth=Depends(verify_token)):
    characters_col.update_one({"_id": ObjectId(char_id)}, {"$set": char.dict()})
    return {"_id": char_id, **char.dict()}

@app.delete("/api/characters/{char_id}")
def delete_character(char_id: str, auth=Depends(verify_token)):
    characters_col.delete_one({"_id": ObjectId(char_id)})
    return {"message": "Character deleted"}

# Showcase API
@app.get("/api/showcase")
def get_showcase():
    items = list(showcase_col.find())
    for i in items:
        i["_id"] = str(i["_id"])
    return items

@app.post("/api/showcase")
def create_showcase(item: ShowcaseItem, auth=Depends(verify_token)):
    result = showcase_col.insert_one(item.dict())
    return {"_id": str(result.inserted_id), **item.dict()}

@app.put("/api/showcase/{item_id}")
def update_showcase(item_id: str, item: ShowcaseItem, auth=Depends(verify_token)):
    showcase_col.update_one({"_id": ObjectId(item_id)}, {"$set": item.dict()})
    return {"_id": item_id, **item.dict()}

@app.delete("/api/showcase/{item_id}")
def delete_showcase(item_id: str, auth=Depends(verify_token)):
    showcase_col.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Showcase item deleted"}

# Merch API
@app.get("/api/merch")
def get_merch():
    items = list(merch_col.find())
    for i in items:
        i["_id"] = str(i["_id"])
    return items

@app.post("/api/merch")
def create_merch(item: MerchItem, auth=Depends(verify_token)):
    result = merch_col.insert_one(item.dict())
    return {"_id": str(result.inserted_id), **item.dict()}

@app.put("/api/merch/{item_id}")
def update_merch(item_id: str, item: MerchItem, auth=Depends(verify_token)):
    merch_col.update_one({"_id": ObjectId(item_id)}, {"$set": item.dict()})
    return {"_id": item_id, **item.dict()}

@app.delete("/api/merch/{item_id}")
def delete_merch(item_id: str, auth=Depends(verify_token)):
    merch_col.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Merch item deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
