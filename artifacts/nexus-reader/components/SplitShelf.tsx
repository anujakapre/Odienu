import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCard } from "@/components/BookCard";
import { SeriesCluster } from "@/components/SeriesCluster";
// import { ShelfFlowerAccent } from "@/components/decorations/BotanicalDecorations";
import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { Work } from "@/lib/database";
import { FandomShelf, TrackItem } from "@/lib/nexusEngine";
import Svg, { Line, Rect } from "react-native-svg";

function MiniMetalBracket({ side }: { side: "left" | "right" }) {
  return (
    <Svg width={10} height={14} pointerEvents="none">
      <Rect
        x={side === "right" ? 1 : 5}
        y={0}
        width={4}
        height={14}
        rx={1}
        fill="#6b6b6b"
      />
      <Rect
        x={side === "right" ? 0 : 1}
        y={1}
        width={9}
        height={4}
        rx={1}
        fill="#8a8a8a"
      />
    </Svg>
  );
}

function TrackRow({
  items,
  onPressWork,
}: {
  items: TrackItem[];
  onPressWork?: (work: Work) => void;
}) {
  if (items.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.trackList}
    >
      {items.map((item) => {
        if (item.type === "work") {
          return (
            <BookCard
              key={item.work.workId}
              work={item.work}
              onPress={onPressWork}
            />
          );
        }
        return (
          <SeriesCluster
            key={item.cluster.seriesName}
            cluster={item.cluster}
            onPressWork={onPressWork}
          />
        );
      })}
    </ScrollView>
  );
}

interface SplitShelfProps {
  shelf: FandomShelf;
  onPressWork?: (work: Work) => void;
}

export function SplitShelf({ shelf, onPressWork }: SplitShelfProps) {
  const colors = useColors();
  const { themeId } = useTheme();

  const hasActive = shelf.activeTrack.length > 0;
  const hasToRead = shelf.toReadTrack.length > 0;

  if (!hasActive && !hasToRead) return null;

  const isThemed = themeId !== "default";

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: themeId === "botanical"
            ? "#fffdf4"
            : themeId === "lofi"
            ? "#1e0c06"
            : themeId === "origami"
            ? "#ffffff"
            : colors.card,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.shelfHeader}>
        <View style={styles.titleRow}>
          {shelf.isNexus && (
            <View
              style={[
                styles.nexusBadge,
                { backgroundColor: colors.nexusGlow + "33" },
              ]}
            >
              <Text
                style={[styles.nexusBadgeText, { color: colors.nexusGlow }]}
              >
                NEXUS
              </Text>
            </View>
          )}
          <Text
            style={[styles.shelfTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {shelf.displayName}
          </Text>
        </View>
        {shelf.isNexus && shelf.nexusFandoms && (
          <View style={styles.fandomPills}>
            {shelf.nexusFandoms.map((f) => (
              <View
                key={f}
                style={[
                  styles.fandomPill,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text
                  style={[
                    styles.fandomPillText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {f}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Themed shelf bar */}
      {isThemed && themeId === "origami" && (
        <View
          style={[
            styles.origamiDivider,
            { backgroundColor: colors.shelfHighlight },
          ]}
        />
      )}
      {isThemed && (themeId === "botanical" || themeId === "lofi") && (
        <View
          style={[styles.woodDivider, { backgroundColor: colors.shelfColor }]}
        >
          <View
            style={[
              styles.woodHighlight,
              { backgroundColor: colors.shelfHighlight + "55" },
            ]}
          />
          {themeId === "lofi" && (
            <View style={styles.bracketRow}>
              <MiniMetalBracket side="left" />
              <View style={{ flex: 1 }} />
              <MiniMetalBracket side="right" />
            </View>
          )}
          {themeId === "botanical" && (
            <View style={styles.flowerRow}>
              {/* <ShelfFlowerAccent /> */}
            </View>
          )}
        </View>
      )}
      {!isThemed && (
        <View
          style={[styles.plainDivider, { backgroundColor: colors.border }]}
        />
      )}

      {/* Active track */}
      {hasActive && (
        <View style={styles.track}>
          <Text
            style={[styles.trackLabel, { color: colors.mutedForeground }]}
          >
            Active
          </Text>
          <TrackRow items={shelf.activeTrack} onPressWork={onPressWork} />
        </View>
      )}

      {hasActive && hasToRead && (
        <View
          style={[styles.trackDivider, { backgroundColor: colors.border }]}
        />
      )}

      {/* To Read track */}
      {hasToRead && (
        <View style={styles.track}>
          <Text
            style={[styles.trackLabel, { color: colors.mutedForeground }]}
          >
            {`${shelf.displayName} \u2014 To Read`}
          </Text>
          <TrackRow items={shelf.toReadTrack} onPressWork={onPressWork} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  shelfHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nexusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nexusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  shelfTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  fandomPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  fandomPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  fandomPillText: {
    fontSize: 10,
    fontWeight: "600",
  },
  plainDivider: {
    height: 1,
    marginHorizontal: 14,
    marginBottom: 4,
  },
  woodDivider: {
    height: 18,
    overflow: "hidden",
  },
  woodHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  bracketRow: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  flowerRow: {
    position: "absolute",
    right: 10,
    top: 1,
  },
  origamiDivider: {
    height: 10,
    marginBottom: 4,
  },
  track: {
    paddingBottom: 10,
  },
  trackLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },
  trackDivider: {
    height: 1,
    marginHorizontal: 14,
    marginBottom: 4,
  },
  trackList: {
    paddingHorizontal: 14,
  },
});
