import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Tv, ShoppingBag, LogOut, Globe } from 'lucide-react';
import CharactersTab from './CharactersTab.jsx';
import ShowcaseTab from './ShowcaseTab.jsx';
import MerchTab from './MerchTab.jsx';
import { authFetch, clearAdminToken, getAdminToken } from '../lib/api.js';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('characters');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin');
      return;
    }
    authFetch('/api/auth/verify').catch(() => {
      clearAdminToken();
      navigate('/admin');
    });
  }, [navigate]);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">AIROCX CMS</div>
        <div className="sidebar-links">
          <button 
            className={`sidebar-btn ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            <Users size={16} /> Characters
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('showcase')}
          >
            <Tv size={16} /> Showcase
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'merch' ? 'active' : ''}`}
            onClick={() => setActiveTab('merch')}
          >
            <ShoppingBag size={16} /> Merchandise
          </button>
        </div>
        <div className="admin-logout-btn">
          <button onClick={handleLogout} className="sidebar-btn" style={{ color: '#f43f5e' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>🎬 Studio Dashboard</h1>
          <div className="admin-actions">
            <a href="/" className="btn-small-outline" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} /> View Live Site
            </a>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'characters' && <CharactersTab />}
          {activeTab === 'showcase' && <ShowcaseTab />}
          {activeTab === 'merch' && <MerchTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
