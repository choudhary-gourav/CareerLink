import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{ color: 'var(--accent)' }}>◈</span>
            <span>CareerLink</span>
          </div>
          <p className="footer-tagline">
            The premium bridge between exceptional talent and the companies shaping tomorrow.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/job-seekers">Find Jobs</Link>
            <Link to="/job-posters">Post a Job</Link>
            <Link to="/home">Career Insights</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
              Get the latest opportunities in your inbox.
            </p>
            <div className="footer-subscribe">
              <input type="email" placeholder="you@email.com" />
              <button className="btn-primary" style={{ fontSize: 13, padding: '8px 14px' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 CareerLink Professional. All rights reserved.</span>
      </div>
    </footer>
  );
}

