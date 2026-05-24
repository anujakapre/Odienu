import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  Pattern,
  Rect,
} from "react-native-svg";

export function AncientArchivesBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="archiveGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* Subtle archival masonry guidelines */}
          <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0a96d" strokeWidth={0.6} opacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#archiveGrid)" />
    </Svg>
  );
}

export function WispGlow({ size = 65 }: { size?: number }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Gentle hovering loop sequence
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 3200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3200, useNativeDriver: true }),
      ])
    ).start();

    // Constant shifting visual pulse sequence
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const s = size / 65;

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Svg width={size} height={size} pointerEvents="none">
        <G transform={`translate(${size / 2}, ${size / 2})`}>
          {/* Layered translucent radial magic fields */}
          <Animated.G style={{ transform: [{ scale: pulseAnim }] }}>
            <Circle cx={0} cy={0} r={28 * s} fill="#e0a96d" opacity={0.12} />
            <Circle cx={0} cy={0} r={18 * s} fill="#e0a96d" opacity={0.25} />
          </Animated.G>
          <Circle cx={0} cy={0} r={8 * s} fill="#ffffff" />
          {/* Orbiting geometric rings */}
          <Circle cx={0} cy={0} r={22 * s} stroke="#e0a96d" strokeWidth={1} fill="none" strokeDasharray="4, 4" opacity={0.4} />
        </G>
      </Svg>
    </Animated.View>
  );
}

export function VaultRunes() {
  return (
    <Svg width={80} height={120} pointerEvents="none" opacity={0.15}>
      <G stroke="#e0a96d" strokeWidth={1.5} fill="none" strokeLinecap="round">
        {/* Runic glyph geometric paths */}
        <Path d="M 20 20 L 40 40 M 40 40 L 60 20 M 40 40 L 40 80 M 20 60 L 60 60" />
        <Path d="M 30 90 L 50 110 M 50 90 L 30 110 M 40 90 L 40 110" />
      </G>
    </Svg>
  );
}
