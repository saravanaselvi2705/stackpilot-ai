import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../../../../packages/shared/types';
import API from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  updateProfile: (updates: Partial<User>) => Promise<void>;

  checkBackend: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const init = async () => {

      try {

        const storedToken = localStorage.getItem("stackpilot_token");
        const storedUser = localStorage.getItem("stackpilot_user");

        if (storedToken && storedUser) {

          setToken(storedToken);
          setUser(JSON.parse(storedUser));

        }

      } finally {

        setLoading(false);

      }

    };

    init();

  }, []);

  const login = async (
    email: string,
    password: string
  ) => {

    setLoading(true);
    setError(null);

    try {

      const response = await API.auth.login(email, password);

      localStorage.setItem(
        "stackpilot_token",
        response.token
      );

      localStorage.setItem(
        "stackpilot_user",
        JSON.stringify(response.user)
      );

      setToken(response.token);
      setUser(response.user);

    } catch (err: any) {

      setError(err.message || "Login failed");
      throw err;

    } finally {

      setLoading(false);

    }

  };

  const logout = () => {

    localStorage.removeItem("stackpilot_token");
    localStorage.removeItem("stackpilot_user");

    setToken(null);
    setUser(null);

  };

  const updateProfile = async (
    updates: Partial<User>
  ) => {

    const updated = await API.auth.updateProfile(updates);

    setUser(updated);

    localStorage.setItem(
      "stackpilot_user",
      JSON.stringify(updated)
    );

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

        login,

        logout,

        updateProfile,

        checkBackend

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;

};