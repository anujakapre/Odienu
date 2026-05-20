import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

export function VikingBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect width={width} height={height} fill="#5f879b" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Path key={i} d={`M ${i * 120 - 20} ${80 + (i % 2) * 90} C ${i * 120 + 50} ${50 + (i % 2) * 40}, ${i * 120 + 80} ${120 + (i % 2) * 40}, ${i * 120 + 140} ${90 + (i % 2) * 50}`} stroke="#b8d7e4" strokeWidth={4} fill="none" opacity={0.3} />
      ))}
    </Svg>
  );
}

export function BabyDragon() {
  return (
    <Svg width={120} height={84} pointerEvents="none">
      <Path d="M 18 52 C 20 30 44 20 62 28 C 76 34 86 46 82 58 C 76 72 52 76 36 68 C 28 64 22 60 18 52 Z" fill="#d2f0ff" stroke="#23313a" strokeWidth={2} />
      <Path d="M 76 52 C 94 48 104 36 110 22" stroke="#d2f0ff" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M 86 22 L 96 12" stroke="#23313a" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={42} cy={46} r={3} fill="#23313a" />
      <Rect x={84} y={54} width={22} height={12} rx={3} fill="#ffd36a" stroke="#23313a" strokeWidth={2} />
    </Svg>
  );
}

export function ShieldPattern() {
  return (
    <Svg width={48} height={48} pointerEvents="none">
      <Path d="M 24 4 L 40 12 L 36 30 C 33 38 24 44 24 44 C 24 44 15 38 12 30 L 8 12 Z" fill="#996a3c" stroke="#ffe17f" strokeWidth={2} />
      <Path d="M 24 10 L 24 38 M 14 22 L 34 22" stroke="#ffd36a" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
