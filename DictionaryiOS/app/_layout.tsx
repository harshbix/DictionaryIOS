import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Path
            d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 9.09938 14.0158 9.85792 13.7226 10.5657C13.4295 11.2734 12.9998 11.9164 12.4581 12.4581C11.9164 12.9998 11.2734 13.4295 10.5657 13.7226C9.85792 14.0158 9.09938 14.1667 8.33333 14.1667C7.56729 14.1667 6.80875 14.0158 6.10101 13.7226C5.39328 13.4295 4.75022 12.9998 4.20854 12.4581C3.66687 11.9164 3.23719 11.2734 2.94404 10.5657C2.65088 9.85792 2.5 9.09938 2.5 8.33333C2.5 6.78624 3.11458 5.30251 4.20854 4.20854C5.30251 3.11458 6.78624 2.5 8.33333 2.5C9.88043 2.5 11.3642 3.11458 12.4581 4.20854C13.5521 5.30251 14.1667 6.78624 14.1667 8.33333Z"
            stroke="black"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Path
            d="M15.8333 9.16666C15.8333 10.7138 15.2187 12.1975 14.1248 13.2914C13.0308 14.3854 11.5471 15 10 15M10 15C8.4529 15 6.96917 14.3854 5.87521 13.2914C4.78125 12.1975 4.16666 10.7138 4.16666 9.16666M10 15V18.3333M10 18.3333H6.66666M10 18.3333H13.3333M10 11.6667C9.33696 11.6667 8.70107 11.4033 8.23223 10.9344C7.76339 10.4656 7.5 9.8297 7.5 9.16666V4.16666C7.5 3.50362 7.76339 2.86773 8.23223 2.39889C8.70107 1.93005 9.33696 1.66666 10 1.66666C10.663 1.66666 11.2989 1.93005 11.7678 2.39889C12.2366 2.86773 12.5 3.50362 12.5 4.16666V9.16666C12.5 9.8297 12.2366 10.4656 11.7678 10.9344C11.2989 11.4033 10.663 11.6667 10 11.6667Z"
            stroke="black"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
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
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
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
