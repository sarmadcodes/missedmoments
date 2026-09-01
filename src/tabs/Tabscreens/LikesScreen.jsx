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
import { useTabBarSpacer } from '../../theme/layout';
import BannerCard from '../../components/cards/BannerCard';

const LikesScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();
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

  const openProfile = item => {
    navigation.navigate('PersonProfile', {
      person: {
        image: item.image,
        name: item.name,
        location: item.location,
      },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: tabBarSpacer }}>
          <AppHeader
            title="Likes"
            rightContent={
              <TouchableOpacity
                activeOpacity={0.66}
                onPress={() => navigation.navigate('NotificationScreen')}
                style={{
                  padding: 10,
                  backgroundColor: '#333',
                  borderRadius: 50,
                }}
              >
                <Ionicons name="notifications" size={20} color={'#fff'} />
              </TouchableOpacity>
            }
          />

          <BannerCard
            icon="heart"
            title="You have 5 new likes!"
            text="Check out your new matches!"
          />

          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              marginBottom: 5,
            }}
          >
            Quiet Admirers
          </Text>
          <FlatList
            data={people2}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item }) => (
              <PersonCard
                {...item}
                type="bordered"
                buttonText="Say Hello"
                onPress={() => openProfile(item)}
                onButtonPress={() => {
                  navigation.navigate('ChattingScreen', {
                    chat: item,
                  });
                }}
              />
            )}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            Someone Nearby
          </Text>
          <FlatList
            data={people2}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item }) => (
              <PersonCard
                {...item}
                type="bordered"
                buttonText="Reveal"
                onPress={() => openProfile(item)}
                onButtonPress={() => {
                  navigation.navigate('ChattingScreen', {
                    chat: item,
                  });
                }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LikesScreen;

const styles = StyleSheet.create({});
