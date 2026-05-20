import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { useLibrary } from "@/hooks/useLibrary";
import { updateProgress } from "@/lib/database";

const PARAGRAPHS_PER_CHAPTER = 25;

const PARAGRAPH_POOL = [
  "The corridor stretched before her in silence, gaslit flames throwing long shadows across ancient stone. She pressed her back against the cold wall, head tilted toward the door she had just left.",
  "He had not expected to feel afraid. And yet the moment he crossed the threshold, something ancient stirred at the edge of awareness — a presence that recognized him before he recognized it.",
  "The letter had been folded and unfolded so many times that the creases were soft as cloth, the ink worn at the corners to a faint smear. She read it one more time, slowly.",
  "\"You were supposed to wait,\" he said quietly. It was not an accusation. It was the sound of a weight that had finally found a place to rest.",
  "Rain had been falling since midmorning, drumming its patient fingers against the high library windows. The smell of old parchment and warm wood surrounded her like a held breath.",
  "Outside, the world carried on its indifferent business: market bells rang three floors below, pigeons argued over ownership of a ledge, and the river moved steadily toward wherever rivers go.",
  "She closed the book. It was no use. The words kept sliding off their meanings, and her mind kept returning to the conversation she had not yet had the courage to begin.",
  "He set his cup down carefully on the stone ledge and studied the map again. The route was circuitous, deliberately so. Whoever had drawn this did not want to be found.",
  "There were seventeen steps between her door and the window at the end of the hall. She had counted them every night this week. Tonight she stopped at twelve.",
  "The thing about grief, she had come to understand, was that it was not steady. It came in shapes. Some days a stone wall. Some days something more like weather.",
  "She found the note tucked beneath her plate at breakfast — two lines in a handwriting she did not recognize, asking nothing and promising nothing, and somehow more frightening for it.",
  "He handed her the mug without being asked and returned to watching the rain. This, she thought, was a form of conversation she could manage.",
  "The library was busier than she had expected for an hour this late. A dozen readers hunched over scattered texts, their faces hidden beneath lamp-glow and concentration.",
  "There were days when time moved differently — stretched thin at the edges, bunched in the middle, leaving gaps where memory should have been.",
  "\"I didn't come here to argue with you,\" she said. They both understood this was not entirely true. But it was a reasonable place to start.",
  "He had not thought about that afternoon in years. The specific way the light had fallen through those particular windows. The sound the floor had made when she walked away.",
  "She said his name once, very softly, and then did not say anything for a long time. He waited. Outside, the clock finished striking nine.",
  "The map was wrong, or she was. One of the two. She folded it carefully, tucked it away, and chose the path that felt least certain.",
  "Books had been his first refuge and remained so. There was something steadying about the promise of a spine — the quiet certainty that a thing had a beginning, a middle, an end.",
  "She stood at the window long after the lights went out across the courtyard, thinking about nothing in particular, which was another way of thinking about everything at once.",
  "The tea had gone cold again. Third time this week. She drank it anyway, staring at the notes she had been working on since Tuesday, which refused to resolve into anything useful.",
  "He was already gone when she reached the door. She could tell by the quality of the silence — the kind that fills a room the moment someone leaves it for good.",
  "The garden had gone completely wild. She had always meant to do something about that. Standing in it now, she decided she had been wrong about what it needed.",
  "There is a particular kind of quiet that only exists between two people who have said the important thing and are now waiting to find out what it means.",
  "She pulled the curtain aside and looked out at the dark street, the lit windows of the building opposite, the small figures moving behind glass. Something about it made her feel steadier.",
];

function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

function generateChapterContent(workId: string, chapterNum: number): string[] {
  const seed = `${workId}-${chapterNum}`;
  const indices: number[] = [];
  const used = new Set<number>();

  for (let i = 0; indices.length < PARAGRAPHS_PER_CHAPTER; i += 1) {
    const idx = seededIndex(`${seed}-${i}`, PARAGRAPH_POOL.length);
    if (!used.has(idx) || used.size >= PARAGRAPH_POOL.length) {
      indices.push(idx);
      used.add(idx);
    }
  }
  return indices.map((i) => PARAGRAPH_POOL[i]);
}

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 22];
const LINE_SPACINGS = [1.3, 1.5, 1.7, 1.9, 2.1, 2.4];

