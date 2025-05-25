import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data
const mockWords = [
  { id: 1, word: 'Serendipity', partOfSpeech: 'noun', meaning: 'The occurrence of events by chance in a happy way', synonyms: ['fortune', 'luck'], example: 'It was pure serendipity that we met at the coffee shop that day.' },
  { id: 2, word: 'Ephemeral', partOfSpeech: 'adjective', meaning: 'Lasting for a very short time', synonyms: ['temporary', 'fleeting'], example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.' },
  { id: 3, word: 'Mellifluous', partOfSpeech: 'adjective', meaning: 'Sweet or musical; pleasant to hear', synonyms: ['melodious', 'harmonious'], example: 'Her mellifluous voice captivated the entire audience.' },
  { id: 4, word: 'Wanderlust', partOfSpeech: 'noun', meaning: 'A strong desire to travel', synonyms: ['travel bug', 'itchy feet'], example: 'His wanderlust led him to visit over 50 countries.' },
  { id: 5, word: 'Eloquent', partOfSpeech: 'adjective', meaning: 'Fluent or persuasive in speaking or writing', synonyms: ['articulate', 'expressive'], example: 'The speaker gave an eloquent speech about climate change.' }
];

const quotes = [
  'Success is not the key to happiness. Happiness is the key to success.',
  'Push yourself, because no one else is going to do it for you.',
  'Believe you can and you\'re halfway there.',
  'Dream it. Wish it. Do it.',
  'The only way to do great work is to love what you do.',
  'Life is what happens to you while you\'re busy making other plans.'
];

const HomeScreen  = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [quote, setQuote] = useState('');
  const [wordOfTheDay, setWordOfTheDay] = useState(mockWords[0]);
  const [trendingWords, setTrendingWords] = useState<typeof mockWords>([]);
  const [favoriteWords, setFavoriteWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  const searchInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const initializeData = () => {
      // Set random quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      
      // Set word of the day
      const randomWordIndex = Math.floor(Math.random() * mockWords.length);
      setWordOfTheDay(mockWords[randomWordIndex]);
      
      // Set trending words (excluding word of the day)
      const trending = mockWords
        .filter(word => word.id !== mockWords[randomWordIndex].id)
        .slice(0, 4);
      setTrendingWords(trending);
      
      setIsLoading(false);
    };

    setTimeout(initializeData, 1000);
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchText('');
    }
  };

  const toggleSaveWord = (wordId: unknown) => {
    setFavoriteWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const filteredWords = searchText
    ? mockWords.filter(w => 
        w.word.toLowerCase().includes(searchText.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleVoiceSearch = () => {
    console.log('Voice search activated');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading WordWise...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View style={styles.header}>
        {searchOpen ? (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search words..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoFocus
              />
            </View>
          </View>
        ) : (
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="book" size={24} color="white" />
            </View>
            <Text style={styles.appTitle}>WordWise</Text>
          </View>
        )}

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
            <Ionicons 
              name={searchOpen ? "close" : "search"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleVoiceSearch}>
            <Ionicons name="mic" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Word of the Day */}
        <View style={styles.wordOfDayContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="star" size={20} color="#FBBF24" />
              <Text style={styles.sectionTitle}>Word of the Day</Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => toggleSaveWord(wordOfTheDay.id)}
            >
              <Ionicons
                name={favoriteWords.has(wordOfTheDay.id) ? "bookmark" : "bookmark-outline"}
                size={16}
                color={favoriteWords.has(wordOfTheDay.id) ? "#3B82F6" : "rgba(255,255,255,0.6)"}
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.wordTitle}>{wordOfTheDay.word}</Text>
          <View style={styles.partOfSpeechTag}>
            <Text style={styles.partOfSpeechText}>{wordOfTheDay.partOfSpeech}</Text>
          </View>
          <Text style={styles.wordMeaning}>{wordOfTheDay.meaning}</Text>
          
          {wordOfTheDay.example && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>"{wordOfTheDay.example}"</Text>
            </View>
          )}
        </View>

        {/* Daily Quote */}
        <View style={styles.quoteContainer}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#A855F7" />
            <Text style={styles.sectionTitle}>Daily Inspiration</Text>
          </View>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </View>

        {/* Trending Words */}
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="trending-up" size={20} color="#FB923C" />
            <Text style={styles.sectionTitle}>Trending Words</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {trendingWords.map((word) => (
              <View key={word.id} style={styles.trendingCard}>
                <View style={styles.trendingCardHeader}>
                  <Text style={styles.trendingWordTitle}>{word.word}</Text>
                  <TouchableOpacity
                    style={styles.smallBookmarkButton}
                    onPress={() => toggleSaveWord(word.id)}
                  >
                    <Ionicons
                      name={favoriteWords.has(word.id) ? "bookmark" : "bookmark-outline"}
                      size={12}
                      color={favoriteWords.has(word.id) ? "#3B82F6" : "rgba(255,255,255,0.6)"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.smallPartOfSpeechTag}>
                  <Text style={styles.smallPartOfSpeechText}>{word.partOfSpeech}</Text>
                </View>
                <Text style={styles.trendingWordMeaning}>{word.meaning}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={styles.searchResultsSection}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="search" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Search Results</Text>
            </View>
            
            {filteredWords.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No matches found for "{searchText}"</Text>
              </View>
            ) : (
              <View style={styles.searchResults}>
                {filteredWords.map((word) => (
                  <View key={word.id} style={styles.searchResultCard}>
                    <View style={styles.searchResultHeader}>
                      <Text style={styles.searchResultTitle}>{word.word}</Text>
                      <TouchableOpacity
                        style={styles.smallBookmarkButton}
                        onPress={() => toggleSaveWord(word.id)}
                      >
                        <Ionicons
                          name={favoriteWords.has(word.id) ? "bookmark" : "bookmark-outline"}
                          size={12}
                          color={favoriteWords.has(word.id) ? "#3B82F6" : "rgba(255,255,255,0.6)"}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.smallPartOfSpeechTag}>
                      <Text style={styles.smallPartOfSpeechText}>{word.partOfSpeech}</Text>
                    </View>
                    <Text style={styles.searchResultMeaning}>{word.meaning}</Text>
                    {word.example && (
                      <Text style={styles.searchResultExample}>e.g., {word.example}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  wordOfDayContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  wordTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  partOfSpeechTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  wordMeaning: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  exampleContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  exampleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteContainer: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quoteText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    lineHeight: 28,
    marginTop: 16,
  },
  trendingSection: {
    marginTop: 24,
  },
  trendingScroll: {
    marginTop: 16,
  },
  trendingCard: {
    width: width * 0.75,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  trendingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingWordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  smallBookmarkButton: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPartOfSpeechTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  smallPartOfSpeechText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  trendingWordMeaning: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  searchResultsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  noResultsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  noResultsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  searchResults: {
    marginTop: 16,
  },
  searchResultCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  searchResultMeaning: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 8,
  },
  searchResultExample: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
});

export default HomeScreen;