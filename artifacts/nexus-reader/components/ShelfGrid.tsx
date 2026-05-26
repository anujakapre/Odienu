import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BookCard } from './BookCard';
import { Work } from '@/lib/database.native';
import { useTheme } from '@/contexts/ThemeContext';

interface ShelfGridProps {
  title: string;
  works: Work[];
  onPressWork: (work: Work) => void;
  emptyMessage?: string;
  glowCards?: boolean;
  horizontal?: boolean;
}

export function ShelfGrid({ title, works, onPressWork, emptyMessage, glowCards, horizontal }: ShelfGridProps) {
  const { theme } = useTheme();

  if (!works || works.length === 0) {
    if (emptyMessage) {
      return (
        <View style={styles.container}>
          {title ? <Text style={[styles.title, { color: theme.colors.foreground }]}>{title}</Text> : null}
          <Text style={[styles.empty, { color: theme.colors.mutedForeground }]}>{emptyMessage}</Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={styles.container}>
      {title ? (
         <View style={[styles.headerDecoration, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.foreground }]}>{title}</Text>
         </View>
      ) : null}

      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalScroll, { borderColor: theme.colors.border }]}>
          {works.map((work) => (
            <View key={work.workId} style={styles.horizontalItem}>
               <BookCard work={work} onPress={onPressWork} compact={true} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.grid, { borderColor: theme.colors.border }]}>
          {works.map((work) => (
            <View key={work.workId} style={styles.gridItem}>
               <BookCard work={work} onPress={onPressWork} compact={true} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerDecoration: {
    paddingHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  empty: {
    paddingHorizontal: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    justifyContent: 'flex-start',
  },
  gridItem: {
    // Allows flexible high density packing 
    width: 140,
    marginBottom: 12,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  horizontalItem: {
    width: 140,
  }
});
