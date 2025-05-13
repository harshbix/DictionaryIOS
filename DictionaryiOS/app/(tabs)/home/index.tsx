import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import words from '../../../assets/data/words.json';

const { width } = Dimensions.get('window');

const quotes = [
  'The best way to get started is to quit talking and begin doing.',
  'Success is not the key to happiness. Happiness is the key to success.',
  'Push yourself, because no one else is going to do it for you.',
  'Believe you can and you’re halfway there.',
  'Dream it. Wish it. Do it.',
];

const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};

const getRandomWords = (count = 5) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HomeScreen = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [quote, setQuote] = useState('');
  const [trendingWords, setTrendingWords] = useState<{ id: number; word: string; partOfSpeech: string; meaning: string; synonyms: string[]; example: string; }[]>([]);

  useEffect(() => {
    setQuote(getRandomQuote());
    const trending = words.slice(0, 5);
    setTrendingWords(trending.length ? trending : getRandomWords());
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchText('');
  };

  const renderSaveButton = () => (
    <TouchableOpacity style={styles.saveButton}>
      <Feather name="bookmark" size={18} color="#1F2937" />
    </TouchableOpacity>
  );

  const filteredWords = searchText
    ? words.filter((w) =>
        w.word.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {searchOpen ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search words..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <Text style={styles.title}>📘 WordWise</Text>
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

        {/* Word of the Day */}
        <View style={styles.wordCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>✨ Word of the Day</Text>
            {renderSaveButton()}
          </View>
          <Text style={styles.wordTitle}>{words[0].word}</Text>
          <Text style={styles.wordDefinition}>{words[0].meaning}</Text>
        </View>

        {/* Daily Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.sectionTitle}>🧠 Daily Quote</Text>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </View>

        {/* Trending Words */}
        <View>
          <Text style={styles.sectionTitle}>🔥 Trending Words</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {trendingWords.map((item) => (
              <View key={item.id} style={styles.trendingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.trendingTitle}>{item.word}</Text>
                  {renderSaveButton()}
                </View>
                <Text style={styles.trendingDesc}>{item.meaning}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>🔍 Search Results</Text>
            {filteredWords.length === 0 ? (
              <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No matches found.</Text>
            ) : (
              filteredWords.map((item) => (
                <View key={item.id} style={styles.trendingCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.trendingTitle}>{item.word}</Text>
                    {renderSaveButton()}
                  </View>
                  <Text style={styles.trendingDesc}>{item.meaning}</Text>
                  <Text style={{ color: '#9CA3AF', marginTop: 4 }}>
                    e.g., {item.example}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
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
    borderBottomWidth: 2,
    borderColor: '#D1D5DB',
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  quoteCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  wordDefinition: {
    marginTop: 8,
    fontSize: 16,
    color: '#4B5563',
  },
  quoteText: {
    marginTop: 12,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1E3A8A',
  },
  trendingScroll: {
    flexDirection: 'row',
    marginTop: 12,
  },
  trendingCard: {
    width: width * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  trendingDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  saveButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
});