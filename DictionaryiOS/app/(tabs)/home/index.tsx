import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchText('');
  };

  const renderSaveButton = () => (
    <TouchableOpacity style={styles.saveButton}>
      <Feather name="bookmark" size={18} color="#1F2937" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Search */}
        <View style={styles.header}>
          {searchOpen ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search words..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          ) : (
            <Text style={styles.title}>Dictionary</Text>
          )}

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleSearch} style={styles.iconWrapper}>
              <Feather name={searchOpen ? 'x' : 'search'} size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <MaterialCommunityIcons name="microphone-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Word of the Day Section */}
        <View style={styles.wordCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Word of the Day</Text>
            {renderSaveButton()}
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
                <View style={styles.cardHeader}>
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  {renderSaveButton()}
                </View>
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
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconWrapper: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    flexGrow: 1,
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
    color: '#1F2937',
    marginBottom: 8,
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  wordDefinition: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
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
  },
  trendingDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  saveButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
});
