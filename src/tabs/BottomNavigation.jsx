import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomBar from '../components/CustomBottomBar';
import DiscoverScreen from './Tabscreens/DiscoverScreen';
import ChatsScreen from './Tabscreens/ChatsScreen';
import LikesScreen from './Tabscreens/LikesScreen';
import MatchesScreen from './Tabscreens/MatchesScreen';
import ProfileScreen from './Tabscreens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Matches"
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomBottomBar {...props} />}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Likes" component={LikesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
