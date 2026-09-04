import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * A notification is tapped from outside any screen's component tree (the OS
 * notification tray, or a background/killed-state JS handler), so there is
 * no navigation prop in scope to call. This is react-navigation's own
 * documented pattern for that case: create the ref once here, hand it to
 * <NavigationContainer ref={navigationRef}> in App.jsx, and anything outside
 * a component can then call navigationRef.current?.navigate(...).
 */
export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};
