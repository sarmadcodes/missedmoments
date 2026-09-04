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
import { setupPushNotifications, teardownPushNotifications } from '../services/push';

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
          // A restored session (app reopened, not a fresh login) still needs
          // its push token registered/refreshed. Never blocks the splash
          // screen on this -- it resolves to false rather than throwing if
          // push isn't set up yet.
          setupPushNotifications().catch(() => {});
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
      const me = await refreshUser();
      setupPushNotifications().catch(() => {});
      return me;
    },
    [refreshUser],
  );

  const signUp = useCallback(
    async payload => {
      const session = await authApi.register(payload);
      await saveTokens(session);
      const me = await refreshUser();
      setupPushNotifications().catch(() => {});
      return me;
    },
    [refreshUser],
  );

  const signOut = useCallback(async () => {
    // Best effort, and deliberately before clearing local tokens: unregistering
    // needs an authenticated call to look up this device's own token.
    await teardownPushNotifications().catch(() => {});
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
