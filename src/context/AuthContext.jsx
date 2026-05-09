// =============================================
// AUTH CONTEXT
// Manages logged-in user state app-wide.
// TODO: Replace mock login with POST /api/auth/login
// =============================================

import { createContext, useContext, useState } from 'react';
import { currentUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO: On app load, check localStorage for JWT token and validate via API
  const [user, setUser] = useState(null); // null = not logged in

  // TODO: Replace with real API call → POST /api/auth/login
  const login = async (email, password) => {
    // Mock: accept any credential and return the dummy user
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(currentUser);
        resolve({ success: true });
      }, 800);
    });
  };

  // TODO: Call DELETE /api/auth/logout and clear token
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
