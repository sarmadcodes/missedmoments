import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import ChatCard from '../../components/cards/ChatCard';
import { Loading, ErrorState, EmptyState } from '../../components/ScreenState';
import { useTabBarSpacer } from '../../theme/layout';
import { likes as likesApi } from '../../services/endpoints';
import { avatarSource, timeAgo, friendlyError } from '../../utils/format';

const ChatsScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();
  const [searchText, setSearchText] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const result = await likesApi.matches();
      setMatches(result.matches ?? []);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const query = searchText.trim().toLowerCase();
  const filtered = query
    ? matches.filter(
        m =>
          m.name?.toLowerCase().includes(query) ||
          m.lastMessage?.toLowerCase().includes(query),
      )
    : matches;

  // Kept as an element rather than a component so React reconciles it in
  // place; passing a new function to ListHeaderComponent remounts the header
  // on every keystroke and the search field loses focus.
  const listHeader = (
    <View>
      <AppHeader title="Inbox" />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#777" style={styles.searchIcon} />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="#777"
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return <Loading label="Loading your conversations" />;
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
    if (query) {
      return (
        <EmptyState
          icon="search-outline"
          title="No results"
          text={`Nothing matches "${searchText}".`}
        />
      );
    }
    return (
      <EmptyState
        icon="chatbubbles-outline"
        title="No conversations yet"
        text="When a moment becomes mutual, the conversation shows up here."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <FlatList
        data={filtered}
        keyExtractor={item => item.matchId}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: tabBarSpacer, flexGrow: 1 }}
        ListEmptyComponent={renderEmpty()}
        initialNumToRender={8}
        windowSize={9}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor="#D4A84A"
            colors={['#D4A84A']}
          />
        }
        renderItem={({ item }) => (
          <ChatCard
            image={avatarSource(item.photoUrl, item.userId)}
            title={item.name}
            time={timeAgo(item.lastMessageAt || item.matchedAt)}
            message={item.lastMessage || 'Say the thing you almost said'}
            unreadCount={item.unreadCount || 0}
            onPress={() =>
              navigation.navigate('ChattingScreen', {
                matchId: item.matchId,
                chat: {
                  title: item.name,
                  image: avatarSource(item.photoUrl, item.userId),
                  userId: item.userId,
                },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 10,
    marginBottom: 25,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    color: '#ffffffde',
    fontSize: 14,
    paddingVertical: 0,
  },
});
