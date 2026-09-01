import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN = 'mm.accessToken';
const REFRESH_TOKEN = 'mm.refreshToken';

/**
 * Token persistence.
 *
 * NOTE: AsyncStorage is not encrypted. It is acceptable for short-lived access
 * tokens at this stage, but move the refresh token to react-native-keychain
 * (Keychain / EncryptedSharedPreferences) before a public release.
 */
export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN);

export const saveTokens = async ({ accessToken, refreshToken }) => {
  const pairs = [];
  if (accessToken) pairs.push([ACCESS_TOKEN, accessToken]);
  if (refreshToken) pairs.push([REFRESH_TOKEN, refreshToken]);
  if (pairs.length) await AsyncStorage.multiSet(pairs);
};

export const clearTokens = () =>
  AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN]);
