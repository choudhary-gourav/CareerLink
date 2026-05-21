import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiUrl } from '../api';
import './JobSeekers.css';

const JOBS = [
  { id: 1, title: 'Senior Product Designer', company: 'Spark Agency', type: 'Full-time', location: 'Remote', salary: '$104k – $135k', tags: ['Figma', 'UX', 'Product'], posted: '2d ago', applicants: 43, status: 'Hot' },
  { id: 2, title: 'Lead Full Stack Engineer', company: 'Candidate ID', type: 'Full-time', location: 'San Francisco, CA', salary: '$180k – $215k', tags: ['React', 'Node.js', 'AWS'], posted: '1d ago', applicants: 27, status: 'New' },
  { id: 3, title: 'Growth Marketing Manager', company: 'Undefined Work', type: 'Full-time', location: 'New York, NY', salary: '$100k – $130k', tags: ['SEO', 'Ads', 'Analytics'], posted: '3d ago', applicants: 61, status: null },
  { id: 4, title: 'QA Automation Engineer', company: 'Remote Work', type: 'Contract', location: 'Remote', salary: '$90k – $115k', tags: ['Selenium', 'Python', 'CI/CD'], posted: '5d ago', applicants: 19, status: null },
  { id: 5, title: 'Data Architect', company: 'DataCo', type: 'Full-time', location: 'Austin, TX', salary: '$150k – $190k', tags: ['SQL', 'Spark', 'Snowflake'], posted: '1d ago', applicants: 35, status: 'New' },
  { id: 6, title: 'Product Manager', company: 'TechStart', type: 'Full-time', location: 'Remote', salary: '$120k – $155k', tags: ['Roadmap', 'Agile', 'Jira'], posted: '4d ago', applicants: 88, status: 'Hot' },
];

const PROFILE = {
  name: 'Jordan Blake',
  role: 'Senior Product Designer',
  location: 'San Francisco, CA',
  matches: 24,
};

export default function JobSeekers() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(apiUrl('/post'));
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
          if (data.length > 0 && window.innerWidth > 768) setSelected(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      
      try {
        const res = await fetch(apiUrl('/post'));
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
          if (data.length > 0 && window.innerWidth > 768) setSelected(data[0]);
        }
      } catch (err) { console.error(err); }
      return;
    }
    
    try {
      const res = await fetch(apiUrl(`/post/${search}`), {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0 && window.innerWidth > 768) setSelected(data[0]);
        else setSelected(null);
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const displayJobs = jobs.length ? jobs : JOBS; 

  return (
    <div className="seekers-page">
      <Navbar />

      <div className={`seekers-layout ${selected ? 'has-selected' : ''}`}>
        {}
        <aside className="seekers-sidebar">
          <div className="profile-card card">
            <div className="profile-avatar-lg">JB</div>
            <div className="profile-info">
              <div className="profile-name-lg">{PROFILE.name}</div>
              <div className="profile-role-sm">{PROFILE.role}</div>
              <div className="profile-loc">📍 {PROFILE.location}</div>
            </div>
            <div className="profile-match-badge">
              <span className="match-count">{PROFILE.matches}</span>
              <span className="match-label">Job Matches</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Filters</div>

            <div className="filter-group">
              <label>Job Type</label>
              {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(t => (
                <label key={t} className="checkbox-label">
                  <input type="checkbox" defaultChecked={t === 'Full-time'} />
                  {t}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label>Location</label>
              {['Remote', 'On-site', 'Hybrid'].map(t => (
                <label key={t} className="checkbox-label">
                  <input type="checkbox" defaultChecked={t === 'Remote'} />
                  {t}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label>Salary Range</label>
              <input type="range" min="50" max="300" defaultValue="150" className="range-input" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>$50k</span><span>$300k</span>
              </div>
            </div>
          </div>
        </aside>

        {}
        <main className="seekers-main">
          <div className="seekers-search-bar">
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleSearch}>Search</button>
          </div>

          <div className="jobs-count">{jobs.length} recommended jobs</div>

          <div className="jobs-list">
            {displayJobs.map((job, i) => {
              const key = job.id || job._id || i;
              const logoInitial = (job.profile || job.title || 'J')[0].toUpperCase();
              const displayTitle = job.profile || job.title || 'Unknown Role';
              
              return (
                <div
                  key={key}
                  className={`job-list-item card ${selected && (selected.id === key || selected._id === key) ? 'selected' : ''}`}
                  onClick={() => setSelected(job)}
                >
                  <div className="job-list-top">
                    <div className="jl-logo">{logoInitial}</div>
                    <div className="jl-info">
                      <div className="jl-title">{displayTitle}</div>
                      <div className="jl-company">{job.company || 'Tech Company'}</div>
                    </div>
                    {job.status && (
                      <span className={job.status === 'Hot' ? 'badge-green' : 'badge-blue'}>
                        {job.status}
                      </span>
                    )}
                  </div>
                  <div className="jl-tags">
                    {(job.techs || job.tags || []).map((t, idx) => <span key={`${t}-${idx}`} className="jl-tag">{t}</span>)}
                  </div>
                  <div className="jl-footer">
                    <span className="jl-salary">{job.salary || 'Competitive'}</span>
                    <span className="jl-meta">{job.applicants || Math.floor(Math.random() * 50) + 1} applicants · {job.posted || 'Just now'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {}
        {selected && (
          <aside className="job-detail card">
            <button className="jd-back-btn" onClick={() => setSelected(null)}>
              ← Back to Jobs
            </button>
            <div className="jd-header">
              <div className="jd-logo">{(selected.profile || selected.title || 'J')[0].toUpperCase()}</div>
              <div>
                <h2 className="jd-title">{selected.profile || selected.title || 'Unknown Role'}</h2>
                <div className="jd-company">{selected.company || 'Tech Company'}</div>
              </div>
            </div>

            <div className="jd-meta-row">
              <span className="meta-tag">{selected.type || 'Full-time'}</span>
              <span className="meta-tag">📍 {selected.location || 'Remote'}</span>
              <span className="meta-tag">⏱ {selected.posted || 'Just now'}</span>
            </div>

            <div className="jd-salary-block">
              <span className="jd-salary-label">Salary Range</span>
              <span className="jd-salary-value">{selected.salary || 'Competitive'}</span>
            </div>

            <div className="jd-tags-row">
              {(selected.techs || selected.tags || []).map((t, idx) => <span key={`${t}-${idx}`} className="badge-blue">{t}</span>)}
            </div>

            <div className="jd-section">
              <h4>About the Role</h4>
              <p>
                {selected.desc || (
                  <>
                    We're looking for a talented <strong>{selected.profile || selected.title}</strong> to join our growing team. 
                    You'll work closely with cross-functional teams to drive impact and shape the future of our product. 
                  </>
                )}
              </p>
            </div>

            <div className="jd-section">
              <h4>Requirements</h4>
              <ul>
                <li>{selected.exp || 1}+ years of relevant experience</li>
                <li>Strong communication and collaboration skills</li>
                <li>Experience with {(selected.techs || selected.tags || []).join(', ')}</li>
                <li>Self-driven and able to work independently</li>
                <li>Passion for building impactful products</li>
              </ul>
            </div>

            <div className="jd-actions">
              <button className="btn-primary jd-apply-btn">Apply Now</button>
              <button className="btn-outline" style={{ padding: '11px' }}>♡ Save</button>
            </div>

            <div className="jd-applicants">
              {selected.applicants || Math.floor(Math.random() * 50) + 1} people have applied to this role
            </div>
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}

