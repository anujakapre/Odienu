import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";

import { BookCard } from "@/components/BookCard";
import { ShelfFlowerAccent } from "@/components/decorations/BotanicalDecorations";
import { EmptyLane } from "@/components/EmptyLane";
import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { Work } from "@/lib/database";

function MetalBracket({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <Svg width={16} height={22} pointerEvents="none">
      <Rect
        x={flip ? 2 : 8}
        y={0}
        width={6}
        height={22}
        rx={1}
        fill="#6b6b6b"
      />
      <Rect
        x={flip ? 0 : 2}
        y={2}
        width={14}
        height={5}
        rx={1}
        fill="#8a8a8a"
      />
      <Circle cx={flip ? 5 : 11} cy={11} r={2.5} fill="#4a4a4a" />
    </Svg>
  );
}

interface ShelfLaneProps {
  title: string;
  works: Work[];
  subtitle?: string;
  glowCards?: boolean;
  onPressWork?: (work: Work) => void;
  compact?: boolean;
  showEmpty?: boolean;
  emptyMessage?: string;
}

export function ShelfLane({
  title,
  works,
  subtitle,
  glowCards,
  onPressWork,
  compact,
  showEmpty,
  emptyMessage,
}: ShelfLaneProps) {
  const colors = useColors();
  const { themeId } = useTheme();

  if (works.length === 0 && showEmpty) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
        </View>
        <EmptyLane message={emptyMessage ?? `Nothing in ${title} yet`} />
      </View>
    );
  }

  if (works.length === 0) return null;

  const showShelfBar = themeId !== "default";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
        <View style={[styles.countBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.countText, { color: colors.mutedForeground }]}>
            {works.length}
          </Text>
        </View>
      </View>

      {showShelfBar && themeId === "origami" && (
        <View
          style={[
            styles.shelfBarOrigami,
            { backgroundColor: colors.shelfHighlight },
          ]}
        />
      )}
      {showShelfBar && (themeId === "botanical" || themeId === "lofi") && (
        <View
          style={[styles.shelfBar, { backgroundColor: colors.shelfColor }]}
        >
          <View
            style={[
              styles.shelfHighlight,
              { backgroundColor: colors.shelfHighlight + "60" },
            ]}
          />
          {themeId === "lofi" && (
            <View style={styles.shelfBrackets}>
              <MetalBracket side="left" />
              <View style={{ flex: 1 }} />
              <MetalBracket side="right" />
            </View>
          )}
          {themeId === "botanical" && (
            <View style={styles.shelfFlowers}>
              <ShelfFlowerAccent />
            </View>
          )}
        </View>
      )}

      <FlatList
        data={works}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.workId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookCard
            work={item}
            showGlow={glowCards}
            onPress={onPressWork}
            compact={compact}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
  },
  shelfBar: {
    height: 20,
    marginHorizontal: 0,
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  shelfBarOrigami: {
    height: 14,
    marginHorizontal: 0,
    marginBottom: 8,
    borderRadius: 2,
  },
  shelfHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  shelfBrackets: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  shelfFlowers: {
    position: "absolute",
    right: 16,
    top: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
