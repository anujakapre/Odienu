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
import { ThemeCycler } from "@/components/ThemeCycler";
import { BotanicalBackground, PottedPlant, SleepingCat, VineDecoration } from "@/components/decorations/BotanicalDecorations";
import { BlushBackground, FairyLightsBlush, KnitBlanket, TulipsBlush } from "@/components/decorations/BlushDecorations";
import { CloudLadders, CloudscapeBackground, CloudStars, CloudWhale } from "@/components/decorations/CloudscapeDecorations";
import { LavenderBackground, GhostReader, AmethystWindow } from "@/components/decorations/LavenderDecorations";
import { LoFiBackground, PendantLamp, FairyLights, CoffeeCorner, ButterflySketch } from "@/components/decorations/LoFiDecorations";
import { ShireBackground, HobbitDoor, BrassLantern, ElvenDeer } from "@/components/decorations/ShireDecorations";
import { OrigamiBackground, CloudFormation, PaperCat, OrigamiCrane, OrigamiBunny, StepLadder } from "@/components/decorations/OrigamiDecorations";
import { VikingBackground, BabyDragon, ShieldPattern } from "@/components/decorations/VikingDecorations";
import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { themeId } = useTheme();
  const { dashboard, loading, error, refresh } = useLibrary();
  const [refreshing, setRefreshing] = React.useState(false);

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
        <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      {themeId === "botanical" && <BotanicalBackground />}
      {themeId === "cloudscape" && <CloudscapeBackground />}
      {themeId === "shire" && <ShireBackground />}
      {themeId === "blush" && <BlushBackground />}
      {themeId === "lofi" && <LoFiBackground />}
      {themeId === "origami" && <OrigamiBackground />}
      {themeId === "viking" && <VikingBackground />}
      {themeId === "lavender" && <LavenderBackground />}

      {themeId === "lofi" && (
        <View style={[styles.lofiTopLayer, { top: floatingHeaderH, pointerEvents: "none" }]}>
          <View style={styles.lampCenter}><PendantLamp /></View>
          <FairyLights />
        </View>
      )}

      {themeId === "cloudscape" && (
        <View style={[styles.topAccent, { top: floatingHeaderH + 8, pointerEvents: "none" }]}>
          <CloudStars />
          <CloudscapeBackground />
        </View>
      )}

      {themeId === "shire" && (
        <View style={[styles.cornerAccent, { top: floatingHeaderH + 22, pointerEvents: "none" }]}>
          <HobbitDoor />
          <BrassLantern />
        </View>
      )}

      {themeId === "blush" && (
        <View style={[styles.topAccent, { top: floatingHeaderH - 4, pointerEvents: "none" }]}>
          <FairyLightsBlush />
          <TulipsBlush />
          <KnitBlanket />
        </View>
      )}

      {themeId === "viking" && (
        <View style={[styles.cornerAccent, { top: floatingHeaderH + 20, pointerEvents: "none" }]}>
          <ShieldPattern />
          <BabyDragon />
        </View>
      )}

      {themeId === "lavender" && (
        <View style={[styles.cornerAccent, { top: floatingHeaderH + 12, pointerEvents: "none" }]}>
          <AmethystWindow />
          <GhostReader />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: totalPaddingTop }]}
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
          <ThemeCycler />
        </View>

        {themeId === "botanical" && <VineDecoration />}

        {dashboard && (
          <>
            {dashboard.newUpdates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.updateHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.updateGlow }]}>New Updates</Text>
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
      </ScrollView>
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
  section: { marginTop: 18 },
  updateHeader: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  fandomSection: { marginTop: 18, paddingHorizontal: 20 },
  sectionDivider: { height: StyleSheet.hairlineWidth, marginBottom: 10 },
  fandomSectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
  topAccent: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  cornerAccent: { position: "absolute", right: 12, alignItems: "flex-end", gap: 6 },
  lofiTopLayer: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  lampCenter: { alignItems: "center", marginBottom: 2 },
});