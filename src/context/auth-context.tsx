"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Tree {
  id: number;
  date: string;
  duration: number;
  treeType: string;
  hint: string;
}

interface MockUser {
  email: string;
  displayName: string;
  cash: number;
  totalFocusTime: number; // in hours
  forest: Tree[];
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple in-memory store for users to persist data across navigation
const users = new Map<string, MockUser>();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  const updateUser = useCallback((updatedData: Partial<MockUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      // Also update the user in our in-memory store
      users.set(user.email, updatedUser);
    }
  }, [user]);

  const login = useCallback((email: string) => {
    let userData = users.get(email);

    if (!userData) {
      // If user doesn't exist in our map, it's a new user (or first login this session)
      const displayName = email.split('@')[0]
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      
      userData = {
        email,
        displayName: displayName || 'User',
        cash: 100,
        totalFocusTime: 0,
        forest: [],
      };
      users.set(email, userData);
    }

    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // In this mock setup, we are never in a loading state from an async source.
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
