import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiUrl } from '../api';
import './JobPosters.css';

const STATS = [
  { label: 'Career Questions', value: '4,873', icon: '❓', color: '#4f6ef7' },
  { label: 'Active Applications', value: '1,384', icon: '📋', color: '#22c55e' },
  { label: 'Job Postings', value: '12', icon: '📌', color: '#f59e0b' },
  { label: 'No Description', value: '7', icon: '⚠️', color: '#ef4444' },
];

const ACTIVE_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', type: 'Full-time', location: 'Remote', applicants: 47, posted: '3 days ago', active: true },
  { id: 2, title: 'Senior Product Designer', type: 'Full-time', location: 'San Francisco', applicants: 29, posted: '1 week ago', active: true },
  { id: 3, title: 'Data Architect', type: 'Contract', location: 'Austin, TX', applicants: 15, posted: '2 weeks ago', active: false },
];

const CHART_DATA = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 55 },
  { day: 'Wed', value: 42 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 65 },
  { day: 'Sat', value: 20 },
  { day: 'Sun', value: 35 },
];

const maxVal = Math.max(...CHART_DATA.map(d => d.value));

export default function JobPosters() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ profile: '', company: '', type: 'Full-time', location: '', salary: '', exp: '', techs: '', description: '' });
  const [jobs, setJobs] = useState([]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(apiUrl('/post'));
        if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Job fetch failed:', error);
      }
    };

    loadJobs();
  }, []);

  const displayJobs = jobs.length ? jobs : ACTIVE_JOBS;

  const handlePublishJob = async () => {
    try {
      const payload = {
        profile: form.profile,
        company: form.company,
        type: form.type,
        location: form.location,
        salary: form.salary,
        desc: form.description,
        exp: parseInt(form.exp, 10) || 0,
        techs: form.techs.split(',').map(t => t.trim()).filter(Boolean)
      };

      const res = await fetch(apiUrl('/post'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        setForm({ profile: '', company: '', type: 'Full-time', location: '', salary: '', exp: '', techs: '', description: '' });
        
        const jobsRes = await fetch(apiUrl('/post'));
        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(data);
        }
      }
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  return (
    <div className="posters-page">
      <Navbar />

      <div className="posters-layout">
        {}
        <div className="posters-header">
          <div>
            <h1 className="posters-title">Poster Dashboard</h1>
            <p className="posters-subtitle">Manage your open job posts and track growth analytics.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Post a New Job
          </button>
        </div>

        {}
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: `${s.color}18` }}>{s.icon}</div>
                <span className="stat-label">{s.label}</span>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="posters-grid">
          {}
          <div className="chart-card card">
            <div className="chart-header">
              <h3>Applications This Week</h3>
              <span className="badge-green">+24.8% ↑</span>
            </div>
            <div className="bar-chart">
              {CHART_DATA.map((d, i) => (
                <div key={i} className="bar-col">
                  <div className="bar-wrap">
                    <div
                      className="bar-fill"
                      style={{ height: `${(d.value / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="bar-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="postings-card card">
            <div className="chart-header">
              <h3>Active Postings</h3>
              <span className="badge-blue">{ACTIVE_JOBS.length} Jobs</span>
            </div>
            <div className="postings-list">
              {displayJobs.map((job, i) => (
                <div key={job._id || job.id || i} className="posting-item">
                  <div className="posting-icon">
                    {job.profile?.includes('Engineer') || job.title?.includes('Engineer') ? '⚙️' : job.profile?.includes('Designer') || job.title?.includes('Designer') ? '🎨' : '🗄️'}
                  </div>
                    <div className="posting-info">
                      <div className="posting-title">{job.profile || job.title}</div>
                      <div className="posting-meta">{job.company ? `Company: ${job.company}` : ''} {job.salary ? ` | Salary: ${job.salary}` : ''}</div>
                      <div className="posting-meta">{job.techs?.[0] || job.type} · {job.techs?.[1] || job.location}</div>
                    </div>
                  <div className="posting-right">
                    <div className="applicant-count">{job.applicants || 0}</div>
                    <div className="applicant-label">applicants</div>
                    <button className={job.active !== false ? 'posting-btn active' : 'posting-btn inactive'}>
                      {job.active !== false ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="card postings-table-card">
          <div className="chart-header" style={{ padding: '20px 24px 0' }}>
            <h3>All Job Postings</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="text" placeholder="Search postings..." className="table-search" />
              <button className="btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>Filter</button>
            </div>
          </div>
          <table className="postings-table">
            <thead>
              <tr>
                  <th>Company</th>
                  <th>Salary</th>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayJobs.map((job, i) => {
                const key = job._id || job.id || i;
                return (
                  <tr key={key}>
                     <td className="td-title">{job.company || ''}</td>
                     <td>{job.salary || ''}</td>
                     <td className="td-title">{job.profile || job.title}</td>
                     <td><span className="meta-tag">{job.techs?.[0] || job.type}</span></td>
                     <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{job.techs?.[1] || job.location}</td>
                     <td style={{ fontWeight: 600 }}>{job.applicants || 0}</td>
                     <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{job.posted || 'Just now'}</td>
                     <td>
                       <span className={job.active !== false ? 'badge-green' : 'status-paused'}>
                         {job.active !== false ? 'Active' : 'Paused'}
                       </span>
                     </td>
                     <td>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <button className="table-action-btn">Edit</button>
                         <button className="table-action-btn table-action-danger">Delete</button>
                       </div>
                     </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post a New Job</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <div className="form-group">
                  <label>Job Profile / Title</label>
                  <input name="profile" value={form.profile} onChange={handleChange} placeholder="e.g. Senior React Developer" type="text" />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Spark Agency" type="text" />
                </div>
              </div>
              <div className="modal-row">
                <div className="form-group">
                  <label>Job Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Remote / City, State" type="text" />
                </div>
              </div>
              <div className="modal-row">
                <div className="form-group">
                  <label>Salary Range</label>
                  <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. $104k – $135k" type="text" />
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input name="exp" value={form.exp} onChange={handleChange} placeholder="e.g. 3" type="number" />
                </div>
              </div>
              <div className="form-group">
                <label>Technologies (Comma separated)</label>
                <input name="techs" value={form.techs} onChange={handleChange} placeholder="e.g. React, Node.js, AWS" type="text" />
              </div>
              <div className="form-group">
                <label>Job Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, requirements, and benefits..." rows={5} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handlePublishJob}>Publish Job</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

