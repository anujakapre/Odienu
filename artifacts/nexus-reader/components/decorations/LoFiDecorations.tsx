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
  Rect,
} from "react-native-svg";

export function LoFiBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <Pattern
          id="stripes"
          x="0"
          y="0"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <Rect width="3" height="22" fill="#ffffff" opacity={0.04} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#stripes)" />
      {/* Faint coffee doodles */}
      {[80, 200, 320].map((x, i) => (
        <G key={i} transform={`translate(${x}, ${60 + i * 120})`} opacity={0.06}>
          <Circle cx={0} cy={0} r={20} stroke="#f0ddb5" strokeWidth={1.5} fill="none" />
          <Path
            d="M -8,-5 C -5,-15 5,-15 8,-5"
            stroke="#f0ddb5"
            strokeWidth={1}
            fill="none"
          />
        </G>
      ))}
    </Svg>
  );
}

export function PendantLamp() {
  const pulseAnim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.25, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.15, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Svg width={80} height={115} pointerEvents="none">
      {/* Glow (warm amber, behind lamp) */}
      <Ellipse cx={40} cy={90} rx={38} ry={28} fill="#f5c87a" opacity={0.18} />
      <Ellipse cx={40} cy={82} rx={24} ry={18} fill="#f5c87a" opacity={0.14} />

      {/* Cord */}
      <Line x1={40} y1={0} x2={40} y2={36} stroke="#9a7a52" strokeWidth={2.5} />

      {/* Lamp shade */}
      <Path
        d="M 14,36 L 8,80 L 72,80 L 66,36 Z"
        fill="#3a1e0c"
        stroke="#6b3a1a"
        strokeWidth={1.5}
      />
      {/* Shade rim top */}
      <Rect x={12} y={34} width={56} height={6} rx={3} fill="#4a2810" />
      {/* Shade rim bottom */}
      <Rect x={6} y={78} width={68} height={5} rx={2} fill="#4a2810" />
      {/* Shade inner glow */}
      <Path
        d="M 18,40 L 14,75 L 66,75 L 62,40 Z"
        fill="#f5c87a"
        opacity={0.2}
      />

      {/* Bulb socket + bulb */}
      <Rect x={34} y={56} width={12} height={18} rx={2} fill="#9a7a52" />
      <Ellipse cx={40} cy={70} rx={7} ry={9} fill="#f5e090" opacity={0.9} />
    </Svg>
  );
}

export function FairyLights() {
  const { width } = useWindowDimensions();
  const w = width;
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.55, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bulbCount = 9;
  const spacing = (w - 20) / (bulbCount - 1);
  const bulbColors = ["#f5c87a", "#e8a040", "#f5e090", "#c8765a", "#f5c87a", "#e8a040", "#f5e090", "#f5c87a", "#e8a040"];

  return (
    <Svg width={w} height={55} pointerEvents="none">
      {/* String */}
      <Path
        d={`M 10,12 Q ${w * 0.25},22 ${w * 0.5},10 Q ${w * 0.75},0 ${w - 10},14`}
        stroke="#6b3a1a"
        strokeWidth={1.8}
        fill="none"
      />

      {/* Bulbs */}
      {Array.from({ length: bulbCount }).map((_, i) => {
        const t = i / (bulbCount - 1);
        const x = 10 + t * (w - 20);
        const y = 10 + Math.sin(t * Math.PI) * 12;
        const color = bulbColors[i % bulbColors.length];
        return (
          <G key={i} transform={`translate(${x}, ${y + 6})`}>
            {/* Cord from string to bulb */}
            <Line x1={0} y1={-6} x2={0} y2={0} stroke="#6b3a1a" strokeWidth={1} />
            {/* Glow halo */}
            <Circle cx={0} cy={8} r={10} fill={color} opacity={0.18} />
            {/* Bulb body */}
            <Path
              d="M -5,0 Q -6,8 0,13 Q 6,8 5,0 Z"
              fill={color}
              opacity={0.9}
            />
            {/* Bulb cap */}
            <Rect x={-3} y={-3} width={6} height={5} rx={1} fill="#9a7a52" />
          </G>
        );
      })}
    </Svg>
  );
}

