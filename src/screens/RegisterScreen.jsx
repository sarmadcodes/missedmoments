import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import AppButton from '../components/AppButton';
import AppIcon from '../components/AppIcon';

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

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [momentPhotos, setMomentPhotos] = useState([null, null, null, null]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handlePickImage = (target, index) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      response => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        const asset = response.assets && response.assets[0];
        if (!asset || !asset.uri) {
          return;
        }

        if (target === 'profile') {
          setProfilePhoto(asset.uri);
          return;
        }

        setMomentPhotos(prev => {
          const next = [...prev];
          next[index] = asset.uri;
          return next;
        });
      },
    );
  };

  const toggleInterest = id => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigation.navigate('BottomNavigation');
    }
  };

  const renderInput = (label, value, setter, placeholder, options = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {options.icon && (
          <Ionicons
            name={options.icon}
            color="#777"
            size={18}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor="#777"
          value={value}
          onChangeText={setter}
          keyboardType={options.keyboardType || 'default'}
          secureTextEntry={options.secureTextEntry}
          autoCapitalize={options.autoCapitalize || 'none'}
          multiline={options.multiline}
          numberOfLines={options.multiline ? 4 : 1}
          textAlignVertical={options.multiline ? 'top' : 'center'}
        />
        {options.rightIcon && (
          <TouchableOpacity onPress={options.onRightIconPress}>
            <Ionicons name={options.rightIcon} color="#777" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  const stepTitles = ['Create Account', 'Add Your Photo', 'Interests'];
  const stepSubtitles = [
    'Tell us a little bit about yourself to create your new account.',
    'Add your profile photo and share more moments from your life.',
    'Choose your favorite interests so the app can match you better.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppIcon />

        <View style={styles.header}>
          <Text style={styles.title}>{stepTitles[currentStep]}</Text>
          <Text style={styles.subtitle}>{stepSubtitles[currentStep]}</Text>
        </View>

        {currentStep === 0 && (
          <View style={styles.form}>
            {renderInput('Enter Name', name, setName, 'Full Name', {
              icon: 'person-outline',
            })}

            <View style={styles.row}>
              <View style={styles.halfItem}>
                {renderInput('Age', age, setAge, 'Age', {
                  icon: 'calendar-outline',
                  keyboardType: 'numeric',
                })}
              </View>
              <View style={styles.halfItem}>
                {renderInput('Gender', gender, setGender, 'Gender', {
                  icon: 'transgender-outline',
                })}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfItem}>
                {renderInput('Number', number, setNumber, 'Phone Number', {
                  icon: 'call-outline',
                  keyboardType: 'phone-pad',
                })}
              </View>
              <View style={styles.halfItem}>
                {renderInput('City', city, setCity, 'City', {
                  icon: 'location-outline',
                })}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfItem}>
                {renderInput(
                  'Set Password',
                  password,
                  setPassword,
                  'Password',
                  {
                    icon: 'lock-closed',
                    secureTextEntry: !passwordVisible,
                    rightIcon: passwordVisible ? 'eye' : 'eye-off',
                    onRightIconPress: () => setPasswordVisible(prev => !prev),
                  },
                )}
              </View>
              <View style={styles.halfItem}>
                {renderInput(
                  'Confirm Password',
                  confirmPassword,
                  setConfirmPassword,
                  'Confirm Password',
                  {
                    icon: 'lock-closed',
                    secureTextEntry: !confirmVisible,
                    rightIcon: confirmVisible ? 'eye' : 'eye-off',
                    onRightIconPress: () => setConfirmVisible(prev => !prev),
                  },
                )}
              </View>
            </View>

            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                placeholder="Tell us about yourself"
                placeholderTextColor="#777"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.form}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.profileUpload}
              onPress={() => handlePickImage('profile')}
            >
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={30}
                    color="#777"
                  />
                  <Text style={styles.uploadText}>Upload Profile Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              MORE MOMENTS
            </Text>
            <View style={styles.momentGrid}>
              {momentPhotos.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={styles.smallUploadBox}
                  onPress={() => handlePickImage('moment', index)}
                >
                  {item ? (
                    <Image source={{ uri: item }} style={styles.momentImage} />
                  ) : (
                    <View style={styles.uploadPlaceholderSmall}>
                      <Ionicons name="add" size={24} color="#777" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.form}>
            <View style={styles.interestContainer}>
              {interestOptions.map(item => {
                const isActive = selectedInterests.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.66}
                    onPress={() => toggleInterest(item.id)}
                    style={[
                      styles.interestButton,
                      {
                        backgroundColor: isActive ? '#D4A84A' : 'transparent',
                        borderColor: isActive ? '#D4A84A' : '#777',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      color={isActive ? '#000' : '#D4A84A'}
                      size={15} />
                    <Text
                      style={[
                        styles.interestText,
                        { color: isActive ? '#000' : '#ffffffde' },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.subtitleNote}>
              Select at least 5 to continue
            </Text>
          </View>
        )}

        <View style={styles.buttonWrapper}>
          <AppButton
            title={currentStep < 2 ? 'Continue' : 'Finish'}
            width="100%"
            onPress={handleContinue}
            disabled={currentStep === 2 && selectedInterests.length < 5}
          />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            activeOpacity={0.66}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.signUpText}>Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 15,
  },
  container: {
    paddingBottom: 25,
  },
  header: {
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#D4A84A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#ffffffde',
    lineHeight: 15,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 12,
    color: '#ffffffde',
  },
  inputContainer: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#111',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 14,
  },
  textAreaContainer: {
    minHeight: 120,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 5,
  },
  halfItem: {
    flex: 1,
  },
  profileUpload: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 13,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    color: '#D4A84A',
    fontSize: 14,
    fontWeight: '700',
  },
  momentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  smallUploadBox: {
    width: '48%',
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 7,
  },
  uploadPlaceholderSmall: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  momentImage: {
    width: '100%',
    height: '100%',
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  interestButton: {
    width: '31%',
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:2,
    marginBottom: 10,
  },
  interestText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitleNote: {
    color: '#ffffff99',
    fontSize: 12,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffffde',
  },
  signUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4A84A',
  },
});
