import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

/** Shared loading / error / empty states so every screen behaves the same. */
export const Loading = ({ label = 'Loading...' }) => (
  <View style={styles.center}>
    <ActivityIndicator color="#D4A84A" />
    <Text style={styles.dim}>{label}</Text>
  </View>
);

export const ErrorState = ({ message, onRetry }) => (
  <View style={styles.center}>
    <Ionicons name="cloud-offline-outline" size={30} color="#E90000" />
    <Text style={styles.title}>Couldn't load this</Text>
    <Text style={styles.dim}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retry} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const EmptyState = ({ icon = 'sparkles-outline', title, text }) => (
  <View style={styles.center}>
    <Ionicons name={icon} size={30} color="#D4A84A" />
    <Text style={styles.title}>{title}</Text>
    {text ? <Text style={styles.dim}>{text}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 30, flexGrow: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 10 },
  dim: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  retry: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
  },
  retryText: { color: '#D4A84A', fontWeight: '700', fontSize: 13 },
});
