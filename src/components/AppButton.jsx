import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const AppButton = ({
  title = '',
  onPress,
  loading = false,
  disabled = false,
  width = '90%',
  height = 50,
  borderRadius = 50,
  borderWidth = 1,
  borderColor = '#FF5153',
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
}) => {
  const iconColor = leftIconColor || textColor;
  const rightColor = arrowColor || textColor;

  return (
    <View style={[styles.wrapper, { width }]}>
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            width: '100%',
            height,
            borderRadius,
            borderWidth,
            borderColor,
            backgroundColor: disabled ? '#FF5153' : backgroundColor,
            opacity: pressed ? 0.66 : 1,
          },
          buttonStyle,
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
              style={[styles.title, { color: textColor }, textStyle]}
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
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  leftIcon: {
    marginRight: 10,
  },

  rightIcon: {
    marginLeft: 10,
  },
});
