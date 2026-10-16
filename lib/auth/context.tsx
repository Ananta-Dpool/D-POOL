"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    name: string;
    password: string;
    whatsappNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Helper to load user profile from Supabase
  const loadProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, whatsapp_number, verification_status, campuses(name)")
        .eq("id", userId)
        .single();

      const namePart = email.split("@")[0];
      const fallbackName =
        namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, " ");

      const campusName =
        (profile as any)?.campuses?.name || "SPAV Vijayawada";

      const authUser: AuthUser = {
        id: userId,
        email,
        name: profile?.full_name || fallbackName,
        campusName,
        whatsappNumber: profile?.whatsapp_number || undefined,
        isVerified: profile?.verification_status === "verified",
      };

      setUser(authUser);
    } catch {
      // Fallback user if profile row is still syncing
      setUser({
        id: userId,
        email,
        name: email.split("@")[0],
        campusName: "SPAV Vijayawada",
        isVerified: true,
      });
    }
  };

  useEffect(() => {
    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 2. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadProfile(data.user.id, data.user.email || email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    }
  };

  const signup = async (data: {
    email: string;
    name: string;
    password: string;
    whatsappNumber?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            whatsapp_number: data.whatsappNumber || null,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
        await loadProfile(authData.user.id, authData.user.email || data.email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
