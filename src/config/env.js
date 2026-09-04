import { Platform } from 'react-native';

/**
 * Runtime configuration.
 *
 * `10.0.2.2` is the host machine as seen from the Android emulator; a physical
 * device needs your LAN IP (or an `adb reverse tcp:4100 tcp:4100`, which the
 * dev script sets up). Point API_BASE_URL at your deployed API for release.
 */
const DEV_HOST = Platform.select({
  // A USB-connected phone reaches the laptop through an adb reverse tunnel,
  // so localhost is correct there. 10.0.2.2 is the emulator-only alias for
  // the host machine and does NOT work on a real device.
  //   adb reverse tcp:4100 tcp:4100
  android: 'http://localhost:4100',
  ios: 'http://localhost:4100',
  default: 'http://localhost:4100',
});

// Recommended CloudPanel subdomain (see the backend repo's deploy notes for
// the exact DNS record and Nginx/SSL setup). Update this once the site is
// live if a different subdomain is actually used.
export const API_BASE_URL = __DEV__ ? DEV_HOST : 'https://missedmoments-api.threadique.live';

// Requests time out rather than hanging forever on a dead network.
export const API_TIMEOUT_MS = 15000;
