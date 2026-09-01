import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth as authApi, users as usersApi } from '../services/endpoints';
import { saveTokens, clearTokens, getAccessToken } from '../services/storage';

const AuthContext = createContext(null);

/**
 * Holds the signed-in user and the auth actions.
 *
 * `bootstrapping` is what the splash screen waits on: it is true until we know
 * whether a stored token is still valid, so the app never flashes the login
 * screen at someone who is already signed in.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshUser = useCallback(async () => {
    const me = await usersApi.me();
    setUser(me);
    return me;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          await refreshUser();
        }
      } catch {
        // Token is missing, expired or the API is unreachable. Either way the
        // user starts signed out rather than stuck on the splash screen.
        await clearTokens();
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [refreshUser]);

  const signIn = useCallback(
    async (email, password) => {
      const session = await authApi.login(email, password);
      await saveTokens(session);
      return refreshUser();
    },
    [refreshUser],
  );

  const signUp = useCallback(
    async payload => {
      const session = await authApi.register(payload);
      await saveTokens(session);
      return refreshUser();
    },
    [refreshUser],
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Revoking server-side is best effort; clearing locally is what matters.
    }
    await clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, bootstrapping, signIn, signUp, signOut, refreshUser }),
    [user, bootstrapping, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};
