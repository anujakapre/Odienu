import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
} from "react-native-svg";

import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/contexts/ThemeContext";

function GhostWithBooks({ color, bookColors }: { color: string; bookColors: string[] }) {
  return (
    <Svg width={90} height={100} viewBox="0 0 90 100">
      <G opacity={0.85}>
        <Path
          d="M 15 50 Q 15 20 45 20 Q 75 20 75 50 L 75 80 Q 65 75 55 82 Q 45 89 35 82 Q 25 75 15 80 Z"
          fill={color}
          stroke={color}
          strokeWidth={1}
          opacity={0.9}
        />
        <Circle cx={35} cy={48} r={5} fill="#000" opacity={0.5} />
        <Circle cx={55} cy={48} r={5} fill="#000" opacity={0.5} />
        <Path
          d="M 36 58 Q 45 65 54 58"
          stroke="#000"
          strokeWidth={1.5}
          fill="none"
          opacity={0.4}
          strokeLinecap="round"
        />
      </G>
      <G transform="translate(18, 60) rotate(-10)">
        {bookColors.map((bc, i) => (
          <Rect
            key={i}
            x={i * 8}
            y={-i * 2}
            width={7}
            height={24}
            rx={1}
            fill={bc}
            stroke="#00000022"
            strokeWidth={0.5}
          />
        ))}
      </G>
    </Svg>
  );
}

interface EmptyLaneProps {
  message?: string;
}

export function EmptyLane({ message = "Nothing here yet" }: EmptyLaneProps) {
  const colors = useColors();
  const { themeId } = useTheme();

  const ghostColor =
    themeId === "botanical"
      ? "#c8e6c0"
      : themeId === "lofi"
      ? "#f0ddb5"
      : themeId === "origami"
      ? "#ffffff"
      : "#e8e0f0";

  const bookColors =
    themeId === "botanical"
      ? ["#4a7c40", "#8B6914", "#d4625a", "#9b59b6"]
      : themeId === "lofi"
      ? ["#e8a857", "#c8765a", "#4a2810", "#8B5e3c"]
      : themeId === "origami"
      ? ["#5b9bd5", "#f5a0c0", "#9070e0", "#5bbf9f"]
      : ["#c084fc", "#f59e0b", "#34d399", "#e879f9"];

  return (
    <View style={styles.container}>
      <GhostWithBooks color={ghostColor} bookColors={bookColors} />
      <Text style={[styles.message, { color: colors.mutedForeground }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  message: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});