export function CoffeeCorner() {
  return (
    <Svg width={220} height={95} pointerEvents="none">
      {/* Croissant */}
      <G transform="translate(130, 35)">
        <Path
          d="M -30,20 C -40,5 -20,-15 0,-10 C 20,-5 40,5 30,20 C 25,30 -25,30 -30,20 Z"
          fill="#c8860a"
          stroke="#8B5c00"
          strokeWidth={1}
        />
        <Path
          d="M -22,10 C -15,0 -8,0 -2,8"
          stroke="#8B5c00"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 0,5 C 8,0 15,2 18,10"
          stroke="#8B5c00"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Glaze sheen */}
        <Path
          d="M -24,12 C -18,5 -10,4 -4,8"
          stroke="#f5d080"
          strokeWidth={1}
          fill="none"
          opacity={0.5}
          strokeLinecap="round"
        />
      </G>

      {/* Plate */}
      <Ellipse cx={155} cy={78} rx={48} ry={8} fill="#e8e0d0" stroke="#c0b090" strokeWidth={1} />

      {/* Mug */}
      <G transform="translate(30, 20)">
        {/* Mug body */}
        <Rect x={0} y={0} width={58} height={52} rx={6} fill="#3a1e0c" stroke="#6b3a1a" strokeWidth={1.5} />
        {/* Mug top */}
        <Ellipse cx={29} cy={0} rx={29} ry={5} fill="#4a2810" />
        {/* Liquid surface */}
        <Ellipse cx={29} cy={0} rx={24} ry={4} fill="#1a0c06" />
        {/* Handle */}
        <Path
          d="M 58,12 C 78,12 78,42 58,42"
          stroke="#6b3a1a"
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 58,16 C 72,16 72,38 58,38"
          stroke="#3a1e0c"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        {/* Label band */}
        <Rect x={0} y={22} width={58} height={8} rx={0} fill="#4a2810" opacity={0.6} />
      </G>

      {/* Steam from mug */}
      <Path
        d="M 42,20 C 38,12 44,5 40,0"
        stroke="#f0ddb5"
        strokeWidth={2}
        fill="none"
        opacity={0.5}
        strokeLinecap="round"
      />
      <Path
        d="M 52,18 C 56,10 50,4 54,-2"
        stroke="#f0ddb5"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
        strokeLinecap="round"
      />
      <Path
        d="M 62,20 C 58,12 64,5 60,0"
        stroke="#f0ddb5"
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
        strokeLinecap="round"
      />

      {/* Saucer under mug */}
      <Ellipse cx={59} cy={72} rx={42} ry={6} fill="#d4c8b4" stroke="#b0a090" strokeWidth={1} />
    </Svg>
  );
}

export function ButterflySketch() {
  return (
    <Svg width={65} height={70} pointerEvents="none">
      {/* Frame */}
      <Rect
        x={2}
        y={2}
        width={61}
        height={66}
        rx={3}
        fill="#2a1608"
        stroke="#6b3a1a"
        strokeWidth={2}
      />
      {/* Mat */}
      <Rect
        x={8}
        y={8}
        width={49}
        height={54}
        rx={2}
        fill="#f5f0e8"
        opacity={0.1}
      />
      {/* Butterfly body */}
      <Line
        x1={32}
        y1={18}
        x2={32}
        y2={56}
        stroke="#f0ddb5"
        strokeWidth={1.5}
        opacity={0.7}
      />
      {/* Upper wings */}
      <Path
        d="M 32,28 C 16,18 10,28 14,38 C 18,48 28,40 32,35"
        fill="none"
        stroke="#f0ddb5"
        strokeWidth={1.2}
        opacity={0.7}
      />
      <Path
        d="M 32,28 C 48,18 54,28 50,38 C 46,48 36,40 32,35"
        fill="none"
        stroke="#f0ddb5"
        strokeWidth={1.2}
        opacity={0.7}
      />
      {/* Lower wings */}
      <Path
        d="M 32,36 C 20,36 16,44 20,50 C 24,56 30,50 32,44"
        fill="none"
        stroke="#f0ddb5"
        strokeWidth={1}
        opacity={0.6}
      />
      <Path
        d="M 32,36 C 44,36 48,44 44,50 C 40,56 34,50 32,44"
        fill="none"
        stroke="#f0ddb5"
        strokeWidth={1}
        opacity={0.6}
      />
      {/* Antennae */}
      <Path
        d="M 30,24 C 26,16 22,12 20,8"
        stroke="#f0ddb5"
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
      />
      <Path
        d="M 34,24 C 38,16 42,12 44,8"
        stroke="#f0ddb5"
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
      />
      <Circle cx={20} cy={8} r={1.5} fill="#f0ddb5" opacity={0.6} />
      <Circle cx={44} cy={8} r={1.5} fill="#f0ddb5" opacity={0.6} />
    </Svg>
  );
}
