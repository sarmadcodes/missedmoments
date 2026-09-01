import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ 
  children, 
  imageSource, 
  backgroundColor
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IMAGE_HEIGHT = height * 0.55;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle='light-content' backgroundColor='transparent' />

      <View style={{ height: IMAGE_HEIGHT, width: width, position: 'absolute', top: 0 }}>
        <Image
          source={imageSource}
          style={styles.fullImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',   
            'rgba(50, 0, 0, 0.15)',
            backgroundColor,        
            backgroundColor        
          ]}
          locations={[0, 0.4, 0.85, 1]} 
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View
        style={[
          styles.contentContainer,
          // Real insets instead of a hard-coded marginVertical:25, which
          // collided with the notch on some devices.
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
});

export default ScreenWrapper;