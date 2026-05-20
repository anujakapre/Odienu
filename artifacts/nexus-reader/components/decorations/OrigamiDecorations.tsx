import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  Path,
  Pattern,
  Polygon,
  Rect,
} from "react-native-svg";

export function OrigamiBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="dotgrid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <Circle cx="11" cy="11" r="1" fill="#5b9bd5" opacity={0.18} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#dotgrid)" />
      {[
        { x: 60, y: 140 },
        { x: width - 80, y: 240 },
        { x: 40, y: 380 },
        { x: width - 50, y: 500 },
      ].map((pos, i) => (
        <G key={i} transform={`translate(${pos.x}, ${pos.y})`} opacity={0.07}>
          <Circle cx={0} cy={0} r={22} stroke="#5b9bd5" strokeWidth={1} fill="none" />
          <Circle cx={20} cy={-5} r={18} stroke="#5b9bd5" strokeWidth={1} fill="none" />
          <Circle cx={38} cy={2} r={15} stroke="#5b9bd5" strokeWidth={1} fill="none" />
        </G>
      ))}
    </Svg>
  );
}

export function CloudFormation({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const s = scale;
  return (
    <Svg width={100 * s} height={55 * s} pointerEvents="none">
      <G opacity={0.88}>
        <Circle cx={30 * s} cy={35 * s} r={20 * s} fill="#ffffff" />
        <Circle cx={50 * s} cy={28 * s} r={26 * s} fill="#ffffff" />
        <Circle cx={72 * s} cy={33 * s} r={18 * s} fill="#ffffff" />
        <Circle cx={30 * s} cy={40 * s} r={16 * s} fill="#ffffff" />
        <Circle cx={72 * s} cy={40 * s} r={14 * s} fill="#ffffff" />
        <Rect x={14 * s} y={38 * s} width={72 * s} height={14 * s} fill="#ffffff" />
        <Circle cx={30 * s} cy={35 * s} r={20 * s} fill="none" stroke="#c0d8f0" strokeWidth={1} />
        <Circle cx={50 * s} cy={28 * s} r={26 * s} fill="none" stroke="#c0d8f0" strokeWidth={1} />
        <Circle cx={72 * s} cy={33 * s} r={18 * s} fill="none" stroke="#c0d8f0" strokeWidth={1} />
      </G>
    </Svg>
  );
}

export function PaperCat({ size = 70 }: { size?: number }) {
  const s = size / 70;
  return (
    <Svg width={size} height={size * 1.1} pointerEvents="none">
      <Rect x={15 * s} y={50 * s} width={40 * s} height={28 * s} rx={2 * s} fill="#f0f0f0" stroke="#c0d8f0" strokeWidth={1.5} />
      <Line x1={15 * s} y1={62 * s} x2={55 * s} y2={62 * s} stroke="#c0d8f0" strokeWidth={0.8} opacity={0.5} />
      <Rect x={14 * s} y={20 * s} width={42 * s} height={36 * s} rx={3 * s} fill="#ffffff" stroke="#c0d8f0" strokeWidth={1.5} />
      <Line x1={35 * s} y1={20 * s} x2={35 * s} y2={56 * s} stroke="#d0e8f5" strokeWidth={0.7} opacity={0.5} />
      <Polygon points={`${14 * s},${24 * s} ${6 * s},${8 * s} ${25 * s},${20 * s}`} fill="#f0f0f0" stroke="#c0d8f0" strokeWidth={1.5} />
      <Polygon points={`${56 * s},${24 * s} ${64 * s},${8 * s} ${45 * s},${20 * s}`} fill="#f0f0f0" stroke="#c0d8f0" strokeWidth={1.5} />
      <Polygon points={`${16 * s},${23 * s} ${10 * s},${11 * s} ${24 * s},${21 * s}`} fill="#f5a0c0" opacity={0.5} />
      <Polygon points={`${54 * s},${23 * s} ${60 * s},${11 * s} ${46 * s},${21 * s}`} fill="#f5a0c0" opacity={0.5} />
      <Circle cx={26 * s} cy={36 * s} r={4 * s} fill="#2a3050" />
      <Circle cx={44 * s} cy={36 * s} r={4 * s} fill="#2a3050" />
      <Circle cx={27.5 * s} cy={34.5 * s} r={1.5 * s} fill="#ffffff" />
      <Circle cx={45.5 * s} cy={34.5 * s} r={1.5 * s} fill="#ffffff" />
      <Polygon points={`${35 * s},${44 * s} ${32 * s},${48 * s} ${38 * s},${48 * s}`} fill="#f5a0c0" />
      <Line x1={14 * s} y1={45 * s} x2={28 * s} y2={46 * s} stroke="#c0d8f0" strokeWidth={1} opacity={0.7} />
      <Line x1={14 * s} y1={48 * s} x2={28 * s} y2={47 * s} stroke="#c0d8f0" strokeWidth={1} opacity={0.7} />
      <Line x1={56 * s} y1={45 * s} x2={42 * s} y2={46 * s} stroke="#c0d8f0" strokeWidth={1} opacity={0.7} />
      <Line x1={56 * s} y1={48 * s} x2={42 * s} y2={47 * s} stroke="#c0d8f0" strokeWidth={1} opacity={0.7} />
      <Circle cx={20 * s} cy={43 * s} r={6 * s} fill="#f5a0c0" opacity={0.4} />
      <Circle cx={50 * s} cy={43 * s} r={6 * s} fill="#f5a0c0" opacity={0.4} />
    </Svg>
  );
}

export function OrigamiCrane({ size = 50 }: { size?: number }) {
  const s = size / 50;
  return (
    <Svg width={size} height={size} pointerEvents="none">
      <Polygon points={`${25 * s},${25 * s} ${2 * s},${15 * s} ${15 * s},${38 * s}`} fill="#5b9bd5" stroke="#3a78b0" strokeWidth={1} />
      <Polygon points={`${25 * s},${25 * s} ${48 * s},${15 * s} ${35 * s},${38 * s}`} fill="#a8d4f5" stroke="#3a78b0" strokeWidth={1} />
      <Polygon points={`${15 * s},${38 * s} ${25 * s},${25 * s} ${35 * s},${38 * s} ${25 * s},${48 * s}`} fill="#5b9bd5" stroke="#3a78b0" strokeWidth={1} />
      <Path d={`M ${25 * s} ${25 * s} L ${25 * s} ${10 * s}`} stroke="#3a78b0" strokeWidth={1.2} fill="none" />
      <Circle cx={25 * s} cy={9 * s} r={2.5 * s} fill="#3a78b0" />
    </Svg>
  );
}
