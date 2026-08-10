import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';

const ProfileScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingBottom:'25%'}}>
      <AppHeader
        title="Profile"
        rightContent={
          <TouchableOpacity
            activeOpacity={0.66}
            style={{ padding: 10, backgroundColor: '#333', borderRadius: 50 }}
          >
            <Ionicons name="settings" size={20} color={'#fff'} />
          </TouchableOpacity>
        }
      />

      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})