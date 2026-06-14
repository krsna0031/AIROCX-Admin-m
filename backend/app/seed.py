from sqlalchemy.orm import Session
from app import models

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.Character).count() > 0:
        return
    
    print("Seed database: Tables are empty. Seeding initial data...")
    
    # 1. Seed Characters
    characters = [
        models.Character(
            name="Blobby",
            role="The Dreamer",
            desc="An endlessly curious spirit who sees wonder in everything — the heart and soul of the AIROCX world.",
            bio="Born from a cosmic cloud of stardust, Blobby floats through life with an infectious sense of wonder. Every mundane moment becomes magical through their eyes. They collect stories, memories, and dreams — storing them in their translucent form like fireflies in a jar.",
            episodes="24",
            fans="1.2M",
            power="Dreamweaving",
            color="linear-gradient(135deg,#c084fc,#6c5ce7)",
            svg='<svg width="70" height="85" viewBox="0 0 220 260"><ellipse cx="110" cy="140" rx="75" ry="90" fill="#d8b4fe"/><circle cx="85" cy="120" r="20" fill="white"/><circle cx="135" cy="120" r="20" fill="white"/><circle cx="90" cy="118" r="10" fill="#1a1a2e"/><circle cx="140" cy="118" r="10" fill="#1a1a2e"/><circle cx="93" cy="114" r="4" fill="white"/><circle cx="143" cy="114" r="4" fill="white"/><ellipse cx="110" cy="158" rx="16" ry="9" fill="#1a1a2e"/><circle cx="60" cy="175" r="12" fill="#f472b6"/><circle cx="160" cy="175" r="12" fill="#f472b6"/></svg>',
            image="",
            origin="Cosmic Nebula of Luminara",
            quote="Every dream is a universe waiting to be explored.",
            element="Aether",
            abilities="Dreamweaving, Memory Capture, Starlight Shield, Empathy Pulse",
        ),
        models.Character(
            name="Ferno",
            role="The Spark",
            desc="Hot-headed but warm-hearted, Ferno brings the energy and courage when things get tough.",
            bio="Forged in the heart of a volcano, Ferno's fiery temperament masks a deeply loyal soul. Quick to anger but even quicker to forgive, they charge headfirst into danger to protect their friends. Their flames burn brightest when hope seems lost.",
            episodes="22",
            fans="980K",
            power="Ember Burst",
            color="linear-gradient(135deg,#f472b6,#ef4444)",
            svg='<svg width="70" height="85" viewBox="0 0 220 260"><rect x="60" y="80" width="100" height="130" rx="20" fill="#fca5a5"/><circle cx="90" cy="130" r="16" fill="white"/><circle cx="140" cy="130" r="16" fill="white"/><circle cx="93" cy="128" r="8" fill="#1a1a2e"/><circle cx="143" cy="128" r="8" fill="#1a1a2e"/><rect x="95" y="155" width="30" height="8" rx="4" fill="#1a1a2e"/><polygon points="110,60 90,90 130,90" fill="#fca5a5"/></svg>',
            image="",
            origin="The Volcanic Core of Mount Pyraxis",
            quote="Courage is having fire in your heart when the path gets dark.",
            element="Fire",
            abilities="Ember Burst, Inferno Dash, Flame Wall, Phoenix Rebirth",
        ),
        models.Character(
            name="Aqui",
            role="The Thinker",
            desc="Calm, analytical, and deeply empathetic — Aqui flows through problems with graceful logic.",
            bio="Rising from the depths of the Crystal Tides, Aqui observes the world with patient wisdom. They believe every conflict has a solution if you look deep enough. Their fluid nature allows them to adapt to any situation, finding harmony where others see chaos.",
            episodes="20",
            fans="1.1M",
            power="Tidal Mind",
            color="linear-gradient(135deg,#67e8f9,#06b6d4)",
            svg='<svg width="70" height="85" viewBox="0 0 220 260"><ellipse cx="110" cy="150" rx="60" ry="75" fill="#a5f3fc"/><circle cx="90" cy="130" r="18" fill="white"/><circle cx="130" cy="130" r="18" fill="white"/><circle cx="93" cy="128" r="9" fill="#1a1a2e"/><circle cx="133" cy="128" r="9" fill="#1a1a2e"/><path d="M95 165 Q110 180 125 165" stroke="#1a1a2e" stroke-width="3" fill="none"/><ellipse cx="70" cy="100" rx="20" ry="8" fill="#a5f3fc" transform="rotate(-20 70 100)"/><ellipse cx="150" cy="100" rx="20" ry="8" fill="#a5f3fc" transform="rotate(20 150 100)"/></svg>',
            image="",
            origin="The Crystal Tides of Oceamar",
            quote="Still waters run deep, and so does understanding.",
            element="Water",
            abilities="Tidal Mind, Current Sense, Hydro Shield, Deep Resonance",
        ),
        models.Character(
            name="Zolt",
            role="The Inventor",
            desc="A quick-witted genius who can build anything from nothing — and accidentally blow it up twice.",
            bio="Powered by lightning and caffeine, Zolt's mind moves faster than their hands. They see solutions in scraps, potential in chaos. Sure, half their inventions malfunction spectacularly — but the other half change everything. Failure is just data.",
            episodes="21",
            fans="950K",
            power="Circuit Storm",
            color="linear-gradient(135deg,#fbbf24,#f59e0b)",
            svg='<svg width="70" height="85" viewBox="0 0 220 260"><polygon points="110,50 40,180 180,180" fill="#fde68a"/><circle cx="95" cy="140" r="14" fill="white"/><circle cx="135" cy="140" r="14" fill="white"/><circle cx="97" cy="138" r="7" fill="#1a1a2e"/><circle cx="137" cy="138" r="7" fill="#1a1a2e"/><rect x="100" y="160" width="20" height="6" rx="3" fill="#1a1a2e"/><line x1="110" y1="50" x2="110" y2="30" stroke="#fde68a" stroke-width="6"/><circle cx="110" cy="24" r="8" fill="#fbbf24"/></svg>',
            image="",
            origin="The Lightning Forges of Voltheim",
            quote="Failure is the first step in my next breakthrough.",
            element="Lightning",
            abilities="Circuit Storm, Spark Weld, Thunder Clap, Overcharge",
        )
    ]
    db.add_all(characters)
    
    # 2. Seed Showcase
    showcase = [
        models.ShowcaseItem(type="video", cat="video", title="Season 1 Trailer", desc="Official launch trailer", ytId="dQw4w9WgXcQ", color="#6c5ce7", image="", large=True),
        models.ShowcaseItem(type="image", cat="image", title="Blobby Concept Art", desc="Original character design", ytId="", color="#c084fc", image="", large=False),
        models.ShowcaseItem(type="image", cat="bts", title="Studio Timelapse", desc="Behind the scenes at AIROCX HQ", ytId="", color="#f472b6", image="", large=False),
        models.ShowcaseItem(type="video", cat="video", title="Episode 1: The Awakening", desc="Pilot episode clip", ytId="dQw4w9WgXcQ", color="#ef4444", image="", large=False),
        models.ShowcaseItem(type="image", cat="image", title="World of Ember Isles", desc="Environment artwork", ytId="", color="#f59e0b", image="", large=False),
        models.ShowcaseItem(type="video", cat="bts", title="Making of Aqui", desc="Character design process", ytId="dQw4w9WgXcQ", color="#06b6d4", image="", large=False),
        models.ShowcaseItem(type="image", cat="image", title="Crystal Tides Panorama", desc="Panoramic scene artwork", ytId="", color="#67e8f9", image="", large=False),
        models.ShowcaseItem(type="video", cat="video", title="Season 2 Teaser", desc="Coming this fall", ytId="dQw4w9WgXcQ", color="#a855f7", image="", large=False)
    ]
    db.add_all(showcase)
    
    # 3. Seed Merch
    merch = [
        models.MerchItem(name="Blobby Plush Toy", cat="Collectibles", price=34.99, color="#c084fc", emoji="Plush", image="", description="A soft Blobby companion with embroidered details for desks, shelves, and adventures."),
        models.MerchItem(name="Ferno Graphic Tee", cat="Apparel", price=29.99, color="#f472b6", emoji="Tee", image="", description="A comfortable character tee featuring Ferno's bright Ember Burst artwork."),
        models.MerchItem(name="AIROCX Enamel Pin Set", cat="Accessories", price=18.99, color="#fbbf24", emoji="Pins", image="", description="Four polished character pins made for jackets, bags, and collector boards."),
        models.MerchItem(name="Crystal Tides Art Print", cat="Art & Posters", price=24.99, color="#67e8f9", emoji="Print", image="", description="Gallery-quality artwork inspired by Aqui and the luminous Crystal Tides."),
        models.MerchItem(name="Zolt Inventor Kit", cat="Toys & Games", price=49.99, color="#f59e0b", emoji="Kit", image="", description="A hands-on creativity kit packed with safe build prompts from Zolt's workshop."),
        models.MerchItem(name="Aqui Water Bottle", cat="Accessories", price=22.99, color="#06b6d4", emoji="Bottle", image="", description="A reusable bottle with calm Crystal Tides colors and Aqui character art."),
        models.MerchItem(name="AIROCX Hoodie", cat="Apparel", price=59.99, color="#a855f7", emoji="Hoodie", image="", description="A heavyweight studio hoodie with a subtle embroidered AIROCX universe mark."),
        models.MerchItem(name="Character Sticker Pack", cat="Collectibles", price=9.99, color="#ec4899", emoji="Stickers", image="", description="A colorful weather-resistant sticker set featuring the complete key character cast.")
    ]
    db.add_all(merch)
    
    db.commit()
    print("✓ SQLite Database seeded successfully!")
