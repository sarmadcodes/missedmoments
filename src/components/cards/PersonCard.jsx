import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PersonCard = ({
  type = 'transparent',
  image,
  name,
  location,
  age,
  buttonText = 'Say Hello',
  onPress,
  onButtonPress,
}) => {
  const isBordered = type === 'bordered';

  return (
    <TouchableOpacity
      activeOpacity={0.66}
      style={[
        styles.card,
        isBordered ? styles.borderedCard : styles.transparentCard,
      ]}
      onPress={onPress}
    >
      {/* Profile Image */}
      <Image source={image} style={styles.image} />

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {/* Location / Age */}
      {isBordered ? (
        location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={11} color="#D4A84A" />

            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        ) : null
      ) : (
        age !== undefined && <Text style={styles.age}>{age} years</Text>
      )}

      {/* Button */}
      <TouchableOpacity
        activeOpacity={0.66}
        style={styles.button}
        onPress={onButtonPress}
      >
        {isBordered && (
          <Ionicons
            name="chatbubble-outline"
            size={10}
            color="#FFFFFFDE"
            style={styles.buttonIcon}
          />
        )}

        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 150,
    alignItems: 'center',
    borderRadius: 10,
    padding:8,
    marginVertical:10
  },

  transparentCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingTop: 3,
  },

  borderedCard: {
    width:130, 
    height:160,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444444',
    // paddingTop: 5,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84ACE',
    resizeMode: 'cover',
    marginBottom: 7,
  },

  name: {
    color: '#FFFFFFDE',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 110,
    marginBottom: 3,
  },

  age: {
    color: '#777',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 7,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 120,
    marginBottom: 8,
  },

  locationText: {
    color: '#FFFFFFDE',
    fontSize: 10,
    marginLeft: 3,
  },

  button: {
    minWidth: 80,
    height: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D4A84ACE',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonIcon: {
    marginRight: 3,
  },

  buttonText: {
    color: '#FFFFFFDE',
    fontSize: 10,
    fontWeight: '400',
  },
});

export default PersonCard;
