import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AppIcon = () => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../assets/images/appicon.png')}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
});

export default AppIcon;