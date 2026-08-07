import { StatusBar, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen'
import WelcomeScreen from './src/screens/WelcomeScreen'

const App = () => {
  const Stack = createStackNavigator();
  return (
   
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

        

      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App
