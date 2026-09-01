import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import FilterButton from '../../components/FilterButton';
import MomentCard from '../../components/cards/MomentCard';
import { Loading, ErrorState, EmptyState } from '../../components/ScreenState';
import { useTabBarSpacer } from '../../theme/layout';
import { checkIn } from '../../services/location';
import { moments as momentsApi } from '../../services/endpoints';
import { avatarSource, timeAgo, friendlyError } from '../../utils/format';

const WINDOWS = [
  { id: 'hour', name: 'Right now' },
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This week' },
];

const DiscoverScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();

  const [people, setPeople] = useState([]);
  const [window, setWindow] = useState('hour');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * `checkIn` records where you are now and returns who was here with you.
   * Doing it on focus is the whole product: a moment is captured when you open
   * the app, which is also why no background location is needed.
   */
  const load = useCallback(
    async (selectedWindow = window, { viaCheckIn = false } = {}) => {
      setError(null);
      try {
        if (viaCheckIn) {
          const result = await checkIn();
          setPeople(result.nearby ?? []);
        } else {
          const result = await momentsApi.nearby(selectedWindow);
          setPeople(result.people ?? []);
        }
      } catch (err) {
        setError(friendlyError(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [window],
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load(window, { viaCheckIn: window === 'hour' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load(window, { viaCheckIn: window === 'hour' });
  };

  const onSelectWindow = id => {
    setWindow(id);
    setLoading(true);
  };

  const listHeader = (
    <View>
      <AppHeader
        title="Discover"
        subtitle={
          loading
            ? 'Looking for moments nearby...'
            : `Who's here — ${people.length} ${
                people.length === 1 ? 'moment' : 'moments'
              } nearby.`
        }
        rightContent={
          <TouchableOpacity
            activeOpacity={0.66}
            onPress={() => navigation.navigate('NotificationScreen')}
            style={styles.bellBtn}
          >
            <Ionicons name="notifications" size={20} color={'#fff'} />
          </TouchableOpacity>
        }
      />
      <FilterButton items={WINDOWS} selectedId={window} onSelect={onSelectWindow} />
    </View>
  );

  const renderBody = () => {
    if (loading) return <Loading label="Finding people who were near you" />;
    if (error) {
      return <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />;
    }
    return (
      <EmptyState
        title="No moments yet"
        text="Nobody else has checked in near you recently. Try again after your next coffee."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <FlatList
        data={people}
        keyExtractor={item => item.userId}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: tabBarSpacer, flexGrow: 1 }}
        ListEmptyComponent={renderBody()}
        removeClippedSubviews
        initialNumToRender={6}
        windowSize={9}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D4A84A"
            colors={['#D4A84A']}
          />
        }
        renderItem={({ item }) => (
          <MomentCard
            image={avatarSource(item.photoUrl)}
            title={item.name}
            location={item.placeName || `${item.distanceMetres}m away`}
            age={item.age ?? '--'}
            timing={timeAgo(item.lastSeenAt)}
            matchPercentage={item.matchPercentage}
            onPress={() =>
              navigation.navigate('PersonProfile', { userId: item.userId })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  bellBtn: { padding: 10, backgroundColor: '#333', borderRadius: 50 },
});
