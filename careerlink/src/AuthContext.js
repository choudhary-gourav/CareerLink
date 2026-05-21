import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('careerlink-auth');
    if (saved === 'true') setIsAuthenticated(true);
  }, []);

  const login = () => {
    window.localStorage.setItem('careerlink-auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    window.localStorage.removeItem('careerlink-auth');
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

