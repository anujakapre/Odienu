import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BookCard } from "@/components/BookCard";
import { useColors } from "@/hooks/useColors";
import { Work } from "@/lib/database";
import { SeriesCluster as SeriesClusterType } from "@/lib/nexusEngine";

interface SeriesClusterProps {
  cluster: SeriesClusterType;
  onPressWork?: (work: Work) => void;
}

export function SeriesCluster({ cluster, onPressWork }: SeriesClusterProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.muted,
          borderColor: colors.border,
          borderRadius: 12, // Swapped colors.radius for standard int if not defined in AppThemeColors
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.seriesBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.seriesLabel, { color: colors.mutedForeground }]}>
            SERIES
          </Text>
        </View>
        <Text
          style={[styles.seriesName, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {cluster.seriesName}
        </Text>
        <View style={[styles.partBadge, { backgroundColor: colors.primary + "22" }]}>
          <Text style={[styles.partText, { color: colors.primary }]}>
            {cluster.works.length} parts
          </Text>
        </View>
      </View>

      {/* Replaced FlatList with a standard ScrollView to completely eliminate VirtualizedList nesting errors */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {cluster.works.map((item, index) => (
          <View style={styles.itemWrapper} key={item.workId}>
            <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.orderText, { color: colors.primaryForeground }]}>
                {index + 1}
              </Text>
            </View>
            <BookCard work={item} onPress={onPressWork} compact />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    minWidth: 300,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  seriesBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seriesLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  seriesName: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  partBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partText: {
    fontSize: 10,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 12,
  },
  itemWrapper: {
    position: "relative",
    marginRight: 12,
  },
  orderBadge: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  orderText: {
    fontSize: 10,
    fontWeight: "800",
  },
});