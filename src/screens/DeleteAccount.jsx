import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../components/AppButton';
import { Alert } from 'react-native';
import { users as usersApi } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import { friendlyError } from '../utils/format';

const consequences = [
  'Your profile and photos will be permanently removed',
  'You will lose all your matches, chats, and likes',
  'Your activity and data will be deleted from our servers',
  "You won't be able to recover your account",
];

const alternatives = [
  {
    key: 'break',
    icon: 'pause',
    title: 'Take a break instead',
    subtitle:
      'You can temporarily disable your account if you just need a break.',
  },
  {
    key: 'download',
    icon: 'download',
    title: 'Download your data',
    subtitle:
      'Save a copy of your data before permanently deleting your account.',
  },
  {
    key: 'feedback',
    icon: 'chatbubble-ellipses',
    title: 'Have feedback for us?',
    subtitle: "We'd love to know why you're leaving so we can do better.",
  },
];

const AlternativeRow = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={styles.altCard}
  >
    <View style={styles.altIconCircle}>
      <Ionicons name={icon} size={16} color="#D4A84A" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.altTitle}>{title}</Text>
      <Text style={styles.altSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const DeleteAccountScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  const toLogin = () =>
    navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });

  const handleTakeABreak = () => {
    Alert.alert(
      'Take a break?',
      'Your profile is hidden and you stop appearing in Discover. Signing back in reactivates it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          onPress: async () => {
            try {
              await usersApi.deactivate();
              await signOut();
              toLogin();
            } catch (err) {
              Alert.alert('Could not deactivate', friendlyError(err));
            }
          },
        },
      ],
    );
  };

  const handleDownloadData = () =>
    Alert.alert(
      'Download your data',
      'Data export is not available yet. Contact support and we will send you a copy.',
    );

  const handleFeedback = () => {
    navigation.navigate('Feedback');
  };

  // Irreversible, so it is gated behind an explicit confirmation.
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'This cannot be undone. Your profile, photos, matches and messages will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete permanently',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersApi.remove();
              await signOut();
              toLogin();
            } catch (err) {
              Alert.alert('Could not delete account', friendlyError(err));
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 40 }}>
          <AppHeader
            title="Delete Your Account"
            subtitle="We're sorry to see you go. Deleting your account is permanent and cannot be undone."
          />

          {/* Consequences card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Once your account is deleted:</Text>
            {consequences.map((line, index) => (
              <View key={index} style={styles.consequenceRow}>
                <View style={styles.xIcon}>
                  <Ionicons name="close" size={12} color="#000" />
                </View>
                <Text style={styles.consequenceText}>{line}</Text>
              </View>
            ))}
          </View>

          {/* Alternatives */}
          <Text style={styles.sectionTitle}>
            Before you delete, please note:
          </Text>

          <AlternativeRow
            icon={alternatives[0].icon}
            title={alternatives[0].title}
            subtitle={alternatives[0].subtitle}
            onPress={handleTakeABreak}
          />
          <AlternativeRow
            icon={alternatives[1].icon}
            title={alternatives[1].title}
            subtitle={alternatives[1].subtitle}
            onPress={handleDownloadData}
          />
          <AlternativeRow
            icon={alternatives[2].icon}
            title={alternatives[2].title}
            subtitle={alternatives[2].subtitle}
            onPress={handleFeedback}
          />

          {/* Delete button */}
          <AppButton title="Delete My Account" leftIcon="trash-outline" onPress={() => navigation.navigate('SplashScreen')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    marginBottom: 25,
  },
  cardHeader: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  consequenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  xIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E90000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  consequenceText: {
    flex: 1,
    color: '#CCCCCC',
    fontSize: 12,
    lineHeight: 17,
  },
  sectionTitle: {
    color: '#D4A84A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  altIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D4A84A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  altTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  altSubtitle: {
    color: '#999',
    fontSize: 11,
    lineHeight: 15,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 50,
    marginBottom: 10,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
