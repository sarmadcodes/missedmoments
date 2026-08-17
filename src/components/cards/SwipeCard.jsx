import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 30; // matches paddingHorizontal:15 on both sides
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.5;
export { SCREEN_WIDTH };

const SwipeCard = ({ person, onPress }) => {
  const interests = person.interests || ['Music', 'Travel'];
  const likes = person.likes ?? 120;

  return (
    <View style={styles.card}>
      <Image source={person.image} style={styles.image} />
      <LinearGradient
        colors={['transparent', '#000000E6']}
        style={styles.gradient}
      >
        <Text style={styles.name}>
          {person.name}
          {person.age ? `, ${person.age}` : ''}
        </Text>

        {person.location ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color="#D4A84A" />
            <Text style={styles.location}>{person.location}</Text>
          </View>
        ) : null}

        <View style={styles.detailRow}>
          <View style={styles.infoPill}>
            <Ionicons name="heart-outline" size={11} color="#D4A84A" />
            <Text style={styles.infoText}>{likes} likes</Text>
          </View>
          <View style={styles.infoPill}>
            <Ionicons name="sparkles-outline" size={11} color="#D4A84A" />
            <Text style={styles.infoText}>
              {interests.slice(0, 2).join(' • ')}
            </Text>
          </View>
          <TouchableOpacity onPress={onPress}
            activeOpacity={0.66}
            style={styles.swipeUpIndicator}
          >
            <Ionicons name="arrow-up" size={12} color="#D4A84A" />
            <Text style={styles.swipeUpText}>View</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42%',
    justifyContent: 'flex-end',
    padding: 18,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  location: {
    color: '#D4A84A',
    fontSize: 12,
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(212,168,74,0.25)',
    maxWidth: '100%',
  },
  infoText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 5,
  },
  swipeUpIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: '#000000a1',
    borderRadius: 50,
  },
  swipeUpText: {
    color: '#D4A84A',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default SwipeCard;
