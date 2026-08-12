import React, { useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('WelcomeScreen'); // Replace with your screen name
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/splashbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Center Logo */}
      <View style={styles.overlay}>
        <Image
          source={require('../assets/images/applogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Fixed Image */}
      <Image
        source={require('../assets/images/goldheart.png')}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 190,
    height: 190,
  },

  bottomImage: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    width: '75%',
    height: 90,
  },
});
