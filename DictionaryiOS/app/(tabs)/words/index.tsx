import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import wordsData from '../../../assets/data/words.json'; // Adjust path as needed
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons

const filterOptions = ['All', 'A-Z', 'Z-A', 'Short Words', 'Long Words'];

const WordsScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('All');

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

    return (
        <View style={styles.container}>
            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#555" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search word..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                {filterOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.filterButton, filter === option && styles.activeFilter]}
                        onPress={() => setFilter(option)}
                    >
                        <Text style={styles.filterText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Word List */}
            <FlatList
                data={filteredWords}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.wordText}>{item.word}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    filterContainer: {
        flexGrow: 0,
        flexDirection: 'row',
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
        color: '#111',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    wordText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#111',
    },
});

export default WordsScreen;
