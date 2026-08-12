import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const MessageBubble = ({ item, avatar, name }) => {
  const isMe = item.sender === 'me';

  return (
    <View style={styles.messageContainer}>
      <View style={[styles.row, { flexDirection: isMe ? 'row-reverse' : 'row' }]}>
        {/* Avatar + name */}
        <View style={styles.avatarBlock}>
          <Image source={avatar} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {/* Bubble */}
        <View style={styles.bubbleWrapper}>
          {isMe ? (
            <LinearGradient
              colors={['#B60406', '#1A0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bubble}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.timeText}>{item.time}</Text>
                {item.seen && (
                  <View style={styles.seenRow}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFFAA" />
                    <Text style={styles.seenText}> Seen</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          ) : (
            <View style={[styles.bubble, styles.bubbleOther]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.timeText}>{item.time}</Text>
                {item.seen && (
                  <View style={styles.seenRow}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFFAA" />
                    <Text style={styles.seenText}> Seen</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Heart reaction, pinned to the far right of the row */}
      {item.liked && (
        <Ionicons name="heart" size={16} color="#E90000" style={styles.likeIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 22,
    position: 'relative',
  },
  row: {
    alignItems: 'flex-end',
  },
  avatarBlock: {
    width: 46,
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
    resizeMode: 'cover',
  },
  name: {
    color: '#D4A84A',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  bubbleWrapper: {
    flexShrink: 1,
    maxWidth: '68%',
    marginHorizontal: 8,
  },
  bubble: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOther: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
  },
  messageText: {
    color: '#FFFFFFDE',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    color: '#FFFFFF88',
    fontSize: 8,
    marginRight: 8,
  },
  seenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seenText: {
    color: '#FFFFFF88',
    fontSize: 8,
  },
  likeIcon: {
    position: 'absolute',
    right: 4,
    bottom: -16,
  },
});

export default MessageBubble;