import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = {
  Discover: 'compass',
  Chats: 'chatbubble-ellipses',
  Matches: 'people',
  Likes: 'heart-outline',
  Profile: 'person-circle-outline',
};

const CustomBottomBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const animations = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0)),
  ).current;

  useEffect(() => {
    
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === state.index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  return (
    <View style={[styles.absoluteWrapper, { bottom: insets.bottom }]}>
      <LinearGradient
        colors={['#5E1414', '#A70D0D', '#661212']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.bar}
      >
        {state.routes.map((route, index) => {
          const anim = animations[index];
          const isFocused = state.index === index;

          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -15],
          });

          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={styles.tab}
            >
              <Animated.View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isFocused ? '#D4A84A' : 'transparent',
                    borderRadius: 50,
                    padding: 8,
                  },
                ]}
              >
                <Ionicons
                  name={icons[route.name]}
                  size={20}
                  color={isFocused ? '#fff' : '#ffffffde'}
                />
              </Animated.View>

              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

export default CustomBottomBar;

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

  bar: {
    flexDirection: 'row',
    height: 75,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 8,
    alignItems: 'flex-end',
    paddingBottom: 8,
    overflow: 'hidden',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  label: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },

  activeLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
