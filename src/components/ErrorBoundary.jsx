import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Catches render-time crashes so a single bad screen shows a recoverable
 * message instead of a blank white app.
 */
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with your crash reporter (Sentry/Crashlytics) when one is added.
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  handleReset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          {__DEV__
            ? String(this.state.error?.message || this.state.error)
            : 'Please try again in a moment.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: { color: '#D4A84A', fontSize: 20, fontWeight: '700' },
  message: {
    color: '#ffffffde',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 26,
    paddingVertical: 11,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
  },
  buttonText: { color: '#D4A84A', fontSize: 14, fontWeight: '700' },
});

export default ErrorBoundary;
