import { Platform } from 'react-native';
import { navigate } from '../navigation/navigationRef';
import { api } from './api';

/**
 * Push notifications: FCM on Android, and FCM-delivering-to-APNs on iOS,
 * both through the one @react-native-firebase/messaging API.
 *
 * Everything here is wrapped so that a project with no Firebase config at
 * all (no google-services.json / GoogleService-Info.plist yet) degrades to
 * a silent no-op instead of crashing the app. That is intentional: this
 * code ships now, credentials arrive later, and nothing about signing in,
 * discovering, matching or chatting should ever depend on push existing.
 *
 * Background and killed: the OS shows the system notification and handles
 * delivery on its own -- this only needs to catch the tap
 * (registerNotificationOpenHandlers). That covers the large majority of real
 * pushes, since most arrive while the app isn't open.
 *
 * Foreground: FCM does not auto-show a system notification while the app is
 * open on Android. This deliberately does NOT display one either -- an
 * on-device test found @notifee/react-native's native module failing to
 * link under this project's New Architecture build (RN 0.82,
 * newArchEnabled=true), throwing "Notifee native module not found" and
 * crashing the app at JS startup. Chasing that library's New Architecture
 * compatibility is out of scope for this launch; the user is already
 * looking at the app when a push arrives in foreground, so the in-app
 * notification feed (GET /v1/notifications) is what actually needs to
 * reflect it, not a redundant system banner. If a foreground banner is
 * wanted later, re-adding notifee (or swapping to a New Architecture-proven
 * alternative) is an isolated, additive change to this one file.
 */

let messagingModule = null;
const getMessaging = () => {
  if (messagingModule !== null) return messagingModule;
  try {
    // Deferred require: importing this module at all throws immediately if
    // the native Firebase app was never configured (no google-services.json
    // / GoogleService-Info.plist), and that must not take the whole JS
    // bundle down with it.
    // eslint-disable-next-line global-require
    messagingModule = require('@react-native-firebase/messaging').default;
  } catch (err) {
    console.warn('Push notifications unavailable (Firebase not configured):', err?.message);
    messagingModule = false;
  }
  return messagingModule;
};

/** Routes a tapped notification's payload to the right screen. */
const openFromData = data => {
  if (!data) return;
  if ((data.type === 'match' || data.type === 'message') && data.matchId) {
    navigate('ChattingScreen', { matchId: data.matchId });
  } else if (data.type === 'like') {
    navigate('BottomNavigation', { screen: 'Likes' });
  }
};

/**
 * Asks for permission, gets a token, registers it with the backend, and
 * wires up tap routing. Call once after a successful sign-in; safe to call
 * again on every app launch for a signed-in user.
 *
 * Resolves to false (never throws) if push cannot be set up for any reason
 * -- missing native config, permission denied, or a fresh Expo Go-style
 * environment without the native module at all.
 */
export const setupPushNotifications = async () => {
  const messaging = getMessaging();
  if (!messaging) return false;

  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) return false;

    const token = await messaging().getToken();
    if (token) {
      await registerToken(token);
    }

    // The token can rotate (app reinstall, restored backup, OS-level
    // refresh); re-register rather than let the backend keep pushing to a
    // token that no longer resolves to this device.
    messaging().onTokenRefresh(registerToken);

    // Foreground messages still arrive here; nothing is displayed for them
    // (see the file header), but this keeps the listener registered so a
    // future foreground-banner feature has a single place to add it.
    messaging().onMessage(() => {});

    registerNotificationOpenHandlers(messaging);

    return true;
  } catch (err) {
    console.warn('Push notification setup failed (non-fatal):', err?.message);
    return false;
  }
};

/** Tap routing for background, and the tap that launched the app from killed. */
const registerNotificationOpenHandlers = messaging => {
  // A system notification tap while backgrounded.
  messaging().onNotificationOpenedApp(remoteMessage => {
    openFromData(remoteMessage?.data);
  });

  // The tap that actually launched the app from a killed state.
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) openFromData(remoteMessage.data);
    });
};

const registerToken = async token => {
  try {
    await api.post('/v1/notifications/devices', {
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    });
  } catch (err) {
    // Not fatal: the app works fully without push. Retried next launch.
    console.warn('Could not register push token (non-fatal):', err?.message);
  }
};

/** Call on sign-out so a shared/reset device stops getting this account's pushes. */
export const teardownPushNotifications = async () => {
  const messaging = getMessaging();
  if (!messaging) return;
  try {
    const token = await messaging().getToken();
    if (token) {
      await api.delete(`/v1/notifications/devices/${encodeURIComponent(token)}`);
    }
  } catch {
    // Best effort -- the server-side token just goes stale and gets pruned
    // the next time a push to it comes back as "not registered".
  }
};
