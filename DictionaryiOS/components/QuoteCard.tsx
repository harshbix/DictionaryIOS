import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

interface QuoteCardProps {
  quote: string;
  author?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.quoteText, { color: colors.text }]}>
        “{quote}”
      </Text>
      {author && <Text style={[styles.author, { color: colors.subtext }]}>— {author}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  author: {
    marginTop: 10,
    textAlign: 'right',
    fontSize: 14,
    opacity: 0.7,
  },
});

export default QuoteCard;
