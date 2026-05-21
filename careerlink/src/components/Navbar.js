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
        </div>

        <div className={`navbar-actions ${mobileMenuOpen ? 'show' : ''}`}>
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
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>
                Sign In
              </button>
            </Link>
          )}
          <Link to="/job-posters" onClick={() => setMobileMenuOpen(false)}>
            <button className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Post a Job
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

