import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';

// Dummy fallback — matches the shape a real `person` param should have
const dummyPerson = {
  image: require('../assets/images/overlay3.png'),
  name: 'Elizabeth',
  location: 'Blue Door Café, New York',
  credits: 40,
  stats: { liked: 106, conversations: 24, connections: 12 },
  about:
    'I love good conversations, cozy cafés and meaningful connections. Looking to meet new people and see where it goes.',
  details: {
    height: '5\'6"',
    education: "Bachelor's",
    work: 'Marketing Manager',
    religion: 'Christian',
    smoke: 'No',
    drink: 'Socially',
  },
  interests: ['Coffee', 'Travel', 'Music', 'Photography', 'Books'],
  photos: [
    require('../assets/images/overlay3.png'),
    require('../assets/images/overlay1.png'),
    require('../assets/images/overlay2.png'),
    require('../assets/images/overlay4.png'),
  ],
};

const interestIcons = {
  Coffee: 'cafe-outline',
  Travel: 'airplane-outline',
  Music: 'musical-notes-outline',
  Photography: 'camera-outline',
  Books: 'book-outline',
};

const StatItem = ({ icon, value, label, color }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={16} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Ionicons
      name={icon}
      size={13}
      color="#E90000"
      style={{ marginRight: 8 }}
    />
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const PersonProfileScreen = ({ navigation, route }) => {
  const passedPerson = route?.params?.person;

  const person = passedPerson
    ? {
        ...dummyPerson,
        ...passedPerson,
        stats: { ...dummyPerson.stats, ...(passedPerson.stats || {}) },
        details: { ...dummyPerson.details, ...(passedPerson.details || {}) },
      }
    : dummyPerson;

  const handleStartConversation = () => {
    navigation.navigate('ChattingScreen', {
      chat: {
        image: person.image,
        title: person.name,
        location: person.location,
      },
    });
  };

  const handleLike = () => {
    console.log('Liked:', person.name);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '15%' }}
      >
        {/* Header photo block */}
        <LinearGradient
          colors={['#000', '#000']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              {/* <Ionicons name="ellipsis-horizontal" size={18} color="#fff" /> */}
            </TouchableOpacity>
          </View>

          <Image source={person.image} style={styles.avatar} />

          <Text style={styles.name}>{person.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#D4A84A" />
            <Text style={styles.locationText}> {person.location}</Text>
          </View>

          <View style={styles.creditsPill}>
            <Ionicons name="cash-outline" size={12} color="#D4A84A" />
            <Text style={styles.creditsText}> {person.credits} Credits</Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 15 }}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <StatItem
              icon="heart"
              value={person.stats.liked}
              label="People liked"
              color="#E90000"
            />
            <StatItem
              icon="chatbox-ellipses-outline"
              value={person.stats.conversations}
              label="Conversations"
              color="#D4A84A"
            />
            <StatItem
              icon="people-outline"
              value={person.stats.connections}
              label="Connections"
              color="#D4A84A"
            />
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartConversation}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={['#200404', '#B60406']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.startBtnText}> Start Conversation</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLike}
              style={styles.likeBtn}
            >
              <Ionicons name="heart-outline" size={14} color="#E90000" />
              <Text style={styles.likeBtnText}> Like</Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="person-outline"
                size={15}
                color="#E90000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardHeaderText}>About {person.name}</Text>
            </View>
            <Text style={styles.aboutText}>{person.about}</Text>

            <View style={styles.detailsGrid}>
              <DetailRow
                icon="resize-outline"
                label="Height"
                value={person.details.height}
              />
              <DetailRow
                icon="school-outline"
                label="Education"
                value={person.details.education}
              />
              <DetailRow
                icon="briefcase-outline"
                label="Work"
                value={person.details.work}
              />
              <DetailRow
                icon="sparkles-outline"
                label="Religion"
                value={person.details.religion}
              />
              <DetailRow
                icon="close-circle-outline"
                label="Smoke"
                value={person.details.smoke}
              />
              <DetailRow
                icon="wine-outline"
                label="Drink"
                value={person.details.drink}
              />
            </View>
          </View>

          {/* Interests */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="star-outline"
                size={15}
                color="#E90000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardHeaderText}>Interests</Text>
            </View>
            <View style={styles.chipsRow}>
              {person.interests.map(interest => (
                <View key={interest} style={styles.chip}>
                  <Ionicons
                    name={interestIcons[interest] || 'ellipse-outline'}
                    size={12}
                    color="#E90000"
                  />
                  <Text style={styles.chipText}> {interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Photos */}
          <View style={styles.photosHeaderRow}>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="image-outline"
                size={15}
                color="#E90000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardHeaderText}>Photos</Text>
            </View>
            <TouchableOpacity>
              {/* <Text style={styles.viewAllText}>View all ›</Text> */}
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {person.photos.map((photo, index) => (
              <Image key={index} source={photo} style={styles.photoThumb} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonProfileScreen;

const styles = StyleSheet.create({
  headerGradient: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#D4A84A',
    resizeMode: 'cover',
    marginBottom: 12,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    color: '#999',
    fontSize: 12,
  },
  creditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b6040750',
    borderWidth: 1,
    borderColor: '#B60406',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  creditsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 50,
    marginRight: 10,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#444',
  },
  likeBtnText: {
    color: '#D4A84A',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  aboutText: {
    color: '#999',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 14,
  },
  detailLabel: {
    color: '#777',
    fontSize: 9,
  },
  detailValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
  },
  photosHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#D4A84A',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
  },
  photoThumb: {
    width: 85,
    height: 110,
    borderRadius: 12,
    marginRight: 10,
    resizeMode: 'cover',
  },
});
