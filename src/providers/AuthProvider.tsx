import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { AuthContext, type AuthContextValue } from "@/providers/auth-context";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function checkAdminByEmail(user: User) {
  const email = user.email ? normalizeEmail(user.email) : "";

  if (!email) {
    return false;
  }

  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const userRef = useRef<User | null>(null);

  const refreshAdminStatus = useCallback(async (nextUser?: User | null) => {
    const activeUser = nextUser ?? userRef.current;

    if (!activeUser) {
      setIsAdmin(false);
      return false;
    }

    try {
      const adminStatus = await checkAdminByEmail(activeUser);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("Admin status check failed", error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async (nextSession: Session | null) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await refreshAdminStatus(nextSession.user);
      } else {
        setIsAdmin(false);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    void supabase.auth.getSession().then(({ data }) => syncSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAdminStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      return { error };
    }

    const nextUser = data.user;

    if (!nextUser) {
      return { error: new Error("Giris sirasinda kullanici bilgisi alinamadi.") };
    }

    const adminStatus = await refreshAdminStatus(nextUser);

    if (!adminStatus) {
      await supabase.auth.signOut();
      return { error: new Error("Bu hesap admin paneline erisim yetkisine sahip degil.") };
    }

    return { error: null };
  }, [refreshAdminStatus]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
    refreshAdminStatus,
  }), [isAdmin, loading, refreshAdminStatus, session, signIn, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
