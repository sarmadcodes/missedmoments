import { StatusBar, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen'
import WelcomeScreen from './src/screens/WelcomeScreen'
import OnboardingScreen from './src/screens/OnboardingScreen'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import BottomNavigation from './src/tabs/BottomNavigation'
import NotificationScreen from './src/screens/NotificationScreen'
import ChattingScreen from './src/screens/ChattingScreen'
import EditProfileScreen from './src/screens/EditProfileScreen'
import SettingScreen from './src/screens/SettingScreen'
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'
import PersonProfileScreen from './src/screens/PersonProfileScreen'
import DeleteAccount from './src/screens/DeleteAccount'
import EditProfile from './src/screens/EditProfileScreen'

const App = () => {
  const Stack = createStackNavigator();
  return (
   
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />

        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="PersonProfile" component={PersonProfileScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App
