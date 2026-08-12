import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BannerCard = ({
  title,
  text,
  icon,
  iconType = 'Ionicons',
  iconSize = 20,
  iconColor = 'transparent',
  onPress,
  gradientColors = ['#200404', '#B60406'],
}) => {
  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    switch (iconType) {
      case 'Ionicons':
      default:
        return (
          <Ionicons
            name={icon}
            size={iconSize}
            color={iconColor}
          />
        );
    }
  };

  const content = (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.container,
        !icon && styles.noIconContainer,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
      )}

      <View
        style={[
          styles.textContainer,
          !icon && styles.centerTextContainer,
        ]}
      >
        {title && (
          <Text
            style={[
              styles.title,
              !icon && styles.centerText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        {text && (
          <Text
            style={[
              styles.text,
              !icon && styles.centerText,
            ]}
            numberOfLines={2}
          >
            {text}
          </Text>
        )}
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 55,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#5C3434',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    overflow: 'hidden',
    marginVertical: 10,
  },

  noIconContainer: {
    justifyContent: 'center',
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D4A84A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  centerTextContainer: {
    alignItems: 'center',
  },

  title: {
    color: '#D4A84A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  text: {
    color: '#FFFFFFDE',
    fontSize: 10,
    fontWeight: '400',
  },

  centerText: {
    textAlign: 'center',
  },
});

export default BannerCard;