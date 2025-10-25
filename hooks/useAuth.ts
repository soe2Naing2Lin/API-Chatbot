
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

const USER_STORAGE_KEY = 'gemini-ai-agent-user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    // Also clear usage data on logout
    localStorage.removeItem('gemini-ai-agent-usage');
    setUser(null);
  }, []);

  return { user, login, logout };
};

export type { User };
