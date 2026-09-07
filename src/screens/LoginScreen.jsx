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
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import { useAuth } from '../context/AuthContext';

const Loginscreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // `reset` rather than `navigate`: signing in must clear the auth screens
      // so the Android back button cannot walk back into the login form.
      navigation.reset({ index: 0, routes: [{ name: 'BottomNavigation' }] });
    } catch (err) {
      setError(err?.message || 'Could not sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const notImplemented = provider =>
    Alert.alert(
      `${provider} sign-in`,
      'Social sign-in is not connected yet. Use your email and password for now.',
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <AppIcon />
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Pickup where the moment left off
              </Text>
            </View>

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
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  editable={!submitting}
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
                  value={password}
                  onChangeText={setPassword}
                  editable={!submitting}
                  returnKeyType="go"
                  onSubmitEditing={handleSignIn}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    color="#777"
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton
                title="Sign In"
                width="100%"
                loading={submitting}
                disabled={submitting}
                onPress={handleSignIn}
              />
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or Continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              {[
                ['logo-google', 'Google'],
                ['logo-apple', 'Apple'],
                ['logo-facebook', 'Facebook'],
              ].map(([icon, name]) => (
                <TouchableOpacity
                  key={name}
                  activeOpacity={0.66}
                  style={styles.socialBox}
                  onPress={() => notImplemented(name)}
                >
                  <Ionicons name={icon} color="#ccc" size={25} />
                </TouchableOpacity>
              ))}
            </View>

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
    marginBottom: 10,
    marginTop: 12,
    color: '#ffffffde',
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
  inputIcon: { marginRight: 10 },
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
    marginBottom: 12,
    backgroundColor: '#111',
  },
  passwordInput: { flex: 1, paddingHorizontal: 10, color: '#fff' },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  line: { flex: 1, height: 1, backgroundColor: '#777' },
  dividerText: { paddingHorizontal: 10, fontSize: 11, color: '#ccc' },
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
  footerText: { fontSize: 12, fontWeight: '600', color: '#ffffffde' },
  signUpText: { fontSize: 13, fontWeight: '700', color: '#D4A84A' },
});
