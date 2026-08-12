import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import AppHeader from '../components/AppHeader';
import AppIcon from '../components/AppIcon';
import AppButton from '../components/AppButton';

const interestOptions = [
  { id: 'music', name: 'Music', icon: 'musical-notes-outline' },
  { id: 'dance', name: 'Dance', icon: 'body-outline' },
  { id: 'party', name: 'Party', icon: 'star-outline' },
  { id: 'movies', name: 'Movies', icon: 'film-outline' },
  { id: 'sports', name: 'Sports', icon: 'fitness-outline' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline' },
  { id: 'food', name: 'Food', icon: 'restaurant-outline' },
  { id: 'photography', name: 'Photography', icon: 'camera-outline' },
  { id: 'gaming', name: 'Gaming', icon: 'game-controller-outline' },
];

const EditProfileScreen = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState(
    require('../assets/images/overlay1.png'),
  );
  const [name, setName] = useState('Ben Wayne');
  const [age, setAge] = useState('28');
  const [location, setLocation] = useState('Blue Door Cafe');
  const [description, setDescription] = useState(
    'I love good conversations, cozy cafés, and meeting people with a warm smile and kind energy.',
  );
  const [selectedInterests, setSelectedInterests] = useState([
    'music',
    'travel',
    'food',
  ]);

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets && response.assets[0];
        if (asset?.uri) {
          setProfilePhoto({ uri: asset.uri });
        }
      },
    );
  };

  const toggleInterest = id => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id],
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '25%' }}>
          <AppHeader
            title="Edit Your Profile"
            rightContent={
              <AppButton
                title="Save"
                width={80}
                height={30}
                backgroundColor="#111"
                borderColor="#444"
                onPress={() => navigation.goBack()}
              />
            }
          />

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={profilePhoto} style={styles.avatar} />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraBtn}
                onPress={handlePickImage}
              >
                <Ionicons name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" color="#777" size={18} style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#777"
                keyboardAppearance="dark"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Age</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" color="#777" size={18} style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                placeholderTextColor="#777"
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" color="#777" size={18} style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                value={location}
                onChangeText={setLocation}
                placeholder="Add your location"
                placeholderTextColor="#777"
                keyboardAppearance="dark"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell people a little about yourself"
                placeholderTextColor="#777"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                keyboardAppearance="dark"
              />
            </View>
          </View>

          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.chipsRow}>
              {interestOptions.map(option => {
                const isSelected = selectedInterests.includes(option.id);

                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.8}
                    onPress={() => toggleInterest(option.id)}
                    style={[styles.chip, isSelected && styles.activeChip]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={12}
                      color={isSelected ? '#000' : '#D4A84A'}
                    />
                    <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* <AppButton
            title="Save Changes"
            width="100%"
            height={50}
            marginVertical={15}
            backgroundColor="#B60406"
            borderColor="#B60406"
            showArrow
            onPress={() => navigation.goBack()}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D4A84A',
    resizeMode: 'cover',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ffffffde',
  },
  inputContainer: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  textAreaContainer: {
    minHeight: 100,
    height: 'auto',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 0,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  interestsSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D4A84A',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: '#D4A84A',
  },
  chipText: {
    color: '#D4A84A',
    fontSize: 11,
    marginLeft: 6,
  },
  activeChipText: {
    color: '#000',
  },
});
