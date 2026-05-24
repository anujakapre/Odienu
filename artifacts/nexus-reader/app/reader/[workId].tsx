import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { speakChapter, stopSpeaking } from '@/lib/speechPlayer';
import { lazyLoadRemainingChapters } from '@/lib/fileIngestion';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;

  const [isPlaying, setIsPlaying] = useState(false);

  const sampleText = "The heavy oak doors slammed shut behind him. \"You shouldn't have come here,\" a voice echoed from the shadows. He drew his sword, the metal ringing in the quiet hall. \"I don't have a choice,\" he replied, bracing for impact.";

  const handleAudioPlayback = async () => {
    if (isPlaying) {
      await stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await speakChapter({
        workId: id as string,
        currentChapters: 1,
        text: sampleText,
        activeParagraphIndex: 0
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Navigation */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => { stopSpeaking(); router.back(); }} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Back to Library</Text>
        </Pressable>
      </View>

      {/* Scrollable Text Body */}
      <ScrollView style={styles.scroller} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.bodyText, { color: colors.foreground }]}>
          {sampleText}
        </Text>
      </ScrollView>

      {/* Floating Audio Dock */}
      <View style={[styles.dockContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable onPress={handleAudioPlayback} style={[styles.dockPlayBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.dockPlayBtnText, { color: colors.primaryForeground }]}>
            {isPlaying ? "⏹ Stop Narrator" : "▶️ Play Chapter"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1 },
  backButton: { paddingVertical: 8 },
  backText: { fontSize: 16, fontWeight: '700' },
  scroller: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  bodyText: { fontSize: 18, lineHeight: 28, fontWeight: '500' },
  dockContainer: { position: 'absolute', bottom: 30, left: 24, right: 24, padding: 16, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  dockPlayBtn: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 50 },
  dockPlayBtnText: { fontSize: 16, fontWeight: '700' }
});
