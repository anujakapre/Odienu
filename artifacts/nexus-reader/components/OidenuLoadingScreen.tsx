import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useColors } from '@/contexts/ThemeContext';
import { ThemeMascot } from '@/components/ThemeMascot';

export function OidenuLoadingScreen() {
  const { theme } = useTheme();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemeMascot size={120} />
      <Text style={[styles.title, { color: colors.foreground, fontFamily: theme.typography.headingFont }]}>
        Loading {theme.decorations.mascotName}...
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: theme.typography.bodyFont }]}>
        Arranging your sanctuary.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  subtitle: { fontSize: 13, opacity: 0.8 },
});
