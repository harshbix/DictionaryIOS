import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function DictionaryApp() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');

  const fetchDefinition = async () => {
    setError('');
    setDefinition('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const data = await response.json();
      setDefinition(data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simple Dictionary App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a word"
        value={word}
        onChangeText={setWord}
      />
      <Button title="Search" onPress={fetchDefinition} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {definition ? <Text style={styles.definition}>{definition}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  definition: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
