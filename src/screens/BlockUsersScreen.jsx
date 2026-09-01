import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import { MAX_FONT_SCALE } from '../theme/typography';

// Placeholder list — replace with GET /users/blocked once the API is wired.
const initialBlocked = [
  {
    id: '1',
    name: 'Marcus',
    image: require('../assets/images/overlay2.png'),
    blockedAt: 'Blocked 3 days ago',
  },
  {
    id: '2',
    name: 'Daniel',
    image: require('../assets/images/overlay4.png'),
    blockedAt: 'Blocked 2 weeks ago',
  },
];

const BlockUsersScreen = ({ navigation }) => {
  const [blocked, setBlocked] = useState(initialBlocked);

  const handleUnblock = id =>
    setBlocked(prev => prev.filter(item => item.id !== id));

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Image source={item.image} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {item.name}
        </Text>
        <Text style={styles.meta} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {item.blockedAt}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item.id)}
      >
        <Text style={styles.unblockText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Unblock
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <AppIcon />
      <AppHeader
        title="Blocked Users"
        subtitle="People you've blocked can't see your profile or message you."
        rightContent={
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={blocked}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          blocked.length ? styles.listContent : styles.emptyContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark-outline" size={30} color="#D4A84A" />
            <Text style={styles.emptyTitle}>No blocked users</Text>
            <Text style={styles.emptyText}>
              Anyone you block will show up here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BlockUsersScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  backBtn: { padding: 10, backgroundColor: '#333', borderRadius: 50 },
  listContent: { paddingBottom: 24 },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: { width: 46, height: 46, borderRadius: 50 },
  name: { color: '#fff', fontSize: 14, fontWeight: '600' },
  meta: { color: '#8E8E8E', fontSize: 11, marginTop: 3 },
  unblockBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
  },
  unblockText: { color: '#D4A84A', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingHorizontal: 30 },
  emptyTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 10 },
  emptyText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
