import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../../context/ThemeContext';

const FAVORITES_KEY = '@favorite_words';

const FavoriteWordsScreen = () => {
  const { theme, fontSizeMultiplier = 1 } = useContext(ThemeContext) || { theme: {} };
  interface FavoriteWord {
    id: string;
    word: string;
    meaning: string;
  }
  
  const [favoriteWords, setFavoriteWords] = useState<FavoriteWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const json = await AsyncStorage.getItem(FAVORITES_KEY);
        const favorites = json ? JSON.parse(json) : [];
        setFavoriteWords(favorites);
        setLoading(false);
      } catch (e) {
        console.error('Failed to load favorites', e);
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.accentColor || '#000'} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor }}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>⭐ Favorite Words</Text>
      {favoriteWords.length === 0 ? (
        <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No favorites saved yet.</Text>
      ) : (
        favoriteWords.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.shadowColor }]}
          >
            <Text style={[styles.word, { color: theme.textPrimary }]}>{item.word}</Text>
            <Text style={{ color: theme.textSecondary }}>{item.meaning}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  word: {
    fontSize: 20,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteWordsScreen;
