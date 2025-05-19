import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import WordCard from './WordCard';

interface Word {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech?: string;
  // other fields as needed
}

interface TrendingScrollProps {
  words: Word[];
  onSaveToggle: (wordId: string) => void;
  savedWordIds: Set<string>;
}

const TrendingScroll: React.FC<TrendingScrollProps> = ({ words, onSaveToggle, savedWordIds }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Words</Text>
      <FlatList
        data={words}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordCard
            word={item.word}
            meaning={item.meaning}
            partOfSpeech={item.partOfSpeech}
            isSaved={savedWordIds.has(item.id)}
            onSaveToggle={() => onSaveToggle(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default TrendingScroll;
