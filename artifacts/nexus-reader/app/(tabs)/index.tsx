import React, { useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ShelfLane } from "@/components/ShelfLane";
import { SplitShelf } from "@/components/SplitShelf";
import { ThemeCycler } from "@/components/ThemeCycler";
import { ThemeBackgroundLayer } from "@/components/ThemeDecorations";

import { useTheme } from "@/contexts/ThemeContext";
import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

export default function HomeScreen() {
  const { theme, themeId } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const { dashboard, loading, error, refresh, syncLocalFiles } = useLibrary();
  // Tracks the user's scroll position for the jumping mascot animation
  const scrollY = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const floatingHeaderH = topPad + 50;
  const totalPaddingTop = floatingHeaderH + 8;

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  function handlePressWork(work: Work) {
    router.push(`/reader/${work.workId}`);
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading Oidenu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}> 
        <Text style={[styles.errorText, { color: colors.destructive ?? '#ef4444' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 

      {/* 🌸 Universal Crash-Proof Mascot Layer */}
      <ThemeBackgroundLayer themeId={themeId} colors={colors} scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: totalPaddingTop }]}
        // Bind the scroll event to our animated tracking value
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16} // Fires smoothly at 60fps
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
          <View style={{ flex: 1 }}>
            <Text style={[styles.appName, { color: colors.foreground }]}>OIDENU</Text>
            <Text style={[styles.appSub, { color: colors.mutedForeground }]}>Your Oidenu library</Text>
          </View>

          <View style={styles.headerControls}>
            <ThemeCycler />
            <Pressable 
              onPress={() => router.push("/(tabs)/settings")}
              style={({ pressed }) => [
                styles.settingsButton, 
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
            <Pressable 
              onPress={async () => {
                console.log("Syncing...");
                await syncLocalFiles();
                console.log("Sync complete!");
              }}
              style={[styles.settingsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 18 }}>🔄</Text>
            </Pressable>
          </View>
        </View>

        {dashboard && (
          <>
            {dashboard.newUpdates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.updateHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.updateGlow ?? colors.primary }]}>New Updates</Text>
                </View>
                <ShelfLane title="" works={dashboard.newUpdates} glowCards onPressWork={handlePressWork} />
              </View>
            )}

            <ShelfLane title="Currently Reading" works={dashboard.currentlyReading} onPressWork={handlePressWork} showEmpty emptyMessage="Nothing being read right now." />
            <ShelfLane title="Recently Read" works={dashboard.recentlyRead} onPressWork={handlePressWork} />
            {dashboard.readThisMonth.length > 0 && <ShelfLane title="Read This Month" works={dashboard.readThisMonth} onPressWork={handlePressWork} />}

            {(dashboard.fandomShelves.length > 0 || dashboard.originalFiction) && (
              <View style={styles.fandomSection}>
                <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />
                <Text style={[styles.fandomSectionLabel, { color: colors.mutedForeground }]}>Fandom Shelves</Text>
              </View>
            )}

            {dashboard.originalFiction && (
              <SplitShelf shelf={dashboard.originalFiction} onPressWork={handlePressWork} />
            )}

            {dashboard.fandomShelves.map((shelf) => (
              <SplitShelf key={shelf.fandomName} shelf={shelf} onPressWork={handlePressWork} />
            ))}
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  loadingText: { marginTop: 12, fontSize: 15 },
  errorText: { fontSize: 15, textAlign: "center" },
  scroll: { paddingBottom: 140 },
  heroHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, marginBottom: 18 },
  appName: { fontSize: 30, fontWeight: "900", letterSpacing: 1.5 },
  appSub: { marginTop: 4, fontSize: 13 },
  headerControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingsButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  section: { marginTop: 18 },
  updateHeader: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  fandomSection: { marginTop: 18, paddingHorizontal: 20 },
  sectionDivider: { height: StyleSheet.hairlineWidth, marginBottom: 10 },
  fandomSectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
});