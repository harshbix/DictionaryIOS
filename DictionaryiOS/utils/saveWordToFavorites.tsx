import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_WORDS';

interface Word {
  id: string;
  text: string;
}

export async function saveWordToFavorites(word: Word) {
  try {
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites: Word[] = existing ? JSON.parse(existing) : [];

    // Check duplicate by id
    if (!favorites.find(fav => fav.id === word.id)) {
      favorites.push(word);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (e) {
    console.error('Failed to save favorite word', e);
  }
}
