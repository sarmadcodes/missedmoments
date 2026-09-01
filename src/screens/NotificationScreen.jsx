import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { notifications as notificationsApi } from '../services/endpoints';
import { Loading, ErrorState, EmptyState } from '../components/ScreenState';
import { avatarSource, timeAgo, friendlyError } from '../utils/format';

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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const result = await notificationsApi.list();
      setItems(result.notifications ?? []);
      // Opening the screen is what marks them read.
      notificationsApi.markRead().catch(() => {});
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderBody = () => {
    if (loading) return <Loading label="Loading notifications" />;
    if (error) return <ErrorState message={error} onRetry={load} />;
    if (!items.length) {
      return (
        <EmptyState
          icon="notifications-outline"
          title="Nothing yet"
          text="Likes, matches and messages will show up here."
        />
      );
    }

    return items.map(item => (
      <NotificationCard
        key={item.id}
        image={avatarSource(item.actorPhotoUrl, item.id)}
        message={item.actorName ? `${item.actorName}: ${item.body}` : item.body}
        time={timeAgo(item.createdAt)}
        showDot={!item.readAt}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppIcon />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerSection}>
          <AppHeader title="Notifications" />
        </View>

        <View style={styles.section}>{renderBody()}</View>
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