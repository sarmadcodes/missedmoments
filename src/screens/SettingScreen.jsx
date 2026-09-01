import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { users as usersApi } from '../services/endpoints';
import { friendlyError } from '../utils/format';

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeaderRow}>
    <Ionicons
      name={icon}
      size={15}
      color="#fff"
      style={{ marginRight: 8 }}
    />
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const ToggleRow = ({ icon, title, subtitle, value, onValueChange, isLast }) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>
    <View style={styles.rowIconCircle}>
      <Ionicons name={icon} size={16} color="#fff" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#333', true: '#D4A84A' }}
      thumbColor="#fff"
      ios_backgroundColor="#333"
    />
  </View>
);

const NavRow = ({ icon, title, onPress, danger, isLast }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.row, !isLast && styles.rowBorder]}
  >
    <View style={[styles.rowIconCircle, danger && styles.rowIconCircleDanger]}>
      <Ionicons name={icon} size={16} color={danger ? '#FF3B30' : '#fff'} />
    </View>
    <Text
      style={[styles.rowTitle, { flex: 1 }, danger && styles.rowTitleDanger]}
    >
      {title}
    </Text>
    <Ionicons name="chevron-forward" size={16} color="#777" />
  </TouchableOpacity>
);

const SettingScreen = ({ navigation }) => {
  const [invisibleMode, setInvisibleMode] = useState(false);
  const [discoverableNearby, setDiscoverableNearby] = useState(true);
  const [allNotifications, setAllNotifications] = useState(true);
  const [newMatchAlert, setNewMatchAlert] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      usersApi
        .me()
        .then(me => {
          if (!active) return;
          setInvisibleMode(Boolean(me.isInvisible));
          setDiscoverableNearby(Boolean(me.isDiscoverable));
          setAllNotifications(Boolean(me.notifyAll));
          setNewMatchAlert(Boolean(me.notifyNewMatch));
        })
        .catch(err => active && setError(friendlyError(err)));
      return () => {
        active = false;
      };
    }, []),
  );

  /**
   * Optimistic: flip the switch immediately, then persist. If the request
   * fails the switch goes back, so the UI never claims a setting was saved
   * when it was not.
   */
  const persist = (field, value, setter) => {
    setter(value);
    setError(null);
    usersApi.update({ [field]: value }).catch(err => {
      setter(!value);
      setError(friendlyError(err));
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 40 }}>
          <AppHeader title="Settings" />
          {error ? <Text style={styles.settingsError}>{error}</Text> : null}

          {/* Visibility */}
          <SectionHeader icon="eye-outline" title="Visibility" />
          <View style={styles.card}>
            <ToggleRow
              icon="eye-off-outline"
              title="Invisible Mode"
              subtitle="Scroll without being seen"
              value={invisibleMode}
              onValueChange={v => persist('isInvisible', v, setInvisibleMode)}
            />
            <ToggleRow
              icon="navigate-outline"
              title="Discoverable Nearby"
              subtitle="Show me in others nearby feed"
              value={discoverableNearby}
              onValueChange={v =>
                persist('isDiscoverable', v, setDiscoverableNearby)
              }
              isLast
            />
          </View>

          {/* Notification */}
          <SectionHeader icon="notifications-outline" title="Notification" />
          <View style={styles.card}>
            <ToggleRow
              icon="notifications-outline"
              title="All Notifications"
              subtitle="Get notified about everything"
              value={allNotifications}
              onValueChange={v => persist('notifyAll', v, setAllNotifications)}
            />
            <ToggleRow
              icon="alert-circle-outline"
              title="New Match Alert"
              subtitle="A small chime when it's mutual"
              value={newMatchAlert}
              onValueChange={v => persist('notifyNewMatch', v, setNewMatchAlert)}
              isLast
            />
          </View>

          {/* Account */}
          <SectionHeader icon="person-outline" title="Account" />
          <View style={styles.card}>
            <NavRow
              icon="lock-closed-outline"
              title="Change Your Password"
              onPress={() => navigation.navigate('ChangePasswordScreen')}
            />
            <NavRow
              icon="person-remove-outline"
              title="Block Users"
              onPress={() => navigation.navigate('BlockUsers')}
            />
            <NavRow
              icon="trash-outline"
              title="Delete Account"
              danger
              isLast
              onPress={() => navigation.navigate('DeleteAccount')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  settingsError: {
    color: '#FF6B6B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  clearText: {
    color: '#999',
    fontSize: 13,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  rowIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconCircleDanger: {
    backgroundColor: '#3A0000',
  },
  rowTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rowTitleDanger: {
    color: '#FF3B30',
  },
  rowSubtitle: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
  },
});
