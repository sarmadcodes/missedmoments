import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTabBarSpacer } from '../../theme/layout';

// Dummy profile data — swap for real data once the API is wired up
const dummyProfile = {
  avatar: require('../../assets/images/overlay1.png'),
  name: 'Ben Wayne',
  username: '@Ben Wayne',
  age: 28,
  joined: 'Join 2 months ago',
  location: 'Blue door cafe',
  stats: [
    { key: 'seen', icon: 'eye-outline', value: 150, label: 'Seen By' },
    { key: 'liked', icon: 'heart', value: 190, label: 'Liked you' },
    { key: 'matches', icon: 'sparkles-outline', value: 10, label: 'Matches' },
  ],
};

const accountItems = [
  // { key: 'notification', icon: 'notifications-outline', label: 'Notification', screen: 'Notifications' },
  { key: 'privacy', icon: 'lock-closed-outline', label: 'Privacy', screen: 'SettingScreen' },
  { key: 'visibility', icon: 'settings', label: 'Account Settings', screen: 'SettingScreen' },
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
  const [avatar, setAvatar] = useState(dummyProfile.avatar);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets && response.assets[0];
        if (asset?.uri) {
          setAvatar({ uri: asset.uri });
        }
      },
    );
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: tabBarSpacer }}>
          <AppHeader
            title="Profile"
            // rightContent={
            //   <TouchableOpacity
            //     activeOpacity={0.66}
            //     style={{ padding: 10, backgroundColor: '#333', borderRadius: 50 }}
            //     onPress={() => navigation.navigate('SettingScreen')}
            //   >
            //     <Ionicons name="settings" size={20} color={'#fff'} />
            //   </TouchableOpacity>
            // }
          />

          {/* Profile header */}
          <View style={styles.profileBlock}>
            <View style={styles.avatarWrapper}>
              <Image source={avatar} style={styles.avatar} />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraBtn}
                onPress={handlePickImage}
              >
                <Ionicons name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.name}>{dummyProfile.name}</Text>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color="#D4A84A"
                  style={{ marginLeft: 6 }}
                />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{dummyProfile.username}</Text>
                <View style={styles.metaDivider} />
                <Ionicons name="person-outline" size={11} color="#ccc" />
                <Text style={styles.metaText}> {dummyProfile.age} years</Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={11} color="#ccc" />
                <Text style={styles.metaText}> {dummyProfile.joined}</Text>
                <View style={styles.metaDivider} />
                <Ionicons name="location-outline" size={11} color="#ccc" />
                <Text style={styles.metaText}> {dummyProfile.location}</Text>
              </View>
            </View>
          </View>

          {/* Edit profile — swap props to match your real AppButton API */}
          <AppButton
            title="Edit Profile"
            icon="pencil-outline"
            height={40}
            gradientColors={['#A26B20', '#FFCC74', '#A26B20']}
            textColor='#000'
            borderWidth={0}
            leftIcon="pencil-outline"
            onPress={() => navigation.navigate('EditProfile')}
          />

          {/* Stats */}
          <View style={styles.statsRow}>
            {dummyProfile.stats.map(s => (
              <StatCard key={s.key} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </View>

          {/* Account */}
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

          {/* Account Actions */}
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <AccountRow icon="refresh-outline" label="Logout" isLast onPress={handleLogout} />
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
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    position: 'relative',
  },
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
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    color: '#ccc',
    fontSize: 11,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#777',
    marginHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A0000',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    color: '#FFFFFFAA',
    fontSize: 9,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  accountRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  rowIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconCircleDanger: {
    backgroundColor: '#3A0000',
  },
  rowLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  rowLabelDanger: {
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmModal: {
    width: '80%',
    backgroundColor: '#111111de',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#444444de',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 7,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noButton: {
    backgroundColor: '#D4A84A',
  },
  noButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  yesButton: {
    backgroundColor: '#B60406',
  },
  yesButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});