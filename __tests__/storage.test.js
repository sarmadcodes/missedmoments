/**
 * Guards the token storage layer against AsyncStorage API drift.
 *
 * This exists because a real bug shipped here: the code called multiSet /
 * multiRemove, which AsyncStorage v3 removed in favour of setMany / removeMany.
 * Nothing caught it -- it parses, it lints, and it only fails at runtime on the
 * line that runs immediately after a successful login.
 *
 * The official mock implements the same surface as the native module, so
 * calling a method that no longer exists fails here instead of on a device.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../src/services/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

describe('token storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists both tokens and reads them back', async () => {
    await saveTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });

    await expect(getAccessToken()).resolves.toBe('access-1');
    await expect(getRefreshToken()).resolves.toBe('refresh-1');
  });

  it('returns null when nothing has been stored', async () => {
    await expect(getAccessToken()).resolves.toBeNull();
    await expect(getRefreshToken()).resolves.toBeNull();
  });

  it('stores only the token that was provided', async () => {
    await saveTokens({ accessToken: 'access-only' });

    await expect(getAccessToken()).resolves.toBe('access-only');
    await expect(getRefreshToken()).resolves.toBeNull();
  });

  it('does not throw when given no tokens at all', async () => {
    await expect(saveTokens({})).resolves.toBeUndefined();
  });

  it('clears both tokens on sign out', async () => {
    await saveTokens({ accessToken: 'access-2', refreshToken: 'refresh-2' });
    await clearTokens();

    await expect(getAccessToken()).resolves.toBeNull();
    await expect(getRefreshToken()).resolves.toBeNull();
  });

  it('overwrites an existing session on re-login', async () => {
    await saveTokens({ accessToken: 'old', refreshToken: 'old-r' });
    await saveTokens({ accessToken: 'new', refreshToken: 'new-r' });

    await expect(getAccessToken()).resolves.toBe('new');
    await expect(getRefreshToken()).resolves.toBe('new-r');
  });

  it('uses only methods that exist on the installed AsyncStorage', () => {
    // The removed v2 names must not reappear.
    expect(AsyncStorage.multiSet).toBeUndefined();
    expect(AsyncStorage.multiGet).toBeUndefined();
    expect(AsyncStorage.multiRemove).toBeUndefined();

    expect(typeof AsyncStorage.setMany).toBe('function');
    expect(typeof AsyncStorage.removeMany).toBe('function');
    expect(typeof AsyncStorage.getItem).toBe('function');
  });
});
