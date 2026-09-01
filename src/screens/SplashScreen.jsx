import React, { useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { bootstrapping, user } = useAuth();

  useEffect(() => {
    // Wait until we know whether the stored session is still good, so a
    // signed-in user is never bounced to the login screen.
    if (bootstrapping) {
      return;
    }

    const timer = setTimeout(() => {
      navigation.replace(user ? 'BottomNavigation' : 'WelcomeScreen');
    }, 1200);

    return () => clearTimeout(timer);
  }, [bootstrapping, user, navigation]);

  return (
    <ImageBackground
      source={require('../assets/images/splashbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/images/applogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
  background: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 190, height: 190 },
  bottomImage: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    width: '75%',
    height: 90,
  },
});
