import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import wordsData from '../../../assets/data/words.json';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Word = {
  id: number;
  word: string;
  partOfSpeech?: string;
  meaning?: string;
  synonyms?: string[];
  example?: string;
};

const FILTERS = ['All', 'A-Z', 'Z-A', 'Short Words', 'Long Words'];

const WordsScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');
  const [selected, setSelected] = useState<Word | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openModal = (word: Word) => {
    setSelected(word);
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setSelected(null);
    });
  };

  const filteredWords = wordsData
    .filter(w => w.word.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'A-Z') return a.word.localeCompare(b.word);
      if (filter === 'Z-A') return b.word.localeCompare(a.word);
      return 0;
    })
    .filter(w => {
      if (filter === 'Short Words') return w.word.length <= 6;
      if (filter === 'Long Words') return w.word.length >= 9;
      return true;
    });

  const handleFilter = (f: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(f);
  };

  const renderCard = ({ item }: { item: Word }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <Pressable
        onPress={() => openModal(item)}
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={{ marginBottom: 12 }}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Text style={styles.wordText}>{item.word}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search words..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <Pressable onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </Pressable>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {FILTERS.map(f => (
          <Pressable
            key={f}
            onPress={() => handleFilter(f)}
            style={[
              styles.chip,
              filter === f && styles.chipActive,
            ]}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        keyExtractor={w => w.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Bottom-Sheet Modal */}
      <Modal transparent visible={visible} animationType="none">
        <Pressable style={styles.overlay} onPress={closeModal} />
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            style={styles.sheetHeader}
          >
            <Text style={styles.sheetTitle}>{selected?.word}</Text>
          </LinearGradient>
          <View style={styles.sheetContent}>
            <Text style={styles.sheetLabel}>Part of Speech:</Text>
            <Text style={styles.sheetText}>{selected?.partOfSpeech || '—'}</Text>
            <Text style={styles.sheetLabel}>Meaning:</Text>
            <Text style={styles.sheetText}>{selected?.meaning || '—'}</Text>
            <Text style={styles.sheetLabel}>Synonyms:</Text>
            <Text style={styles.sheetText}>
              {selected?.synonyms?.join(', ') || '—'}
            </Text>
            <Text style={styles.sheetLabel}>Example:</Text>
            <Text style={styles.sheetText}>{selected?.example || '—'}</Text>
          </View>
          <Pressable style={styles.hideButton} onPress={closeModal}>
            <Text style={styles.hideText}>Hide</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8', padding: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    elevation: 2,
  },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 16, color: '#333' },

  chipsContainer: { paddingVertical: 8 },
  chip: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#3B82F6' },
  chipText: { color: '#1E3A8A', fontSize: 14 },
  chipTextActive: { color: '#FFF', fontWeight: '600' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  wordText: { fontSize: 18, fontWeight: '600', color: '#111' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFF',
    elevation: 10,
  },
  sheetHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sheetTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  sheetContent: { padding: 16 },
  sheetLabel: { fontWeight: '600', marginTop: 12, color: '#333' },
  sheetText: { fontSize: 16, color: '#555', marginTop: 4 },
  hideButton: {
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EEE',
  },
  hideText: { color: '#3B82F6', fontWeight: '600', fontSize: 16 },
});

export default WordsScreen;
