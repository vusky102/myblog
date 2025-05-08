'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const { id, isAdmin } = jwtDecode(token);
          setUser({ id, isAdmin });
            setError(null);
          } else {
            Cookies.remove('token');
            setUser(null);
          }
        }
       catch (err) {
        console.error('Auth check failed:', err);
        Cookies.remove('token');
        setUser(null);
        setError('Authentication failed');
      }
    };

    checkAuth();
    // Re-check auth status when window gains focus
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const login = (user, token) => {
    try {
      // Decode will throw if the token is malformed
      const { id, isAdmin } = jwtDecode(token);
  
      // Persist the raw JWT
      Cookies.set('token', token, { expires: 1 }); // 1 day
  
      // Update React state
      setUser({ id, isAdmin });
      setError(null);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed');
      throw err;
    }
  };
  

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}