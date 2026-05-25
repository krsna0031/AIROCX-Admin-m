import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';

function MerchTab() {
  const [merch, setMerch] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/merch`);
      if (response.ok) {
        setMerch(await response.json());
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error);
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id || item.id);
    setFormData(item);
  };

  const handleChange = (e) => {
    const val = e.target.name === 'price' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/merch/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMerch();
        setEditing(null);
        alert('✨ Merchandise updated successfully!');
      } else {
        alert('❌ Update failed. Verify authentication.');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('⚠️ API connection failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/merch/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchMerch();
        alert('🗑️ Product deleted!');
      }
    } catch (error) {
      console.error('Error deleting merch:', error);
    }
  };

  const handleAdd = async () => {
    const newItem = {
      name: 'New Universe Collectible',
      cat: 'Collectibles',
      price: 19.99,
      color: '#ef4444',
      emoji: '🧸',
      image: ''
    };

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${BACKEND_URL}/api/merch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      if (response.ok) {
        fetchMerch();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="tab-header">
        <h2>Manage Store Products</h2>
        <button onClick={handleAdd} className="btn-primary" style={{ width: 'auto' }}>+ Add Product</button>
      </div>

      {editing ? (
        <div className="edit-form-split" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-fields">
            <h3 style={{ marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Edit Product Specifications</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input name="name" className="form-input" value={formData.name || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input name="cat" className="form-input" value={formData.cat || ''} onChange={handleChange} placeholder="e.g. Apparel, Toys, Accessories" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($ USD)</label>
                <input type="number" name="price" className="form-input" step="0.01" value={formData.price || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Color Theme (HEX backdrop)</label>
                <input name="color" className="form-input" value={formData.color || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Emoji Representation (If no Image URL)</label>
                <input name="emoji" className="form-input" value={formData.emoji || ''} onChange={handleChange} placeholder="e.g. 👕, 🧸, 📌" />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input name="image" className="form-input" value={formData.image || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <button onClick={() => setEditing(null)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {merch.map((item) => (
            <div key={item._id || item.id} className="admin-card">
              <div className="card-preview" style={{ background: item.color, fontSize: '56px' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  item.emoji
                )}
              </div>
              <h3>{item.name}</h3>
              <p className="role">{item.cat}</p>
              <h4 style={{ fontSize: '20px', fontFamily: 'Space Grotesk, sans-serif', color: '#fff', marginBottom: '16px' }}>
                ${(item.price || 0).toFixed(2)}
              </h4>
              <div className="card-actions">
                <button onClick={() => handleEdit(item)} className="btn-edit">Edit Specs</button>
                <button onClick={() => handleDelete(item._id || item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MerchTab;
