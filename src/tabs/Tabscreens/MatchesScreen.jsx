import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import SwipeCard, {
  CARD_WIDTH,
  CARD_HEIGHT,
  SCREEN_WIDTH,
} from '../../components/cards/SwipeCard';

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 250;

const MatchesScreen = ({ navigation }) => {
  const people = [
    {
      id: '1',
      image: require('../../assets/images/overlay1.png'),
      name: 'Elizabeth',
      age: 28,
      location: 'Blue Door Cafe',
      interests: ['Music', 'Travel', 'Books'],
      likes: 132,
    },
    {
      id: '2',
      image: require('../../assets/images/overlay2.png'),
      name: 'Marcus',
      age: 21,
      location: 'Roundhouse',
      interests: ['Fitness', 'Art', 'Cocktails'],
      likes: 94,
    },
    {
      id: '3',
      image: require('../../assets/images/overlay3.png'),
      name: 'Emily',
      age: 20,
      location: 'Downtown',
      interests: ['Food', 'Dance', 'Film'],
      likes: 88,
    },
    {
      id: '4',
      image: require('../../assets/images/overlay4.png'),
      name: 'Sarah',
      age: 24,
      location: 'Rooftop Lounge',
      interests: ['Photography', 'Travel'],
      likes: 118,
    },
    {
      id: '5',
      image: require('../../assets/images/overlay1.png'),
      name: 'John',
      age: 33,
      location: 'King’s Cross',
      interests: ['Football', 'Coffee', 'Music'],
      likes: 140,
    },
    {
      id: '6',
      image: require('../../assets/images/overlay2.png'),
      name: 'David',
      age: 29,
      location: 'Metro Station',
      interests: ['Gaming', 'Movies', 'Road Trips'],
      likes: 105,
    },
    {
      id: '7',
      image: require('../../assets/images/overlay3.png'),
      name: 'Sophia',
      age: 23,
      location: 'West End',
      interests: ['Fashion', 'Art', 'Sunsets'],
      likes: 116,
    },
    {
      id: '8',
      image: require('../../assets/images/overlay4.png'),
      name: 'Alex',
      age: 27,
      location: 'City Library',
      interests: ['Running', 'Books', 'Music'],
      likes: 97,
    },
    {
      id: '9',
      image: require('../../assets/images/overlay1.png'),
      name: 'Jessica',
      age: 22,
      location: 'Baker Street',
      interests: ['Food', 'Travel', 'Movies'],
      likes: 109,
    },
    {
      id: '10',
      image: require('../../assets/images/overlay2.png'),
      name: 'Michael',
      age: 31,
      location: 'Harbor Point',
      interests: ['Podcasts', 'Cycling', 'Coffee'],
      likes: 123,
    },
    {
      id: '11',
      image: require('../../assets/images/overlay3.png'),
      name: 'Olivia',
      age: 25,
      location: 'North Avenue',
      interests: ['Dancing', 'Travel', 'Design'],
      likes: 111,
    },
    {
      id: '12',
      image: require('../../assets/images/overlay4.png'),
      name: 'Daniel',
      age: 30,
      location: 'Bayside',
      interests: ['Golf', 'Wine', 'Food'],
      likes: 96,
    },
    {
      id: '13',
      image: require('../../assets/images/overlay1.png'),
      name: 'Chloe',
      age: 19,
      location: 'Garden Lane',
      interests: ['Skincare', 'Art', 'Cafe Hopping'],
      likes: 89,
    },
    {
      id: '14',
      image: require('../../assets/images/overlay2.png'),
      name: 'James',
      age: 32,
      location: 'Old Town',
      interests: ['Photography', 'Hiking'],
      likes: 121,
    },
    {
      id: '15',
      image: require('../../assets/images/overlay3.png'),
      name: 'Hannah',
      age: 24,
      location: 'River Walk',
      interests: ['Yoga', 'Music', 'Brunch'],
      likes: 99,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPeople, setLikedPeople] = useState([]);
  const position = useRef(new Animated.ValueXY()).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastLabel, setToastLabel] = useState(null);

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [currentIndex]);

  const showToast = label => {
    setToastLabel(label);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setToastLabel(null));
  };

  // Placeholder only — swap for a real API call once the backend
  // for storing liked profiles is ready. For now this just keeps
  // liked people in local state for this screen.
  const handleLikePerson = person => {
    setLikedPeople(prev => [...prev, person]);
    console.log('Liked (pending backend integration):', person.name);
  };

  const handlePassPerson = person => {
    console.log('Passed:', person.name);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          forceSwipe('up');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const forceSwipe = direction => {
    const x =
      direction === 'right'
        ? SCREEN_WIDTH * 1.5
        : direction === 'left'
        ? -SCREEN_WIDTH * 1.5
        : 0;
    const y = direction === 'up' ? -SCREEN_WIDTH * 1.5 : 0;
    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = direction => {
    const person = people[currentIndex];
    if (direction === 'right') {
      handleLikePerson(person);
      showToast('like');
    } else if (direction === 'left') {
      handlePassPerson(person);
      showToast('pass');
    } else if (direction === 'up') {
      navigation.navigate('PersonProfile', {
        person: {
          image: person.image,
          name: person.name,
          age: person.age,
          location: person.location,
          interests: person.interests,
          likes: person.likes,
        },
      });
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
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-18deg', '0deg', '18deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [20, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderCards = () => {
    if (currentIndex >= people.length) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={32} color="#D4A84A" />
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptySubtitle}>
            No more profiles nearby — check back soon.
          </Text>
        </View>
      );
    }

    return people
      .map((person, index) => {
        if (index < currentIndex || index > currentIndex + 2) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={person.id}
              style={[styles.cardWrapper, getCardStyle()]}
              {...panResponder.panHandlers}
            >
              <SwipeCard
                person={person}
                onPress={() =>
                  navigation.navigate('PersonProfile', {
                    person: {
                      image: person.image,
                      name: person.name,
                      age: person.age,
                      location: person.location,
                      interests: person.interests,
                      likes: person.likes,
                    },
                  })
                }
              />

              <Animated.View
                style={[
                  styles.stamp,
                  styles.likeStamp,
                  { opacity: likeOpacity },
                ]}
              >
                <Text style={styles.likeStampText}>LIKE</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.stamp,
                  styles.nopeStamp,
                  { opacity: nopeOpacity },
                ]}
              >
                <Text style={styles.nopeStampText}>PASS</Text>
              </Animated.View>
            </Animated.View>
          );
        }

        const depth = index - currentIndex;
        return (
          <Animated.View
            key={person.id}
            style={[
              styles.cardWrapper,
              styles.stackedCard,
              { top: 8 * depth, transform: [{ scale: 1 - 0.04 * depth }] },
            ]}
          >
            <SwipeCard person={person} />
          </Animated.View>
        );
      })
      .reverse(); // current card renders last so it sits visually on top
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <AppHeader title="Matches" />

      <View style={styles.deckArea}>{renderCards()}</View>

      {currentIndex < people.length && (
        <View style={styles.actionsRow}>
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
            toastLabel === 'like' ? styles.toastLike : styles.toastPass,
            { opacity: toastOpacity },
          ]}
        >
          <Ionicons
            name={toastLabel === 'like' ? 'heart' : 'close-circle'}
            size={16}
            color={toastLabel === 'like' ? '#D4A84A' : '#E90000'}
          />
          <Text style={styles.toastText}>
            {toastLabel === 'like' ? '  Liked' : '  Passed'}
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  deckArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  stackedCard: {
    zIndex: -1,
  },
  stamp: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: 8,
  },
  likeStamp: {
    left: 24,
    borderColor: '#D4A84A',
    transform: [{ rotate: '-20deg' }],
  },
  likeStampText: {
    color: '#D4A84A',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  nopeStamp: {
    right: 24,
    borderColor: '#E90000',
    transform: [{ rotate: '20deg' }],
  },
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
    marginBottom: '35%',
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
  passBtn: {
    borderColor: '#E90000',
  },
  likeBtn: {
    borderColor: '#D4A84A',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  toast: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 50,
  },
  toastLike: {
    borderColor: '#D4A84A',
  },
  toastPass: {
    borderColor: '#E90000',
  },
  toastText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
