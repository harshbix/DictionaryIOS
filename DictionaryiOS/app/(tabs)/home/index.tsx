import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import icons separately to avoid undefined module errors
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import words directly from the source
import words from '../../../assets/data/words.json';
import { ThemeContext } from '../../../context/ThemeContext';
import { NotificationContext } from '../../../context/NotificationContext';
// Use expo-font directly instead of a custom hook that might be missing
import * as Font from 'expo-font';

// Import the saveWordToFavorites function
import { saveWordToFavorites } from '../../../utils/saveWordToFavorites'; // Adjust the path as needed

const FAVORITES_KEY = '@favorite_words'; // Match the key used in saveWordToFavorites
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { theme, fontSizeMultiplier = 1 } = useContext(ThemeContext) || { theme: {} };
  const { pushNotificationsEnabled = false } = useContext(NotificationContext) || {};
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [quote, setQuote] = useState('');
  const [wordOfTheDay, setWordOfTheDay] = useState(words[0] || {});
  const [trendingWords, setTrendingWords] = useState<{ id: number; word: string; partOfSpeech: string; meaning: string; synonyms: string[]; example: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteWords, setFavoriteWords] = useState<{ id: number; word: string; partOfSpeech: string; meaning: string; synonyms: string[]; example: string; }[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts manually
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Default system font if custom font is not available
          'system-font': require('expo-font/build/FontLoader').FontLoader.resolveAsync()
        });
        setFontsLoaded(true);
      } catch (error) {
        console.log('Error loading fonts:', error);
        // Continue without custom fonts
        setFontsLoaded(true);
      }
    }
    
    loadFonts();
  }, []);

  // Load favorite words from AsyncStorage
  const loadFavoriteWords = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteWords(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorite words:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const storedQuote = await AsyncStorage.getItem('dailyQuote');
        const lastQuoteDate = await AsyncStorage.getItem('lastQuoteDate');
        const today = new Date().toDateString();

        if (storedQuote && lastQuoteDate === today) {
          setQuote(storedQuote);
        } else {
          const newQuote = getRandomQuote();
          setQuote(newQuote);
          await AsyncStorage.setItem('dailyQuote', newQuote);
          await AsyncStorage.setItem('lastQuoteDate', today);
        }

        const storedWordOfDay = await AsyncStorage.getItem('wordOfTheDay');
        const lastWordDate = await AsyncStorage.getItem('lastWordDate');

        if (storedWordOfDay && lastWordDate === today) {
          setWordOfTheDay(JSON.parse(storedWordOfDay));
        } else {
          const randomIndex = Math.floor(Math.random() * words.length);
          const todayWord = words[randomIndex];
          setWordOfTheDay(todayWord);
          await AsyncStorage.setItem('wordOfTheDay', JSON.stringify(todayWord));
          await AsyncStorage.setItem('lastWordDate', today);
        }

        setTrendingWords(getRandomWords(5));

        // Load favorite words using the new approach
        await loadFavoriteWords();

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsLoading(false);
      }
    };

    initializeData();

    if (pushNotificationsEnabled) {
      setupWordOfDayNotification();
    }
  }, [pushNotificationsEnabled]);

  const getRandomQuote = () => {
    const quotes = [
      'Success is not the key to happiness. Happiness is the key to success.',
      'Push yourself, because no one else is going to do it for you.',
      'Believe you can and you\'re halfway there.',
      'Dream it. Wish it. Do it.',
    ];
    
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  };

  const getRandomWords = (count = 5) => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchText('');
    }
  };

  const setupWordOfDayNotification = () => {
    // Implementation would go here - using console log for now
    console.log('Setting up word of day notification');
  };

  // Modified toggleSaveWord function that uses saveWordToFavorites
  const toggleSaveWord = async (word: { id: number; word: string; partOfSpeech: string; meaning: string; synonyms: string[]; example: string; }) => {
    try {
      // Check if the word is already in favorites
      const isCurrentlyFavorited = isWordSaved(word.id);
      
      if (isCurrentlyFavorited) {
        // Remove the word from favorites
        const updatedFavorites = favoriteWords.filter(fav => fav.id !== word.id);
        setFavoriteWords(updatedFavorites);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      } else {
        // Add the word to favorites using the new function
        await saveWordToFavorites({ 
          id: word.id.toString(), 
          text: word.word 
        });
        // Refresh the favorites list
        await loadFavoriteWords();
      }
    } catch (error) {
      console.error('Error toggling favorite word:', error);
    }
  };

  // Modified isWordSaved function to work with the array of favorite words
  const isWordSaved = (wordId: number) => {
    return favoriteWords.some(word => word.id === wordId);
  };

  const renderSaveButton = (word: { id: number; word: string; partOfSpeech: string; meaning: string; synonyms: string[]; example: string; }) => (
    <TouchableOpacity
      style={[
        styles.saveButton,
        { backgroundColor: theme.cardBackgroundSecondary },
      ]}
      onPress={() => toggleSaveWord(word)}
    >
      {/* Use conditional rendering instead of conditional name prop */}
      {isWordSaved(word.id) ? (
        <Feather name="bookmark" size={18} color={theme.accentColor} />
      ) : (
        <Feather name="bookmark" size={18} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const filteredWords = searchText
    ? words.filter((w) =>
        w.word.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleVoiceSearch = () => {
    // Implementation for voice search would go here
    console.log('Voice search activated');
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.accentColor || '#0000ff'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {searchOpen ? (
            <TextInput
              style={[
                styles.searchInput,
                {
                  borderColor: theme.borderColor,
                  color: theme.textPrimary,
                  fontSize: 16 * fontSizeMultiplier,
                },
              ]}
              placeholder="Search words..."
              placeholderTextColor={theme.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          ) : (
            <Text style={[
              styles.title,
              {
                color: theme.textPrimary,
                fontSize: 24 * fontSizeMultiplier,
              },
            ]}>📘 WordWise</Text>
          )}

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleSearch} style={styles.iconWrapper}>
              <Feather
                name={searchOpen ? 'x' : 'search'}
                size={20}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={handleVoiceSearch}>
              <MaterialCommunityIcons
                name="microphone-outline"
                size={20}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Word of the Day */}
        <View style={[
          styles.wordCard,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
          },
        ]}>
          <View style={styles.cardHeader}>
            <Text style={[
              styles.sectionTitle,
              {
                color: theme.textPrimary,
                fontSize: 18 * fontSizeMultiplier,
              },
            ]}>✨ Word of the Day</Text>
            {renderSaveButton(wordOfTheDay)}
          </View>
          <Text style={[
            styles.wordTitle,
            {
              color: theme.textPrimary,
              fontSize: 22 * fontSizeMultiplier,
            },
          ]}>{wordOfTheDay.word}</Text>
          <Text style={[
            styles.wordDefinition,
            {
              color: theme.textSecondary,
              fontSize: 16 * fontSizeMultiplier,
            },
          ]}>{wordOfTheDay.meaning}</Text>
        </View>

        {/* Daily Quote */}
        <View style={[
          styles.quoteCard,
          {
            backgroundColor: theme.cardBackgroundAccent,
            shadowColor: theme.shadowColor,
          },
        ]}>
          <Text style={[
            styles.sectionTitle,
            {
              color: theme.textPrimary,
              fontSize: 18 * fontSizeMultiplier,
            },
          ]}>🧠 Daily Quote</Text>
          <Text style={[
            styles.quoteText,
            {
              color: theme.textAccent || theme.textPrimary,
              fontSize: 16 * fontSizeMultiplier,
            },
          ]}>"{quote}"</Text>
        </View>

        {/* Trending Words */}
        <View>
          <Text style={[
            styles.sectionTitle,
            {
              color: theme.textPrimary,
              fontSize: 18 * fontSizeMultiplier,
            },
          ]}>🔥 Trending Words</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.trendingScroll}
          >
            {trendingWords.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.trendingCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderColor,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[
                    styles.trendingTitle,
                    {
                      color: theme.textPrimary,
                      fontSize: 18 * fontSizeMultiplier,
                    },
                  ]}>{item.word}</Text>
                  {renderSaveButton(item)}
                </View>
                <Text style={[
                  styles.trendingDesc,
                  {
                    color: theme.textSecondary,
                    fontSize: 14 * fontSizeMultiplier,
                  },
                ]}>{item.meaning}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={[
              styles.sectionTitle,
              {
                color: theme.textPrimary,
                fontSize: 18 * fontSizeMultiplier,
              },
            ]}>🔍 Search Results</Text>
            {filteredWords.length === 0 ? (
              <Text style={{
                color: theme.textSecondary,
                fontStyle: 'italic',
                fontSize: 14 * fontSizeMultiplier,
              }}>No matches found.</Text>
            ) : (
              filteredWords.slice(0, 10).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.resultCard,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderColor,
                      shadowColor: theme.shadowColor,
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[
                      styles.trendingTitle,
                      {
                        color: theme.textPrimary,
                        fontSize: 18 * fontSizeMultiplier,
                      },
                    ]}>{item.word}</Text>
                    {renderSaveButton(item)}
                  </View>
                  <Text style={[
                    styles.trendingDesc,
                    {
                      color: theme.textSecondary,
                      fontSize: 14 * fontSizeMultiplier,
                    },
                  ]}>{item.meaning}</Text>
                  <Text style={{
                    color: theme.textSecondary,
                    marginTop: 4,
                    fontStyle: 'italic',
                    fontSize: 13 * fontSizeMultiplier,
                  }}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  iconWrapper: {
    marginLeft: 12,
  },
  wordCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  wordTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  wordDefinition: {
    fontStyle: 'italic',
  },
  quoteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  trendingScroll: {
    marginVertical: 12,
  },
  trendingCard: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: width * 0.7,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  trendingTitle: {
    fontWeight: '600',
  },
  trendingDesc: {
    marginTop: 6,
    fontStyle: 'italic',
  },
  resultCard: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButton: {
    padding: 6,
    borderRadius: 8,
  },
});

export default HomeScreen;
