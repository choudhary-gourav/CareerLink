import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import JobSeekers from './pages/JobSeekers';
import JobPosters from './pages/JobPosters';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/job-seekers" element={<JobSeekers />} />
          <Route path="/job-posters" element={<JobPosters />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

