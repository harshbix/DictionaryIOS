import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

interface WordData {
  word: string;
  partOfSpeech: string;
  meaning: string;
  sentence?: string;
}

interface WordCardProps {
  wordData: WordData;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  const { word, partOfSpeech, meaning, sentence } = wordData;
  const { isDarkMode, colors } = useContext(ThemeContext);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    try {
      const savedWords = await AsyncStorage.getItem('savedWords');
      const parsed: WordData[] = savedWords ? JSON.parse(savedWords) : [];
      const alreadySaved = parsed.some(item => item.word === word);
      setIsSaved(alreadySaved);
    } catch (error) {
      console.error('Error checking saved words:', error);
    }
  };

  const toggleSave = async () => {
    try {
      const savedWords = await AsyncStorage.getItem('savedWords');
      let parsed: WordData[] = savedWords ? JSON.parse(savedWords) : [];

      if (isSaved) {
        parsed = parsed.filter(item => item.word !== word);
      } else {
        parsed.push(wordData);
      }

      await AsyncStorage.setItem('savedWords', JSON.stringify(parsed));
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.word, { color: colors.text }]}>{word}</Text>
        <TouchableOpacity onPress={toggleSave}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? colors.primary : colors.icon}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.pos, { color: colors.subtext }]}>{partOfSpeech}</Text>
      <Text style={[styles.meaning, { color: colors.text }]}>{meaning}</Text>
      {sentence && <Text style={[styles.sentence, { color: colors.subtext }]}>"{sentence}"</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pos: {
    marginTop: 6,
    fontStyle: 'italic',
  },
  meaning: {
    marginTop: 8,
    fontSize: 16,
  },
  sentence: {
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});

export default WordCard;
