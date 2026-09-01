import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import PersonCard from '../../components/cards/PersonCard';
import BannerCard from '../../components/cards/BannerCard';
import { Loading, ErrorState, EmptyState } from '../../components/ScreenState';
import { useTabBarSpacer } from '../../theme/layout';
import { likes as likesApi } from '../../services/endpoints';
import { avatarSource, friendlyError } from '../../utils/format';

const LikesScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();
  const [admirers, setAdmirers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [admirerResult, matchResult] = await Promise.all([
        likesApi.admirers(),
        likesApi.matches(),
      ]);
      setAdmirers(admirerResult.people ?? []);
      setMatches(matchResult.matches ?? []);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openProfile = userId => navigation.navigate('PersonProfile', { userId });

  // Liking back from here is what turns a quiet admirer into a match.
  const likeBack = async userId => {
    try {
      const result = await likesApi.act(userId, 'like');
      await load();
      if (result?.matched) {
        navigation.navigate('ChattingScreen', { matchId: result.matchId });
      }
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppIcon />
        <Loading label="Loading your likes" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppIcon />
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true);
            load();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor="#D4A84A"
            colors={['#D4A84A']}
          />
        }
      >
        <View style={{ paddingBottom: tabBarSpacer }}>
          <AppHeader
            title="Likes"
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

          {admirers.length > 0 && (
            <BannerCard
              icon="heart"
              title={`You have ${admirers.length} new ${
                admirers.length === 1 ? 'like' : 'likes'
              }!`}
              text="Like them back to start a conversation."
            />
          )}

          <Text style={styles.sectionTitle}>Quiet Admirers</Text>
          {admirers.length === 0 ? (
            <EmptyState
              icon="heart-outline"
              title="No admirers yet"
              text="When someone likes your moment, they show up here — silently."
            />
          ) : (
            <FlatList
              data={admirers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.userId}
              ItemSeparatorComponent={separator}
              renderItem={({ item }) => (
                <PersonCard
                  name={item.name}
                  location={item.placeName || 'Nearby'}
                  image={avatarSource(item.photoUrl)}
                  type="bordered"
                  buttonText="Like back"
                  onPress={() => openProfile(item.userId)}
                  onButtonPress={() => likeBack(item.userId)}
                />
              )}
            />
          )}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Your Matches</Text>
          {matches.length === 0 ? (
            <EmptyState
              icon="sparkles-outline"
              title="No matches yet"
              text="A match happens when you both tap the heart."
            />
          ) : (
            <FlatList
              data={matches}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.matchId}
              ItemSeparatorComponent={separator}
              renderItem={({ item }) => (
                <PersonCard
                  name={item.name}
                  location="Matched"
                  image={avatarSource(item.photoUrl)}
                  type="bordered"
                  buttonText="Message"
                  onPress={() => openProfile(item.userId)}
                  onButtonPress={() =>
                    navigation.navigate('ChattingScreen', {
                      matchId: item.matchId,
                      chat: {
                        title: item.name,
                        image: avatarSource(item.photoUrl),
                        userId: item.userId,
                      },
                    })
                  }
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Defined outside render so React does not remount the separator each pass.
const separator = () => <View style={{ width: 10 }} />;

export default LikesScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  bellBtn: { padding: 10, backgroundColor: '#333', borderRadius: 50 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
});
