import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { ThemeId } from "@/constants/themes";

const THEME_ICONS: Record<ThemeId, string> = {
  default: "✦",
  botanical: "❧",
  lofi: "♨",
  origami: "✿",
};

const THEME_SHORT: Record<ThemeId, string> = {
  default: "Dark",
  botanical: "Botanical",
  lofi: "Lo-Fi",
  origami: "Origami",
};

export function ThemeCycler() {
  const { themeId, cycleTheme } = useTheme();
  const colors = useColors();
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    rotateZ.value = withTiming(rotateZ.value + 360, { duration: 400 });
  }, [themeId]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  function handlePress() {
    scale.value = withSpring(0.88, {}, () => {
      scale.value = withSpring(1);
    });
    cycleTheme();
  }

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
        <Text style={[styles.icon, { color: colors.primary }]}>
          {THEME_ICONS[themeId]}
        </Text>
        <Text style={[styles.label, { color: colors.primary }]}>
          {THEME_SHORT[themeId]}
        </Text>
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
