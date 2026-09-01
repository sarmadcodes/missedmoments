import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN = 'mm.accessToken';
const REFRESH_TOKEN = 'mm.refreshToken';

/**
 * Token persistence.
 *
 * NOTE: this uses the AsyncStorage v3 API. v3 replaced multiGet/multiSet/
 * multiRemove with getMany/setMany/removeMany, and setMany takes an object
 * rather than an array of [key, value] pairs. The old names survive only as
 * internal `legacy_*` methods and are not callable from here.
 *
 * AsyncStorage is not encrypted. It is acceptable for short-lived access
 * tokens at this stage, but move the refresh token to react-native-keychain
 * (Keychain / EncryptedSharedPreferences) before a public release.
 */
export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN);

export const saveTokens = async ({ accessToken, refreshToken }) => {
  const entries = {};
  if (accessToken) entries[ACCESS_TOKEN] = accessToken;
  if (refreshToken) entries[REFRESH_TOKEN] = refreshToken;
  if (Object.keys(entries).length) {
    await AsyncStorage.setMany(entries);
  }
};

export const clearTokens = () =>
  AsyncStorage.removeMany([ACCESS_TOKEN, REFRESH_TOKEN]);
