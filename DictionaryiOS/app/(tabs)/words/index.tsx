import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Easing,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import wordsData from '../../../assets/data/words.json';

type Word = {
  id: number;
  word: string;
  partOfSpeech?: string;
  meaning?: string;
  synonyms?: string[];
  example?: string;
};

const { width, height } = Dimensions.get('window');

const filterOptions = ['All', 'A-Z', 'Z-A', 'Short Words', 'Long Words'];

const WordsScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  
  // Animations
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedWord(word);
    setModalVisible(true);

    // Animate modal opening
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    // Animate modal closing
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text && !recentSearches.includes(text) && text.length > 2) {
      setRecentSearches((prev) => [text, ...prev.slice(0, 4)]);
    }
  };

  const handleFilterPress = (option: string) => {
    Haptics.selectionAsync();
    setFilter(option);
  };

  useEffect(() => {
    Animated.timing(searchBarAnim, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [isSearchFocused]);

  const renderWordCard = ({ item, index }: { item: Word; index: number }) => {
    // Calculate a gradient based on word length
    const gradientIntensity = Math.min(item.word.length * 10, 100);
    const startColor = `hsla(${210 + index % 40}, 80%, 65%, 0.9)`;
    const endColor = `hsla(${230 + index % 40}, 90%, 45%, 0.85)`;
    
    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.97,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 3,
        tension: 300,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => handleWordPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[startColor, endColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <BlurView intensity={15} style={styles.cardBlur} tint="light">
              <View style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <Ionicons name="book-outline" size={24} color="#ffffff" />
                </View>
                <Text style={styles.wordText}>{item.word}</Text>
                {item.partOfSpeech && (
                  <View style={styles.partOfSpeechTag}>
                    <Text style={styles.partOfSpeechText}>{item.partOfSpeech}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1E3A8A', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Dictionary</Text>
        <Text style={styles.headerSubtitle}>Explore the world of words</Text>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchSection}>
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              width: searchBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['94%', '100%'],
              }),
              borderRadius: searchBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.searchGradient}
          >
            <BlurView intensity={12} tint="light" style={styles.searchBlur}>
              <Ionicons name="search" size={20} color="#fff" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a word..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchText}
                onChangeText={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                selectionColor="#3B82F6"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              )}
            </BlurView>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Filter */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.filterButton, filter === option && styles.activeFilter]}
              onPress={() => handleFilterPress(option)}
            >
              <LinearGradient
                colors={
                  filter === option
                    ? ['#3B82F6', '#1D4ED8']
                    : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.filterGradient}
              >
                <BlurView intensity={12} tint="light" style={styles.filterBlur}>
                  <Text style={[styles.filterText, filter === option && styles.activeFilterText]}>
                    {option}
                  </Text>
                </BlurView>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Word List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderWordCard}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>No words found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      </View>

      {/* Word Detail Modal */}
      {selectedWord && (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: modalOpacityAnim,
                  transform: [{ scale: modalScaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#1E3A8A', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalGradient}
              >
                <BlurView intensity={25} tint="dark" style={styles.modalBlur}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleContainer}>
                      <Text style={styles.modalWord}>{selectedWord.word}</Text>
                      {selectedWord.partOfSpeech && (
                        <View style={styles.modalPartOfSpeechTag}>
                          <Text style={styles.modalPartOfSpeechText}>
                            {selectedWord.partOfSpeech}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Pressable style={styles.closeButton} onPress={closeModal}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                        style={styles.closeButtonGradient}
                      >
                        <Ionicons name="close" size={24} color="#fff" />
                      </LinearGradient>
                    </Pressable>
                  </View>

                  <View style={styles.divider} />

                  <ScrollView
                    style={styles.modalBody}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    {selectedWord.meaning && (
                      <InfoSection
                        icon="bulb-outline"
                        label="Meaning"
                        value={selectedWord.meaning}
                      />
                    )}

                    {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                      <InfoSection
                        icon="swap-horizontal-outline"
                        label="Synonyms"
                        value={selectedWord.synonyms.join(', ')}
                        chips={selectedWord.synonyms}
                      />
                    )}

                    {selectedWord.example && (
                      <InfoSection
                        icon="chatbox-ellipses-outline"
                        label="Example"
                        value={selectedWord.example}
                        isExample={true}
                      />
                    )}

                    <View style={styles.pronunciationSection}>
                      <Text style={styles.sectionLabel}>Pronunciation</Text>
                      <TouchableOpacity style={styles.playButton}>
                        <LinearGradient
                          colors={['#3B82F6', '#1D4ED8']}
                          style={styles.playButtonGradient}
                        >
                          <Ionicons name="volume-high" size={24} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                          style={styles.actionButtonGradient}
                        >
                          <Ionicons name="bookmark-outline" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Save</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                          style={styles.actionButtonGradient}
                        >
                          <Ionicons name="share-outline" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Share</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </BlurView>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

interface InfoSectionProps {
  icon: string;
  label: string;
  value: string;
  chips?: string[];
  isExample?: boolean;
}

const InfoSection: React.FC<InfoSectionProps> = ({ icon, label, value, chips, isExample }) => {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoHeaderRow}>
        <View style={styles.infoIconContainer}>
          <Ionicons name={icon as any} size={20} color="#fff" />
        </View>
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      
      {isExample ? (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleText}>{`"${value}"`}</Text>
        </View>
      ) : chips ? (
        <View style={styles.chipsContainer}>
          {chips.map((chip, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.infoText}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Pale black background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2E', // Slightly lighter pale black
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)', // White with transparency
    marginTop: 5,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  searchContainer: {
    overflow: 'hidden',
    height: 50,
    alignSelf: 'center',
  },
  searchGradient: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle white overlay
  },
  searchBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF', // White text
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  filterContainer: {
    paddingVertical: 5,
  },
  filterButton: {
    marginRight: 10,
    height: 36,
    overflow: 'hidden',
    borderRadius: 18,
  },
  filterGradient: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle white overlay
  },
  filterBlur: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  activeFilter: {
    shadowColor: '#FFFFFF', // White shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  filterText: {
    color: 'rgba(255,255,255,0.8)', // White with transparency
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF', // White text
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 70,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#2C2C2E', // Slightly lighter pale black
  },
  cardBlur: {
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', // Subtle white overlay
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    flex: 1,
  },
  partOfSpeechTag: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Subtle white overlay
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 10,
  },
  partOfSpeechText: {
    color: '#FFFFFF', // White text
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: height * 0.8,
    borderRadius: 30,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#2C2C2E', // Slightly lighter pale black
  },
  modalBlur: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalWord: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    marginRight: 12,
  },
  modalPartOfSpeechTag: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Subtle white overlay
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  modalPartOfSpeechText: {
    color: '#FFFFFF', // White text
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', // Subtle white overlay
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle white line
    marginHorizontal: 25,
  },
  modalBody: {
    flex: 1,
    padding: 25,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', // Subtle white overlay
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White text
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)', // White with transparency
    lineHeight: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginLeft: -5,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle white overlay
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 5,
  },
  chipText: {
    color: '#FFFFFF', // White text
    fontWeight: '500',
    fontSize: 14,
  },
  exampleContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle white overlay
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF', // White border
    marginTop: 5,
  },
  exampleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)', // White with transparency
    fontStyle: 'italic',
    lineHeight: 24,
  },
  pronunciationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)', // Subtle white overlay
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle white overlay
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)', // White with transparency
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)', // White with transparency
    marginTop: 5,
  },
});

export default WordsScreen;