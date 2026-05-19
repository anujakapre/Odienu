import React from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ShelfLane } from "@/components/ShelfLane";
import { SplitShelf } from "@/components/SplitShelf";
import { useColors } from "@/hooks/useColors";
import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { dashboard, loading, error, refresh } = useLibrary();
  const [refreshing, setRefreshing] = React.useState(false);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  function handlePressWork(_work: Work) {}

  if (loading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Loading your library...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {error}
        </Text>
      </View>
    );
  }

  const totalPaddingTop = topPad + 60;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: totalPaddingTop },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            progressViewOffset={totalPaddingTop}
          />
        }
      >
        <View style={styles.heroHeader}>
          <Text style={[styles.appName, { color: colors.foreground }]}>
            NEXUS READER
          </Text>
          <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
            {dashboard
              ? `${dashboard.currentlyReading.length} in progress  \u00b7  ${dashboard.fandomShelves.length} fandoms`
              : "Your personal fanfic library"}
          </Text>
        </View>

        {dashboard && (
          <>
            {dashboard.newUpdates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View
                    style={[
                      styles.updatePulse,
                      { backgroundColor: colors.updateGlow },
                    ]}
                  />
                  <Text
                    style={[styles.sectionTitle, { color: colors.updateGlow }]}
                  >
                    New Updates
                  </Text>
                </View>
                <ShelfLane
                  title=""
                  works={dashboard.newUpdates}
                  glowCards
                  onPressWork={handlePressWork}
                />
              </View>
            )}

            <ShelfLane
              title="Currently Reading"
              works={dashboard.currentlyReading}
              onPressWork={handlePressWork}
            />

            <ShelfLane
              title="Recently Read"
              works={dashboard.recentlyRead}
              onPressWork={handlePressWork}
            />

            {dashboard.readThisMonth.length > 0 && (
              <ShelfLane
                title="Read This Month"
                works={dashboard.readThisMonth}
                onPressWork={handlePressWork}
              />
            )}

            {(dashboard.fandomShelves.length > 0 ||
              dashboard.originalFiction) && (
              <View style={styles.fandomSection}>
                <View
                  style={[
                    styles.sectionDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Text
                  style={[
                    styles.fandomSectionLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  FANDOM SHELVES
                </Text>

                {dashboard.originalFiction && (
                  <SplitShelf
                    shelf={dashboard.originalFiction}
                    onPressWork={handlePressWork}
                  />
                )}

                {dashboard.fandomShelves.map((shelf) => (
                  <SplitShelf
                    key={shelf.fandomName}
                    shelf={shelf}
                    onPressWork={handlePressWork}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View
          style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
        />
      </ScrollView>

      <View
        style={[
          styles.floatingHeader,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.background + "ee",
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.floatingTitle, { color: colors.foreground }]}>
          Home
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  heroHeader: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },
  appSub: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
    gap: 8,
  },
  updatePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  fandomSection: {
    marginTop: 4,
  },
  sectionDivider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  fandomSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  floatingTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
});
