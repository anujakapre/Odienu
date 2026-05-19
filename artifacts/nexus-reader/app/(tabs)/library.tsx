import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { BookCard } from "@/components/BookCard";
import { useColors } from "@/hooks/useColors";
import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

type StatusFilter = "All" | Work["status"];
const FILTERS: StatusFilter[] = ["All", "Currently Reading", "Unread", "Read"];

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { works, loading } = useLibrary();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const filtered = useMemo(() => {
    return works.filter((w) => {
      const matchesStatus = filter === "All" || w.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        w.author.toLowerCase().includes(query.toLowerCase()) ||
        w.shelves.some((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        );
      return matchesStatus && matchesQuery;
    });
  }, [works, query, filter]);

  if (loading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          Library
        </Text>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search titles, authors, fandoms..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filter === f ? colors.primary : colors.muted,
                  borderColor:
                    filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      filter === f ? colors.primaryForeground : colors.mutedForeground,
                  },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.workId}
        numColumns={2}
        contentContainerStyle={[
          styles.grid,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 90),
          },
        ]}
        columnWrapperStyle={styles.row}
        scrollEnabled={!!filtered.length}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nothing here
            </Text>
            <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
              {query ? "Try a different search." : "Your library is empty."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <BookCard
              work={item}
              onPress={(w) => router.push(`/reader/${w.workId}`)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  searchInput: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
  },
  emptyState: {
    paddingTop: 80,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyBody: {
    fontSize: 14,
    fontWeight: "500",
  },
});
