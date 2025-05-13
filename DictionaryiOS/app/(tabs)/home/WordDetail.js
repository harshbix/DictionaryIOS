import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const WordDetailScreen = () => {
  const { params } = useRoute();
  const { word } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.wordTitle}>{word.title}</Text>
      <Text style={styles.phonetic}>/{word.phonetic || 'ˌserənˈdipəti'}/</Text>

      <Text style={styles.partOfSpeech}>noun</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Definition</Text>
        <Text style={styles.cardText}>1. The occurrence and development of events by chance in a happy or beneficial way.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Example Sentences</Text>
        <Text style={styles.cardText}>
          "Scientists often rely on serendipity to make unexpected discoveries."
        </Text>
        <Text style={styles.cardText}>
          "Their meeting was pure serendipity - they both happened to be in the right place at the right time."
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Synonyms & Antonyms</Text>
        <Text style={styles.cardText}>Synonyms: chance, fortune, luck</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default WordDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wordTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  phonetic: {
    fontSize: 16,
    color: '#6B7280',
    marginVertical: 8,
  },
  partOfSpeech: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  card: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#6B7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
