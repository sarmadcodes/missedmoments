import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import FilterButton from '../components/FilterButton';

const NotificationScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '25%' }}>
          <AppHeader title="Notifications" />
          <FilterButton
            items={[
              { id: 1, name: 'All' },
              { id: 2, name: 'Unread' },
              { id: 3, name: 'Matches' },
              { id: 4, name: 'Likes' },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
