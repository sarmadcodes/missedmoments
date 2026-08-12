import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@react-native-vector-icons/ionicons';
import ChatCard from '../../components/cards/ChatCard';

const ChatsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const chats = [
    {
      id: '1',
      image: require('../../assets/images/overlay1.png'),
      title: 'Sienna',
      time: '3m ago',
      message: 'I knew it was you – Blue Door, right?',
      unreadCount: 3,
    },
    {
      id: '2',
      image: require('../../assets/images/overlay2.png'),
      title: 'Emily',
      time: '12m ago',
      message: 'Loved the encore. You stayed for it?',
      unreadCount: 0,
    },
    {
      id: '3',
      image: require('../../assets/images/overlay3.png'),
      title: 'Olivia',
      time: '15m ago',
      message: 'Where are you Marcus ? I am excited to see you',
      unreadCount: 2,
    },
    {
      id: '4',
      image: require('../../assets/images/overlay4.png'),
      title: 'David',
      time: '3m ago',
      message: 'Where are you i am waiting for you?',
      unreadCount: 4,
    },
    {
      id: '5',
      image: require('../../assets/images/overlay1.png'),
      title: 'Charles',
      time: '18m ago',
      message: 'Hey! Did you manage to grab a table outside?',
      unreadCount: 0,
    },
    {
      id: '6',
      image: require('../../assets/images/overlay2.png'),
      title: 'Liam',
      time: '25m ago',
      message: 'Just ordered the coffee, come inside whenever you reach.',
      unreadCount: 0,
    },
    {
      id: '7',
      image: require('../../assets/images/overlay4.png'),
      title: 'John',
      time: '42m ago',
      message: 'That playlist they are playing is amazing, who is it?',
      unreadCount: 2,
    },
    {
      id: '8',
      image: require('../../assets/images/overlay3.png'),
      title: 'Ferido',
      time: '1h ago',
      message: 'Running 5 minutes late! Save me a seat near the window.',
      unreadCount: 0,
    },
  ];
  const filteredChats = chats.filter(item => {
    const query = searchText.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 15 }}
    >
      <AppIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '25%' }}>
          <AppHeader
            title="Inbox"
            
          />

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="#777"
              style={styles.searchIcon}
            />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search"
              placeholderTextColor="#777"
              style={styles.searchInput}
            />
          </View>

          {filteredChats.map(item => (
            <ChatCard
              key={item.id}
              {...item}
              onPress={() => {
                console.log('Chat pressed:', item.title);
                navigation.navigate('ChattingScreen', {
                  chat: item,
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 10,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffffde',
    fontSize: 14,
    paddingVertical: 0,
  },
});
