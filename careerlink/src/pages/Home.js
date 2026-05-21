import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const features = [
  { icon: '⚡', title: 'Precision Matching', desc: 'Our platform is designed to analyze skills and culture to match human to each other perfectly.' },
  { icon: '🔗', title: 'Instant Connect', desc: 'Direct messaging and scheduling tools that eliminate recruiter middlemen.' },
  { icon: '✅', title: 'Verified Listings', desc: 'Every job posting is authenticated ensuring you only see legitimate opportunities.' },
  { icon: '📊', title: 'Career Insights', desc: 'Access market intelligence, salary benchmarks, and skill trends to navigate your path with data.' },
];

const jobs = [
  { title: 'Senior Product Designer', company: 'Spark Agency', type: 'Full-time', location: 'Remote', salary: '$104k – $135k', badge: 'Apply Now', badgeType: 'green' },
  { title: 'Senior Frontend Engineer', company: 'Candidate ID', type: 'Full-time', location: 'San Francisco', salary: '$165k – $215k', badge: 'Apply Now', badgeType: 'green' },
  { title: 'Growth Marketing Manager', company: 'Undefined Work', type: 'Full-time', location: 'New York', salary: '$105k – $145k', badge: 'Apply Now', badgeType: 'green' },
  { title: 'QA Automation Engineer', company: 'Remote Work', type: 'Contract', location: 'Remote', salary: '$95k – $115k', badge: 'Apply Now', badgeType: 'green' },
];

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">Premium Career Platform</div>
            <h1>Navigate Your Future<br /><span className="hero-accent">With Confidence</span></h1>
            <p>
              Connect with industry-leading opportunities or discover the talent that drives your company forward. CareerLink is the premium bridge between exceptional talent and life-changing opportunities.
            </p>
            <div className="hero-actions">
              <Link to="/job-seekers"><button className="btn-primary hero-btn">Look for a Job</button></Link>
              <Link to="/job-posters"><button className="btn-outline hero-btn">Post a Job ➜</button></Link>
            </div>
          </div>
          <div className="hero-image-block">
            <div className="hero-img-placeholder">
              <div className="hero-img-inner">
                <div className="hero-profile-card">
                  <div className="profile-avatar">JD</div>
                  <div>
                    <div className="profile-name">Jane Doe</div>
                    <div className="profile-role">Senior Designer</div>
                  </div>
                  <span className="badge-green" style={{ marginLeft: 'auto' }}>Hired ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="why-section">
        <div className="section-inner">
          <div className="section-label">Why Choose CareerLink?</div>
          <h2 className="section-title">Our platform is designed to provide professionals with unmatched career development tools and ideal match opportunities.</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="infra-section">
        <div className="infra-inner">
          <div className="infra-text">
            <div className="section-label">Our Mission</div>
            <h2>Building the Infrastructure of Opportunity</h2>
            <p>
              At CareerLink, we believe talent shouldn't be gatekept — it should be a platform: it provides a platform for career seekers to find their professional match. We connect exceptional talent with world-class opportunities through innovative technology and meaningful relationships.
            </p>
            <div className="infra-stats">
              <div className="infra-stat">
                <span className="stat-big">500K+</span>
                <span>Active Listings</span>
              </div>
              <div className="infra-stat">
                <span className="stat-big">98%</span>
                <span>Success Rate</span>
              </div>
            </div>
          </div>
          <div className="infra-image">
            <div className="infra-img-placeholder">
              <div className="infra-dots">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="infra-dot" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <div className="infra-img-text">Connect. Grow. Thrive.</div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="jobs-preview">
        <div className="section-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div className="section-label">Open Positions</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Recommended Jobs</h2>
            </div>
            <Link to="/job-seekers"><button className="btn-outline">Browse All →</button></Link>
          </div>
          <div className="jobs-grid">
            {jobs.map((j, i) => (
              <div key={i} className="job-preview-card card">
                <div className="job-card-top">
                  <div className="job-company-logo">{j.company[0]}</div>
                  <div>
                    <div className="job-title">{j.title}</div>
                    <div className="job-company">{j.company}</div>
                  </div>
                </div>
                <div className="job-meta">
                  <span className="meta-tag">{j.type}</span>
                  <span className="meta-tag">{j.location}</span>
                </div>
                <div className="job-card-footer">
                  <span className="job-salary">{j.salary}</span>
                  <button className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to make your move?</h2>
          <p>Join thousands of professionals who found their dream career through CareerLink.</p>
          <div className="cta-actions">
            <Link to="/job-seekers"><button className="btn-primary cta-btn">Find a Job</button></Link>
            <Link to="/job-posters"><button className="btn-outline cta-btn">Post a Job</button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

