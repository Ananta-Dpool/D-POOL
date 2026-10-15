"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  campusName: string;
  whatsappNumber?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    email: string;
    name: string;
    password: string;
    whatsappNumber?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "dpool_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore storage error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulating authentication delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Extract name from email if not available
    const namePart = email.split("@")[0];
    const formattedName =
      namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, " ");

    const loggedInUser: AuthUser = {
      id: "u-" + Date.now(),
      email,
      name: formattedName || "Student",
      campusName: "SPAV Vijayawada",
      isVerified: true,
    };

    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    return true;
  };

  const signup = async (data: {
    email: string;
    name: string;
    password: string;
    whatsappNumber?: string;
  }): Promise<boolean> => {
    // Simulating registration delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: AuthUser = {
      id: "u-" + Date.now(),
      email: data.email,
      name: data.name,
      campusName: "SPAV Vijayawada",
      whatsappNumber: data.whatsappNumber,
      isVerified: true,
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
