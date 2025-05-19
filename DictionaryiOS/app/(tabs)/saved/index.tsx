import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

// Storage key for favorites
const FAVORITES_KEY = '@favorite_words';

interface Word {
  id: string; // Unique id for each word
  word: string;
  definition: string;
  partOfSpeech: string;
}

export default function FavoriteWordsScreen() {
  const [favoriteWords, setFavoriteWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadFavorites();
  }, []);

  // Load favorites from AsyncStorage
  async function loadFavorites() {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
      if (jsonValue != null) {
        setFavoriteWords(JSON.parse(jsonValue));
        fadeInCards();
      }
    } catch (e) {
      console.error('Failed to load favorite words', e);
    }
  }

  // Save favorites list to AsyncStorage
  async function saveFavorites(words: Word[]) {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(words));
      setFavoriteWords(words);
    } catch (e) {
      console.error('Failed to save favorite words', e);
    }
  }

  // Fade-in animation for cards
  function fadeInCards() {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }

  // Open word detail modal
  function openDetails(word: Word) {
    setSelectedWord(word);
  }

  // Close modal
  function closeDetails() {
    setSelectedWord(null);
  }

  // Remove a word by index with confirmation alert
  const removeFavoriteWord = (wordId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this word from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const filtered = favoriteWords.filter(w => w.id !== wordId);
            saveFavorites(filtered);
          },
        },
      ]
    );
  };

  // Render right action button when swiped (Delete button)
  const renderRightActions = (wordId: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => removeFavoriteWord(wordId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  // Render each word item with swipeable
  const renderItem = ({ item }: { item: Word }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Pressable
          android_ripple={{ color: '#ddd' }}
          onPress={() => openDetails(item)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#e0f0ff' : '#fff',
            },
            styles.cardInner,
          ]}
        >
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
        </Pressable>
      </Animated.View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Words</Text>

      {favoriteWords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite words saved yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteWords}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Fullscreen modal for word details */}
      <Modal visible={selectedWord !== null} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalWord}>{selectedWord?.word}</Text>
          <Text style={styles.modalPartOfSpeech}>{selectedWord?.partOfSpeech}</Text>
          <Text style={styles.modalDefinition}>{selectedWord?.definition}</Text>

          <Pressable style={styles.closeButton} onPress={closeDetails}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#1e3799',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardInner: {
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30336b',
  },
  partOfSpeech: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7f8fa6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#a4b0be',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
  },
  modalWord: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0a3d62',
    marginBottom: 10,
  },
  modalPartOfSpeech: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#3c6382',
    marginBottom: 20,
  },
  modalDefinition: {
    fontSize: 22,
    color: '#273c75',
    lineHeight: 32,
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: '#0a3d62',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#f7f1e3',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#e55039',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
