/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Firebase Cloud Messaging requires the background handler to be registered
// here, outside the React tree, so it can run when a push arrives while the
// app is backgrounded or fully killed and no component is mounted. This must
// not throw if Firebase was never configured (no google-services.json /
// GoogleService-Info.plist yet) -- the app should still start normally.
try {
  // eslint-disable-next-line global-require
  const messaging = require('@react-native-firebase/messaging').default;
  messaging().setBackgroundMessageHandler(async () => {
    // Nothing to do here: the OS already shows the system notification for
    // a background/killed-state push on its own. This handler existing is
    // what lets that happen at all -- without it, Android can drop messages
    // received while killed.
  });
} catch (err) {
  console.warn('Push notifications unavailable (Firebase not configured):', err?.message);
}

AppRegistry.registerComponent(appName, () => App);
