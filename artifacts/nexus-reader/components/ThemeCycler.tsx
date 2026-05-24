import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

// Assuming you have 3 themes: 'botanical', 'origami', 'space'
const THEMES = ['default','cloudscape','shire','botanical', 'origami', 'viking','blush','lofi','lavender','archives'] as const;

export function ThemeCycler() {
  const { theme, setTheme } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    // Wrap your theme iteration check defensively

    // Safely find the next theme in the array
    const currentIndex = THEMES.indexOf(theme.id as any);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    if (setTheme) {
      setTheme(THEMES[nextIndex]);
    }
  };
  

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.text, { color: theme.colors.primaryForeground }]}>
          Swap Theme
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  text: { fontWeight: 'bold', fontSize: 12 }
});
