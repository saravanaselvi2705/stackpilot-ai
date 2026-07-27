import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../../../../packages/shared/types';
import API from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  sessionExpiredMsg: string | null;
  isMock: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: (expiredReason?: string) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkBackend: () => Promise<boolean>;
  clearSessionMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const storedToken = localStorage.getItem("stackpilot_token");
        const storedUser = localStorage.getItem("stackpilot_user");
        
        if (storedToken && storedUser) {
          try {
            const parsedUser: User = JSON.parse(storedUser);
            // Basic session integrity check
            if (parsedUser && parsedUser._id && parsedUser.email) {
              setToken(storedToken);
              setUser(parsedUser);
            } else {
              localStorage.removeItem("stackpilot_token");
              localStorage.removeItem("stackpilot_user");
              setSessionExpiredMsg("Session expired or invalid. Please sign in again.");
            }
          } catch {
            localStorage.removeItem("stackpilot_token");
            localStorage.removeItem("stackpilot_user");
            setSessionExpiredMsg("Stored session was corrupted. Please log in again.");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSessionExpiredMsg(null);
    try {
      const response = await API.auth.login(email, password);
      localStorage.setItem("stackpilot_token", response.token);
      localStorage.setItem("stackpilot_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    throw new Error("Public self-registration is disabled. Please request an administrator invitation.");
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("stackpilot_user", JSON.stringify(updatedUser));
    }
  };

  const logout = (expiredReason?: string) => {
    localStorage.removeItem("stackpilot_token");
    localStorage.removeItem("stackpilot_user");
    setToken(null);
    setUser(null);
    if (expiredReason) {
      setSessionExpiredMsg(expiredReason);
    }
  };

  const clearSessionMessage = () => {
    setSessionExpiredMsg(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await API.auth.updateProfile(updates);
    setUser(updated);
    localStorage.setItem("stackpilot_user", JSON.stringify(updated));
  };

  const checkBackend = async () => {
    return await API.checkBackendAvailability();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        sessionExpiredMsg,
        isMock: false,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        checkBackend,
        clearSessionMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};