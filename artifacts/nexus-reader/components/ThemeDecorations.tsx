import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ThemeColors } from '@/contexts/ThemeContext';

interface ThemeBackgroundLayerProps {
  themeId: string;
  colors: ThemeColors;
  scrollY: Animated.Value;
}

export function ThemeBackgroundLayer({ themeId, colors, scrollY }: ThemeBackgroundLayerProps) {
  const decorationColor = colors.primary;
  const iconOpacity = 0.12; // Muted opacity so text is always readable

  // This math creates the continuous "jumping" animation loop as you scroll
  const jumpBounce = Animated.modulo(scrollY, 150).interpolate({
    inputRange: [0, 75, 150],
    outputRange: [0, -25, 0], // Jumps up 25px, then back down
  });

  const jumpBounceAlt = Animated.modulo(scrollY, 150).interpolate({
    inputRange: [0, 75, 150],
    outputRange: [-25, 0, -25], // Alternate timing for the secondary icons
  });

  const renderIcons = () => {
    switch (themeId) {
      case 'default': // Area 51
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="ufo-outline" size={110} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-15deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="alien-outline" size={90} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '20deg' }] }]} />
          </>
        );
      case 'botanical': // Greenhouse
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="leaf" size={120} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-15deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="flower-tulip-outline" size={90} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '20deg' }] }]} />
          </>
        );
      case 'cloudscape': // Happy Clouds
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="cloud-outline" size={130} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-5deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="star-four-points-outline" size={80} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '20deg' }] }]} />
          </>
        );
      case 'shire': // Hobbit Hole
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="pine-tree" size={120} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="door" size={80} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '10deg' }] }]} />
          </>
        );
      case 'blush': // Soft Study
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="book-open-variant" size={100} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-15deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="pencil-outline" size={70} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '45deg' }] }]} />
          </>
        );
      case 'lofi': // Dark Coffee Shop
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="coffee-outline" size={110} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-10deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="headphones" size={80} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '15deg' }] }]} />
          </>
        );
      case 'origami': // Paper Cranes
        return (
          <>
            <AnimatedIcon IconSet={FontAwesome5} name="paper-plane" size={80} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '15deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="bird" size={110} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '-20deg' }] }]} />
          </>
        );
      case 'viking': // Berk Dragons
        return (
          <>
            <AnimatedIcon IconSet={FontAwesome5} name="dragon" size={100} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-15deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="shield-cross-outline" size={90} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '20deg' }] }]} />
          </>
        );
      case 'lavender': // Happy Ghost
        return (
          <>
            <AnimatedIcon IconSet={FontAwesome5} name="ghost" size={100} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }, { rotate: '-10deg' }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="magic-staff" size={90} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '30deg' }] }]} />
          </>
        );
      case 'archives': // Dark Academia / Mummy
        return (
          <>
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="pillar" size={110} color={decorationColor} style={[styles.topLeft, { opacity: iconOpacity, transform: [{ translateY: jumpBounce }] }]} />
            <AnimatedIcon IconSet={MaterialCommunityIcons} name="eye-outline" size={80} color={decorationColor} style={[styles.bottomRight, { opacity: iconOpacity, transform: [{ translateY: jumpBounceAlt }, { rotate: '15deg' }] }]} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {renderIcons()}
    </View>
  );
}

// Helper wrapper to easily pass Animated.View styles into vector icons
const AnimatedIcon = ({ IconSet, style, ...props }: any) => {
  return (
    <Animated.View style={style}>
      <IconSet {...props} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topLeft: { position: 'absolute', top: 40, left: -20 },
  bottomRight: { position: 'absolute', bottom: 60, right: -15 },
});