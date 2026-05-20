import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";

export function CloudscapeBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect width={width} height={height} fill="#4A90E2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <G key={i} opacity={0.68} transform={`translate(${(i * 135) % (width + 160) - 80}, ${(i * 151) % (height + 110) - 55})`}>
          <Ellipse cx={22} cy={18} rx={22} ry={14} fill="#ffffff" opacity={0.9} />
          <Ellipse cx={44} cy={12} rx={18} ry={12} fill="#ffffff" opacity={0.9} />
          <Ellipse cx={58} cy={20} rx={20} ry={13} fill="#ffffff" opacity={0.9} />
        </G>
      ))}
    </Svg>
  );
}

export function CloudShelf() {
  return (
    <Svg width={180} height={54} pointerEvents="none">
      <Path d="M 8 34 C 18 14 36 14 46 24 C 56 8 82 8 92 22 C 104 14 124 14 132 28 C 142 22 160 24 172 34 L 172 44 L 8 44 Z" fill="#ffffff" opacity={0.96} stroke="#dff0ff" strokeWidth={1.5} />
      <Path d="M 24 40 L 24 50" stroke="#ffb347" strokeWidth={3} strokeLinecap="round" />
      <Path d="M 52 40 L 52 50" stroke="#ffb347" strokeWidth={3} strokeLinecap="round" />
      <Path d="M 80 38 L 80 50" stroke="#ffb347" strokeWidth={3} strokeLinecap="round" />
      <Path d="M 110 40 L 110 50" stroke="#ffb347" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

export function CloudWhale() {
  return (
    <Svg width={120} height={72} pointerEvents="none">
      <Path d="M 10 42 C 24 18 56 14 78 24 C 96 32 104 48 98 58 C 90 70 60 72 40 64 C 28 60 18 54 10 42 Z" fill="#ffffff" opacity={0.97} stroke="#dff0ff" strokeWidth={1.5} />
      <Circle cx={38} cy={36} r={3} fill="#4A90E2" />
      <Path d="M 88 42 C 102 34 108 26 112 16" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
      <Path d="M 104 18 C 104 8 112 6 116 12" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" fill="none" />
      <Path d="M 30 52 Q 42 58 54 52" stroke="#4A90E2" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function CloudLadders() {
  return (
    <Svg width={60} height={120} pointerEvents="none">
      <Line x1={10} y1={10} x2={26} y2={110} stroke="#ffb347" strokeWidth={4} strokeLinecap="round" />
      <Line x1={34} y1={10} x2={50} y2={110} stroke="#ffb347" strokeWidth={4} strokeLinecap="round" />
      {[24, 44, 64, 84].map((y) => (
        <Line key={y} x1={14} y1={y} x2={38} y2={y} stroke="#ffb347" strokeWidth={3.2} strokeLinecap="round" />
      ))}
    </Svg>
  );
}

export function CloudStars() {
  return (
    <Svg width={180} height={40} pointerEvents="none">
      {Array.from({ length: 5 }).map((_, i) => (
        <G key={i} transform={`translate(${20 + i * 28}, ${18 + (i % 2) * 4})`}>
          <Circle cx={0} cy={0} r={2.3} fill="#fff" />
          <Path d="M 0,-8 L 0,8 M -8,0 L 8,0" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.95} />
        </G>
      ))}
    </Svg>
  );
}
