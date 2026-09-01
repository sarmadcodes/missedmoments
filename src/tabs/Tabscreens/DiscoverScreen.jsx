import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import FilterButton from '../../components/FilterButton';
import MomentCard from '../../components/cards/MomentCard';
import { useTabBarSpacer } from '../../theme/layout';

const DiscoverScreen = ({ navigation }) => {
  const tabBarSpacer = useTabBarSpacer();
  const moments = [
    {
      id: '1',
      image: require('../../assets/images/overlay1.png'),
      title: 'Sienna',
      location: 'Blue Door Cafe',
      age: 24,
      timing: '6mins ago',
      matchPercentage: 55,
    },
    {
      id: '2',
      image: require('../../assets/images/overlay2.png'),
      title: 'Emily',
      location: 'Downtown Cafe',
      age: 29,
      timing: '10mins ago',
      matchPercentage: 88,
    },
    {
      id: '3',
      image: require('../../assets/images/overlay3.png'),
      title: 'Noah',
      location: 'Artisan Caffe',
      age: 20,
      timing: '15mins ago',
      matchPercentage: 70,
    },
    {
      id: '4',
      image: require('../../assets/images/overlay4.png'),
      title: 'Charlotte',
      location: 'Starlight Lounge',
      age: 26,
      timing: '2mins ago',
      matchPercentage: 90,
    },
    {
      id: '5',
      image: require('../../assets/images/overlay4.png'),
      title: 'Oliver',
      location: 'Central Perk Cafe',
      age: 25,
      timing: '4mins ago',
      matchPercentage: 65,
    },
    {
      id: '6',
      image: require('../../assets/images/overlay3.png'),
      title: 'Michael J.',
      location: 'Rooftop Bistro',
      age: 27,
      timing: '2hrs ago',
      matchPercentage: 79,
    },
    {
      id: '7',
      image: require('../../assets/images/overlay2.png'),
      title: 'Sophia',
      location: 'Metro Bakery',
      age: 22,
      timing: '12mins ago',
      matchPercentage: 91,
    },
    {
      id: '8',
      image: require('../../assets/images/overlay1.png'),
      title: 'Ethan',
      location: 'Urban Roast',
      age: 31,
      timing: '18mins ago',
      matchPercentage: 45,
    },
  ];
  const listHeader = (
    <View>
      <AppHeader
        title="Discover"
        subtitle={`Who's here \u2014 ${moments.length} moments nearby in the last hour.`}
        rightContent={
          <TouchableOpacity
            activeOpacity={0.66}
            onPress={() => navigation.navigate('NotificationScreen')}
            style={styles.bellBtn}
          >
            <Ionicons name="notifications" size={20} color={'#fff'} />
          </TouchableOpacity>
        }
      />
      <FilterButton
        items={[
          { id: 1, name: 'Right now' },
          { id: 2, name: 'Today' },
          { id: 3, name: 'This week' },
        ]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppIcon />
      <FlatList
        data={moments}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: tabBarSpacer }}
        removeClippedSubviews
        initialNumToRender={6}
        windowSize={9}
        renderItem={({ item }) => (
          <MomentCard
            image={item.image}
            title={item.title}
            location={item.location}
            age={item.age}
            timing={item.timing}
            matchPercentage={item.matchPercentage}
            onPress={() => {
              navigation.navigate('PersonProfile', {
                person: {
                  image: item.image,
                  name: item.title,
                  location: item.location,
                  age: item.age,
                },
              });
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  bellBtn: { padding: 10, backgroundColor: '#333', borderRadius: 50 },
});
