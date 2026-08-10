import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MomentCard = ({
  image,
  title,
  location,
  age,
  timing,
  matchPercentage,
  onPress,
}) => {
  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(prev => !prev);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.66}
      style={styles.card}
      onPress={onPress}
    >
      {/* Image */}
      <Image source={image} style={styles.image} />

      {/* Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={14}
            color="#FFFFFFDE"
            style={styles.icon}
          />

          <Text style={styles.infoText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        {/* Age + Timing */}
        <View style={styles.infoRow}>
          <View style={styles.smallInfo}>
            <Ionicons name="person-circle" size={16} color="#FFFFFFDE" />

            <Text style={styles.infoText}>{age} years</Text>
          </View>

          <View style={styles.smallInfo}>
            <Ionicons name="time" size={16} color="#FFFFFFDE" />

            <Text style={styles.infoText}>{timing}</Text>
          </View>
        </View>

        {/* Match */}
        <View style={styles.matchRow}>
          <Text style={styles.matchText}>Moment match {matchPercentage}%</Text>

          <View style={styles.progressBackground}>
            <View
              style={[styles.progressFill, { width: `${matchPercentage}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Heart */}
      <TouchableOpacity
        style={styles.heartButton}
        activeOpacity={0.7}
        onPress={handleHeartPress}
      >
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={25}
          color={liked ? '#FF3B30' : '#D4A84A'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 120,
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 10,
  },

  // IMAGE
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4A84A',
    resizeMode: 'cover',
  },

  // DETAILS
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 10,
  },

  title: {
    color: '#D4A84A',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  smallInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  icon: {
    // marginRight: 7,
  },

  infoText: {
    color: '#ffffffde',
    fontSize: 12,
    fontWeight: '400',
    marginLeft:5
  },

  // MATCH
  matchRow: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  matchText: {
    color: '#FFFFFFDE',
    fontSize: 12,
    fontWeight:'600',
    marginRight: 10,
  },

  progressBackground: {
    width: 75,
    height: 7,
    borderRadius: 50,
    backgroundColor: '#333',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#B60406',
    borderRadius: 50,
  },

  // HEART
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MomentCard;
