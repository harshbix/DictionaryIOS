import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; // or 'react-native-vector-icons'

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Feather name="search" size={20} color="black" />
          <MaterialCommunityIcons name="microphone-outline" size={20} color="black" />
        </View>

        {/* Word of the Day Section */}
        <View style={styles.wordCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Word of the Day</Text>
            <View style={styles.circle} />
          </View>
          <View>
            <Text style={styles.wordTitle}>Petrichor</Text>
            <Text style={styles.wordDefinition}>
              The pleasant smell that follows rain falling on dry ground
            </Text>
          </View>
        </View>

        {/* Trending Words Section */}
        <View>
          <Text style={styles.sectionTitle}>Trending Words</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {[
              { title: 'Serendipity', def: 'Finding something good without looking for it' },
              { title: 'Ephemeral', def: 'Lasting for a very short time' },
              { title: 'Mellifluous', def: 'Sweet or musical; pleasant to hear' },
              { title: 'Luminescent', def: 'Emitting light' }
            ].map((item, index) => (
              <View key={index} style={styles.trendingCard}>
                <Text style={styles.trendingTitle}>{item.title}</Text>
                <Text style={styles.trendingDesc}>{item.def}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: '#1F2937',
    marginBottom: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    fontFamily: 'Poppins',
  },
  wordDefinition: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  trendingScroll: {
    flexDirection: 'row',
    marginTop: 12,
  },
  trendingCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Poppins',
  },
  trendingDesc: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginTop: 8,
  },
});
