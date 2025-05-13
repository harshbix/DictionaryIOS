// Enhanced HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import wordsData from '../../../assets/data/words.json'; // adjust path as needed

const quotes = [
  "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
  "Language is the roadmap of a culture.",
  "A different language is a different vision of life.",
  "To have another language is to possess a second soul.",
  "Words can inspire. And words can destroy. Choose yours well."
];

const HomeScreen = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [randomQuote, setRandomQuote] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredWords([]);
    } else {
      const results = wordsData.filter(word =>
        word.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredWords(results);
    }
  }, [searchText]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchText('');
    setFilteredWords([]);
  };

  const renderSaveButton = () => (
    <TouchableOpacity style={styles.saveButton}>
      <Feather name="bookmark" size={18} color="#1F2937" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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

        {searchOpen && filteredWords.length > 0 && (
          <FlatList
            data={filteredWords}
            keyExtractor={(item, index) => item.title + index}
            renderItem={({ item }) => (
              <View style={styles.searchResultCard}>
                <Text style={styles.wordTitle}>{item.title}</Text>
                <Text style={styles.wordDefinition}>{item.definition}</Text>
              </View>
            )}
          />
        )}

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

        <View style={styles.quoteCard}>
          <Text style={styles.sectionTitle}>Daily Quote</Text>
          <Text style={styles.quoteText}>“{randomQuote}”</Text>
        </View>

        {/* More UI sections can be added below (e.g., Recently Added, Fun Fact) */}

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
  quoteCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#374151',
  },
  searchResultCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  saveButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
});
