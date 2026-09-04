import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BottomNavigation from './src/tabs/BottomNavigation';
import NotificationScreen from './src/screens/NotificationScreen';
import ChattingScreen from './src/screens/ChattingScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingScreen from './src/screens/SettingScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import PersonProfileScreen from './src/screens/PersonProfileScreen';
import DeleteAccount from './src/screens/DeleteAccount';
import BlockUsersScreen from './src/screens/BlockUsersScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AuthProvider } from './src/context/AuthContext';
import { navigationRef } from './src/navigation/navigationRef';

// Created once at module scope. Building it inside the component made a brand
// new navigator on every render.
const Stack = createNativeStackNavigator();

// The whole app is a dark surface; without this the navigator flashes white
// between screens.
const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#000' },
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <NavigationContainer theme={navTheme} ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />

            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
            <Stack.Screen name="PersonProfile" component={PersonProfileScreen} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
            <Stack.Screen name="BlockUsers" component={BlockUsersScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            {/* Single registration. `EditProfileScreen` and `EditProfile` were
                both registered against this same component. */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
