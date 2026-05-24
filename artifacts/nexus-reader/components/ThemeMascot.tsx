import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeMascot({ size = 80 }: { size?: number }) {
  const { themeId } = useTheme();

  const mascotMap: Record<string, any> = {
    default: require('@/assets/mascots/mascot-botanical.png'),
    botanical: require('@/assets/mascots/mascot-botanical.png'),
    cloudscape: require('@/assets/mascots/mascot-cloudscape.png'),
    shire: require('@/assets/mascots/mascot-shire.png'),
    blush: require('@/assets/mascots/mascot-blush.png'),
    lofi: require('@/assets/mascots/mascot-lofi.png'),
    origami: require('@/assets/mascots/mascot-origami.png'),
    viking: require('@/assets/mascots/mascot-viking.png'),
    lavender: require('@/assets/mascots/mascot-lavender.png'),
    archives: require('@/assets/mascots/mascot-archives.gif'),
  };

  const selectedMascot = mascotMap[themeId] ?? mascotMap.botanical;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Image
        source={selectedMascot}
        style={styles.imageCanvas}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imageCanvas: { width: '100%', height: '100%' },
});
