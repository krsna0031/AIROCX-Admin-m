import React, { useState, useEffect } from 'react';
import ImageField from './ImageField.jsx';
import { apiUrl, authFetch, readApiError } from '../lib/api.js';

function CharactersTab() {
  const [characters, setCharacters] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(apiUrl('/api/characters'));
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleEdit = (char) => {
    setEditing(char._id || char.id);
    setFormData({ ...char });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await authFetch(`/api/characters/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCharacters();
        setEditing(null);
        alert('✨ Character successfully updated!');
      } else {
        alert(await readApiError(response));
      }
    } catch (error) {
      console.error('Error saving character:', error);
      alert('⚠️ API connection failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;
    
    try {
      const response = await authFetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCharacters();
        alert('🗑️ Character deleted!');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const handleAdd = async () => {
    const newChar = {
      name: 'New Character',
      role: 'The Sidekick',
      desc: 'An upbeat explorer ready for custom stories.',
      bio: 'Discovered in a vector rendering node, this character loves light and high-frame animations.',
      episodes: '1',
      fans: '10K',
      power: 'Quantum Jump',
      color: 'linear-gradient(135deg, #00cec9, #0984e3)',
      svg: '',
      image: '',
      origin: 'A newly discovered corner of the AIROCX universe',
      quote: 'Every adventure starts with one brave step.',
      element: 'Aether',
      abilities: 'Quantum Jump, Star Compass'
    };

    try {
      const response = await authFetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newChar)
      });
      if (response.ok) {
        fetchCharacters();
      }
    } catch (error) {
      console.error('Error adding character:', error);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="tab-header">
        <h2>Manage Characters</h2>
        <button onClick={handleAdd} className="btn-primary" style={{ width: 'auto' }}>+ Add Character</button>
      </div>

      {editing ? (
        <div className="edit-form-split">
          {/* LEFT: EDITING FIELDS */}
          <div className="form-fields">
            <h3 style={{ marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Modify Properties</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" className="form-input" value={formData.name || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input name="role" className="form-input" value={formData.role || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea name="desc" className="form-input" value={formData.desc || ''} onChange={handleChange} rows={2} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Biography</label>
              <textarea name="bio" className="form-input" value={formData.bio || ''} onChange={handleChange} rows={4} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input name="origin" className="form-input" value={formData.origin || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Element</label>
                <input name="element" className="form-input" value={formData.element || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Signature Quote</label>
              <input name="quote" className="form-input" value={formData.quote || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Abilities (comma separated)</label>
              <input name="abilities" className="form-input" value={formData.abilities || ''} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Episodes</label>
                <input name="episodes" className="form-input" value={formData.episodes || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Fans</label>
                <input name="fans" className="form-input" value={formData.fans || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Power Profile</label>
                <input name="power" className="form-input" value={formData.power || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color Backdrop (HEX or linear-gradient)</label>
              <input name="color" className="form-input" value={formData.color || ''} onChange={handleChange} />
            </div>

            <ImageField
              value={formData.image || ''}
              onChange={(image) => setFormData({ ...formData, image })}
              label="Character Image"
            />

            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <button onClick={() => setEditing(null)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
            </div>
          </div>

          {/* RIGHT: LIVE SPLIT-SCREEN PREVIEW */}
          <div className="live-preview-container">
            <div className="preview-title">Live Presentation Preview</div>
            <div className="live-preview-card">
              <div className="card-preview" style={{ background: formData.color || '#1e1e24' }}>
                {formData.image ? (
                  <img src={formData.image} alt={formData.name} className="char-photo" />
                ) : (
                  <div className="media-placeholder">Add an image</div>
                )}
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif' }}>{formData.name || 'New Hero'}</h3>
              <p className="role" style={{ color: 'var(--accent)' }}>{formData.role || 'Superpower Role'}</p>
              <p className="desc-small">{formData.desc || 'Short card description preview...'}</p>
              <div className="stats-mini">
                <span>📺 {formData.episodes || '0'}</span>
                <span>👥 {formData.fans || '0'}</span>
                <span>⚡ {formData.power || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {characters.map((char) => (
            <div key={char._id || char.id} className="admin-card">
              <div className="card-preview" style={{ background: char.color }}>
                {char.image ? (
                  <img src={char.image} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="media-placeholder">No image</div>
                )}
              </div>
              <h3>{char.name}</h3>
              <p className="role">{char.role}</p>
              <p className="desc-small">{char.desc}</p>
              <div className="stats-mini">
                <span>📺 {char.episodes} eps</span>
                <span>👥 {char.fans} fans</span>
                <span>⚡ {char.power}</span>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(char)} className="btn-edit">Edit Properties</button>
                <button onClick={() => handleDelete(char._id || char.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharactersTab;
