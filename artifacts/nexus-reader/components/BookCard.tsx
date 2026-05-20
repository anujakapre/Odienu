import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Line, Path } from "react-native-svg";

import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { Work } from "@/lib/database";

const FANDOM_GRADIENTS: Record<string, readonly [string, string]> = {
  "Harry Potter": ["#4c1d95", "#1e0a3c"],
  "DC Comics": ["#1e3a8a", "#0a1628"],
  "Marvel Avengers": ["#7f1d1d", "#3b0a0a"],
  "Original Fiction": ["#064e3b", "#012118"],
};
const FALLBACK_GRADIENTS: readonly [string, string][] = [
  ["#1e3a5f", "#0a1628"],
  ["#2d1b69", "#1a0e3d"],
  ["#065f46", "#012118"],
  ["#7f1d1d", "#3b0a0a"],
  ["#1a1f3a", "#0d1020"],
];

const BOTANICAL_GRADIENTS: Record<string, readonly [string, string]> = {
  "Harry Potter": ["#6b3fa0", "#3b1f70"],
  "DC Comics": ["#1e4a8a", "#0a2860"],
  "Marvel Avengers": ["#8B1a1a", "#5c0f0f"],
  "Original Fiction": ["#2d6e40", "#0f3020"],
};

const LOFI_GRADIENTS: Record<string, readonly [string, string]> = {
  "Harry Potter": ["#4a2870", "#2a1040"],
  "DC Comics": ["#1a3060", "#0a1830"],
  "Marvel Avengers": ["#6a1818", "#3a0808"],
  "Original Fiction": ["#1a4030", "#0a2018"],
};

const ORIGAMI_GRADIENTS: Record<string, readonly [string, string]> = {
  "Harry Potter": ["#8060c0", "#5040a0"],
  "DC Comics": ["#4080c0", "#2060a0"],
  "Marvel Avengers": ["#c04040", "#a02020"],
  "Original Fiction": ["#40a080", "#208060"],
};

function getGradient(
  shelves: string[],
  themeId: string
): readonly [string, string] {
  const map =
    themeId === "botanical"
      ? BOTANICAL_GRADIENTS
      : themeId === "lofi"
      ? LOFI_GRADIENTS
      : themeId === "origami"
      ? ORIGAMI_GRADIENTS
      : FANDOM_GRADIENTS;

  for (const shelf of shelves) {
    if (map[shelf]) return map[shelf];
  }
  const hash = shelves
    .join("")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}

function getPlatformColor(platform: Work["sourcePlatform"]): string {
  switch (platform) {
    case "AO3":
      return "#900000";
    case "FFN":
      return "#003366";
    case "Local Book":
      return "#065f46";
  }
}

function getStatusColor(
  status: Work["status"],
  colors: ReturnType<typeof useColors>
): string {
  switch (status) {
    case "Read":
      return colors.statusRead;
    case "Currently Reading":
      return colors.statusReading;
    case "Unread":
      return colors.statusUnread;
  }
}

const HAND_DRAWN_BORDER: Record<string, string> = {
  botanical: "#8B6914",
  lofi: "#e8a857",
  origami: "#5b9bd5",
};

interface BookCardProps {
  work: Work;
  showGlow?: boolean;
  onPress?: (work: Work) => void;
  compact?: boolean;
}

export function BookCard({ work, showGlow, onPress, compact }: BookCardProps) {
  const colors = useColors();
  const { themeId } = useTheme();
  const glowOpacity = useSharedValue(0);
  const gradient = getGradient(work.shelves, themeId);

  const cardWidth = compact ? 130 : 155;
  const cardHeight = compact ? 185 : 220;
  const coverHeight = cardHeight * 0.48;

  const isThemed = themeId !== "default";
  const handDrawnColor = HAND_DRAWN_BORDER[themeId] ?? colors.primary;

  useEffect(() => {
    if (work.needsReview || showGlow) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700 }),
          withTiming(0.25, { duration: 700 })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = 0;
    }
  }, [work.needsReview, showGlow]);

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const progress =
    work.totalChapters === "?"
      ? null
      : Math.min(1, work.currentChapters / parseInt(work.totalChapters, 10));

  return (
    <Pressable
      onPress={() => onPress?.(work)}
      style={({ pressed }) => [
        styles.container,
        { width: cardWidth, height: cardHeight, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {(work.needsReview || showGlow) && (
        <Animated.View
          style={[
            styles.glowBorder,
            {
              width: cardWidth + 4,
              height: cardHeight + 4,
              borderColor: colors.updateGlow,
            },
            glowAnimStyle,
          ]}
        />
      )}
      <View
        style={[
          styles.card,
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            borderColor: isThemed ? "transparent" : colors.border,
            borderWidth: isThemed ? 0 : 1,
          },
          Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.22,
              shadowRadius: 8,
            },
            android: { elevation: 6 },
            web: {
              boxShadow: "0 4px 12px rgba(0,0,0,0.22)",
            },
            default: {},
          }),
        ]}
      >
        <View
          style={[
            styles.cover,
            {
              height: coverHeight,
              borderRadius: colors.radius,
              backgroundColor: gradient[0],
            },
          ]}
        >
          <View
            style={[
              styles.platformBadge,
              { backgroundColor: getPlatformColor(work.sourcePlatform) },
            ]}
          >
            <Text style={styles.platformText}>{work.sourcePlatform}</Text>
          </View>
          {work.needsReview && (
            <View
              style={[
                styles.newBadge,
                { backgroundColor: colors.updateGlow },
              ]}
            >
              <Text
                style={[
                  styles.newBadgeText,
                  { color: colors.accentForeground },
                ]}
              >
                NEW
              </Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.cardForeground }]}
            numberOfLines={2}
          >
            {work.title}
          </Text>
          <Text
            style={[styles.author, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {work.author}
          </Text>

          <View style={styles.footer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(work.status, colors) },
              ]}
            />
            <Text
              style={[styles.chapText, { color: colors.mutedForeground }]}
            >
              {work.currentChapters}/{work.totalChapters}
            </Text>
          </View>

          {progress !== null && (
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor:
                      work.status === "Read"
                        ? colors.statusRead
                        : colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>

        {/* Hand-drawn border overlay for themed modes */}
        {isThemed && (
          <Svg
            width={cardWidth}
            height={cardHeight}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Path
              d={`M 4,3 L ${cardWidth - 5},2 L ${cardWidth - 3},${
                cardHeight - 4
              } L 3,${cardHeight - 3} Z`}
              stroke={handDrawnColor}
              strokeWidth={2}
              fill="none"
              strokeLinejoin="round"
            />
            <Line
              x1={cardWidth - 22}
              y1={5}
              x2={cardWidth - 5}
              y2={22}
              stroke={handDrawnColor}
              strokeWidth={1.2}
              opacity={0.45}
            />
            <Line
              x1={4}
              y1={cardHeight - 22}
              x2={22}
              y2={cardHeight - 4}
              stroke={handDrawnColor}
              strokeWidth={1.2}
              opacity={0.45}
            />
          </Svg>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  glowBorder: {
    position: "absolute",
    borderRadius: 14,
    borderWidth: 2,
    top: -2,
    left: -2,
  },
  card: {
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    justifyContent: "space-between",
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  platformBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    marginBottom: 2,
  },
  author: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chapText: {
    fontSize: 9,
    fontWeight: "500",
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
