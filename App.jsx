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

const App = () => {
  const Stack = createStackNavigator();
  return (
   
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
        {/* <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} /> */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />

        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        

      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App
