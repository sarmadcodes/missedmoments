import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import SwipeCard, { useCardMetrics } from '../../components/cards/SwipeCard';
import { Loading, ErrorState, EmptyState } from '../../components/ScreenState';
import { useTabBarSpacer } from '../../theme/layout';
import { moments as momentsApi, likes as likesApi } from '../../services/endpoints';
import { avatarSource, friendlyError } from '../../utils/format';

const SWIPE_OUT_DURATION = 250;

const MatchesScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastLabel, setToastLabel] = useState(null);

  const position = useRef(new Animated.ValueXY()).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // The PanResponder below is built once and never rebuilt, so every value it
  // reaches through closure is frozen at the first render. Reading the index
  // from a ref is what keeps a dragged card acting on the person actually on
  // top of the deck instead of always on person #1.
  const currentIndexRef = useRef(0);

  const { screenWidth, cardWidth, cardHeight, swipeThreshold } = useCardMetrics();
  const tabBarSpacer = useTabBarSpacer();

  // Same reason as currentIndexRef: the frozen gesture handlers need the
  // current window metrics, not the ones from the first render.
  const metricsRef = useRef({ screenWidth, swipeThreshold });
  metricsRef.current = { screenWidth, swipeThreshold };

  // ...and the same for the deck, which now arrives from the API.
  const peopleRef = useRef(people);
  peopleRef.current = people;

  const load = useCallback(async () => {
    setError(null);
    try {
      // A wider window than Discover so the deck does not run dry.
      const result = await momentsApi.nearby('week');
      setPeople(result.people ?? []);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
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

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    position.setValue({ x: 0, y: 0 });
  }, [currentIndex, position]);

  const showToast = label => {
    setToastLabel(label);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToastLabel(null));
  };

  const act = async (person, action) => {
    try {
      const result = await likesApi.act(person.userId, action);
      showToast(result?.matched ? 'match' : action);
    } catch (err) {
      // The card has already animated away; surface it without blocking.
      showToast('error');
      console.warn('like failed:', friendlyError(err));
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        const { swipeThreshold: threshold } = metricsRef.current;
        if (gesture.dx > threshold) {
          forceSwipe('right');
        } else if (gesture.dx < -threshold) {
          forceSwipe('left');
        } else if (gesture.dy < -threshold) {
          forceSwipe('up');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const forceSwipe = direction => {
    const { screenWidth: width } = metricsRef.current;
    const x =
      direction === 'right' ? width * 1.5 : direction === 'left' ? -width * 1.5 : 0;
    const y = direction === 'up' ? -width * 1.5 : 0;
    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = direction => {
    const person = peopleRef.current[currentIndexRef.current];
    if (!person) {
      return;
    }
    // Keep the ref in step immediately; the effect above only runs after the
    // next render, and a fast second gesture can land before that.
    currentIndexRef.current += 1;

    if (direction === 'right') {
      act(person, 'like');
    } else if (direction === 'left') {
      act(person, 'pass');
    } else if (direction === 'up') {
      navigation.navigate('PersonProfile', { userId: person.userId });
    }

    setCurrentIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth * 1.5, 0, screenWidth * 1.5],
      outputRange: ['-18deg', '0deg', '18deg'],
    });
    return { ...position.getLayout(), transform: [{ rotate }] };
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [20, swipeThreshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-swipeThreshold, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // The API's nearby shape mapped onto what SwipeCard expects.
  const toCardPerson = person => ({
    image: avatarSource(person.photoUrl, person.userId),
    name: person.name,
    age: person.age,
    location: person.placeName || `${person.distanceMetres}m away`,
    interests: [],
    likes: person.matchPercentage,
  });

  const renderCards = () => {
    if (loading) return <Loading label="Building your deck" />;
    if (error) {
      return (
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true);
            load();
          }}
        />
      );
    }

    if (currentIndex >= people.length) {
      return (
        <EmptyState
          title="You're all caught up"
          text="No more profiles nearby — check back after your next moment."
        />
      );
    }

    return people
      .map((person, index) => {
        if (index < currentIndex || index > currentIndex + 2) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={person.userId}
              style={[
                styles.cardWrapper,
                { width: cardWidth, height: cardHeight },
                getCardStyle(),
              ]}
              {...panResponder.panHandlers}
            >
              <SwipeCard
                person={toCardPerson(person)}
                onPress={() =>
                  navigation.navigate('PersonProfile', { userId: person.userId })
                }
              />

              <Animated.View
                style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}
              >
                <Text style={styles.likeStampText}>LIKE</Text>
              </Animated.View>
              <Animated.View
                style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}
              >
                <Text style={styles.nopeStampText}>PASS</Text>
              </Animated.View>
            </Animated.View>
          );
        }

        const depth = index - currentIndex;
        return (
          <Animated.View
            key={person.userId}
            style={[
              styles.cardWrapper,
              styles.stackedCard,
              { width: cardWidth, height: cardHeight },
              { top: 8 * depth, transform: [{ scale: 1 - 0.04 * depth }] },
            ]}
          >
            <SwipeCard person={toCardPerson(person)} />
          </Animated.View>
        );
      })
      .reverse(); // current card renders last so it sits visually on top
  };

  const hasDeck = !loading && !error && currentIndex < people.length;
  const isNegative = toastLabel === 'pass' || toastLabel === 'error';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <AppHeader title="Matches" />

      <View style={styles.deckArea}>{renderCards()}</View>

      {hasDeck && (
        <View style={[styles.actionsRow, { marginBottom: tabBarSpacer }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.passBtn]}
            onPress={() => forceSwipe('left')}
          >
            <Ionicons name="close" size={26} color="#E90000" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => forceSwipe('right')}
          >
            <Ionicons name="checkmark" size={26} color="#D4A84A" />
          </TouchableOpacity>
        </View>
      )}

      {toastLabel && (
        <Animated.View
          style={[
            styles.toast,
            isNegative ? styles.toastPass : styles.toastLike,
            { opacity: toastOpacity, bottom: tabBarSpacer + 60 },
          ]}
        >
          <Ionicons
            name={
              toastLabel === 'match'
                ? 'sparkles'
                : toastLabel === 'like'
                ? 'heart'
                : toastLabel === 'error'
                ? 'alert-circle'
                : 'close-circle'
            }
            size={16}
            color={isNegative ? '#E90000' : '#D4A84A'}
          />
          <Text style={styles.toastText}>
            {toastLabel === 'match'
              ? "  It's a match!"
              : toastLabel === 'like'
              ? '  Liked'
              : toastLabel === 'error'
              ? "  Couldn't save that"
              : '  Passed'}
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  deckArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardWrapper: { position: 'absolute' },
  stackedCard: { zIndex: -1 },
  stamp: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: 8,
  },
  likeStamp: { left: 24, borderColor: '#D4A84A', transform: [{ rotate: '-20deg' }] },
  likeStampText: {
    color: '#D4A84A',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  nopeStamp: { right: 24, borderColor: '#E90000', transform: [{ rotate: '20deg' }] },
  nopeStampText: {
    color: '#E90000',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  actionBtn: {
    width: 55,
    height: 55,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    borderWidth: 1.5,
  },
  passBtn: { borderColor: '#E90000' },
  likeBtn: { borderColor: '#D4A84A' },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 50,
  },
  toastLike: { borderColor: '#D4A84A' },
  toastPass: { borderColor: '#E90000' },
  toastText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