export default function ReaderScreen() {
  const { workId } = useLocalSearchParams<{ workId: string }>();
  const colors = useColors();
  const { themeId } = useTheme();
  const insets = useSafeAreaInsets();
  const { works } = useLibrary();
  const scrollRef = useRef<ScrollView>(null);
  const [fontSizeIdx, setFontSizeIdx] = useState(4);
  const [lineSpacingIdx, setLineSpacingIdx] = useState(2);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const work = useMemo(() => works.find((w) => w.workId === workId), [works, workId]);
  const fontSize = FONT_SIZES[fontSizeIdx];
  const lineSpacing = LINE_SPACINGS[lineSpacingIdx];
  const lineHeight = fontSize * lineSpacing;
  const chapterNum = work ? Math.max(1, work.currentChapters) : 1;
  const paragraphs = useMemo(
    () => (workId ? generateChapterContent(workId, chapterNum) : []),
    [workId, chapterNum]
  );
  const chapterStartIndex = (chapterNum - 1) * PARAGRAPHS_PER_CHAPTER;
  const localParagraph = work
    ? Math.min(
        PARAGRAPHS_PER_CHAPTER - 1,
        Math.max(0, work.activeParagraphIndex - chapterStartIndex)
      )
    : 0;
  const estimatedParaHeight = fontSize * lineSpacing * 5 + 28;
  const headerHeight = 180;

  useEffect(() => {
    if (scrollRef.current && localParagraph > 0) {
      const y = headerHeight + localParagraph * estimatedParaHeight;
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ y, animated: false });
      }, 150);
      return () => clearTimeout(timer);
    }
    setCurrentParagraph(localParagraph);
    return undefined;
  }, [localParagraph, estimatedParaHeight]);

  function handleScroll(event: { nativeEvent: { contentOffset: { y: number } } }) {
    const y = event.nativeEvent.contentOffset.y;
    const para = Math.min(
      paragraphs.length - 1,
      Math.max(0, Math.floor((y - headerHeight) / estimatedParaHeight))
    );
    setCurrentParagraph(para);

    if (work) {
      const globalIndex = chapterStartIndex + para;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        void updateProgress(work.workId, work.currentChapters, globalIndex);
      }, 1200);
    }
  }

  const handleBack = useCallback(async () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    if (work) {
      const globalIndex = chapterStartIndex + currentParagraph;
      await updateProgress(work.workId, work.currentChapters, globalIndex).catch(() => {});
    }
    router.back();
  }, [work, currentParagraph, chapterStartIndex]);

  const progress = paragraphs.length > 1 ? currentParagraph / (paragraphs.length - 1) : 0;
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 20) : insets.top;
  const bgColor =
    themeId === "botanical"
      ? "#fffdf4"
      : themeId === "lofi"
        ? "#1a0c06"
        : themeId === "origami"
          ? "#fafaf8"
          : colors.background;
  const textColor =
    themeId === "botanical"
      ? "#2d1f0a"
      : themeId === "lofi"
        ? "#f0ddb5"
        : themeId === "origami"
          ? "#2a3050"
          : colors.foreground;

  if (!work) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}> 
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Work not found.</Text>
        <Pressable onPress={() => router.back()} style={[styles.backPill, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backPillText, { color: colors.primaryForeground }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: bgColor }]}> 
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 10,
            backgroundColor: bgColor + "f0",
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Text style={[styles.backArrow, { color: colors.primary }]}>←</Text>
          <Text style={[styles.backLabel, { color: colors.primary }]}>Library</Text>
        </Pressable>
        <Text style={[styles.chapterLabel, { color: colors.mutedForeground }]} numberOfLines={1}>
          Ch.{chapterNum}/{work.totalChapters}
        </Text>
        <Pressable onPress={() => setShowControls((s) => !s)} hitSlop={12} style={styles.settingsButton}>
          <Text style={[styles.settingsIcon, { color: colors.primary }]}>Aa</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
        onScroll={handleScroll}
        scrollEventThrottle={150}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chapterHeader}>
          <Text style={[styles.workTitle, { color: textColor, fontSize: fontSize + 4 }]}>{work.title}</Text>
          <Text style={[styles.authorLabel, { color: colors.mutedForeground }]}>by {work.author}</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.chapterHeading, { color: colors.primary }]}>Chapter {chapterNum}</Text>
        </View>

        {paragraphs.map((para, idx) => (
          <Text
            key={idx}
            style={[
              styles.paragraph,
              { color: textColor, fontSize, lineHeight, opacity: idx === currentParagraph ? 1 : 0.88 },
            ]}
          >
            {para}
          </Text>
        ))}

        <View style={[styles.endMarker, { borderColor: colors.border }]}> 
          <View style={[styles.endLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.endText, { color: colors.mutedForeground }]}>End of Chapter {chapterNum}</Text>
          <View style={[styles.endLine, { backgroundColor: colors.border }]} />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 4, backgroundColor: bgColor + "f2", borderTopColor: colors.border }]}> 
        {showControls && (
          <View style={[styles.controlsPanel, { borderBottomColor: colors.border, backgroundColor: bgColor }]}> 
            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: colors.mutedForeground }]}>Font size</Text>
              <View style={styles.stepper}>
                <Pressable onPress={() => setFontSizeIdx((i) => Math.max(0, i - 1))} style={[styles.stepBtn, { borderColor: colors.border }]} disabled={fontSizeIdx === 0}>
                  <Text style={[styles.stepBtnText, { color: fontSizeIdx === 0 ? colors.mutedForeground : colors.foreground }]}>−</Text>
                </Pressable>
                <Text style={[styles.stepValue, { color: textColor }]}>{fontSize}px</Text>
                <Pressable onPress={() => setFontSizeIdx((i) => Math.min(FONT_SIZES.length - 1, i + 1))} style={[styles.stepBtn, { borderColor: colors.border }]} disabled={fontSizeIdx === FONT_SIZES.length - 1}>
                  <Text style={[styles.stepBtnText, { color: fontSizeIdx === FONT_SIZES.length - 1 ? colors.mutedForeground : colors.foreground }]}>+</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: colors.mutedForeground }]}>Line spacing</Text>
              <View style={styles.stepper}>
                <Pressable onPress={() => setLineSpacingIdx((i) => Math.max(0, i - 1))} style={[styles.stepBtn, { borderColor: colors.border }]} disabled={lineSpacingIdx === 0}>
                  <Text style={[styles.stepBtnText, { color: lineSpacingIdx === 0 ? colors.mutedForeground : colors.foreground }]}>−</Text>
                </Pressable>
                <Text style={[styles.stepValue, { color: textColor }]}>{lineSpacing.toFixed(1)}×</Text>
                <Pressable onPress={() => setLineSpacingIdx((i) => Math.min(LINE_SPACINGS.length - 1, i + 1))} style={[styles.stepBtn, { borderColor: colors.border }]} disabled={lineSpacingIdx === LINE_SPACINGS.length - 1}>
                  <Text style={[styles.stepBtnText, { color: lineSpacingIdx === LINE_SPACINGS.length - 1 ? colors.mutedForeground : colors.foreground }]}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}> 
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary }]} />
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{Math.round(progress * 100)}% — para {currentParagraph + 1}</Text>
          <Text style={[styles.fandomTag, { color: colors.mutedForeground }]}>{work.shelves[0] ?? "Original Fiction"}</Text>
          <Pressable onPress={() => setShowControls((s) => !s)} hitSlop={8}>
            <Text style={[styles.controlToggle, { color: colors.primary }]}>{showControls ? "✕" : "Aa"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  notFound: { fontSize: 16, fontWeight: "500" },
  backPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  backPillText: { fontSize: 14, fontWeight: "700" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  backArrow: { fontSize: 20, fontWeight: "300" },
  backLabel: { fontSize: 15, fontWeight: "600" },
  chapterLabel: { flex: 1, textAlign: "center", fontSize: 13, fontWeight: "500" },
  settingsButton: { paddingHorizontal: 4 },
  settingsIcon: { fontSize: 15, fontWeight: "700" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 28 },
  chapterHeader: { marginBottom: 32, alignItems: "center" },
  workTitle: { fontWeight: "800", letterSpacing: 0.5, textAlign: "center", marginBottom: 6 },
  authorLabel: { fontSize: 13, fontWeight: "500", fontStyle: "italic", marginBottom: 20 },
  headerDivider: { height: 1, width: 60, marginBottom: 16 },
  chapterHeading: { fontSize: 14, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  paragraph: { marginBottom: 22, textAlign: "justify", fontWeight: "400" },
  endMarker: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 20, borderWidth: 1, borderRadius: 16, padding: 12 },
  endLine: { flex: 1, height: 1 },
  endText: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  bottomBar: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  controlsPanel: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12, gap: 12 },
  controlRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  controlLabel: { fontSize: 13, fontWeight: "600" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1 },
  stepBtnText: { fontSize: 18, fontWeight: "700" },
  stepValue: { minWidth: 52, textAlign: "center", fontSize: 13, fontWeight: "700" },
  progressTrack: { height: 4, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between" },
  progressText: { fontSize: 12, fontWeight: "600" },
  fandomTag: { flex: 1, fontSize: 12, fontWeight: "600", textAlign: "center" },
  controlToggle: { fontSize: 15, fontWeight: "700" },
});
