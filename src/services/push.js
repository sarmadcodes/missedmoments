import { Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
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
 * Foreground: FCM delivers a data-only-feeling event to JS (Android does not
 * auto-show a system notification while the app is foregrounded), so a local
 * notification is shown here via notifee, which is also what supplies proper
 * Android notification channels.
 * Background: the OS shows the system notification on its own; only the tap
 * needs handling here (see registerNotificationOpenHandlers).
 * Killed: same as background, plus messaging().getInitialNotification() /
 * notifee.getInitialNotification() catch the tap that actually launched
 * the app, which the background listener alone would miss.
 */

const CHANNEL_ID = 'missedmoments-default';

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

const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'MissedMoments',
    importance: AndroidImportance.HIGH,
  });
};

/**
 * Asks for permission, gets a token, registers it with the backend, and
 * wires up foreground display + tap routing. Call once after a successful
 * sign-in; safe to call again on every app launch for a signed-in user.
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

    await ensureAndroidChannel();

    const token = await messaging().getToken();
    if (token) {
      await registerToken(token);
    }

    // The token can rotate (app reinstall, restored backup, OS-level
    // refresh); re-register rather than let the backend keep pushing to a
    // token that no longer resolves to this device.
    messaging().onTokenRefresh(registerToken);

    // Foreground: show it ourselves, since Android does not.
    messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
      });
    });

    registerNotificationOpenHandlers(messaging);

    return true;
  } catch (err) {
    console.warn('Push notification setup failed (non-fatal):', err?.message);
    return false;
  }
};

/** Tap routing for background, and the tap that launched the app from killed. */
const registerNotificationOpenHandlers = messaging => {
  // A system notification tap while backgrounded (message delivered natively
  // by FCM/APNs, not through notifee).
  messaging().onNotificationOpenedApp(remoteMessage => {
    openFromData(remoteMessage?.data);
  });

  // The tap that actually launched the app from a killed state.
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) openFromData(remoteMessage.data);
    });

  // A tap on a notification notifee itself displayed (the foreground path).
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) openFromData(detail.notification?.data);
  });
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) openFromData(detail.notification?.data);
  });
  notifee.getInitialNotification().then(initial => {
    if (initial) openFromData(initial.notification?.data);
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
