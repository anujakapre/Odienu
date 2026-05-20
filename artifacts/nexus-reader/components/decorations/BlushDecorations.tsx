import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

export function BlushBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect width={width} height={height} fill="#fadadd" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Circle key={i} cx={40 + i * 55} cy={80 + (i % 3) * 140} r={20} fill="#fff6f8" opacity={0.35} />
      ))}
    </Svg>
  );
}

export function FairyLightsBlush() {
  return (
    <Svg width={180} height={50} pointerEvents="none">
      <Path d="M 0 12 Q 30 0 60 14 T 120 12 T 180 16" stroke="#f5a0c0" strokeWidth={2} fill="none" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Circle key={i} cx={10 + i * 32} cy={16 + (i % 2) * 4} r={4.5} fill="#fff6f8" stroke="#f5a0c0" strokeWidth={1} />
      ))}
    </Svg>
  );
}

export function TulipsBlush() {
  return (
    <Svg width={56} height={80} pointerEvents="none">
      <Rect x={20} y={44} width={16} height={26} rx={8} fill="#ffffff" opacity={0.7} />
      <Path d="M 28 20 C 18 14 16 32 26 36 C 28 28 30 28 32 36 C 42 32 40 14 28 20 Z" fill="#f5a0c0" />
      <Path d="M 28 20 C 24 10 20 8 18 2" stroke="#7fbf7f" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M 28 20 C 30 10 34 8 36 2" stroke="#7fbf7f" strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function KnitBlanket() {
  return (
    <Svg width={96} height={64} pointerEvents="none">
      <Path d="M 6 20 C 20 6 40 10 50 20 C 60 30 76 30 90 16 L 90 58 L 6 58 Z" fill="#f7d7e3" stroke="#f0b9cc" strokeWidth={1.5} />
      <Path d="M 20 18 L 76 48" stroke="#ffffff" strokeWidth={2} opacity={0.6} />
      <Path d="M 32 14 L 88 44" stroke="#ffffff" strokeWidth={2} opacity={0.5} />
    </Svg>
  );
}
