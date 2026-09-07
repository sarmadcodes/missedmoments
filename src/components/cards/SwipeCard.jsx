import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { MAX_FONT_SCALE } from '../../theme/typography';

// Horizontal padding applied by the screens that host this card.
const SCREEN_GUTTER = 15;

/**
 * Card dimensions, recalculated whenever the window changes.
 *
 * These used to be module-level constants derived from `Dimensions.get()`,
 * which froze them at app launch and left the deck mis-sized after a rotation
 * or in split-screen.
 */
export const useCardMetrics = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return {
    screenWidth: width,
    cardWidth: width - SCREEN_GUTTER * 2,
    // In landscape half the height is far too short to be readable, so lean on
    // width instead and clamp so the card never overruns the viewport.
    cardHeight: Math.min(isLandscape ? height * 0.62 : height * 0.5, height * 0.7),
    swipeThreshold: width * 0.28,
  };
};

const SwipeCard = ({ person, onPress }) => {
  const { cardWidth, cardHeight } = useCardMetrics();
  // The backend only ever sends a shared-interest count and a computed
  // match score for a nearby person, never their interest names or a like
  // count -- there's no such data to show. Both pills below reflect that.
  const sharedInterests = person.sharedInterests ?? 0;
  const matchPercentage = person.matchPercentage;

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <Image source={person.image} style={styles.image} />
      <LinearGradient
        colors={['transparent', '#000000E6']}
        style={styles.gradient}
      >
        <Text style={styles.name} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {person.name}
          {person.age ? `, ${person.age}` : ''}
        </Text>

        {person.location ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color="#D4A84A" />
            <Text
              style={styles.location}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {person.location}
            </Text>
          </View>
        ) : null}

        <View style={styles.detailRow}>
          {matchPercentage != null ? (
            <View style={styles.infoPill}>
              <Ionicons name="heart-outline" size={11} color="#D4A84A" />
              <Text style={styles.infoText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                {matchPercentage}% match
              </Text>
            </View>
          ) : null}
          {sharedInterests > 0 ? (
            <View style={styles.infoPill}>
              <Ionicons name="sparkles-outline" size={11} color="#D4A84A" />
              <Text
                style={styles.infoText}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {sharedInterests} shared interest{sharedInterests === 1 ? '' : 's'}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.66}
            style={styles.swipeUpIndicator}
          >
            <Ionicons name="arrow-up" size={12} color="#D4A84A" />
            <Text
              style={styles.swipeUpText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
    flexShrink: 1,
  },
  infoText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 5,
    flexShrink: 1,
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
