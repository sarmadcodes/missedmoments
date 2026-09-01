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
import React, { useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Ionicons from '@react-native-vector-icons/ionicons';
import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';

const Loginscreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // `reset` rather than `navigate`: signing in must clear the auth screens so
  // the Android back button cannot walk back into the login form.
  const handleSignIn = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomNavigation' }],
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
      <AppIcon />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Pickup where the moment left off</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              color="#777"
              size={18}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="username@example.com"
              placeholderTextColor="#777"
              keyboardAppearance="dark"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <Ionicons
              name="lock-closed"
              color="#777"
              size={18}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.passwordInput}
              placeholder="************"
              placeholderTextColor="#777"
              secureTextEntry={!passwordVisible}
              keyboardAppearance="dark"
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye' : 'eye-off'}
                color="#777"
                size={20}
              />
            </TouchableOpacity>
          </View>

          <AppButton title="Sign In" width="100%" onPress={handleSignIn} />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or Continue with</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            activeOpacity={0.66}
            style={styles.socialBox}
            onPress={handleSignIn}
          >
            <Ionicons name="logo-google" color="#ccc" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.66}
            style={styles.socialBox}
            onPress={handleSignIn}
          >
            <Ionicons name="logo-apple" color="#ccc" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.66}
            style={styles.socialBox}
            onPress={handleSignIn}
          >
            <Ionicons name="logo-facebook" color="#ccc" size={25} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            activeOpacity={0.66}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { justifyContent: 'center' },
  header: { marginBottom: 15 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#D4A84A',
  },
  subtitle: { fontSize: 13, marginTop: 5, color: '#ffffffde' },
  form: { marginVertical: 10 },
  label: {
    fontSize: 14,
    // fontWeight: '600',
    marginBottom: 10,
    marginTop: 12,
    color: '#ffffffde',
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    paddingHorizontal: 20,
    fontSize: 14,
    backgroundColor: '#111',
    color: '#fff',
  },
  inputContainer: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#111',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 0,
    fontSize: 14,
  },
  passwordContainer: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#111',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#777',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#ccc',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 15,
  },
  socialBox: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#777',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffffde',
  },
  signUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4A84A',
  },
  
});
