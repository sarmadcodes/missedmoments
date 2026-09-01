import {
  ActivityIndicator,
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MessageBubble from '../components/MessageBubble';
import { ErrorState } from '../components/ScreenState';
import { chat as chatApi } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import { avatarSource, friendlyError } from '../utils/format';

const ChattingScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const matchId = route?.params?.matchId;
  const routeChat = route?.params?.chat || {};

  const chat = {
    title: routeChat.title || routeChat.name || 'Match',
    image: routeChat.image || avatarSource(routeChat.photoUrl),
    location: routeChat.location || 'Matched',
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(Boolean(matchId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    if (!matchId) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const result = await chatApi.messages(matchId);
      setMessages(result.messages ?? []);
      // Opening the thread is what clears the unread badge.
      chatApi.markRead(matchId).catch(() => {});
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || !matchId || sending) {
      return;
    }

    setSending(true);
    setMessage('');
    try {
      const sent = await chatApi.send(matchId, text);
      setMessages(prev => [...prev, sent]);
    } catch (err) {
      // Put the text back so nothing is silently lost.
      setMessage(text);
      setError(friendlyError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>

        <Image source={chat.image} style={styles.headerAvatar} />

        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chat.title}
          </Text>
          <Text style={styles.headerSubtitle}>{chat.location}</Text>
        </View>

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
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
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
            <Text style={styles.matchTitle}>Moment became a match</Text>
            <Text style={styles.matchSubtitle}>Say hello to {chat.title}</Text>
          </LinearGradient>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#D4A84A" />
            </View>
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : messages.length > 0 ? (
            <>
              <Text style={styles.todayLabel}>Messages</Text>
              {messages.map(item => {
                const mine = item.senderId === user?.userId;
                return (
                  <MessageBubble
                    key={item.id}
                    item={{
                      ...item,
                      sender: mine ? 'me' : 'them',
                      text: item.body,
                      time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    }}
                    avatar={mine ? avatarSource(null) : chat.image}
                    name={mine ? user?.name || 'You' : chat.title}
                  />
                );
              })}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#D4A84A" />
              <Text style={styles.emptyStateTitle}>Start the conversation</Text>
              <Text style={styles.emptyStateText}>
                Say hello to {chat.title} and start a new moment.
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
            editable={!sending && Boolean(matchId)}
          />
          <TouchableOpacity
            style={{ marginLeft: 8, opacity: message.trim() && !sending ? 1 : 0.4 }}
            disabled={!message.trim() || sending}
            onPress={handleSend}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#D4A84A" />
            ) : (
              <Ionicons name="send" size={16} color="#D4A84A" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChattingScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  backBtn: {
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 50,
    marginRight: 10,
  },
  headerAvatar: { width: 38, height: 38, borderRadius: 50 },
  headerTextBlock: { flex: 1, marginLeft: 10 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  headerSubtitle: { color: '#8E8E8E', fontSize: 11, marginTop: 2 },
  iconBtn: { padding: 8 },
  centered: { paddingVertical: 40, alignItems: 'center' },
  matchBanner: {
    alignItems: 'center',
    paddingVertical: 22,
    borderRadius: 14,
    marginBottom: 18,
  },
  ringsIcon: { flexDirection: 'row', marginBottom: 8 },
  ring: {
    width: 16,
    height: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#D4A84A',
  },
  ringOverlap: { marginLeft: -6 },
  matchTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  matchSubtitle: { color: '#bbb', fontSize: 12, marginTop: 4 },
  todayLabel: {
    color: '#777',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyState: { alignItems: 'center', paddingTop: 30, paddingHorizontal: 30 },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: { flex: 1, color: '#fff', fontSize: 13, maxHeight: 100, paddingVertical: 0 },
});
