import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Loading, ErrorState } from '../components/ScreenState';
import {
  users as usersApi,
  likes as likesApi,
  safety as safetyApi,
} from '../services/endpoints';
import { avatarSource, friendlyError } from '../utils/format';

const interestIcons = {
  Music: 'musical-notes-outline',
  Travel: 'airplane-outline',
  Food: 'restaurant-outline',
  Photography: 'camera-outline',
  Gaming: 'game-controller-outline',
  Dance: 'body-outline',
  Party: 'star-outline',
  Movies: 'film-outline',
  Sports: 'fitness-outline',
};

const PersonProfileScreen = ({ navigation, route }) => {
  const userId = route?.params?.userId;

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setError('No profile was selected.');
      setLoading(false);
      return;
    }
    setError(null);
    try {
      setPerson(await usersApi.profile(userId));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLike = async () => {
    setActing(true);
    try {
      const result = await likesApi.act(userId, 'like');
      if (result?.matched) {
        Alert.alert("It's a match!", `You and ${person.name} liked each other.`, [
          {
            text: 'Say hello',
            onPress: () =>
              navigation.navigate('ChattingScreen', {
                matchId: result.matchId,
                chat: {
                  title: person.name,
                  image: avatarSource(person.photos?.[0]),
                  userId,
                },
              }),
          },
          { text: 'Later', style: 'cancel' },
        ]);
      } else {
        Alert.alert('Liked', 'They will only find out if they like you back.');
      }
    } catch (err) {
      Alert.alert('Could not save that', friendlyError(err));
    } finally {
      setActing(false);
    }
  };

  const handleBlock = () => {
    Alert.alert(
      `Block ${person?.name}?`,
      'They will not be able to see your profile or message you, and any conversation you have will be closed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await safetyApi.block(userId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Could not block', friendlyError(err));
            }
          },
        },
      ],
    );
  };

  const handleReport = () => {
    Alert.alert('Report this profile?', 'Our team will review it.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: async () => {
          try {
            await safetyApi.report(userId, 'inappropriate');
            Alert.alert('Thank you', 'We will take a look.');
          } catch (err) {
            Alert.alert('Could not report', friendlyError(err));
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loading label="Loading profile" />
      </SafeAreaView>
    );
  }

  if (error || !person) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <ErrorState message={error || 'Profile unavailable'} onRetry={load} />
      </SafeAreaView>
    );
  }

  const photos = person.photos ?? [];
  const interests = person.interests ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <LinearGradient
          colors={['#000', '#000']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle} onPress={handleReport}>
              <Ionicons name="flag-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image source={avatarSource(photos[0])} style={styles.avatar} />

          <Text style={styles.name}>
            {person.name}
            {person.age ? `, ${person.age}` : ''}
          </Text>

          {person.city ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#D4A84A" />
              <Text style={styles.locationText}> {person.city}</Text>
            </View>
          ) : null}
        </LinearGradient>

        <View style={{ paddingHorizontal: 15 }}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLike}
              disabled={acting}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={['#200404', '#B60406']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Ionicons name="heart" size={14} color="#fff" />
                <Text style={styles.startBtnText}> Like</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleBlock}
              style={styles.blockBtn}
            >
              <Ionicons name="ban-outline" size={14} color="#E90000" />
              <Text style={styles.blockBtnText}> Block</Text>
            </TouchableOpacity>
          </View>

          {person.bio ? (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color="#E90000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.cardHeaderText}>About {person.name}</Text>
              </View>
              <Text style={styles.aboutText}>{person.bio}</Text>
            </View>
          ) : null}

          {interests.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="star-outline"
                  size={15}
                  color="#E90000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.cardHeaderText}>Interests</Text>
              </View>
              <View style={styles.chipsRow}>
                {interests.map(interest => (
                  <View key={interest} style={styles.chip}>
                    <Ionicons
                      name={interestIcons[interest] || 'ellipse-outline'}
                      size={12}
                      color="#E90000"
                    />
                    <Text style={styles.chipText}> {interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {photos.length > 1 && (
            <>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="image-outline"
                  size={15}
                  color="#E90000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.cardHeaderText}>Photos</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={avatarSource(photo)}
                    style={styles.photoThumb}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  headerGradient: { alignItems: 'center', paddingBottom: 20, paddingHorizontal: 15 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  iconCircle: { padding: 9, backgroundColor: '#222', borderRadius: 50 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#D4A84A',
    marginTop: 6,
  },
  name: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { color: '#D4A84A', fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 50,
  },
  startBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  blockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E90000',
  },
  blockBtnText: { color: '#E90000', fontSize: 13, fontWeight: '700' },
  card: {
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    padding: 14,
    marginTop: 18,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  cardHeaderText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  aboutText: { color: '#bbb', fontSize: 12, lineHeight: 19, marginTop: 10 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  chipText: { color: '#fff', fontSize: 11 },
  photoThumb: {
    width: 100,
    height: 130,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 12,
  },
});
