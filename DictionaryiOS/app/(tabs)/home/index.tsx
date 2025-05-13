import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [wordData] = useState([
    { title: 'Serendipity', def: 'Finding something good without looking for it' },
    { title: 'Ephemeral', def: 'Lasting for a very short time' },
    { title: 'Mellifluous', def: 'Sweet or musical; pleasant to hear' },
    { title: 'Luminescent', def: 'Emitting light' }
  ]);
  const [filteredData, setFilteredData] = useState(wordData);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchText('');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = wordData.filter(word =>
      word.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleWordSelect = (word: { title: string; def: string }) => {
    navigation.navigate('WordDetail', { word });
  };

  const renderWordItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handleWordSelect(item)}>
      <View style={styles.wordCard}>
        <Text style={styles.wordTitle}>{item.title}</Text>
        <Text style={styles.wordDefinition}>{item.def}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Search */}
        <View style={styles.header}>
          {searchOpen ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search for words..."
              value={searchText}
              onChangeText={handleSearch}
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

        {/* Word List Section */}
        <Text style={styles.sectionTitle}>Words</Text>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.title}
          renderItem={renderWordItem}
          contentContainerStyle={styles.wordList}
        />
      </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  wordList: {
    marginBottom: 24,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
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
});
