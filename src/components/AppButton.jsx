import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';

const AppButton = ({
  title = '',
  onPress,
  loading = false,
  disabled = false,
  width = '90%',
  height = 50,
  borderRadius = 50,
  borderWidth = 1,
  borderColor = '#D24646',
  backgroundColor = '#B60406',
  textColor = '#FFFFFF',
  leftIcon,
  leftIconSize = 18,
  leftIconColor,
  showArrow = false,
  arrowIcon = 'arrow-forward',
  arrowSize = 20,
  arrowColor,
  buttonStyle,
  textStyle,
  // Gradient colors
  gradientColors = ['#700B0C', '#E5090B', '#700B0C'],
  gradientLocations = [0, 0.5, 1],
}) => {
  const iconColor = leftIconColor || textColor;
  const rightColor = arrowColor || textColor;

  return (
    <View style={[styles.wrapper, { width }]}>
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          {
            width: '100%',
            height,
            borderRadius,
            opacity: pressed ? 0.66 : 1,
          },
          buttonStyle,
        ]}
      >
        <LinearGradient
          colors={
            disabled
              ? ['#7A7A7A', '#A0A0A0', '#7A7A7A']
              : gradientColors
          }
          locations={gradientLocations}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.button,
            {
              height,
              borderRadius,
              borderWidth,
              borderColor,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <>
              {/* Left Icon */}
              {leftIcon && (
                <Ionicons
                  name={leftIcon}
                  size={leftIconSize}
                  color={iconColor}
                  style={styles.leftIcon}
                />
              )}

              {/* Title */}
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  { color: textColor },
                  textStyle,
                ]}
              >
                {title}
              </Text>

              {/* Right Arrow */}
              {showArrow && (
                <Ionicons
                  name={arrowIcon}
                  size={arrowSize}
                  color={rightColor}
                  style={styles.rightIcon}
                />
              )}
            </>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginVertical: 5,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
  },

  leftIcon: {
    marginRight: 10,
  },

  rightIcon: {
    marginLeft: 10,
  },
});