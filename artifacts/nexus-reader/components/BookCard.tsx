import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Work } from "@/lib/database";
import { useColors } from "@/hooks/useColors";

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

function getGradient(shelves: string[]): readonly [string, string] {
  for (const shelf of shelves) {
    if (FANDOM_GRADIENTS[shelf]) return FANDOM_GRADIENTS[shelf];
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

interface BookCardProps {
  work: Work;
  showGlow?: boolean;
  onPress?: (work: Work) => void;
  compact?: boolean;
}

export function BookCard({ work, showGlow, onPress, compact }: BookCardProps) {
  const colors = useColors();
  const glowOpacity = useSharedValue(0);
  const gradient = getGradient(work.shelves);

  const cardWidth = compact ? 130 : 155;
  const cardHeight = compact ? 185 : 220;

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
      : Math.min(
          1,
          work.currentChapters / parseInt(work.totalChapters, 10)
        );

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
            { width: cardWidth + 4, height: cardHeight + 4, borderColor: colors.updateGlow },
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
            borderColor: colors.border,
          },
        ]}
      >
        <LinearGradient
          colors={gradient as [string, string]}
          style={[styles.cover, { height: cardHeight * 0.5, borderRadius: colors.radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
            <View style={[styles.newBadge, { backgroundColor: colors.updateGlow }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </LinearGradient>

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
            <Text style={[styles.chapText, { color: colors.mutedForeground }]}>
              {work.currentChapters}/{work.totalChapters}
            </Text>
          </View>

          {progress !== null && (
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor:
                      work.status === "Read" ? colors.statusRead : colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
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
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
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
    color: "#0f0e17",
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
