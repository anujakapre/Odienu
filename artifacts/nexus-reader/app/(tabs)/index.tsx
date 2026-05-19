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
import {
  BotanicalBackground,
  PottedPlant,
  SleepingCat,
  VineDecoration,
} from "@/components/decorations/BotanicalDecorations";
import {
  CoffeeCorner,
  FairyLights,
  LoFiBackground,
  PendantLamp,
  ButterflySketch,
} from "@/components/decorations/LoFiDecorations";
import {
  CloudFormation,
  OrigamiBackground,
  OrigamiCrane,
  OrigamiBunny,
  PaperCat,
  StepLadder,
} from "@/components/decorations/OrigamiDecorations";
import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

const LOFI_LAMP_HEIGHT = 115;
const LOFI_LIGHTS_HEIGHT = 55;
const LOFI_TOP_DECORATION = LOFI_LAMP_HEIGHT + LOFI_LIGHTS_HEIGHT;

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { themeId } = useTheme();
  const { dashboard, loading, error, refresh } = useLibrary();
  const [refreshing, setRefreshing] = React.useState(false);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const floatingHeaderH = topPad + 50;

  const themeExtraPadding =
    themeId === "lofi" ? LOFI_TOP_DECORATION : 0;

  const totalPaddingTop = floatingHeaderH + themeExtraPadding + 8;

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
      <View
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        {themeId === "botanical" && <BotanicalBackground />}
        {themeId === "lofi" && <LoFiBackground />}
        {themeId === "origami" && <OrigamiBackground />}
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
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* === BACKGROUND TEXTURE LAYER === */}
      {themeId === "botanical" && <BotanicalBackground />}
      {themeId === "lofi" && <LoFiBackground />}
      {themeId === "origami" && <OrigamiBackground />}

      {/* === FIXED TOP DECORATION LAYER (Lo-Fi only) === */}
      {themeId === "lofi" && (
        <View
          style={[
            styles.lofiTopLayer,
            { top: floatingHeaderH, pointerEvents: "none" },
          ]}
        >
          <View style={styles.lampCenter}>
            <PendantLamp />
          </View>
          <FairyLights />
        </View>
      )}

      {/* === FIXED BOTTOM DECORATION (Lo-Fi coffee corner) === */}
      {themeId === "lofi" && (
        <View
          style={[
            styles.lofiBottomLayer,
            {
              bottom: insets.bottom + (Platform.OS === "web" ? 34 : 90),
              pointerEvents: "none",
            },
          ]}
        >
          <CoffeeCorner />
        </View>
      )}

      {/* === SCROLLABLE CONTENT === */}
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
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.appName, { color: colors.foreground }]}>
              NEXUS READER
            </Text>
            <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
              {dashboard
                ? `${dashboard.currentlyReading.length} in progress  \u00b7  ${dashboard.fandomShelves.length} fandoms`
                : "Your personal fanfic library"}
            </Text>
          </View>
          <ThemeCycler />
        </View>

        {/* Botanical Vine */}
        {themeId === "botanical" && (
          <View style={styles.vineRow}>
            <VineDecoration />
          </View>
        )}

        {dashboard && (
          <>
            {/* New Updates lane */}
            {dashboard.newUpdates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.updateHeader}>
                  <View
                    style={[
                      styles.updatePulse,
                      { backgroundColor: colors.updateGlow },
                    ]}
                  />
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.updateGlow },
                    ]}
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
              showEmpty
              emptyMessage="Nothing being read right now."
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

            {/* Botanical plants between lanes and shelves */}
            {themeId === "botanical" && (
              <View style={styles.botanicalPlants}>
                <PottedPlant variant={0} />
                <PottedPlant variant={2} />
                <PottedPlant variant={1} />
              </View>
            )}

            {/* Origami cloud accent above fandom shelves */}
            {themeId === "origami" &&
              dashboard.fandomShelves.length > 0 && (
                <View style={styles.origamiClouds}>
                  <CloudFormation scale={0.7} />
                  <CloudFormation scale={1.0} />
                  <CloudFormation scale={0.75} />
                </View>
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

                {dashboard.fandomShelves.map((shelf, idx) => (
                  <React.Fragment key={shelf.fandomName}>
                    <SplitShelf
                      shelf={shelf}
                      onPressWork={handlePressWork}
                    />
                    {/* Origami step ladder between shelves */}
                    {themeId === "origami" && idx < dashboard.fandomShelves.length - 1 && (
                      <View style={styles.origamiLadder}>
                        <StepLadder />
                      </View>
                    )}
                    {/* Lo-Fi butterfly sketch as accent */}
                    {themeId === "lofi" && idx === 0 && (
                      <View style={styles.lofiAccent}>
                        <ButterflySketch />
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            )}

            {/* Botanical sleeping cat footer */}
            {themeId === "botanical" && (
              <View style={styles.catSection}>
                <SleepingCat />
                <Text
                  style={[
                    styles.catCaption,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Your shelf guardian is having a rest.
                </Text>
              </View>
            )}

            {/* Origami animals footer */}
            {themeId === "origami" && (
              <View style={styles.origamiAnimals}>
                <PaperCat size={65} />
                <OrigamiCrane size={50} />
                <OrigamiBunny size={55} />
              </View>
            )}
          </>
        )}

        <View
          style={{
            height:
              insets.bottom +
              (Platform.OS === "web" ? 34 : 90) +
              (themeId === "lofi" ? 100 : 24),
          }}
        />
      </ScrollView>

      {/* === FLOATING HEADER === */}
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
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, fontWeight: "500" },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  heroHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 2,
  },
  appSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3,
  },
  vineRow: {
    marginBottom: 8,
    marginTop: -8,
  },
  section: { marginBottom: 8 },
  updateHeader: {
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
  fandomSection: { marginTop: 4 },
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
  botanicalPlants: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  origamiClouds: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  origamiLadder: {
    alignSelf: "flex-end",
    marginRight: 24,
    marginTop: -16,
    marginBottom: 4,
  },
  lofiAccent: {
    alignSelf: "flex-end",
    marginRight: 28,
    marginBottom: 8,
    opacity: 0.85,
  },
  catSection: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  catCaption: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
  origamiAnimals: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 20,
    paddingVertical: 16,
  },
  lofiTopLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
  },
  lofiBottomLayer: {
    position: "absolute",
    left: 16,
    zIndex: 2,
  },
  lampCenter: {
    alignItems: "center",
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  floatingTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
});
