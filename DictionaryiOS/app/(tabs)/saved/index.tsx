import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock words data (this would normally be in a words.json file)
const wordsData = [
  {
    word: "Courage",
    definition: "The ability to do something that frightens one.",
    partOfSpeech: "noun"
  },
  {
    word: "Inspire",
    definition: "To fill someone with the urge or ability to do or feel something.",
    partOfSpeech: "verb"
  },
  {
    word: "Success",
    definition: "The accomplishment of an aim or purpose.",
    partOfSpeech: "noun"
  }
];

export default function FavoriteWordsScreen() {
  const [favoriteWords, setFavoriteWords] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade in animation

  // Load favorite words from the mock data (simulating loading from words.json)
  useEffect(() => {
    setFavoriteWords(wordsData);
  }, []);

  // Function to add a new favorite word
  const addFavoriteWord = () => {
    const newWord = {
      word: `Word ${favoriteWords.length + 1}`,
      definition: "A placeholder definition.",
      partOfSpeech: "noun"
    };
    setFavoriteWords([...favoriteWords, newWord]);

    // Fade-in effect when a new word is added
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Function to remove a favorite word
  const removeFavoriteWord = (index: number) => {
    setFavoriteWords(favoriteWords.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Words</Text>
      <FlatList
        data={favoriteWords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.word}</Text>
              <Text style={styles.definitionText}>{item.definition}</Text>
              <TouchableOpacity onPress={() => removeFavoriteWord(index)}>
                <Ionicons name="trash-bin-outline" size={24} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={addFavoriteWord}>
        <Text style={styles.buttonText}>Add Favorite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  item: {
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ translateY: 10 }],
    opacity: 1,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#444',
  },
  definitionText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
