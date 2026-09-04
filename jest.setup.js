/**
 * Test environment setup.
 *
 * Native modules have no implementation under Jest, so each one used by the
 * app is replaced with the library's official mock (or a minimal stand-in).
 */

// AsyncStorage ships an in-memory mock matching the real v3 API surface.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    setRNConfiguration: jest.fn(),
    requestAuthorization: jest.fn(success => success && success()),
    getCurrentPosition: jest.fn(success =>
      success({
        coords: { latitude: 51.5, longitude: -0.12, accuracy: 10 },
        timestamp: Date.now(),
      }),
    ),
    watchPosition: jest.fn(() => 0),
    clearWatch: jest.fn(),
  },
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(async () => ({ didCancel: true })),
  launchCamera: jest.fn(async () => ({ didCancel: true })),
}));

// notifee is imported eagerly at the top of src/services/push.js (unlike
// @react-native-firebase/messaging, which that file requires lazily inside a
// try/catch specifically so a project with no Firebase config yet doesn't
// crash) -- without this mock, that eager import alone breaks every test
// that transitively pulls in AuthContext, since there is no native module
// for it under Jest.
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(async () => 'missedmoments-default'),
    displayNotification: jest.fn(async () => {}),
    onForegroundEvent: jest.fn(() => () => {}),
    onBackgroundEvent: jest.fn(),
    getInitialNotification: jest.fn(async () => null),
  },
  AndroidImportance: { HIGH: 4 },
  EventType: { PRESS: 1 },
}));

// Deferred in src/services/push.js and index.js specifically so a missing
// native Firebase config degrades to push-disabled rather than crashing; this
// mock exists only so a *test* importing those files doesn't hit "module not
// found" for a native-only package, not because that guard is untrusted.
jest.mock(
  '@react-native-firebase/messaging',
  () => ({
    __esModule: true,
    default: Object.assign(
      jest.fn(() => ({
        requestPermission: jest.fn(async () => 1),
        getToken: jest.fn(async () => 'test-token'),
        onTokenRefresh: jest.fn(),
        onMessage: jest.fn(),
        onNotificationOpenedApp: jest.fn(),
        getInitialNotification: jest.fn(async () => null),
        setBackgroundMessageHandler: jest.fn(),
      })),
      { AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 } },
    ),
  }),
  { virtual: true },
);
