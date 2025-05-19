
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          // You can replace these with actual custom fonts
          'dictionary-regular': require('../assets/fonts/regular.ttf'),
          'dictionary-medium': require('../assets/fonts/medium.ttf'),
          'dictionary-bold': require('../assets/fonts/bold.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fall back to system fonts if custom fonts fail to load
        setFontLoaded(true);
      }
    };

    loadFonts();
  }, []);

  return { fontLoaded };
};