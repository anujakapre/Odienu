import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

export function LavenderBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect width={width} height={height} fill="#E8EAF6" />
      {Array.from({ length: 18 }).map((_, i) => (
        <Circle key={i} cx={20 + i * 40} cy={50 + (i % 4) * 120} r={2.5} fill="#ffffff" opacity={0.5} />
      ))}
    </Svg>
  );
}

export function AmethystWindow() {
  return (
    <Svg width={100} height={70} pointerEvents="none">
      <Rect x={4} y={6} width={92} height={24} rx={8} fill="#ffffff" opacity={0.45} />
      <Path d="M 20 18 L 26 8 L 34 20 L 28 30 Z" fill="#9a7bff" />
      <Path d="M 38 18 L 46 4 L 56 24 L 44 34 Z" fill="#7e6ee6" />
      <Path d="M 58 16 L 66 8 L 74 22 L 64 30 Z" fill="#a78bfa" />
      <Path d="M 52 24 C 60 28 68 34 72 48" stroke="#7f5bd5" strokeWidth={3} fill="none" />
      <Path d="M 72 48 C 76 60 82 64 92 68" stroke="#9a7bff" strokeWidth={3} fill="none" />
    </Svg>
  );
}

export function GhostReader() {
  return (
    <Svg width={84} height={88} pointerEvents="none">
      <Path d="M 14 36 C 14 20 26 10 42 10 C 58 10 70 20 70 36 L 70 62 C 70 72 62 78 54 74 L 42 68 L 30 74 C 22 78 14 72 14 62 Z" fill="#ffffff" stroke="#7e6ee6" strokeWidth={2} />
      <Circle cx={33} cy={34} r={3} fill="#3F51B5" />
      <Circle cx={51} cy={34} r={3} fill="#3F51B5" />
      <Path d="M 32 48 Q 42 55 52 48" stroke="#3F51B5" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Rect x={28} y={56} width={28} height={16} rx={2} fill="#e8eaf6" stroke="#7e6ee6" strokeWidth={1.5} />
    </Svg>
  );
}
