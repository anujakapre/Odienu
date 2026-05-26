import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon, G } from 'react-native-svg';

interface MascotProps {
  themeId: string;
  primaryColor: string;
  size?: number;
}

export function MascotSVG({ themeId, primaryColor, size = 100 }: MascotProps) {
  // Safe color fallbacks for detailed accents inside geometric layouts
  const eyeColor = '#1a202c';
  const detailColor = '#ffffff';

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">

        {themeId === 'default' && (
          /* 🛸 ZORBLAX: Hyperactive Space Gremlin (Terminal / Interstellar Radar Deck) */
          <G>
            {/* Antennae */}
            <Path d="M35 30 L25 15 M65 30 L75 15" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
            <Circle cx="25" cy="15" r="4" fill={primaryColor} />
            <Circle cx="75" cy="15" r="4" fill={primaryColor} />
            {/* Main Head Structure */}
            <Rect x="20" y="30" width="60" height="45" rx="20" fill={primaryColor} />
            {/* Big Expressive Alien Eyes */}
            <Ellipse cx="38" cy="50" rx="9" ry="12" fill={detailColor} />
            <Ellipse cx="62" cy="50" rx="9" ry="12" fill={detailColor} />
            <Circle cx="38" cy="50" r="4" fill={eyeColor} />
            <Circle cx="62" cy="50" r="4" fill={eyeColor} />
            {/* Gremlin Smirk */}
            <Path d="M42 65 Q50 72 58 65" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          </G>
        )}

        {themeId === 'botanical' && (
          /* 🌱 SPROUT: Sleepy Ancient Bonsai Tree Ent */
          <G>
            {/* Whimsical Twig/Bonsai Base Head */}
            <Path d="M30 75 Q50 85 70 75 L65 45 Q50 35 35 45 Z" fill={primaryColor} />
            {/* Sprouting Foliage Top Layers */}
            <Circle cx="35" cy="35" r="14" fill={primaryColor} opacity={0.9} />
            <Circle cx="50" cy="28" r="16" fill={primaryColor} />
            <Circle cx="65" cy="35" r="14" fill={primaryColor} opacity={0.9} />
            {/* Sleeping Closed Curved Eyes */}
            <Path d="M36 58 Q42 62 44 58" stroke={detailColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <Path d="M56 58 Q58 62 64 58" stroke={detailColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Rosy Pastel Cheeks */}
            <Circle cx="34" cy="64" r="3" fill="#ef4444" opacity={0.4} />
            <Circle cx="66" cy="64" r="3" fill="#ef4444" opacity={0.4} />
          </G>
        )}

        {themeId === 'cloudscape' && (
          /* 🐋 NIMBUS: Translucent Floating Sky Whale */
          <G>
            {/* Smooth Aerodynamic Whale Torso */}
            <Path d="M15 50 C15 30, 75 25, 85 45 C90 55, 75 70, 45 70 C25 70, 15 65, 15 50 Z" fill={primaryColor} />
            {/* Dynamic Sky Tail Flukes */}
            <Path d="M16 50 L2 42 L8 53 L2 64 Z" fill={primaryColor} />
            {/* Peaceful Closed Eye Line */}
            <Path d="M62 46 Q68 44 72 48" stroke={detailColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Dreamy Underbelly Accent Line */}
            <Path d="M30 64 C45 65, 70 60, 78 49" stroke={detailColor} strokeWidth="1.5" opacity={0.6} fill="none" />
          </G>
        )}

        {themeId === 'shire' && (
          /* 🔮 ELION: Cozy Hearth Wizard with cider & ancient texts */
          <G>
            {/* Pointy Wizard Hat */}
            <Path d="M50 10 L15 45 L85 45 Z" fill={primaryColor} />
            <Rect x="10" y="42" width="80" height="6" rx="3" fill={primaryColor} opacity={0.9} />
            {/* Base Face Contour */}
            <Circle cx="50" cy="64" r="20" fill="#fbd38d" />
            {/* Plush Old Mage White Beard */}
            <Path d="M32 64 C32 85, 50 92, 50 92 C50 92, 68 85, 68 64 Z" fill={detailColor} />
            {/* Wise Spectacles */}
            <Circle cx="42" cy="60" r="5" stroke={primaryColor} strokeWidth="2" fill="none" />
            <Circle cx="58" cy="60" r="5" stroke={primaryColor} strokeWidth="2" fill="none" />
            <Path d="M47 60 L53 60" stroke={primaryColor} strokeWidth="2" />
            {/* Inward Inky Pupils */}
            <Circle cx="42" cy="60" r="1.5" fill={eyeColor} />
            <Circle cx="58" cy="60" r="1.5" fill={eyeColor} />
          </G>
        )}

        {themeId === 'blush' && (
          /* 🎀 PIP: Soft Pastel Velvet Floppy-Eared Bunny */
          <G>
            {/* Large Iconic Drooping Velvet Ears */}
            <Path d="M28 45 C15 45, 18 15, 32 20 C32 25, 34 38, 34 45 Z" fill={primaryColor} opacity={0.8} />
            <Path d="M72 45 C85 45, 82 15, 68 20 C68 25, 66 38, 66 45 Z" fill={primaryColor} opacity={0.8} />
            {/* Head Silhouette */}
            <Circle cx="50" cy="55" r="24" fill={primaryColor} />
            {/* Inner Ear Contrast Patches */}
            <Path d="M26 40 C19 40, 21 22, 30 25 Z" fill="#ffe4e6" />
            <Path d="M74 40 C81 40, 79 22, 70 25 Z" fill="#ffe4e6" />
            {/* Soft Pastel Eyes */}
            <Circle cx="40" cy="52" r="3" fill={eyeColor} />
            <Circle cx="60" cy="52" r="3" fill={eyeColor} />
            {/* Tiny Y-Shaped Bunny Nose */}
            <Path d="M48 60 L52 60 L50 63 Z" fill="#f43f5e" />
          </G>
        )}

        {themeId === 'lofi' && (
          /* ☕ MOCHA: Sleeping Calico Kitty Curled Up in an Espresso Mug */
          <G>
            {/* Sturdy Architectural Coffee Mug */}
            <Rect x="24" y="46" width="52" height="42" rx="14" fill={primaryColor} />
            {/* Loop Handle */}
            <Path d="M76 54 C88 54, 88 74, 76 74" stroke={primaryColor} strokeWidth="7" fill="none" />
            {/* Curled Up Kitty Head peeking over rim */}
            <Circle cx="50" cy="44" r="18" fill="#e2e8f0" />
            {/* Distinct Calico Ginger Patch over right ear */}
            <Path d="M35 32 C35 24, 46 28, 46 36 Z" fill="#dd6b20" />
            {/* Left Pointy Ear */}
            <Path d="M65 32 C65 24, 54 28, 54 36 Z" fill="#4a5568" />
            {/* Symmetrical Sleeping Eye Lines */}
            <Path d="M40 46 Q45 50 47 46" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <Path d="M53 46 Q55 50 60 46" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          </G>
        )}

        {themeId === 'origami' && (
          /* 📄 SORA: Sharp Geometric Paper Kingfisher Bird (Minimalist Charcoal Washi) */
          <G>
            {/* Sharp Angular Geometric Body Polygons */}
            <Polygon points="50,20 25,55 50,45" fill={primaryColor} />
            <Polygon points="50,20 75,55 50,45" fill={primaryColor} opacity={0.85} />
            {/* Crisp Paper Wings */}
            <Polygon points="25,55 10,75 50,45" fill={primaryColor} opacity={0.7} />
            <Polygon points="75,55 90,75 50,45" fill={primaryColor} opacity={0.95} />
            {/* Long Stylized Origami Beak */}
            <Polygon points="50,32 50,42 18,37" fill="#b7791f" />
            {/* Sharp Focal Ink Eye Dot */}
            <Circle cx="46" cy="34" r="2" fill={eyeColor} />
          </G>
        )}

        {themeId === 'viking' && (
          /* 🔥 IGNIS: Energetic Stoke-Faced Volcanic Pocket Dragon (Carbon Adorned) */
          <G>
            {/* Jagged Wing Silhouette Backplates */}
            <Path d="M20 30 L5 45 L30 50 Z M80 30 L95 45 L70 50 Z" fill="#2d3748" />
            {/* Dragon Head Structure */}
            <Path d="M30 35 L50 20 L70 35 L64 70 L36 70 Z" fill={primaryColor} />
            {/* Small Side Horns */}
            <Polygon points="30,35 15,22 34,30" fill="#e2e8f0" />
            <Polygon points="70,35 85,22 66,30" fill="#e2e8f0" />
            {/* Bright Luminous Embers Dragon Eyes */}
            <Polygon points="36,46 46,42 44,52" fill="#f97316" />
            <Polygon points="64,46 54,42 56,52" fill="#f97316" />
            {/* Twin Smoking Snout Nostrils */}
            <Circle cx="44" cy="62" r="2" fill={eyeColor} />
            <Circle cx="56" cy="62" r="2" fill={eyeColor} />
          </G>
        )}

        {themeId === 'lavender' && (
          /* 🕯️ CASPER: Friendly Chibi Ghost wearing Oversized Reading Glasses */
          <G>
            {/* Floating Ghost Ethereal Base Form */}
            <Path d="M30 45 C30 25, 70 25, 70 45 C70 65, 68 85, 60 85 C55 85, 52 78, 50 85 C48 78, 45 85, 40 85 C32 85, 30 65, 30 45 Z" fill={primaryColor} opacity={0.85} />
            {/* Oversized Round Framing Specs */}
            <Circle cx="43" cy="46" r="8" stroke="#4a154b" strokeWidth="2.5" fill="none" />
            <Circle cx="57" cy="46" r="8" stroke="#4a154b" strokeWidth="2.5" fill="none" />
            <Path d="M51 46 L49 46" stroke="#4a154b" strokeWidth="2.5" />
            {/* Happy Internal Eye Dots */}
            <Circle cx="43" cy="46" r="2" fill={eyeColor} />
            <Circle cx="57" cy="46" r="2" fill={eyeColor} />
            {/* Playful Open Mouth Gap */}
            <Circle cx="50" cy="58" r="3" fill="#4a154b" />
          </G>
        )}

        {themeId === 'archives' && (
          /* ⚜️ AURELIUS: Floating Ancient Glowing Geometric Crystal Shard Core */
          <G>
            {/* Outer Encapsulated Floating Orbit Rings */}
            <Circle cx="50" cy="50" r="38" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
            {/* Concentric Double Ruling Accent */}
            <Circle cx="50" cy="50" r="30" stroke={primaryColor} strokeWidth="1" fill="none" opacity={0.5} />
            {/* Central Master Diamond Crystal Node */}
            <Polygon points="50,16 72,50 50,84 28,50" fill={primaryColor} />
            {/* Internal Crystal Shading Facet Split */}
            <Polygon points="50,16 50,84 28,50" fill={detailColor} opacity={0.25} />
            {/* Floating Accompanying Peripheral Runes */}
            <Rect x="48" y="6" width="4" height="4" fill={primaryColor} transform="rotate(45 50 8)" />
            <Rect x="48" y="88" width="4" height="4" fill={primaryColor} transform="rotate(45 50 90)" />
          </G>
        )}

        {/* Dynamic Fallback Geometric Sphere if theme boundaries pass unmatched parameters */}
        {!['default', 'botanical', 'cloudscape', 'shire', 'blush', 'lofi', 'origami', 'viking', 'lavender', 'archives'].includes(themeId) && (
          <G>
            <Circle cx="50" cy="50" r="34" fill={primaryColor} />
            <Circle cx="40" cy="46" r="3" fill={detailColor} />
            <Circle cx="60" cy="46" r="3" fill={detailColor} />
          </G>
        )}

      </Svg>
    </View>
  );
}