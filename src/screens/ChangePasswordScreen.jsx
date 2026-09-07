import React, { useState } from 'react';
import {
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import AppHeader from '../components/AppHeader';
import AppIcon from '../components/AppIcon';
import AppButton from '../components/AppButton';
import { auth as authApi } from '../services/endpoints';
import { friendlyError } from '../utils/format';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdatePassword = async () => {
    setError(null);

    if (!currentPassword) return setError('Enter your current password.');
    if (newPassword.length < 8)
      return setError('New password must be at least 8 characters.');
    if (newPassword !== confirmPassword)
      return setError('New passwords do not match.');

    setSubmitting(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      // Changing the password revokes every session, so send them to sign in.
      Alert.alert(
        'Password updated',
        'You have been signed out everywhere. Please sign in again.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }),
          },
        ],
      );
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (
    label,
    value,
    onChangeText,
    placeholder,
    showPassword,
    togglePassword,
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" color="#777" size={18} style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor="#777"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          keyboardAppearance="dark"
          autoCapitalize="none"
        />
        <TouchableOpacity activeOpacity={0.7} onPress={togglePassword}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            color="#777"
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <AppIcon />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <AppHeader
          title="Change Password"
          subtitle="Update your password to keep your account secure"
        />

        <View style={styles.formWrap}>
          {renderField(
            'Current Password',
            currentPassword,
            setCurrentPassword,
            '************',
            showCurrentPassword,
            () => setShowCurrentPassword(prev => !prev),
          )}

          {renderField(
            'New Password',
            newPassword,
            setNewPassword,
            '************',
            showNewPassword,
            () => setShowNewPassword(prev => !prev),
          )}

          {renderField(
            'Confirm Password',
            confirmPassword,
            setConfirmPassword,
            '************',
            showConfirmPassword,
            () => setShowConfirmPassword(prev => !prev),
          )}

          <AppButton
            title="Update Password"
            showArrow
            onPress={handleUpdatePassword}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardIconWrap}>
            <Ionicons name="shield-checkmark" size={18} color="#D4A84A" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>PASSWORD TIPS</Text>
            <Text style={styles.cardText}>
              Choose a strong password that don’t use anywhere else.
            </Text>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <Image
        source={require('../assets/images/goldheart.png')}
        style={styles.bottomHeart}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
  },
  formWrap: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ffffffde',
  },
  inputContainer: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 0,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2B2B2B',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  cardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1B1B1B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#D4A84A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardText: {
    color: '#ffffffde',
    fontSize: 12,
    lineHeight: 18,
  },
  bottomHeart: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    width: '75%',
    height: 90,
  },
});
