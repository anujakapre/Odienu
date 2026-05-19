import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
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

export function BotanicalBackground() {
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
          id="linen"
          x="0"
          y="0"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <Line x1="0" y1="0" x2="6" y2="6" stroke="#c8b08a" strokeWidth="0.4" opacity={0.35} />
          <Line x1="6" y1="0" x2="0" y2="6" stroke="#c8b08a" strokeWidth="0.4" opacity={0.35} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#linen)" />
    </Svg>
  );
}

export function VineDecoration() {
  const { width } = useWindowDimensions();
  const w = width;

  return (
    <Svg width={w} height={110} pointerEvents="none">
      {/* Main vine stem */}
      <Path
        d={`M -8,60 C 55,20 115,85 195,44 C 275,3 335,70 ${w * 0.8},38 C ${w * 0.9},28 ${w + 10},52 ${w + 10},52`}
        stroke="#3d6e34"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* Secondary vine branch */}
      <Path
        d={`M 120,55 C 140,30 160,20 175,10`}
        stroke="#4a7c40"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves along vine */}
      <G transform="translate(42,45) rotate(-35)">
        <Ellipse rx={14} ry={7} fill="#4a7c40" />
        <Path d="M 0,0 L 14,0" stroke="#2d5c2a" strokeWidth={0.8} />
      </G>
      <G transform="translate(85,28) rotate(20)">
        <Ellipse rx={16} ry={8} fill="#3d6e34" />
        <Path d="M 0,0 L 16,0" stroke="#2d5c2a" strokeWidth={0.8} />
      </G>
      <G transform="translate(140,62) rotate(-20)">
        <Ellipse rx={13} ry={7} fill="#4a7c40" />
        <Path d="M 0,0 L 13,0" stroke="#2d5c2a" strokeWidth={0.8} />
      </G>
      <G transform="translate(175,14) rotate(-30)">
        <Ellipse rx={12} ry={6} fill="#2d5c2a" />
      </G>
      <G transform={`translate(${w * 0.5},48) rotate(15)`}>
        <Ellipse rx={15} ry={7} fill="#4a7c40" />
        <Path d={`M 0,0 L 15,0`} stroke="#2d5c2a" strokeWidth={0.8} />
      </G>
      <G transform={`translate(${w * 0.65},22) rotate(-25)`}>
        <Ellipse rx={13} ry={6} fill="#3d6e34" />
      </G>
      <G transform={`translate(${w * 0.78},52) rotate(18)`}>
        <Ellipse rx={14} ry={7} fill="#4a7c40" />
        <Path d={`M 0,0 L 14,0`} stroke="#2d5c2a" strokeWidth={0.8} />
      </G>
      <G transform={`translate(${w * 0.88},30) rotate(-22)`}>
        <Ellipse rx={12} ry={6} fill="#2d5c2a" />
      </G>

      {/* Daisy at x≈90 */}
      <G transform="translate(90,30)">
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <Ellipse
            key={i}
            cx={Math.cos((a * Math.PI) / 180) * 7}
            cy={Math.sin((a * Math.PI) / 180) * 7}
            rx={4}
            ry={2.5}
            fill="#fff"
            transform={`rotate(${a})`}
          />
        ))}
        <Circle cx={0} cy={0} r={4} fill="#f5d060" />
      </G>

      {/* Pink wildflower at x≈w*0.6 */}
      <G transform={`translate(${w * 0.58},32)`}>
        {[0, 72, 144, 216, 288].map((a, i) => (
          <Ellipse
            key={i}
            cx={Math.cos((a * Math.PI) / 180) * 6}
            cy={Math.sin((a * Math.PI) / 180) * 6}
            rx={3.5}
            ry={2}
            fill="#f5a0c0"
            transform={`rotate(${a})`}
          />
        ))}
        <Circle cx={0} cy={0} r={3} fill="#f5c040" />
      </G>

      {/* Mushroom near left */}
      <G transform="translate(52,82)">
        <Rect x={-4} y={0} width={8} height={14} rx={1} fill="#f5f0e8" />
        <Ellipse cx={0} cy={0} rx={13} ry={9} fill="#8B4513" />
        <Circle cx={-4} cy={-3} r={2} fill="#ffffff80" />
        <Circle cx={4} cy={-5} r={1.5} fill="#ffffff80" />
      </G>

      {/* Small mushroom near right */}
      <G transform={`translate(${w * 0.7},78)`}>
        <Rect x={-3} y={0} width={6} height={10} rx={1} fill="#f5f0e8" />
        <Ellipse cx={0} cy={0} rx={10} ry={7} fill="#9b6b3a" />
        <Circle cx={2} cy={-3} r={1.5} fill="#ffffff70" />
      </G>
    </Svg>
  );
}

