import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        console.log('[Auth] Initializing with stored token:', storedToken ? 'YES' : 'NO');
        
        if (storedToken) {
          setToken(storedToken);
          // Try to fetch current user with the stored token
          try {
            console.log('[Auth] Fetching current user...');
            const response = await authAPI.getCurrentUser();
            console.log('[Auth] User fetched successfully:', response.data.email);
            setUser(response.data);
            setError(null);
          } catch (err) {
            console.error('[Auth] Failed to verify stored token:', err.response?.status, err.message);
            // If token is invalid, clear it
            if (err.response?.status === 401 || err.response?.status === 403) {
              console.log('[Auth] Token invalid, clearing it');
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
            // Otherwise, keep the token - it might be a network issue
          }
        }
      } catch (err) {
        console.error('[Auth] Initialization error:', err);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []); // Run only once on mount

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      console.log('[Auth] Fetching current user...');
      const response = await authAPI.getCurrentUser();
      console.log('[Auth] Current user fetched:', response.data.email);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('[Auth] Failed to fetch current user:', err.response?.status, err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token is invalid, clear everything
        console.log('[Auth] Token invalid, clearing it');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Auth] Signing up user:', formData.email);
      const response = await authAPI.signup(formData);
      const { token: newToken, user: userData } = response.data;
      console.log('[Auth] Signup successful, storing token');
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      console.log('[Auth] User set:', userData.email);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      setError(errorMessage);
      console.error('[Auth] Signup error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Auth] Logging in user:', email);
      const response = await authAPI.login({ email, password });
      console.log('[Auth] Login response received');
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken) {
        throw new Error('No token received from server');
      }
      
      console.log('[Auth] Storing token in localStorage');
      localStorage.setItem('token', newToken);
      
      console.log('[Auth] Setting token in state');
      setToken(newToken);
      
      console.log('[Auth] Setting user:', userData.email);
      setUser(userData);
      
      console.log('[Auth] Login successful');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      console.error('[Auth] Login error:', errorMessage);
      console.error('[Auth] Error details:', err.response?.data);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('[Auth] Logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Re-authenticate if token changes
  const refreshUser = useCallback(() => {
    if (token) {
      return fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const value = {
    user,
    token,
    loading,
    error,
    setError,
    signup,
    login,
    logout,
    refreshUser,
    isInitialized,
  };

  console.log('[Auth] Context state:', { 
    hasUser: !!user, 
    hasToken: !!token, 
    loading, 
    isInitialized,
    error: error ? `"${error}"` : 'none'
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
