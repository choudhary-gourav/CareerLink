import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

export default function Navbar({ variant = 'default' }) {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Home', path: '/home' },
    { label: 'Jobs', path: '/job-seekers' },
    { label: 'Post a Job', path: '/job-posters' },
  ];

  return (
    <nav className={`navbar ${variant} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/home" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">CareerLink</span>
        </Link>

        {}
        <button 
          className="navbar-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'show' : ''}`}>
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {/* Mobile actions rendered directly inside the navigation container */}
          <div className="navbar-mobile-actions">
            {isAuthenticated ? (
              <button
                className="btn-outline"
                style={{ fontSize: 14, padding: '10px 20px', width: '100%' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                <button className="btn-outline" style={{ fontSize: 14, padding: '10px 20px', width: '100%' }}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop actions (hidden on mobile via CSS) */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <button
              className="btn-outline"
              style={{ fontSize: 13, padding: '8px 18px' }}
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>
                Sign In
              </button>
            </Link>
          )}
          <Link to="/job-posters">
            <button className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Post a Job
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

