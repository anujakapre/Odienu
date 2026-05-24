import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLibrary } from "@/hooks/useLibrary";
import { Work } from "@/lib/database";

interface BookCardProps {
  work: Work;
  onPress: (work: Work) => void;
}

export function BookCard({ work, onPress }: BookCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const decorations = theme.decorations;
  const { toggleWorkFavorite } = useLibrary();

  const isFavorite = !!work.isFavorite; 

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation(); 
    try {
      await toggleWorkFavorite(work.workId, isFavorite);
    } catch (err) {
      console.warn("Failed to update favorite layout indicator:", err);
    }
  };

  return (
    <Pressable
      onPress={() => onPress(work)}
      style={({ pressed }) => [
        styles.cardFrame,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Dynamic Cover Asset Rendering Slot - Now 1:1 Aspect Ratio Square */}
      <View style={[styles.coverWrapper, { backgroundColor: colors.muted }]}>
        {work.coverUrl ? (
          <Image source={{ uri: work.coverUrl }} style={styles.coverImage} />
        ) : (
          <Text style={[styles.coverFallbackText, { color: colors.mutedForeground }]}>
            {work.title ? work.title.slice(0, 1).toUpperCase() : "B"}
          </Text>
        )}

        {/* 🎀 Whimsical Ornaments Made Significantly Larger and Noticeable */}
        <Pressable
          onPress={handleFavoritePress}
          style={[
            styles.favoriteBadgeContainer,
            { 
              backgroundColor: isFavorite ? "#FFF0F5" : colors.card, 
              borderColor: isFavorite ? "#FFB6C1" : colors.border 
            },
          ]}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.badgeEmojiIcon}>
            {isFavorite ? decorations.favoriteIconActive : decorations.favoriteIconInactive}
          </Text>
        </Pressable>
      </View>

      {/* Cleaned Metadata Layout Blocks (Duplicates Pulled Out) */}
      <View style={styles.metaDataContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.bookTitleText, { color: colors.foreground }]} numberOfLines={2}>
            {work.title}
          </Text>
          {!!work.isComplete && (
            <View style={[styles.completeBadge, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
              <Text style={[styles.completeBadgeText, { color: colors.primary }]}>Done</Text>
            </View>
          )}
        </View>
        <Text style={[styles.bookAuthorText, { color: colors.mutedForeground }]} numberOfLines={1}>
          {work.author}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardFrame: {
    width: "47%", // Leaves an elegant gutter margin gap in your layout grid splits
    borderWidth: 1,
    borderRadius: 16,
    overflow: "visible", // Critical to allow large whimsical ribbons to overlap boundaries!
    marginBottom: 12,
    marginHorizontal: "1.5%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  coverWrapper: {
    width: "100%",
    aspectRatio: 1, // 📐 Forces the primary visual frame into a perfect clean square layout
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverFallbackText: {
    fontSize: 42,
    fontWeight: "900",
    opacity: 0.75,
  },
  favoriteBadgeContainer: {
    position: "absolute",
    top: -4, // Shifts it proudly over the top frame edge layout bounds
    right: -4,
    width: 38, // Noticeably larger touch and display surface target
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badgeEmojiIcon: {
    fontSize: 20, // Emoji scales up inside the ribbon frame wrapper
  },
  metaDataContainer: {
    padding: 10,
    gap: 2,
    justifyContent: "flex-end",
  },
  bookTitleText: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 16,
    flex: 1,
  },
  bookAuthorText: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  completeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  completeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