export function SleepingCat() {
  return (
    <Svg width={110} height={72} pointerEvents="none">
      {/* Book stack under cat */}
      <Rect x={8} y={50} width={94} height={14} rx={2} fill="#8B6914" />
      <Rect x={12} y={44} width={80} height={10} rx={2} fill="#d4a853" />
      <Rect x={16} y={38} width={70} height={9} rx={2} fill="#4a7c40" />

      {/* Cat body - large curled ellipse */}
      <G transform="translate(60, 32) rotate(-12)">
        <Ellipse cx={0} cy={0} rx={36} ry={20} fill="#1a1a2e" />
      </G>

      {/* Cat head */}
      <Circle cx={26} cy={24} r={17} fill="#1a1a2e" />

      {/* Ears */}
      <Polygon points="14,14 9,4 22,10" fill="#1a1a2e" />
      <Polygon points="28,10 36,4 34,14" fill="#1a1a2e" />
      <Polygon points="15,13 11,6 21,10" fill="#c08080" />
      <Polygon points="29,10 35,5 33,13" fill="#c08080" />

      {/* Closed eyes */}
      <Path
        d="M 18,26 Q 22,29 26,26"
        stroke="#555"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 27,25 Q 31,28 35,25"
        stroke="#555"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <Polygon points="27,31 25,34 29,34" fill="#c08080" />

      {/* Tail curling over body */}
      <Path
        d="M 88,36 C 100,20 95,8 78,14"
        stroke="#1a1a2e"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PottedPlant({ variant = 0 }: { variant?: number }) {
  const plantColors = [
    { pot: "#c4785a", leaves: ["#4a7c40", "#3d6e34", "#2d5c2a"] },
    { pot: "#d4a853", leaves: ["#e8a040", "#f5c060", "#e8a040"] },
    { pot: "#8B6914", leaves: ["#4a7c40", "#d4625a", "#4a7c40"] },
  ];
  const p = plantColors[variant % plantColors.length];

  return (
    <Svg width={55} height={75} pointerEvents="none">
      {/* Pot */}
      <Path
        d="M 8,55 L 12,75 L 43,75 L 47,55 Z"
        fill={p.pot}
      />
      <Rect x={5} y={50} width={45} height={8} rx={3} fill={p.pot} />
      <Ellipse cx={27} cy={51} rx={22} ry={5} fill={p.pot} opacity={0.7} />

      {/* Soil */}
      <Ellipse cx={27} cy={51} rx={19} ry={4} fill="#5c3d1e" />

      {/* Leaves */}
      <Path
        d="M 27,50 C 15,35 12,20 20,10"
        stroke={p.leaves[0]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 27,50 C 27,30 27,15 27,5"
        stroke={p.leaves[1]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 27,50 C 38,35 42,20 35,10"
        stroke={p.leaves[2]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 27,50 C 10,42 5,35 8,25"
        stroke={p.leaves[0]}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 27,50 C 42,42 48,32 45,22"
        stroke={p.leaves[2]}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ShelfFlowerAccent() {
  return (
    <Svg width={60} height={20} pointerEvents="none">
      {[12, 30, 48].map((x, i) => (
        <G key={i} transform={`translate(${x}, 10)`}>
          {[0, 90, 180, 270].map((a, j) => (
            <Ellipse
              key={j}
              cx={Math.cos((a * Math.PI) / 180) * 4}
              cy={Math.sin((a * Math.PI) / 180) * 4}
              rx={3}
              ry={1.5}
              fill={i % 2 === 0 ? "#f5a0c0" : "#fff"}
              transform={`rotate(${a})`}
            />
          ))}
          <Circle cx={0} cy={0} r={2.5} fill="#f5d060" />
        </G>
      ))}
    </Svg>
  );
}
