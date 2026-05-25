import React, { useState, useEffect } from 'react';

function MainWebsite() {
  const [characters, setCharacters] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [merchItems, setMerchItems] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [showcaseFilter, setShowcaseFilter] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState('');
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  useEffect(() => {
    fetchData();
    setupScrollAnimations();
  }, []);

  const fetchData = async () => {
    try {
      const [charsRes, showcaseRes, merchRes] = await Promise.all([
        fetch('/api/characters'),
        fetch('/api/showcase'),
        fetch('/api/merch')
      ]);
      if (charsRes.ok && showcaseRes.ok && merchRes.ok) {
        setCharacters(await charsRes.json());
        setShowcaseItems(await showcaseRes.json());
        setMerchItems(await merchRes.json());
      }
    } catch (error) {
      console.error('Error fetching data from backend API:', error);
    }
  };

  const setupScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 200);
  };

  const addToCart = (name) => {
    setCartCount(prev => prev + 1);
    showNotification(`🧸 ${name} added to cart!`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = e.target.contactName.value;
    showNotification(`✨ Thank you, ${name}! Your partnership inquiry has been sent successfully.`);
    e.target.reset();
  };

  const filteredShowcase = showcaseFilter === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(i => i.cat === showcaseFilter);

  // Creative Process Data
  const processSteps = [
    {
      num: "01",
      title: "Narrative & Role Sketch",
      desc: "We detail each character's foundational core, their signature super power (e.g. Dreamweaving), their alignment, and their specific role in our cosmic universe storylines."
    },
    {
      num: "02",
      title: "Vector & SVG Mastercraft",
      desc: "Our design team crafts the visual identity using precise scalable vector paths, establishing signature color palettes using premium light-emitting linear gradients."
    },
    {
      num: "03",
      title: "3D Modeling & Physics Rigging",
      desc: "We bring the vector graphics into 3D environments, rigging joint meshes and configuring custom cell-shading parameters to match our traditional animation aesthetics."
    },
    {
      num: "04",
      title: "Universal Licensing & Merch",
      desc: "Once an episode is complete, we synchronize the IP releases across international streaming services, digital platforms, and co-branded retail merchandise."
    }
  ];

  // Milestones Data
  const timelineMilestones = [
    {
      date: "Q3 2023",
      title: "AIROCX Studio Launch",
      desc: "Founded in Los Angeles with a vision to create unforgettable, character-driven digital franchises using modular, vector-based animation styles."
    },
    {
      date: "Q2 2024",
      title: "Pilot Release & Blobby Debut",
      desc: "Released our first official character teaser. 'Blobby - The Dreamer' went viral online, quickly amassing over 1.2M passionate community fans."
    },
    {
      date: "Q1 2025",
      title: "Season 1 Streaming Launch",
      desc: "Successfully distributed Season 1 globally. Partnered with major distribution services (Nexon, Crux, Helio) reaching millions of concurrent active viewers."
    },
    {
      date: "Present",
      title: "Universe Expansion & Licensing",
      desc: "Refactoring our global API portals, opening our official collectibles e-commerce storefront, and scaling cross-media co-branding franchises."
    }
  ];

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
          <a href="#process">Process</a>
          <a href="#showcase">Showcase</a>
          <a href="#timeline">Timeline</a>
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
              <div className="char-body animate-float" dangerouslySetInnerHTML={{
                __html: characters[0]?.svg || '<svg viewBox="0 0 220 260" width="100"><ellipse cx="110" cy="130" rx="60" ry="70" fill="rgba(255,255,255,0.05)"/></svg>'
              }}></div>
            </div>
          </div>
        </div>

        {/* REVOLVING ENDLESS PARALLAX BANNER */}
        <div className="hero-carousel-wrap">
          <div className="parallax-layer back">
            <div className="carousel-track scroll-right">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`back-${i}-${idx}`} className="carousel-char" style={{ background: ch.color }}>
                  <div dangerouslySetInnerHTML={{ __html: ch.svg }}></div>
                  <span className="char-label">{ch.name}</span>
                </div>
              )))}
            </div>
          </div>
          <div className="parallax-layer mid">
            <div className="carousel-track scroll-left">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`mid-${i}-${idx}`} className="carousel-char" style={{ background: ch.color }}>
                  <div dangerouslySetInnerHTML={{ __html: ch.svg }}></div>
                  <span className="char-label">{ch.name}</span>
                </div>
              )))}
            </div>
          </div>
          <div className="parallax-layer front">
            <div className="carousel-track scroll-right">
              {[...Array(6)].map((_, i) => characters.map((ch, idx) => (
                <div key={`front-${i}-${idx}`} className="carousel-char" style={{ background: ch.color }}>
                  <div dangerouslySetInnerHTML={{ __html: ch.svg }}></div>
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

      {/* CAST LIST SECTION */}
      <section id="characters" className="section-chars">
        <div className="section-header reveal">
          <div className="section-eyebrow">Meet the cast</div>
          <h2 className="section-title">Key Characters</h2>
          <p className="section-desc">
            Explore the unique souls of the AIROCX dimension. Click on any card to dive deep into their bio, signature power profiles, and media statistics.
          </p>
        </div>

        <div className="char-grid">
          {characters.map((char, idx) => (
            <div key={char._id || char.id} className="char-card reveal" 
                 style={{ transitionDelay: `${idx * 0.08}s` }}
                 onClick={() => setSelectedChar(char)}>
              <div className="char-img">
                <div className="char-img-inner" style={{ background: char.color }}>
                  {char.image ? (
                    <img src={char.image} alt={char.name} className="char-photo" />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: char.svg }}></div>
                  )}
                </div>
              </div>
              <div className="char-info">
                <h3>{char.name}</h3>
                <p>{char.role}</p>
              </div>
              <div className="char-desc">{char.desc}</div>
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
              <div className="char-modal-img" style={{ background: selectedChar.color }}>
                {selectedChar.image ? (
                  <img src={selectedChar.image} alt={selectedChar.name} className="char-photo" />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: selectedChar.svg }}></div>
                )}
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

      {/* CREATIVE PROCESS TRACK (NEW SECTION) */}
      <section id="process" className="process-section">
        <div className="section-header reveal">
          <div className="section-eyebrow">Creative Workflow</div>
          <h2 className="section-title">Character Pipeline</h2>
          <p className="section-desc">
            How we bring unforgettable vector characters from preliminary conceptual drafts into global animated releases.
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((step, idx) => (
            <div key={idx} 
                 className={`process-card reveal ${activeProcessStep === idx ? 'active' : ''}`}
                 style={{ transitionDelay: `${idx * 0.08}s` }}
                 onMouseEnter={() => setActiveProcessStep(idx)}>
              <div className="process-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              <div className="process-arrow">➔</div>
            </div>
          ))}
        </div>
      </section>

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

      {/* MILESTONES TIMELINE SECTION (NEW SECTION) */}
      <section id="timeline" className="timeline-section">
        <div className="section-header reveal">
          <div className="section-eyebrow">Milestones</div>
          <h2 className="section-title">Studio Timeline</h2>
          <p className="section-desc">
            Tracing our journey from startup studio foundations to an internationally distributed character licensing hub.
          </p>
        </div>

        <div className="timeline-container">
          {timelineMilestones.map((item, idx) => (
            <div key={idx} className="timeline-item reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
              <div className="timeline-badge"></div>
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MERCH STORE SECTION */}
      <section id="merch" className="section-merch">
        <div className="merch-header-row reveal">
          <div className="section-header">
            <div className="section-eyebrow">E-Commerce</div>
            <h2 className="section-title">Official Store</h2>
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

      {/* CONTACT PARTNERSHIP INQUIRIES */}
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
                  <div className="contact-detail-label">Studio</div>
                  <div className="contact-detail-value">42 Nebula Lane, Los Angeles, CA 90028</div>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-detail-label">Partner Email</div>
                  <div className="contact-detail-value">partners@airocx.studio</div>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-detail-label">Hotline</div>
                  <div className="contact-detail-value">+1 (323) 555-AIROCX</div>
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" id="contactName" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input type="email" className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input form-select" required>
                  <option value="">Choose an inquiry type</option>
                  <option value="licensing">Licensing & Broadcast</option>
                  <option value="merchandising">Merchandising Collab</option>
                  <option value="press">Press & Media Queries</option>
                  <option value="careers">Studio Careers</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea className="form-input form-textarea" placeholder="How would you like to collaborate?" required></textarea>
              </div>
              <button type="submit" className="btn-primary">
                Send Partnership Inquiry <span className="submit-arrow">➔</span>
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
