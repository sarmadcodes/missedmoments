import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ChatCard = ({
  image,
  title,
  time,
  message,
  unreadCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />

        {/* Online Indicator */}
        <View style={styles.onlineDot} />
      </View>

      {/* Chat Content */}
      <View style={styles.contentContainer}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.time}>{time}</Text>
        </View>

        {/* Message */}
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 85,
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
    marginBottom:10
  },

  // IMAGE
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },

  onlineDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 50,
    backgroundColor: '#B60406',
  },

  // CONTENT
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 25,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  title: {
    flex: 1,
    color: '#D4A84A',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },

  time: {
    color: '#FFFFFFDE',
    fontSize: 8,
    fontWeight: '400',
  },

  message: {
    color: '#FFFFFFDE',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
  },

  // UNREAD BADGE
  unreadBadge: {
    position: 'absolute',
    right: 7,
    top: 14,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 50,
    backgroundColor: '#E90000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  unreadText: {
    color: '#FFFFFFDE',
    fontSize: 8,
    fontWeight: '700',
  },
});

export default ChatCard;
