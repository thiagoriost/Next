'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  AuthError,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Database } from '@/types/database.types';

const AUTH_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const AUTH_SESSION_EXPIRY_KEY = 'luxeestate.auth.expiresAt';

function getSessionExpiryKey(userId: string): string {
  return `${AUTH_SESSION_EXPIRY_KEY}:${userId}`;
}

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
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const currentUserId = useRef<string | null>(null);

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseBrowserClient().auth.signOut();
    return error;
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    const synchronizeSession = (
      session: Session | null,
      supabase: SupabaseClient<Database>,
    ) => {
      if (!session) {
        const previousUserId = currentUserId.current;
        if (previousUserId) {
          try {
            window.localStorage.removeItem(
              getSessionExpiryKey(previousUserId),
            );
          } catch (error) {
            console.error('[AuthProvider] Failed to clear the session expiration:', error);
          }
        }
        currentUserId.current = null;
        setUser(null);
        setSessionExpiresAt(null);
        setIsLoading(false);
        return;
      }

      currentUserId.current = session.user.id;
      const expiryKey = getSessionExpiryKey(session.user.id);

      try {
        const storedExpiry = Number(window.localStorage.getItem(expiryKey));
        let expiresAt =
          Number.isFinite(storedExpiry) && storedExpiry > 0
            ? storedExpiry
            : null;

        if (expiresAt === null) {
          expiresAt = Date.now() + AUTH_SESSION_MAX_AGE_MS;
          window.localStorage.setItem(expiryKey, String(expiresAt));
        }

        if (expiresAt <= Date.now()) {
          window.localStorage.removeItem(expiryKey);
          setUser(null);
          setSessionExpiresAt(null);
          setIsLoading(false);
          window.setTimeout(() => {
            void supabase.auth.signOut().then(({ error }) => {
              if (error) {
                console.error(
                  '[AuthProvider] Failed to sign out the expired session:',
                  error.message,
                );
              }
            }).catch((error: unknown) => {
              console.error(
                '[AuthProvider] Failed to sign out the expired session:',
                error,
              );
            });
          }, 0);
          return;
        }

        setSessionExpiresAt(expiresAt);
        setUser(session.user);
        setIsLoading(false);
      } catch (error) {
        console.error(
          '[AuthProvider] Failed to persist the session expiration:',
          error,
        );
        setUser(null);
        setSessionExpiresAt(null);
        setIsLoading(false);
        window.setTimeout(() => {
          void supabase.auth.signOut().then(({ error: signOutError }) => {
            if (signOutError) {
              console.error(
                '[AuthProvider] Failed to sign out without a persisted expiration:',
                signOutError.message,
              );
            }
          }).catch((signOutError: unknown) => {
            console.error(
              '[AuthProvider] Failed to sign out without a persisted expiration:',
              signOutError,
            );
          });
        }, 0);
      }
    };

    void Promise.resolve()
      .then(() => {
        if (!active) return null;
        const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) {
            synchronizeSession(session, supabase);
          }
        });
        unsubscribe = () => subscription.unsubscribe();
        return supabase.auth.getSession().then((result) => ({
          result,
          supabase,
        }));
      })
      .then((response) => {
        if (!response) return;
        const { result, supabase } = response;
        if (!active || !result) return;
        const { data, error } = result;
        if (error) {
          console.error(
            '[AuthProvider] Failed to load the current session:',
            error.message,
          );
        }
        synchronizeSession(data.session, supabase);
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

  useEffect(() => {
    if (!user || sessionExpiresAt === null) return;

    let timeoutId: number;
    const enforceExpiration = () => {
      const remaining = sessionExpiresAt - Date.now();
      if (remaining <= 0) {
        setUser(null);
        setSessionExpiresAt(null);
        void signOut().then((error) => {
          if (error) {
            console.error(
              '[AuthProvider] Failed to sign out the expired session:',
              error.message,
            );
          }
        }).catch((error: unknown) => {
          console.error(
            '[AuthProvider] Failed to sign out the expired session:',
            error,
          );
        });
        return;
      }
      timeoutId = window.setTimeout(enforceExpiration, remaining);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') enforceExpiration();
    };

    enforceExpiration();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionExpiresAt, signOut, user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
