import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import wordsData from '../../../assets/data/words.json';

type Word = {
  id: number;
  word: string;
  partOfSpeech?: string;
  meaning?: string;
  synonyms?: string[];
  example?: string;
};

const { height } = Dimensions.get('window');

const filterOptions = ['All', 'A-Z', 'Z-A', 'Short Words', 'Long Words'];

const WordsScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const filteredWords = wordsData
    .filter((w: Word) => w.word.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a: Word, b: Word) => {
      if (filter === 'A-Z') return a.word.localeCompare(b.word);
      if (filter === 'Z-A') return b.word.localeCompare(a.word);
      return 0;
    })
    .filter((w: Word) => {
      if (filter === 'Short Words') return w.word.length <= 6;
      if (filter === 'Long Words') return w.word.length >= 9;
      return true;
    });

  const handleWordPress = (word: Word) => {
    setSelectedWord(word);
    setModalVisible(true);
  };

  const renderWordCard = ({ item }: { item: Word }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleWordPress(item)}>
      <View style={styles.cardContent}>
        <Ionicons name="book-outline" size={24} color="#3B82F6" style={{ marginRight: 10 }} />
        <Text style={styles.wordText}>{item.word}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a word..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterButton, filter === option && styles.activeFilter]}
            onPress={() => setFilter(option)}
          >
            <Text style={[styles.filterText, filter === option && styles.activeFilterText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderWordCard}
      />

      {/* Modern Modal */}
      {selectedWord && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalWord}>{selectedWord.word}</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#555" />
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="reader-outline" size={18} color="#888" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Part of Speech:</Text>{' '}
                    {selectedWord.partOfSpeech || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="bulb-outline" size={18} color="#888" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Meaning:</Text>{' '}
                    {selectedWord.meaning || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="swap-horizontal-outline" size={18} color="#888" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Synonyms:</Text>{' '}
                    {selectedWord.synonyms?.join(', ') || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="chatbox-ellipses-outline" size={18} color="#888" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Example:</Text>{' '}
                    {selectedWord.example || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#111827',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalWord: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
  },
  modalBody: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontWeight: '600',
  },
});

export default WordsScreen;
