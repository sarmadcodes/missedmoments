import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import FilterButton from '../components/FilterButton';

/* =========================================================
   NOTIFICATION CARD
========================================================= */

const NotificationCard = ({
  image,
  message,
  time,
  showDot = true,
}) => {
  return (
    <View style={styles.notificationCard}>
      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.profileImage} />

        {showDot && <View style={styles.notificationDot} />}
      </View>

      {/* Notification Content */}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          {message}
          {time && <Text style={styles.timeText}> {time}</Text>}
        </Text>
      </View>
    </View>
  );
};

/* =========================================================
   NOTIFICATION SCREEN
========================================================= */

const NotificationScreen = () => {
  const yesterdayNotifications = [
    {
      id: 1,
      image: require('../assets/images/overlay1.png'),
      message: 'Ava Willams post for a first time in a while.',
      time: '2m',
    },
  ];

  const lastSevenDaysNotifications = [
    {
      id: 2,
      image: require('../assets/images/overlay2.png'),
      message:
        'New Follow suggestion and other accepted your follow request.',
      time: '2m',
    },
    {
      id: 3,
      image: require('../assets/images/overlay3.png'),
      message: 'Ava Willams post for a first time in a while.',
      time: '2m',
    },
    {
      id: 4,
      image: require('../assets/images/overlay4.png'),
      message: 'James others like a story.',
      time: '4d',
    },
    {
      id: 5,
      image: require('../assets/images/overlay1.png'),
      message: 'Ava Willams post for a first time in a while.',
      time: '2m',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppIcon />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header + Filters */}
        <View style={styles.headerSection}>
          <AppHeader title="Notifications" />

          <FilterButton
            items={[
              {id: 1, name: 'All'},
              {id: 2, name: 'Likes'},
              {id: 3, name: 'Follows'},
              {id: 4, name: 'Comments'},
            ]}
          />
        </View>

        {/* Yesterday */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>

          {yesterdayNotifications.map(item => (
            <NotificationCard
              key={item.id}
              image={item.image}
              message={item.message}
              time={item.time}
            />
          ))}
        </View>

        {/* Last 7 Days */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 days</Text>

          {lastSevenDaysNotifications.map(item => (
            <NotificationCard
              key={item.id}
              image={item.image}
              message={item.message}
              time={item.time}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 15,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  headerSection: {
    paddingBottom: 20,
  },

  section: {
    marginBottom: 4,
  },

  sectionTitle: {
    color: '#F4C95D',
    fontSize: 14,
    fontWeight: '500',
    // marginLeft: 18,
    marginBottom: 12,
  },

  notificationCard: {
    minHeight: 60,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 7,

    // marginHorizontal: 15,
    marginBottom: 12,

    paddingHorizontal: 15,
    paddingVertical: 8,

    flexDirection: 'row',
    alignItems: 'center',
  },

  imageWrapper: {
    width: 40,
    height: 40,
    position: 'relative',
    marginRight: 12,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F4C95D',
  },

  notificationDot: {
    position: 'absolute',
    right: -2,
    bottom: -1,

    width: 10,
    height: 10,
    borderRadius: 5,

    backgroundColor: '#FF3333',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },

  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },

  notificationText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400',
  },

  timeText: {
    color: '#777777',
    fontSize: 10,
  },
});