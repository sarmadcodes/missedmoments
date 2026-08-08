import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ScreenWrapper = ({ 
  children, 
  imageSource, 
  backgroundColor
}) => {
  // We define the image height at 40% of the screen
  const IMAGE_HEIGHT = height * 0.55;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle='light-content' backgroundColor='transparent' />
      {/* 1. BACKGROUND LAYER: THE IMAGE */}
      <View style={{ height: IMAGE_HEIGHT, width: width, position: 'absolute', top: 0 }}>
        <Image
          source={imageSource}
          style={styles.fullImage}
          resizeMode="cover"
        />
        
        {/* 2. BLENDING LAYER: THE GRADIENT */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',   // Top: Totally clear
            'rgba(50, 0, 0, 0.15)', // Middle: Starting to wash out
            backgroundColor,         // 80% mark: Hits SOLID WHITE
            backgroundColor          // Bottom: Stays SOLID WHITE
          ]}
          // This makes the image disappear COMPLETELY before the 40% height mark
          locations={[0, 0.4, 0.85, 1]} 
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* 3. FOREGROUND LAYER: YOUR CONTENT */}
      {/* This View sits ON TOP of the image and gradient */}
      <View style={styles.contentContainer}>
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
    marginVertical:25, paddingHorizontal:15
    
  },
});

export default ScreenWrapper;