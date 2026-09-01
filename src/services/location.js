import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { api } from './api';

/**
 * Foreground-only location.
 *
 * The app never tracks in the background: a "moment" is recorded when you open
 * the app, which is both what the product needs and what keeps this off the
 * background-location review path in both stores.
 */

Geolocation.setRNConfiguration({
  skipPermissionRequests: true, // we ask explicitly, below
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto', // uses Google Play Services when available
});

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return new Promise(resolve => {
      Geolocation.requestAuthorization(
        () => resolve(true),
        () => resolve(false),
      );
    });
  }

  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  // Approximate-only is still usable, so accept either grant.
  return (
    granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
    granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
  );
};

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date(pos.timestamp).toISOString(),
        }),
      err => reject(new Error(err.message || 'Could not get location')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });

/**
 * Records the current position as a "moment" and returns the people who were
 * near the same place at a similar time. The server resolves the venue name
 * (Google Places) and runs the proximity query (PostGIS).
 */
export const checkIn = async () => {
  const granted = await requestLocationPermission();
  if (!granted) {
    const error = new Error('Location permission denied');
    error.code = 'PERMISSION_DENIED';
    throw error;
  }

  const position = await getCurrentPosition();
  return api.post('/v1/moments/check-in', position);
};

export const fetchNearby = ({ window = 'hour' } = {}) =>
  api.get(`/v1/moments/nearby?window=${encodeURIComponent(window)}`);
