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
