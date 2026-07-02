import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../../../../packages/shared/types';
import API from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchRole: (role: UserRole) => void;
  checkBackend: () => Promise<boolean>;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Auto check if real backend Express API is running
        const available = await API.checkBackendAvailability();
        setIsMock(!available);
        
        const storedToken = localStorage.getItem('stackpilot_token');
        const storedUser = localStorage.getItem('stackpilot_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await API.auth.login(email);
      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const data = await API.auth.register(name, email, role);
      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('stackpilot_token');
    localStorage.removeItem('stackpilot_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updated = await API.auth.updateProfile(updates);
      setUser(updated);
    } catch (err: any) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('stackpilot_user', JSON.stringify(updatedUser));
  };

  const checkBackend = async () => {
    const available = await API.checkBackendAvailability();
    setIsMock(!available);
    return available;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        checkBackend,
        isMock
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
