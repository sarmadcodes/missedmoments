import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import PersonCard from '../../components/cards/PersonCard';

const MatchesScreen = () => {
  const people = [
    {
      id: '1',
      image: require('../../assets/images/overlay1.png'),
      name: 'Elizabeth',
      age: 28,
    },
    {
      id: '2',
      image: require('../../assets/images/overlay2.png'),
      name: 'Marcus',
      age: 21,
    },
    {
      id: '3',
      image: require('../../assets/images/overlay3.png'),
      name: 'Emily',
      age: 20,
    },
    {
      id: '4',
      image: require('../../assets/images/overlay4.png'),
      name: 'Sarah',
      age: 24,
    },
    {
      id: '5',
      image: require('../../assets/images/overlay1.png'),
      name: 'John',
      age: 26,
    },
  ];
  const people2 = [
    {
      id: '1',
      image: require('../../assets/images/overlay1.png'),
      name: 'Sienna',
      location: "King's Cross Platform 4",
    },
    {
      id: '2',
      image: require('../../assets/images/overlay4.png'),
      name: 'Elizabeth',
      location: 'Roundhouse',
    },
    {
      id: '3',
      image: require('../../assets/images/overlay3.png'),
      name: 'David',
      location: 'Roundhouse',
    },
    {
      id: '4',
      image: require('../../assets/images/overlay2.png'),
      name: 'Emily',
      location: 'Blue Door Cafe',
    },
  ];
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '25%' }}>
          <AppHeader title="Matches" />

          <FlatList
            data={people}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item }) => (
              <PersonCard
                type="transparent"
                image={item.image}
                name={item.name}
                age={item.age}
                buttonText="Say Hello"
                onPress={() => {
                  console.log('Person pressed:', item.name);
                }}
                onButtonPress={() => {
                  console.log('Say Hello:', item.name);
                }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({});
