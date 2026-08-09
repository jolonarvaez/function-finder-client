"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/services/users";
import { useUserStore } from "@/components/auth/use-user-store";
import type { User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  /** True for a real (non-anonymous) signed-in user. */
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, setLoading: setProfileLoading, clear } = useUserStore();

  async function fetchProfile(userId: string) {
    if (useUserStore.getState().profile) return;
    setProfileLoading(true);
    try {
      const profile = await getUser(userId);
      setProfile(profile);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // No session (first visit, or an expired one) — sign in anonymously so
      // public pages (map, events) still get an authenticated API request,
      // without requiring the visitor to create an account.
      if (!session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error("Anonymous sign-in failed:", error.message);
          setLoading(false);
        }
        return;
      }
      setUser(session.user);
      setLoading(false);
      if (!session.user.is_anonymous) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_IN" && session?.user && !session.user.is_anonymous) {
        fetchProfile(session.user.id);
      }
      if (event === "SIGNED_OUT") {
        clear();
        supabase.auth.signInAnonymously();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!user && !user.is_anonymous;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Force clear local session even if server-side sign out fails
      setUser(null);
      clear();
    }
  };

  return <AuthContext value={{ user, isAuthenticated, loading, signOut }}>{children}</AuthContext>;
}
