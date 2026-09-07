import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Loading, ErrorState } from '../../components/ScreenState';
import { useTabBarSpacer } from '../../theme/layout';
import { users as usersApi } from '../../services/endpoints';
import { useAuth } from '../../context/AuthContext';
import { avatarSource, friendlyError } from '../../utils/format';
import { otherTestAccount } from '../../config/testAccounts';

const accountItems = [
  {
    key: 'privacy',
    icon: 'lock-closed-outline',
    label: 'Privacy & Settings',
    screen: 'SettingScreen',
  },
  {
    key: 'blocked',
    icon: 'person-remove-outline',
    label: 'Blocked Users',
    screen: 'BlockUsers',
  },
];

const StatCard = ({ icon, value, label }) => (
  <LinearGradient
    colors={['#B60406', '#3A0000']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.statCard}
  >
    <Ionicons name={icon} size={16} color="#D4A84A" style={{ marginBottom: 6 }} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </LinearGradient>
);

const AccountRow = ({ icon, label, onPress, danger, isLast }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.accountRow, !isLast && styles.accountRowBorder]}
  >
    <View style={[styles.rowIconCircle, danger && styles.rowIconCircleDanger]}>
      <Ionicons name={icon} size={16} color={danger ? '#FF3B30' : '#fff'} />
    </View>
    <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
    {!danger && <Ionicons name="chevron-forward" size={16} color="#777" />}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();
  const { user, signIn, signOut, refreshUser } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(user);
  const [switching, setSwitching] = useState(false);

  // TESTING UTILITY -- see src/config/testAccounts.js. Remove before a
  // production submission.
  const handleSwitchAccount = async () => {
    const target = otherTestAccount(profile?.email);
    setSwitching(true);
    try {
      await signOut();
      await signIn(target.email, target.password);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSwitching(false);
    }
  };

  const load = useCallback(async () => {
    setError(null);
    try {
      const me = await usersApi.me();
      setProfile(me);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
  };

  if (!profile && error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppIcon />
        <ErrorState message={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppIcon />
        <Loading label="Loading your profile" />
      </SafeAreaView>
    );
  }

  const stats = [
    {
      key: 'liked',
      icon: 'heart',
      value: profile.stats?.likedYou ?? 0,
      label: 'Liked you',
    },
    {
      key: 'matches',
      icon: 'sparkles-outline',
      value: profile.stats?.matches ?? 0,
      label: 'Matches',
    },
    {
      key: 'age',
      icon: 'person-outline',
      value: profile.age ?? '--',
      label: 'Age',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
              refreshUser().catch(() => {});
            }}
            tintColor="#D4A84A"
            colors={['#D4A84A']}
          />
        }
      >
        <View style={{ paddingBottom: tabBarSpacer }}>
          <AppHeader title="Profile" />

          <View style={styles.profileBlock}>
            <View style={styles.avatarWrapper}>
              <Image source={avatarSource(profile.photoUrl, profile.userId)} style={styles.avatar} />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraBtn}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Ionicons name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.name} numberOfLines={1}>
                  {profile.name}
                </Text>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color="#D4A84A"
                  style={{ marginLeft: 6 }}
                />
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="mail-outline" size={11} color="#ccc" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {' '}
                  {profile.email}
                </Text>
              </View>

              {profile.city ? (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={11} color="#ccc" />
                  <Text style={styles.metaText}> {profile.city}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <AppButton
            title="Edit Profile"
            height={40}
            gradientColors={['#A26B20', '#FFCC74', '#A26B20']}
            textColor="#000"
            borderWidth={0}
            leftIcon="pencil-outline"
            onPress={() => navigation.navigate('EditProfile')}
          />

          <View style={styles.statsRow}>
            {stats.map(s => (
              <StatCard key={s.key} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </View>

          {error ? <Text style={styles.errorLine}>{error}</Text> : null}

          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            {accountItems.map((item, index) => (
              <AccountRow
                key={item.key}
                icon={item.icon}
                label={item.label}
                isLast={index === accountItems.length - 1}
                onPress={() => navigation.navigate(item.screen)}
              />
            ))}
          </View>

          {/* TESTING UTILITY -- remove this whole section before a
              production submission. See src/config/testAccounts.js. */}
          <Text style={styles.sectionTitle}>Testing</Text>
          <View style={styles.card}>
            <AccountRow
              icon="swap-horizontal-outline"
              label={
                switching
                  ? 'Switching...'
                  : `Switch to ${otherTestAccount(profile?.email).label}`
              }
              isLast
              onPress={switching ? undefined : handleSwitchAccount}
            />
          </View>

          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <AccountRow
              icon="refresh-outline"
              label="Logout"
              isLast
              onPress={() => setLogoutModalVisible(true)}
            />
          </View>

          <View style={[styles.card, { marginTop: 12 }]}>
            <AccountRow
              icon="trash-outline"
              label="Delete Account"
              danger
              isLast
              onPress={() => navigation.navigate('DeleteAccount')}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.noButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.yesButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  avatarWrapper: { width: 70, height: 70, position: 'relative' },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
    resizeMode: 'cover',
  },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#B60406',
    padding: 5,
    borderRadius: 50,
  },
  name: { color: '#fff', fontSize: 17, fontWeight: '700', flexShrink: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  metaText: { color: '#ccc', fontSize: 11, flexShrink: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#ffffffcc', fontSize: 10, marginTop: 2 },
  errorLine: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 12,
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  accountRowBorder: { borderBottomWidth: 1, borderBottomColor: '#1e1e1e' },
  rowIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconCircleDanger: { backgroundColor: '#2a0d0d' },
  rowLabel: { flex: 1, color: '#fff', fontSize: 13 },
  rowLabelDanger: { color: '#FF3B30' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000bb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  confirmModal: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
  },
  noButton: { borderColor: '#555' },
  noButtonText: { color: '#ccc', fontWeight: '700', fontSize: 13 },
  yesButton: { borderColor: '#B60406', backgroundColor: '#B60406' },
  yesButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
