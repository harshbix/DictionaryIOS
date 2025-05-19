import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SavedButtonProps {
  isSaved: boolean;
  onPress: () => void;
}

const SavedButton: React.FC<SavedButtonProps> = ({ isSaved, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.7}>
      <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={24} color={isSaved ? '#e0245e' : '#666'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
  },
});

export default SavedButton;
