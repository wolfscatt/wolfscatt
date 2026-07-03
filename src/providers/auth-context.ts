import { createContext } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

export type SignInResult = {
  error: AuthError | Error | null;
};

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<SignInResult>;
  refreshAdminStatus: (nextUser?: User | null) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
