import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ThemeId, THEME_META } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";

const THEME_ICONS: Record<ThemeId, string> = {
  default: "✦",
  botanical: "❧",
  cloudscape: "☁",
  shire: "♣",
  blush: "✿",
  origami: "✂",
  viking: "⛵",
  lavender: "✧",
};

export function ThemeCycler() {
  const { themeId, cycleTheme } = useTheme();
  const colors = useColors();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withTiming(rotate.value + 360, { duration: 400 });
  }, [themeId, rotate]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateZ: `${rotate.value}deg` }],
  }));

  function handlePress() {
    scale.value = withSpring(0.88, {}, () => {
      scale.value = withSpring(1);
    });
    cycleTheme();
  }

  const themeLabel = THEME_META[themeId]?.label ?? "Theme";

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.pill,
          {
            backgroundColor: colors.primary + "22",
            borderColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.icon, { color: colors.primary }]}>{THEME_ICONS[themeId]}</Text>
        <Text style={[styles.label, { color: colors.primary }]}>{themeLabel}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: {
    fontSize: 13,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
