import React, { useState, useEffect } from 'react';
import { apiUrl, readApiError } from '../lib/api.js';

function MainWebsite() {
  const [characters, setCharacters] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [merchItems, setMerchItems] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [showcaseFilter, setShowcaseFilter] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return setupScrollAnimations();
  }, [characters, showcaseItems, merchItems, showcaseFilter]);

  const fetchData = async () => {
    // Fallback sample data if backend is offline
    const fallbackCharacters = [
      { id: 1, name: 'Blobby', role: 'The Dreamer', desc: 'An endlessly curious spirit who sees wonder in everything — the heart and soul of the AIROCX world.', bio: 'Born from a cosmic cloud of stardust, Blobby floats through life with an infectious sense of wonder. Every mundane moment becomes magical through their eyes. They collect stories, memories, and dreams — storing them in their translucent form like fireflies in a jar.', episodes: '24', fans: '1.2M', power: 'Dreamweaving', color: 'linear-gradient(135deg,#c084fc,#6c5ce7)', image: '' },
      { id: 2, name: 'Ferno', role: 'The Spark', desc: 'Hot-headed but warm-hearted, Ferno brings the energy and courage when things get tough.', bio: 'Forged in the heart of a volcano, Ferno\'s fiery temperament masks a deeply loyal soul. Quick to anger but even quicker to forgive, they charge headfirst into danger to protect their friends. Their flames burn brightest when hope seems lost.', episodes: '22', fans: '980K', power: 'Ember Burst', color: 'linear-gradient(135deg,#f472b6,#ef4444)', image: '' },
      { id: 3, name: 'Aqui', role: 'The Thinker', desc: 'Calm, analytical, and deeply empathetic — Aqui flows through problems with graceful logic.', bio: 'Rising from the depths of the Crystal Tides, Aqui observes the world with patient wisdom. They believe every conflict has a solution if you look deep enough. Their fluid nature allows them to adapt to any situation, finding harmony where others see chaos.', episodes: '20', fans: '1.1M', power: 'Tidal Mind', color: 'linear-gradient(135deg,#67e8f9,#06b6d4)', image: '' },
      { id: 4, name: 'Zolt', role: 'The Inventor', desc: 'A quick-witted genius who can build anything from nothing — and accidentally blow it up twice.', bio: 'Powered by lightning and caffeine, Zolt\'s mind moves faster than their hands. They see solutions in scraps, potential in chaos. Sure, half their inventions malfunction spectacularly — but the other half change everything. Failure is just data.', episodes: '21', fans: '950K', power: 'Circuit Storm', color: 'linear-gradient(135deg,#fbbf24,#f59e0b)', image: '' }
    ];
    const fallbackShowcase = [
      { id: 1, type: 'video', cat: 'video', title: 'Season 1 Trailer', desc: 'Official launch trailer', ytId: 'dQw4w9WgXcQ', color: '#6c5ce7', image: '', large: true },
      { id: 2, type: 'image', cat: 'image', title: 'Blobby Concept Art', desc: 'Original character design', ytId: '', color: '#c084fc', image: '', large: false },
      { id: 3, type: 'image', cat: 'bts', title: 'Studio Timelapse', desc: 'Behind the scenes at AIROCX HQ', ytId: '', color: '#f472b6', image: '', large: false },
      { id: 4, type: 'video', cat: 'video', title: 'Episode 1: The Awakening', desc: 'Pilot episode clip', ytId: 'dQw4w9WgXcQ', color: '#ef4444', image: '', large: false },
      { id: 5, type: 'image', cat: 'image', title: 'World of Ember Isles', desc: 'Environment artwork', ytId: '', color: '#f59e0b', image: '', large: false },
      { id: 6, type: 'video', cat: 'bts', title: 'Making of Aqui', desc: 'Character design process', ytId: 'dQw4w9WgXcQ', color: '#06b6d4', image: '', large: false }
    ];
    const fallbackMerch = [
      { id: 1, name: 'Blobby Plush Toy', cat: 'Collectibles', price: 34.99, color: '#c084fc', emoji: '🧸', image: '' },
      { id: 2, name: 'Ferno Graphic Tee', cat: 'Apparel', price: 29.99, color: '#f472b6', emoji: '👕', image: '' },
      { id: 3, name: 'AIROCX Enamel Pin Set', cat: 'Accessories', price: 18.99, color: '#fbbf24', emoji: '📌', image: '' },
      { id: 4, name: 'Crystal Tides Art Print', cat: 'Art & Posters', price: 24.99, color: '#67e8f9', emoji: '🖼️', image: '' },
      { id: 5, name: 'Zolt Inventor Kit', cat: 'Toys & Games', price: 49.99, color: '#f59e0b', emoji: '🔧', image: '' },
      { id: 6, name: 'Aqui Water Bottle', cat: 'Accessories', price: 22.99, color: '#06b6d4', emoji: '💧', image: '' },
      { id: 7, name: 'AIROCX Hoodie', cat: 'Apparel', price: 59.99, color: '#a855f7', emoji: '🧥', image: '' },
      { id: 8, name: 'Character Sticker Pack', cat: 'Collectibles', price: 9.99, color: '#ec4899', emoji: '✨', image: '' }
    ];

    try {
      const [charsRes, showcaseRes, merchRes] = await Promise.all([
        fetch(apiUrl('/api/characters')),
        fetch(apiUrl('/api/showcase')),
        fetch(apiUrl('/api/merch'))
      ]);

      // Verify all responses are OK AND return JSON (not HTML from a SPA rewrite)
      const isJSON = (res) => (res.headers.get('content-type') || '').includes('application/json');

      if (charsRes.ok && showcaseRes.ok && merchRes.ok && isJSON(charsRes) && isJSON(showcaseRes) && isJSON(merchRes)) {
        setCharacters(await charsRes.json());
        setShowcaseItems(await showcaseRes.json());
        setMerchItems(await merchRes.json());
      } else {
        throw new Error('Non-JSON or non-OK response');
      }
    } catch (error) {
      console.warn('Backend unavailable — loading sample data:', error.message);
      setCharacters(fallbackCharacters);
      setShowcaseItems(fallbackShowcase);
      setMerchItems(fallbackMerch);
    }
  };

  const setupScrollAnimations = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  };

  const addToCart = (name) => {
    setCartCount(prev => prev + 1);
    showNotification(`🧸 ${name} added to cart!`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  // Character image map for local assets
  const getCharacterImage = (character) => {
    if (character?.image) return character.image;
    const name = typeof character === 'string' ? character : character?.name;
    const imageMap = {
      'Blobby': '/images/blobby.png',
      'Ferno': '/images/ferno.png',
      'Aqui': '/images/aqui.png',
      'Zolt': '/images/zolt.png'
    };
    return imageMap[name] || '/images/blobby.png';
  };

  // Character emoji avatars based on name for visual display
  const getCharacterEmoji = (name) => {
    const emojiMap = {
      'Blobby': '🫧',
      'Ferno': '🔥',
      'Aqui': '🌊',
      'Zolt': '⚡'
    };
    return emojiMap[name] || '✨';
  };

  const getCharacterGradient = (name) => {
    const gradients = {
      'Blobby': 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #6c5ce7 100%)',
      'Ferno': 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #ef4444 100%)',
      'Aqui': 'linear-gradient(135deg, #67e8f9 0%, #38bdf8 50%, #06b6d4 100%)',
      'Zolt': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
    };
    return gradients[name] || 'linear-gradient(135deg, #a855f7, #6366f1)';
  };

  // Character lore details for description section
  const characterLore = {
    'Blobby': {
      origin: 'Cosmic Nebula of Luminara',
      abilities: ['Dreamweaving', 'Memory Capture', 'Starlight Shield', 'Empathy Pulse'],
      quote: '"Every dream is a universe waiting to be explored."',
      element: 'Aether'
    },
    'Ferno': {
      origin: 'The Volcanic Core of Mount Pyraxis',
      abilities: ['Ember Burst', 'Inferno Dash', 'Flame Wall', 'Phoenix Rebirth'],
      quote: '"Courage isn\'t the absence of fear — it\'s having fire in your heart."',
      element: 'Fire'
    },
    'Aqui': {
      origin: 'The Crystal Tides of Oceamar',
      abilities: ['Tidal Mind', 'Current Sense', 'Hydro Shield', 'Deep Resonance'],
      quote: '"Still waters run deep — and so does understanding."',
      element: 'Water'
    },
    'Zolt': {
      origin: 'The Lightning Forges of Voltheim',
      abilities: ['Circuit Storm', 'Spark Weld', 'Thunder Clap', 'Overcharge'],
      quote: '"Failure is just the first step in my next breakthrough."',
      element: 'Lightning'
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus('');

    const formData = {
      name: e.target.contactName.value,
      email: e.target.contactEmail.value,
      subject: e.target.contactSubject.value,
      message: e.target.contactMessage.value
    };

    // Validate fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      setContactStatus('error');
      showNotification('❌ Please fill in all fields before submitting.');
      setContactSubmitting(false);
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setContactStatus('success');
        showNotification(`✨ Thank you, ${formData.name}! Your inquiry has been sent successfully.`);
        e.target.reset();
      } else {
        setContactStatus('error');
        showNotification(await readApiError(response));
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setContactStatus('error');
      showNotification('Could not send your message. Please try again.');
    } finally {
      setContactSubmitting(false);
      setTimeout(() => setContactStatus(''), 5000);
    }
  };

  const filteredShowcase = showcaseFilter === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(i => i.cat === showcaseFilter);

  const [activeDescChar, setActiveDescChar] = useState(0);

  return (
    <div className="main-website">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="glow-orb one"></div>
      <div className="glow-orb two" style={{ top: '40%', right: '5%', background: 'var(--cyan)' }}></div>
      <div className="glow-orb one" style={{ top: '75%', left: '8%', background: 'var(--pink)' }}></div>

      {/* FLOATING CART BADGE */}
      <div className="cart-badge" onClick={() => showNotification(`🛒 Your cart contains ${cartCount} items. Proceeding to checkout...`)}>
        {cartCount}
      </div>

      {/* GLOBAL TOAST ALERTS */}
      <div className={`notification ${notification ? 'show' : ''}`}>
        {notification}
      </div>

      {/* HEADER NAVIGATION */}
      <nav>
        <div className="nav-logo">AIROCX</div>
        <div className="nav-links">
          <a href="#characters">Cast</a>
          <a href="#character-spotlight">Characters</a>
          <a href="#showcase">Showcase</a>
          <a href="#merch">Store</a>
          <a href="#contact">Contact</a>
          <a href="/admin" style={{ color: 'var(--accent)', fontWeight: '700' }}>Dashboard</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="reveal visible">
            <span>Where</span>
            <span className="outline">Stories</span>
            <span>Come</span>
            <span className="accent-text">Alive</span>
          </h1>
          <p className="hero-tagline reveal visible">
            Welcome to AIROCX. We design scalable character universes, unforgettable lore, and award-winning animations that ignite imagination on screens worldwide.
          </p>
        </div>
        <div className="hero-right reveal visible">
          <div className="hero-character">
            <div className="char-placeholder animate-morph">
              {characters.length > 0 ? (
                <img 
                  src={getCharacterImage(characters[0])}
                  alt={characters[0]?.name}
                  className="hero-char-img animate-float"
                />
              ) : (
                <div className="hero-emoji-avatar animate-float">🌟</div>
              )}
            </div>
          </div>
        </div>

        {/* REVOLVING ENDLESS PARALLAX BANNER */}
        <div className="hero-carousel-wrap">
          <div className="parallax-layer back">
            <div className="carousel-track scroll-right">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`back-${i}-${idx}`} className="carousel-char" style={{ background: getCharacterGradient(ch.name) }}>
                  <img src={getCharacterImage(ch)} alt={ch.name} className="carousel-char-img" />
                  <span className="char-label">{ch.name}</span>
                </div>
              )))}
            </div>
          </div>
          <div className="parallax-layer mid">
            <div className="carousel-track scroll-left">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`mid-${i}-${idx}`} className="carousel-char" style={{ background: getCharacterGradient(ch.name) }}>
                  <img src={getCharacterImage(ch)} alt={ch.name} className="carousel-char-img" />
                  <span className="char-label">{ch.name}</span>
                </div>
              )))}
            </div>
          </div>
          <div className="parallax-layer front">
            <div className="carousel-track scroll-right">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`front-${i}-${idx}`} className="carousel-char" style={{ background: getCharacterGradient(ch.name) }}>
                  <img src={getCharacterImage(ch)} alt={ch.name} className="carousel-char-img" />
                  <span className="char-label">{ch.name}</span>
                </div>
              )))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(12)].map((_, i) => (
            <span key={i}>ORIGINAL IP • SCALABLE ANIMATION • UNIVERSE Lore • MERCHANDISING • COLLECTIBLES •&nbsp;</span>
          ))}
        </div>
      </div>

      {/* CHARACTER CAST WITH DESCRIPTIONS */}
      <section id="characters" className="section-chars">
        <div className="section-header reveal">
          <div className="section-eyebrow">Meet the cast</div>
          <h2 className="section-title">Key Characters</h2>
          <p className="section-desc">
            Explore the unique souls of the AIROCX dimension. Each character brings a distinct personality, power, and story to our universe.
          </p>
        </div>

        <div className="char-grid">
          {characters.map((char, idx) => (
            <div key={char._id || char.id} className="char-card reveal" 
                 style={{ transitionDelay: `${idx * 0.08}s` }}
                 onClick={() => setSelectedChar(char)}>
              <div className="char-img">
                <div className="char-img-inner" style={{ background: getCharacterGradient(char.name) }}>
                  <img src={getCharacterImage(char)} alt={char.name} className="char-photo" />
                </div>
              </div>
              <div className="char-info">
                <h3>{char.name}</h3>
                <p>{char.role}</p>
              </div>
              <div className="char-desc">{char.desc}</div>
              <div className="char-power-badge">
                <span className="power-icon">⚡</span>
                <span>{char.power}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHARACTER BIO POPUP MODAL */}
      {selectedChar && (
        <div className="modal-overlay active" onClick={() => setSelectedChar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedChar(null)}>✕</button>
            <div className="char-modal-content">
              <div className="char-modal-img" style={{ background: getCharacterGradient(selectedChar.name) }}>
                <img src={getCharacterImage(selectedChar)} alt={selectedChar.name} className="modal-char-photo" />
              </div>
              <div className="char-modal-info">
                <h2>{selectedChar.name}</h2>
                <div className="char-role">{selectedChar.role}</div>
                <p className="char-bio">{selectedChar.bio}</p>
                <div className="char-stats">
                  <div className="stat-item">
                    <div className="stat-label">Episodes</div>
                    <div className="stat-value">{selectedChar.episodes}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Fans</div>
                    <div className="stat-value">{selectedChar.fans}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Power Profile</div>
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>{selectedChar.power}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHARACTER DESCRIPTION SPOTLIGHT */}
      {characters.length > 0 && (
        <section id="character-spotlight" className="char-spotlight-section">
          <div className="section-header reveal">
            <div className="section-eyebrow">Character Universe</div>
            <h2 className="section-title">Meet Our Heroes</h2>
            <p className="section-desc">
              Dive deep into each character's origin, powers, and personality. Select a hero to explore their world.
            </p>
          </div>

          {/* Character selector tabs */}
          <div className="spotlight-tabs reveal">
            {characters.map((char, idx) => (
              <button
                key={char._id || char.id}
                className={`spotlight-tab ${activeDescChar === idx ? 'active' : ''}`}
                onClick={() => setActiveDescChar(idx)}
                style={{ '--tab-color': getCharacterGradient(char.name) }}
              >
                <img src={getCharacterImage(char)} alt={char.name} className="spotlight-tab-img" />
                <span>{char.name}</span>
              </button>
            ))}
          </div>

          {/* Active character spotlight */}
          {(() => {
            const char = characters[activeDescChar];
            const fallbackLore = characterLore[char?.name] || {};
            const lore = {
              origin: char?.origin || fallbackLore.origin,
              quote: char?.quote || fallbackLore.quote,
              element: char?.element || fallbackLore.element,
              abilities: char?.abilities
                ? char.abilities.split(',').map((ability) => ability.trim()).filter(Boolean)
                : fallbackLore.abilities
            };
            return char ? (
              <div className="spotlight-content reveal visible" key={char.name}>
                <div className="spotlight-image-side">
                  <div className="spotlight-img-wrap" style={{ background: getCharacterGradient(char.name) }}>
                    <img src={getCharacterImage(char)} alt={char.name} className="spotlight-hero-img" />
                  </div>
                  <div className="spotlight-element-badge">
                    <span className="element-icon">{getCharacterEmoji(char.name)}</span>
                    <span>{lore.element || 'Unknown'} Element</span>
                  </div>
                </div>
                <div className="spotlight-info-side">
                  <div className="spotlight-name-row">
                    <h2>{char.name}</h2>
                    <span className="spotlight-role">{char.role}</span>
                  </div>
                  {lore.quote && <blockquote className="spotlight-quote">{lore.quote}</blockquote>}
                  <p className="spotlight-bio">{char.bio}</p>
                  
                  <div className="spotlight-details-grid">
                    <div className="spotlight-detail">
                      <div className="detail-label">Origin</div>
                      <div className="detail-value">{lore.origin || 'Unknown'}</div>
                    </div>
                    <div className="spotlight-detail">
                      <div className="detail-label">Primary Power</div>
                      <div className="detail-value accent">{char.power}</div>
                    </div>
                    <div className="spotlight-detail">
                      <div className="detail-label">Episodes</div>
                      <div className="detail-value">{char.episodes}</div>
                    </div>
                    <div className="spotlight-detail">
                      <div className="detail-label">Fan Base</div>
                      <div className="detail-value">{char.fans}</div>
                    </div>
                  </div>

                  {lore.abilities && (
                    <div className="spotlight-abilities">
                      <div className="detail-label">Abilities</div>
                      <div className="abilities-list">
                        {lore.abilities.map((ability, i) => (
                          <span key={i} className="ability-chip">{ability}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null;
          })()}
        </section>
      )}

      {/* MEDIA SHOWCASE FILTER GRID */}
      <section id="showcase" className="section-showcase">
        <div className="section-header reveal">
          <div className="section-eyebrow">Media Universe</div>
          <h2 className="section-title">Content Showcase</h2>
          <p className="section-desc">
            Browse through conceptual renders, behind-the-scenes timelapse recordings, and pilot video releases.
          </p>
        </div>

        <div className="showcase-tabs reveal">
          <button className={`tab-btn ${showcaseFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setShowcaseFilter('all')}>All Assets</button>
          <button className={`tab-btn ${showcaseFilter === 'video' ? 'active' : ''}`}
                  onClick={() => setShowcaseFilter('video')}>Episodes & Clips</button>
          <button className={`tab-btn ${showcaseFilter === 'image' ? 'active' : ''}`}
                  onClick={() => setShowcaseFilter('image')}>Designs & Concept</button>
          <button className={`tab-btn ${showcaseFilter === 'bts' ? 'active' : ''}`}
                  onClick={() => setShowcaseFilter('bts')}>Studio Timelapses</button>
        </div>

        <div className="showcase-grid">
          {filteredShowcase.map((item, idx) => (
            <div key={item._id || item.id} 
                 className={`showcase-item reveal ${item.large ? 'large' : ''}`}
                 style={{ transitionDelay: `${idx * 0.05}s` }}
                 onClick={() => item.type === 'video' && setVideoId(item.ytId)}>
              {item.image ? (
                <img src={item.image} alt={item.title} className="showcase-photo" />
              ) : (
                <div className="showcase-thumb" style={{
                  width: '100%', height: '100%', background: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px', color: 'rgba(255,255,255,0.1)'
                }}>
                  {item.type === 'video' ? '▶' : '◆'}
                </div>
              )}
              <div className="showcase-overlay">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
              {item.type === 'video' && (
                <div className="play-icon">
                  <svg viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO LIGHTBOX MODAL */}
      {videoId && (
        <div className="modal-overlay active" onClick={() => setVideoId(null)}>
          <div className="modal-box video-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoId(null)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}



      {/* MERCH STORE SECTION */}
      <section id="merch" className="section-merch">
        <div className="merch-header-row reveal">
          <div className="section-header">
            <div className="section-eyebrow">E-Commerce</div>
            <h2 className="section-title">Official Store</h2>
            <p className="section-desc merch-intro">
              Bring the AIROCX universe home with character collectibles, apparel, art, and creative play kits made for fans of every age.
            </p>
          </div>
          <a href="#merch" onClick={() => showNotification("📦 Expanding store catalogs. Full checkout portal coming soon!")} className="view-all-link">Browse Full Store ➔</a>
        </div>

        <div className="merch-grid">
          {merchItems.map((item, idx) => (
            <div key={item._id || item.id} className="merch-card reveal" 
                 style={{ transitionDelay: `${idx * 0.05}s` }}>
              <div className="merch-img">
                <div className="merch-img-inner" style={{
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px'
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="merch-photo" />
                  ) : item.emoji}
                </div>
              </div>
              <div className="merch-details">
                <div className="merch-cat">{item.cat}</div>
                <div className="merch-name">{item.name}</div>
                <p className="merch-description">
                  {item.description || `Official ${item.name} inspired by the AIROCX story universe.`}
                </p>
                <div className="merch-price-row">
                  <span className="merch-price">${item.price.toFixed(2)}</span>
                  <button className="merch-btn" onClick={() => addToCart(item.name)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND PARTNERSHIPS */}
      <section className="section-partnerships">
        <div className="section-header reveal">
          <div className="section-eyebrow">Licensing & Distribution</div>
          <h2 className="section-title">Studio Partners</h2>
          <p className="section-desc">
            We collaborate with premier digital services and retail brands to scale our animations and merchandise lines globally.
          </p>
        </div>

        <div className="partner-logos reveal">
          {['NEXON', 'CRUX', 'VYRAL', 'KINDR', 'HELIO', 'PLUMA'].map((name, idx) => (
            <div key={name} className="partner-logo" style={{ transitionDelay: `${idx * 0.05}s` }}>{name}</div>
          ))}
        </div>

        <div className="partnership-cards">
          <div className="partnership-card reveal">
            <div className="partnership-icon">🎬</div>
            <h3>Distribution Agreements</h3>
            <p>
              Integrate AIROCX episode segments directly into your broadcast networks, OTT channels, or digital libraries.
            </p>
          </div>
          <div className="partnership-card reveal">
            <div className="partnership-icon">🛍️</div>
            <h3>Collectibles Licensing</h3>
            <p>
              Design high-end toys, apparel, and lifestyle consumer goods utilizing our characters and logo assets.
            </p>
          </div>
          <div className="partnership-card reveal">
            <div className="partnership-icon">🎮</div>
            <h3>Interactive Gaming</h3>
            <p>
              Develop custom mobile gaming titles, AR interactions, or digital avatar skins showcasing our character cast.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT PARTNERSHIP INQUIRIES - WORKING FORM */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="contact-left">
            <div className="section-eyebrow reveal">Collab with us</div>
            <h2 className="section-title reveal">Let's Create <span className="accent-text">Something Epic</span></h2>
            <p className="contact-desc reveal">
              Are you a brand looking for unique co-branding, a streaming service seeking premium content, or a visual creator exploring collaborations? Send us a message!
            </p>

            <div className="contact-details reveal">
              <div className="contact-detail-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-detail-label">Studio HQ</div>
                  <div className="contact-detail-value">127/A, Civil Lines, Near Phool Bagh, Kanpur, UP 208001</div>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-detail-label">Email</div>
                  <div className="contact-detail-value">krsnaonsocials@gmail.com</div>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-detail-label">Phone</div>
                  <div className="contact-detail-value">+91 98765 43210</div>
                </div>
              </div>
            </div>

            <div className="contact-socials reveal">
              <a href="#contact" className="social-link">Instagram</a>
              <a href="#contact" className="social-link">YouTube</a>
              <a href="#contact" className="social-link">TikTok</a>
              <a href="#contact" className="social-link">X / Twitter</a>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form reveal" onSubmit={handleContactSubmit}>
              {contactStatus === 'success' && (
                <div className="form-status success">
                  ✅ Your message has been sent successfully! We'll get back to you soon.
                </div>
              )}
              {contactStatus === 'error' && (
                <div className="form-status error">
                  ❌ Failed to send. Please check your connection and try again.
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" id="contactName" name="contactName" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input type="email" className="form-input" id="contactEmail" name="contactEmail" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input form-select" id="contactSubject" name="contactSubject" required>
                  <option value="">Choose an inquiry type</option>
                  <option value="licensing">Licensing & Broadcast</option>
                  <option value="merchandising">Merchandising Collab</option>
                  <option value="press">Press & Media Queries</option>
                  <option value="careers">Studio Careers</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea className="form-input form-textarea" id="contactMessage" name="contactMessage" placeholder="How would you like to collaborate?" required></textarea>
              </div>
              <button type="submit" className="btn-primary" disabled={contactSubmitting}>
                {contactSubmitting ? (
                  <>Sending... <span className="submit-spinner"></span></>
                ) : (
                  <>Send Partnership Inquiry <span className="submit-arrow">➔</span></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">AIROCX</div>
        <div className="footer-links">
          <a href="#characters">Cast</a>
          <a href="#merch">Store</a>
          <a href="/admin">Dashboard Portal</a>
        </div>
        <div className="footer-copy">© 2026 AIROCX Studios. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default MainWebsite;
