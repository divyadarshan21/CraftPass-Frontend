import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/authApi';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(storage.get('token'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          storage.remove('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    storage.set('token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const { token, user } = await authApi.register(userData);
    storage.set('token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    storage.remove('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isArtisan: user?.role === 'artisan',
    isVerifier: user?.role === 'verifier',
    isBuyer: user?.role === 'buyer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};