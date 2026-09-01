import { Platform } from 'react-native';

/**
 * Runtime configuration.
 *
 * `10.0.2.2` is the host machine as seen from the Android emulator; a physical
 * device needs your LAN IP (or an `adb reverse tcp:4100 tcp:4100`, which the
 * dev script sets up). Point API_BASE_URL at your deployed API for release.
 */
const DEV_HOST = Platform.select({
  android: 'http://10.0.2.2:4100',
  ios: 'http://localhost:4100',
  default: 'http://localhost:4100',
});

export const API_BASE_URL = __DEV__ ? DEV_HOST : 'https://api.missedmoments.app';

// Requests time out rather than hanging forever on a dead network.
export const API_TIMEOUT_MS = 15000;
