'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthError, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Database } from '@/types/database.types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<AuthError | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signOut: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    void Promise.resolve()
      .then(() => {
        if (!active) return null;
        const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) {
            setUser(session?.user ?? null);
            setIsLoading(false);
          }
        });
        unsubscribe = () => subscription.unsubscribe();
        return supabase.auth.getSession();
      })
      .then((result) => {
        if (!active || !result) return;
        const { data, error } = result;
        if (error) {
          console.error(
            '[AuthProvider] Failed to load the current session:',
            error.message,
          );
        }
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('[AuthProvider] Failed to load the current session:', error);
        setIsLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseBrowserClient().auth.signOut();
    return error;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
