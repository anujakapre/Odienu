import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BookCard } from "@/components/BookCard";
import { useColors } from "@/hooks/useColors";
import { Work } from "@/lib/database";

interface ShelfLaneProps {
  title: string;
  works: Work[];
  subtitle?: string;
  glowCards?: boolean;
  onPressWork?: (work: Work) => void;
  compact?: boolean;
}

export function ShelfLane({
  title,
  works,
  subtitle,
  glowCards,
  onPressWork,
  compact,
}: ShelfLaneProps) {
  const colors = useColors();

  if (works.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
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
      <FlatList
        data={works}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.workId}
        contentContainerStyle={styles.list}
        scrollEnabled={!!works.length}
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
    marginBottom: 10,
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
