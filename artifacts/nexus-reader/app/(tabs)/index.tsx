import React, { useRef, useMemo, useEffect } from "react";
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

import { ShelfGrid } from "./components/ShelfGrid";
import { MascotSVG } from "./components/MascotSVG";

import { useTheme, THEMES } from "@/contexts/ThemeContext";
import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database.native";

import { syncLocalFilesSilently } from "@/lib/fileIngestion";

const THEME_TITLES: Record<string, string[]> = {
    default: ["Signal Seeker", "Matrix Voyager", "Gremlin Whisperer"],
    shire: ["Wanderer", "Cider Brewer", "Lore Weaver"],
    lofi: ["Honeybean", "Espresso Sipper", "Calico Napper"],
    viking: ["Brave Heart", "Shield Bearer", "Saga Sailor"],
    archives: ["Archive Keeper", "Rune Decipherer", "Codex Guardian"],
    botanical: ["Sproutlet", "Tea Brewer", "Forest Keeper"],
    cloudscape: ["Sky Drifter", "Star Gazer", "Wind Rider"],
    blush: ["Dreamer", "Velvet Reader", "Pastel Writer"],
    origami: ["Paper Folder", "Ink Weaver", "Washi Crafter"],
    lavender: ["Spirit Caller", "Dream Walker", "Mystic Reader"],
};

export default function HomeScreen() {
  const { theme, themeId, setTheme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  // Provide mock empty implementations directly into the view to unblock compiler if useLibrary is missing/broken
  const { dashboard, loading, error, refresh, syncLocalFiles } = useLibrary() || {
     dashboard: { newUpdates: [], currentlyReading: [], recentlyRead: [], readThisMonth: [], fandomShelves: [], originalFiction: null },
     loading: false, error: null, refresh: async () => {}, syncLocalFiles: async () => {}
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(spinAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [floatAnim, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg']
  });

  // Dynamic greeting using randomized themes array mapping
  const greetingName = useMemo(() => {
    const titles = THEME_TITLES[themeId] || THEME_TITLES['default'];
    return titles[Math.floor(Math.random() * titles.length)];
  }, [themeId]);

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

  function cycleTheme() {
    const keys = Object.keys(THEMES);
    const currentIndex = keys.indexOf(themeId);
    const nextIndex = (currentIndex + 1) % keys.length;
    setTheme(keys[nextIndex]);
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: totalPaddingTop }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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
            <Text style={[styles.appName, { color: colors.foreground }]}>{greetingName}!</Text>
            <Text style={[styles.appSub, { color: colors.mutedForeground }]}>{theme.decorations.profileGreeting} welcome back.</Text>
          </View>

          <View style={styles.headerControls}>
            <Pressable 
              onPress={cycleTheme}
              style={[styles.settingsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 18 }}>🎨</Text>
            </Pressable>
            <Pressable 
              onPress={() => router.push("/settings")}
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
                await syncLocalFilesSilently();
                await refresh(); // Force dashboard view reload after silent SQLite upserts
              }}
              style={[styles.settingsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 18 }}>🔄</Text>
            </Pressable>
          </View>
        </View>

        {/* Mascot Bubble Container */}
        <Animated.View style={[
          styles.mascotBubbleContainer, 
          { 
            backgroundColor: colors.card, 
            borderColor: colors.border,
            transform: [
              { translateY: floatAnim },
              { rotate: spin },
              { translateY: scrollY.interpolate({ inputRange: [-100, 0, 100], outputRange: [10, 0, -10], extrapolate: 'clamp' }) }
            ]
          }
        ]}>
          <MascotSVG size={60} />
          <View style={styles.bubbleTextWrapper}>
            <Text style={[styles.mascotBubbleText, { color: colors.foreground }]}>
              "{theme.decorations.mascotName} is floating here to guide your reading today. All files secured!"
            </Text>
          </View>
        </Animated.View>

        {dashboard && (
          <>
            {dashboard.newUpdates && dashboard.newUpdates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.updateHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.updateGlow ?? colors.primary }]}>New Updates</Text>
                </View>
                <ShelfGrid title="" works={dashboard.newUpdates} glowCards onPressWork={handlePressWork} horizontal={true} />
              </View>
            )}

            {dashboard.currentlyReading && dashboard.currentlyReading.length > 0 && <ShelfGrid title={theme.decorations.shelfCurrentlyReading} works={dashboard.currentlyReading} onPressWork={handlePressWork} />}
            {dashboard.recentlyRead && dashboard.recentlyRead.length > 0 && <ShelfGrid title={theme.decorations.shelfRead} works={dashboard.recentlyRead} onPressWork={handlePressWork} horizontal={true} />}
            {dashboard.readThisMonth && dashboard.readThisMonth.length > 0 && <ShelfGrid title="Read This Month" works={dashboard.readThisMonth} onPressWork={handlePressWork} />}

            {dashboard.fandomShelves && dashboard.fandomShelves.length > 0 && (
              <View style={styles.fandomSection}>
                <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />
                <Text style={[styles.fandomSectionLabel, { color: colors.mutedForeground }]}>Fandom Shelves</Text>
              </View>
            )}

            {dashboard.fandomShelves && dashboard.fandomShelves.map((shelf: any) => (
              <View key={shelf.fandomName}>
                <ShelfGrid title={shelf.fandomName} works={shelf.works} onPressWork={handlePressWork} />
              </View>
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
  appName: { fontSize: 24, fontWeight: "900", letterSpacing: 0.5 },
  appSub: { marginTop: 4, fontSize: 13 },
  headerControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingsButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  section: { marginTop: 18 },
  updateHeader: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  fandomSection: { marginTop: 18, paddingHorizontal: 20 },
  sectionDivider: { height: StyleSheet.hairlineWidth, marginBottom: 10 },
  fandomSectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
  mascotBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    gap: 16
  },
  bubbleTextWrapper: {
    flex: 1
  },
  mascotBubbleText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    fontStyle: 'italic'
  }
});