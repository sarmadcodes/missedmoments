import React, { useState } from 'react';
import {
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

import AppIcon from '../components/AppIcon';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import { MAX_FONT_SCALE } from '../theme/typography';
import { safety as safetyApi } from '../services/endpoints';
import { friendlyError } from '../utils/format';

const reasons = [
  { id: 'match', label: 'Not finding good matches' },
  { id: 'bugs', label: 'The app feels buggy' },
  { id: 'privacy', label: 'Privacy concerns' },
  { id: 'break', label: 'Just taking a break' },
  { id: 'other', label: 'Something else' },
];

const FeedbackScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(selected) && !submitting;

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await safetyApi.feedback(selected, message.trim() || undefined);
      navigation.goBack();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <AppIcon />
          <AppHeader
            title="Send Feedback"
            subtitle="Tell us what isn't working. It genuinely helps."
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

          <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            What's the main reason?
          </Text>

          {reasons.map(item => {
            const active = selected === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => setSelected(item.id)}
                style={[styles.reasonRow, active && styles.reasonRowActive]}
              >
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={active ? '#D4A84A' : '#777'}
                />
                <Text
                  style={[styles.reasonText, active && styles.reasonTextActive]}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Anything else? (optional)
          </Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us more..."
              placeholderTextColor="#777"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              keyboardAppearance="dark"
              maxLength={1000}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AppButton
            title="Submit Feedback"
            width="100%"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  content: { paddingBottom: 40 },
  backBtn: { padding: 10, backgroundColor: '#333', borderRadius: 50 },
  label: {
    color: '#ffffffde',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  reasonRowActive: { borderColor: '#D4A84A', backgroundColor: '#1a1208' },
  reasonText: { color: '#ccc', fontSize: 13, marginLeft: 10, flex: 1 },
  reasonTextActive: { color: '#fff' },
  textAreaContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  textArea: { color: '#fff', fontSize: 14, minHeight: 110 },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});
