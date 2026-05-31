import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { speakChapter, stopSpeaking } from "@/lib/speechPlayer";
import { lazyLoadRemainingChapters } from "@/lib/fileIngestion";
import { useSQLiteContext } from "expo-sqlite";
import { useLibrary } from "@/hooks/useLibrary";
import { ThemeMascot } from "@/components/ThemeMascot";

export default function ReaderScreen() {
  const { workId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;

  const db = useSQLiteContext();
  const { works, toggleWorkFavorite } = useLibrary();

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState("Loading...");
  const [bookAuthor, setBookAuthor] = useState("Unknown Author");
  const [bookFandom, setBookFandom] = useState("");
  const [chapterText, setChapterText] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  const work = works?.find((w) => w.workId === workId);
  const isFavorite = work?.isFavorite ?? false;

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const currentOffset = contentOffset.y;
    const maxOffset = contentSize.height - layoutMeasurement.height;

    if (maxOffset > 0) {
      const progress = Math.min(Math.max(currentOffset / maxOffset, 0), 1);
      setScrollProgress(progress);
    } else {
      setScrollProgress(1);
    }
  };

  useEffect(() => {
    async function loadStoryData() {
      if (!workId) return;
      try {
        setLoading(true);

        lazyLoadRemainingChapters(workId as string).catch((err) =>
          console.warn("Background lazy loader tracking anomaly:", err),
        );

        const workRow = await db.getFirstAsync<{
          title: string;
          author: string;
          fandom: string;
        }>(
          "SELECT title, author, fandom FROM works WHERE workId = ?",
          [workId as string],
        );
        if (workRow) {
          setBookTitle(workRow.title);
          setBookAuthor(workRow.author || "Unknown Author");
          setBookFandom(workRow.fandom || "General");
        }

        const chapterRow = await db.getFirstAsync<{
          bodyText: string;
          chapterNumber: number;
        }>(
          "SELECT bodyText, chapterNumber FROM chapters WHERE workId = ? AND chapterNumber = 1",
          [workId as string],
        );

        if (chapterRow?.bodyText) {
          setChapterText(chapterRow.bodyText);
          setChapterNumber(chapterRow.chapterNumber);
        } else {
          setChapterText(
            "Parsing text layout buffer... If this message persists, verify file ingestion records.",
          );
        }
      } catch (error) {
        console.error(
          "Critical database fetch failure inside Reader Screen:",
          error,
        );
        setChapterText(
          "Error reading book text content layout from local storage engine.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStoryData();
  }, [workId]);

  useEffect(() => {
    if (!workId) return;
    const timeoutId = setTimeout(() => {
      db.runAsync(
        `UPDATE works SET activeParagraphIndex = ? WHERE workId = ?`,
        [Math.floor(scrollProgress * 1000), workId as string],
      ).catch((err) =>
        console.warn("Failed to set background progress", err),
      );
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [scrollProgress, workId]);

  const handleAudioPlayback = async () => {
    if (isPlaying) {
      await stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await speakChapter({
        workId: workId as string,
        currentChapters: 1,
        text: chapterText,
        activeParagraphIndex: 0,
      });
    }
  };

  const handleFavoriteToggle = async () => {
    if (workId) {
      await toggleWorkFavorite(workId as string, isFavorite);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.mutedForeground, marginTop: 12 }}>
          Extracting text blocks...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: colors.card },
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => {
              stopSpeaking();
              router.back();
            }}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>
              ← Library
            </Text>
          </Pressable>
        </View>

        <View style={styles.headerMeta}>
          <Text
            style={[styles.headerTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {bookTitle}
          </Text>
          <Text
            style={[styles.headerAuthor, { color: colors.mutedForeground }]}
          >
            Chapter {chapterNumber} • {bookFandom} - {bookAuthor}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 4,
          backgroundColor: colors.border,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: colors.primary,
            width: `${scrollProgress * 100}%`,
          }}
        />
      </View>

      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text
          style={[
            styles.bodyText,
            {
              color: colors.foreground,
            },
          ]}
        >
          {chapterText}
        </Text>
      </ScrollView>

      {/* Floating Audio Dock - Themed Deck */}
      <View
        style={[
          styles.dockContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.dockRow}>
          <Pressable style={styles.stepBtn}>
            <Text style={[styles.stepText, { color: colors.foreground }]}>
              [Prev Ch]
            </Text>
          </Pressable>
          <Pressable style={styles.stepBtn}>
            <Text style={[styles.stepText, { color: colors.foreground }]}>
              [Rewind 15s]
            </Text>
          </Pressable>

          <Pressable
            onPress={handleAudioPlayback}
            style={[styles.dockPlayBtn, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[
                styles.dockPlayBtnText,
                { color: colors.primaryForeground },
              ]}
            >
              {isPlaying ? "[Pause]" : "[Play / Pause]"}
            </Text>
          </Pressable>

          <Pressable style={styles.stepBtn}>
            <Text style={[styles.stepText, { color: colors.foreground }]}>
              [Skip 15s]
            </Text>
          </Pressable>
          <Pressable style={styles.stepBtn}>
            <Text style={[styles.stepText, { color: colors.foreground }]}>
              [Next Ch]
            </Text>
          </Pressable>
        </View>

        <View style={[styles.favoriteRow, { borderTopColor: colors.border }]}>
          <Pressable
            onPress={handleFavoriteToggle}
            style={styles.favoriteButton}
          >
            <Text style={[styles.favoriteEmoji, { color: colors.foreground }]}>
              {isFavorite
                ? theme.decorations.favoriteIconActive
                : theme.decorations.favoriteIconInactive}
            </Text>
            <Text style={[styles.favoriteText, { color: colors.foreground }]}>
              {isFavorite ? "Favorited!" : theme.decorations.favoriteLabel}
            </Text>
          </Pressable>
          <View style={styles.badgeWrapper}>
            <Text style={{ fontSize: 10, marginRight: 8, color: colors.mutedForeground, fontWeight: "600" }}>{theme.decorations.mascotName} Asset</Text>
            <ThemeMascot size={32} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backButton: { paddingVertical: 8, paddingRight: 16 },
  backText: { fontSize: 16, fontWeight: "700" },
  headerMeta: { gap: 2 },
  headerTitle: { fontSize: 18, fontWeight: "700", lineHeight: 22 },
  headerAuthor: { fontSize: 13, fontWeight: "500", opacity: 0.8 },
  scroller: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 180 },
  bodyText: { fontWeight: "400", fontSize: 19, lineHeight: 30, letterSpacing: 0.2 },
  dockContainer: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stepBtn: { padding: 8 },
  stepText: { fontSize: 12, fontWeight: "600" },
  dockPlayBtn: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 50 },
  dockPlayBtnText: { fontSize: 16, fontWeight: "800" },
  favoriteRow: { borderTopWidth: 1, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  favoriteEmoji: { fontSize: 18 },
  favoriteText: { fontSize: 14, fontWeight: "700" },
  badgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  }
});