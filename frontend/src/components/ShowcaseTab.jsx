import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';

function ShowcaseTab() {
  const [showcase, setShowcase] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchShowcase();
  }, []);

  const fetchShowcase = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/showcase`);
      if (response.ok) {
        setShowcase(await response.json());
      }
    } catch (error) {
      console.error('Error fetching showcase:', error);
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id || item.id);
    setFormData(item);
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/showcase/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchShowcase();
        setEditing(null);
        alert('✨ Showcase asset updated!');
      } else {
        alert('❌ Error updating. Check token credentials.');
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('⚠️ Connection error.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this showcase asset?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/showcase/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchShowcase();
        alert('🗑️ Showcase asset removed!');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleAdd = async () => {
    const newItem = {
      type: 'image',
      cat: 'image',
      title: 'New Creative Concept',
      desc: 'High fidelity studio digital draft asset.',
      ytId: '',
      color: '#6c5ce7',
      image: '',
      large: false
    };

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/showcase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      if (response.ok) {
        fetchShowcase();
      }
    } catch (error) {
      console.error('Error adding showcase item:', error);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="tab-header">
        <h2>Manage Content Showcase</h2>
        <button onClick={handleAdd} className="btn-primary" style={{ width: 'auto' }}>+ Add Showcase Item</button>
      </div>

      {editing ? (
        <div className="edit-form-split" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-fields">
            <h3 style={{ marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Edit Showcase Asset</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Asset Title</label>
                <input name="title" className="form-input" value={formData.title || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select name="type" className="form-input form-select" value={formData.type || ''} onChange={handleChange}>
                  <option value="image">Static Image / Design</option>
                  <option value="video">Youtube Streaming Video</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="cat" className="form-input form-select" value={formData.cat || ''} onChange={handleChange}>
                  <option value="image">Concept Art</option>
                  <option value="video">Episodes & Trailers</option>
                  <option value="bts">Behind the Scenes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Color Theme (HEX backdrop)</label>
                <input name="color" className="form-input" value={formData.color || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="desc" className="form-input" value={formData.desc || ''} onChange={handleChange} rows={2} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">YouTube Video ID (e.g. dQw4w9WgXcQ)</label>
                <input name="ytId" className="form-input" value={formData.ytId || ''} onChange={handleChange} placeholder="Only for Video type" />
              </div>
              <div className="form-group">
                <label className="form-label">Design Image URL (Optional)</label>
                <input name="image" className="form-input" value={formData.image || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
              <input type="checkbox" name="large" id="checkLarge" checked={formData.large || false} onChange={handleChange} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
              <label htmlFor="checkLarge" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Highlight Layout Card (Spans 2 columns in the public grids)</label>
            </div>

            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <button onClick={() => setEditing(null)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {showcase.map((item) => (
            <div key={item._id || item.id} className="admin-card">
              <div className="card-preview" style={{ background: item.color }}>
                {item.image ? (
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '32px', opacity: 0.2 }}>{item.type === 'video' ? '▶' : '◆'}</div>
                )}
              </div>
              <h3>{item.title}</h3>
              <p className="role">{item.cat} • {item.type}</p>
              <p className="desc-small">{item.desc}</p>
              {item.type === 'video' && item.ytId && (
                <div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '12px', wordBreak: 'break-all' }}>
                  📺 YT ID: {item.ytId}
                </div>
              )}
              {item.large && (
                <div style={{ fontSize: '10px', background: 'rgba(201, 255, 83, 0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '100px', width: 'max-content', marginBottom: '16px', fontWeight: 'bold' }}>
                  ⚡ Highlight Card
                </div>
              )}
              <div className="card-actions">
                <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(item._id || item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowcaseTab;
