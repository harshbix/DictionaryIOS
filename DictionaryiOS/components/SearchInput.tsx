import React, { useState, useRef, useEffect } from 'react';
import { Animated, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

interface SearchInputProps {
  onSearch: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const inputWidth = useRef(new Animated.Value(50)).current;

  const { colors } = useContext(ThemeContext);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(inputWidth, {
      toValue: 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (query === '') {
      Animated.timing(inputWidth, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsFocused(false));
    }
  };

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchWrapper, { width: inputWidth, backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.icon} style={styles.icon} />
        {isFocused && (
          <TextInput
            value={query}
            onChangeText={handleChange}
            onBlur={handleBlur}
            autoFocus
            placeholder="Search word..."
            placeholderTextColor={colors.subtext}
            style={[styles.input, { color: colors.text }]}
          />
        )}
        {!isFocused && (
          <TouchableOpacity onPress={handleFocus}>
            <View style={styles.iconOverlay} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    margin: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 8,
  },
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchInput;
