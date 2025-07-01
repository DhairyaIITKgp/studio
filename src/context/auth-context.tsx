"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// A mock user type to simulate a real user object.
interface MockUser {
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = useCallback((email: string) => {
    // In this mock implementation, any login attempt is successful.
    // We'll create a display name from the email for a more realistic feel.
    const displayName = email.split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    setUser({ email, displayName: displayName || 'User' });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // In this mock setup, we are never in a loading state from an async source.
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
