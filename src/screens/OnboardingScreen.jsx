import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from 'react-native';

import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../components/ScreenWrapper';

const OnboardScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingData = [
    {
      image: require('../assets/images/overlay2.png'),

      title: (
        <>
          You see{'\n'}
          <Text style={styles.goldText}>Someone!</Text>
        </>
      ),

      description: 'Only then do you both find out. Then its up to you.',
    },

    {
      image: require('../assets/images/overlay3.png'),

      title: (
        <>
          What if I caught {'\n'}your{' '}
          <Text style={styles.goldText}>eye too?</Text>
        </>
      ),

      description: 'Only then do you both find out. Then its up to you.',
    },

    {
      image: require('../assets/images/overlay1.png'),

      title: (
        <>
          If its mutual{'\n'}
          it could be that <Text style={styles.goldText}>moment</Text>
        </>
      ),

      description:
        'A café. A train. A queue. You notice each other. Nothing is said.',
    },

    {
      image: require('../assets/images/overlay4.png'),

      title: (
        <>
          Maybe we missed {'\n'} a <Text style={styles.goldText}>moment</Text>
        </>
      ),

      description: 'Open the app. See who was near. Tap a heart. No one knows.',
    },
  ];

  const currentData = onboardingData[currentStep];

  const handleContinue = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="transparent" /> */}
      <ScreenWrapper imageSource={currentData.image} backgroundColor="#000">
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/appicon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{currentData.title}</Text>

          <Text style={styles.description}>{currentData.description}</Text>

          <View style={styles.stepsContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.step,
                  index === currentStep
                    ? styles.activeStep
                    : styles.inactiveStep,
                ]}
              />
            ))}
          </View>

          {/* Continue Button */}
          <AppButton title="Continue" showArrow onPress={handleContinue} />
        </View>

        {/* Fixed Bottom Heart */}
        <Image
          source={require('../assets/images/goldheart.png')}
          style={styles.bottomHeart}
          resizeMode="contain"
        />
      </ScreenWrapper>
    </View>
  );
};

export default OnboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
    // paddingHorizontal:15
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 5,
  },

  goldText: {
    color: '#D4A84A',
  },

  description: {
    color: '#BDBDBD',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    width: '75%',
    marginTop: 30,
  },

  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    gap: 8,
  },

  step: {
    height: 6,
    borderRadius: 50,
  },

  activeStep: {
    width: 40,
    backgroundColor: '#D4A84A',
  },

  inactiveStep: {
    width: 15,
    backgroundColor: '#3d3d3dde',
  },

  bottomHeart: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    width: '75%',
    height: 90,
  },
});
