import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

export function ShireBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect width={width} height={height} fill="#23361f" />
      <Path d={`M 0 ${height * 0.7} C ${width * 0.18} ${height * 0.52}, ${width * 0.32} ${height * 0.82}, ${width * 0.52} ${height * 0.63} S ${width * 0.84} ${height * 0.86}, ${width} ${height * 0.68} L ${width} ${height} L 0 ${height} Z`} fill="#3d532f" opacity={0.9} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Path key={i} d={`M ${i * 70 + 20} ${40 + (i % 3) * 24} C ${i * 70 + 40} ${20 + (i % 2) * 10}, ${i * 70 + 56} ${60 + (i % 2) * 14}, ${i * 70 + 76} ${40 + (i % 3) * 20}`} stroke="#6b7d5d" strokeWidth={2} fill="none" opacity={0.25} />
      ))}
    </Svg>
  );
}

export function HobbitDoor() {
  return (
    <Svg width={60} height={84} pointerEvents="none">
      <Circle cx={30} cy={42} r={28} fill="#57b846" stroke="#1f3f19" strokeWidth={3} />
      <Rect x={26} y={33} width={8} height={20} rx={4} fill="#1f3f19" />
      <Circle cx={46} cy={42} r={3} fill="#d8c16f" />
    </Svg>
  );
}

export function BrassLantern() {
  return (
    <Svg width={44} height={72} pointerEvents="none">
      <Path d="M 22 0 L 22 10" stroke="#d8c16f" strokeWidth={3} strokeLinecap="round" />
      <Rect x={10} y={12} width={24} height={34} rx={7} fill="#c08d3d" stroke="#8e6429" strokeWidth={2} />
      <Ellipse cx={22} cy={30} rx={9} ry={12} fill="#f9e3a0" opacity={0.5} />
      <Path d="M 14 18 H 30" stroke="#8e6429" strokeWidth={2} />
    </Svg>
  );
}

export function ElvenDeer() {
  return (
    <Svg width={120} height={86} pointerEvents="none">
      <Path d="M 20 60 C 24 40 34 30 48 28 C 58 26 70 30 78 40 C 88 52 96 56 104 56" stroke="#d8f1b8" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M 42 29 C 38 14 32 10 26 6" stroke="#d8f1b8" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M 52 28 C 52 12 58 7 64 4" stroke="#d8f1b8" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={78} cy={40} r={10} fill="#d8f1b8" opacity={0.7} />
      <Path d="M 72 40 Q 78 46 84 40" stroke="#23361f" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
