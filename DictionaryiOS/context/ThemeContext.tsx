import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Define themes
const lightTheme = {
  backgroundColor: '#F3F4F6',
  cardBackground: '#FFFFFF',
  cardBackgroundSecondary: '#F9FAFB',
  cardBackgroundAccent: '#E0F2FE',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textAccent: '#1E3A8A',
  accentColor: '#3B82F6',
  borderColor: '#E5E7EB',
  shadowColor: '#000',
};

const darkTheme = {
  backgroundColor: '#1F2937',
  cardBackground: '#374151',
  cardBackgroundSecondary: '#4B5563',
  cardBackgroundAccent: '#1E3A8A',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textAccent: '#93C5FD',
  accentColor: '#60A5FA',
  borderColor: '#4B5563',
  shadowColor: '#000',
};

// Create context
export const ThemeContext = createContext({
  theme: lightTheme,
  darkMode: false,
  toggleTheme: () => {},
  fontSizeMultiplier: 1,
  setFontSizeMultiplier: (size: number) => {},
});

// Context provider component
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  // Load theme preferences from AsyncStorage on mount
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        // Load dark mode preference
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkMode(savedDarkMode === 'true');
        } else {
          // Default to system preference
          setDarkMode(deviceTheme === 'dark');
        }

        // Load font size preference
        const savedFontSize = await AsyncStorage.getItem('fontSizeMultiplier');
        if (savedFontSize !== null) {
          setFontSizeMultiplier(parseFloat(savedFontSize));
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    };

    loadThemePreferences();
  }, [deviceTheme]);

  // Toggle between light and dark theme
  const toggleTheme = async () => {
    try {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      await AsyncStorage.setItem('darkMode', String(newDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Update font size multiplier
  const updateFontSize = async (size) => {
    try {
      setFontSizeMultiplier(size);
      await AsyncStorage.setItem('fontSizeMultiplier', String(size));
    } catch (error) {
      console.error('Error saving font size preference:', error);
    }
  };

  // Current theme based on darkMode preference
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        darkMode,
        toggleTheme,
        fontSizeMultiplier,
        setFontSizeMultiplier: updateFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};