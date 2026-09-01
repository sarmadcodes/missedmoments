import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MessageBubble from '../components/MessageBubble';

const myAvatar = require('../assets/images/overlay2.png');

const ChattingScreen = ({ navigation, route }) => {
  const routeChat = route?.params?.chat || route?.params?.person || {};
  const chat = {
    title: routeChat.title || routeChat.name || 'Match',
    image: routeChat.image,
    location: routeChat.location || 'Matched',
    ...routeChat,
  };
  const [message, setMessage] = useState('');
  // Local-only for now; swap for the conversation from the API (and a socket
  // subscription) once chat is wired to the backend.
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const handleSend = () => {
    const text = message.trim();
    if (!text) {
      return;
    }
    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        sender: 'me',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setMessage('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>

        <Image source={chat?.image} style={styles.headerAvatar} />

        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chat?.title}
          </Text>
          <Text style={styles.headerSubtitle}>{chat?.location || 'Matched'}</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="call-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        >
          <LinearGradient
            colors={['#3A0000', '#000']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.matchBanner}
          >
            <View style={styles.ringsIcon}>
              <View style={styles.ring} />
              <View style={[styles.ring, styles.ringOverlap]} />
            </View>
            <Text style={styles.matchTitle}>Moment Became a match</Text>
            <Text style={styles.matchSubtitle}>
              {chat?.title ? `Say hello to ${chat.title}` : 'Say the thing you almost said'}
            </Text>
          </LinearGradient>

          {messages.length > 0 ? (
            <>
              <Text style={styles.todayLabel}>Today</Text>
              {messages.map(item => (
                <MessageBubble
                  key={item.id}
                  item={item}
                  avatar={item.sender === 'me' ? myAvatar : chat?.image}
                  name={item.sender === 'me' ? 'David' : chat?.title}
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#D4A84A" />
              <Text style={styles.emptyStateTitle}>Start the conversation</Text>
              <Text style={styles.emptyStateText}>
                Say hello to {chat?.title} and start a new moment.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Say the thing you almost said"
            placeholderTextColor="#777"
            style={styles.input}
            multiline
            maxLength={2000}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={{ marginLeft: 8, opacity: message.trim() ? 1 : 0.4 }}
            disabled={!message.trim()}
            onPress={handleSend}
          >
            <Ionicons name="send" size={16} color="#D4A84A" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChattingScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
    marginLeft: 10,
    resizeMode: 'cover',
  },
  headerTextBlock: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    color: '#D4A84A',
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#777',
    fontSize: 10,
    marginTop: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  matchBanner: {
    marginTop: 15,
    marginBottom: 25,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4A0000',
    paddingVertical: 18,
    alignItems: 'center',
  },
  ringsIcon: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ring: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D4A84A',
  },
  ringOverlap: {
    marginLeft: -7,
  },
  matchTitle: {
    color: '#D4A84A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  matchSubtitle: {
    color: '#FFFFFFDE',
    fontSize: 11,
    // fontStyle: 'italic',
  },
  todayLabel: {
    textAlign: 'center',
    color: '#777',
    fontSize: 10,
    marginBottom: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 18,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFFDE',
    fontSize: 13,
    paddingVertical: 0,
  },
});