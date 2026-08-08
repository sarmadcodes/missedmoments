import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = ({ navigation }) => {
  const steps = ['Welcome', 'About You', 'Profile Info', 'Discover'];

  const cards = [
    {
      icon: '📷',
      title: 'Add Photos',
      subtitle: 'Add at least 3 photos to showcase your best self.',
    },
    {
      icon: '👤',
      title: 'Bio / Who are you?',
      subtitle: 'Write a short bio that helps others get to know you.',
    },
    {
      icon: '💛',
      title: 'Interests',
      subtitle: 'Select your interests to find people with similar passions.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require('../assets/images/appicon.png')}
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.heading}>
          Complete your{'\n'}profile to{' '}
          <Text style={styles.gold}>Continue</Text>
        </Text>

        <Text style={styles.description}>
          Add photo, bio, and interests everything must be completed before you
          can continue. Otherwise, no one will see you and you won't show as a
          potential match.
        </Text>

        {/* Progress */}
        <View style={styles.progressContainer}>
          {steps.map((item, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.line} />
              <View style={styles.circle}>
                <Text style={styles.tick}>✓</Text>
              </View>
              <Text style={styles.stepText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Card */}
        <View style={styles.card}>
          {cards.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={styles.smallCircle}>
                  <Text style={styles.smallTick}>✓</Text>
                </View>

                <Text style={styles.completeText}>Complete</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Button */}
        <AppButton
          title="Create my Profile"
          showArrow={true}
          onPress={() => navigation.replace('OnboardingScreen')}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.lock}>🔒</Text>
          <Text style={styles.footerText}>Your Info is private and secure</Text>
        </View>
      </ScrollView>

      {/* Bottom Heart */}
      <Image
        source={require('../assets/images/goldheart.png')}
        style={styles.bottomHeart}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const GOLD = '#D4A84A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 80,
  },

  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },

  heading: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },

  gold: {
    color: GOLD,
  },

  description: {
    color: '#ffffffce',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
    fontSize: 12,
    width: '80%',
  },

  progressContainer: {
    flexDirection: 'row',
    marginTop: 25,
    width: '100%',
    justifyContent: 'space-between',
  },

  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },

  line: {
    position: 'absolute',
    top: 11,
    left: '50%',
    width: '100%',
    height: 1,
    backgroundColor: GOLD,
    zIndex: 0,
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#A00000',
    borderWidth: 1,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  tick: {
    color: '#fff',
    fontSize: 10,
  },

  stepText: {
    color: '#ffffffde',
    marginTop: 5,
    fontSize: 10,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#000000ce',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#353535',
    padding: 12,
    marginTop: 22,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 16,
    color: GOLD,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  cardSubtitle: {
    color: '#8E8E8E',
    fontSize: 10,
    marginTop: 4,
    lineHeight: 15,
  },

  smallCircle: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallTick: {
    color: GOLD,
    fontSize: 8,
  },

  completeText: {
    color: GOLD,
    fontSize: 9,
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  lock: {
    fontSize: 13,
    color: GOLD,
  },

  footerText: {
    color: '#ffffff9e',
    marginLeft: 6,
    fontSize: 12,
  },

  bottomHeart: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    width: '75%',
    height: 90,
  },
});
