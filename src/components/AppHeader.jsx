import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppHeader = ({
  title,
  subtitle,
  rightContent,
  titleStyle,
  subtitleStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Left Content */}
      <View
        style={[
          styles.leftContainer,
          rightContent ? styles.withRightContent : styles.fullWidth,
        ]}
      >
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Content */}
      {rightContent && (
        <View style={styles.rightContainer}>{rightContent}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },

  leftContainer: {
    justifyContent: 'center',
    minWidth: 0,
  },

  withRightContent: {
    flex: 1,
  },

  fullWidth: {
    flex: 1,
  },

  rightContainer: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  title: {
    color: '#D4A84A',
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    color: '#ffffffde',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppHeader;
