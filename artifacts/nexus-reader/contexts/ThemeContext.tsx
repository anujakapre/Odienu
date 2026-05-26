import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  updateGlow?: string;
  shelfColor?: string;
  shelfHighlight?: string;
}

export interface ThemeDecorations {
  mascotName: string;
  mascotEmoji: string;
  profileGreeting: string;
  favoriteIconActive: string;
  favoriteIconInactive: string;
  favoriteLabel: string;
  shelfUnread: string;
  shelfRead: string;
  shelfCurrentlyReading: string;
  shelfFavorites: string;
  shelfDecorTreatment: string;
}

export interface OidenuTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  decorations: ThemeDecorations;
}

export const THEMES: Record<string, OidenuTheme> = {
  default: {
    id: 'default',
    name: 'Area 51 Classified',
    colors: { background: '#0f0e17', foreground: '#fffffe', card: '#1a1833', primary: '#34d399', primaryForeground: '#0f0e17', muted: '#1e1d36', mutedForeground: '#a7a9be', border: '#2d2b50', updateGlow: '#34d399', shelfColor: '#1e1d36', shelfHighlight: '#34d399' },
    decorations: { mascotName: 'Zorblax', mascotEmoji: '👽', profileGreeting: 'Accessing classified files,', favoriteIconActive: '🛸', favoriteIconInactive: '☄️', favoriteLabel: 'Abduct Story', shelfUnread: 'Intercepted Datapacks', shelfRead: 'Declassified Intel', shelfCurrentlyReading: 'Analyzing Signal Vectors', shelfFavorites: 'Abducted Legends', shelfDecorTreatment: 'Neon matrix green dashed grid lines' },
  },
  botanical: {
    id: 'botanical',
    name: 'Botanical Library',
    colors: { background: '#f4ead5', foreground: '#2d1f0a', card: '#fffdf4', primary: '#4a7c40', primaryForeground: '#ffffff', muted: '#ede2cc', mutedForeground: '#7a5f3a', border: '#c8b08a', updateGlow: '#4a7c40', shelfColor: '#8B6914', shelfHighlight: '#d4a853' },
    decorations: { mascotName: 'Sprout the Tree', mascotEmoji: '🌳💤', profileGreeting: 'Welcome back to the greenhouse,', favoriteIconActive: '🌸', favoriteIconInactive: '🌱', favoriteLabel: 'Sprout a Favorite', shelfUnread: 'Dormant Seeds', shelfRead: 'Fully Bloomed', shelfCurrentlyReading: 'Sprouting Tendrils', shelfFavorites: 'Prized Greenhouses', shelfDecorTreatment: 'Elegant organic curves with leaf buds' },
  },
  cloudscape: {
    id: 'cloudscape',
    name: 'Oidenu Cloudscape',
    colors: { background: '#4A90E2', foreground: '#ffffff', card: '#dff0ff', primary: '#ffffff', primaryForeground: '#1e3f6f', muted: '#7fb6ef', mutedForeground: '#eff7ff', border: '#dff0ff', updateGlow: '#ffb347', shelfColor: '#ffffff', shelfHighlight: '#ffb347' },
    decorations: { mascotName: 'Nimbus the Sky Whale', mascotEmoji: '🐋✨', profileGreeting: 'Floating among your stories,', favoriteIconActive: '🌙', favoriteIconInactive: '☁️', favoriteLabel: 'Written in Stars', shelfUnread: 'Uncharted Horizons', shelfRead: 'Clear Blue Skies', shelfCurrentlyReading: 'Drifting Through Clouds', shelfFavorites: 'Written in the Stars', shelfDecorTreatment: 'Soft pillowy cloud shapes glowing' },
  },
  shire: {
    id: 'shire',
    name: 'Shire Sanctum',
    colors: { background: '#2d4128', foreground: '#f7f3e2', card: '#385032', primary: '#c4d98a', primaryForeground: '#24341f', muted: '#34482f', mutedForeground: '#d8cfa7', border: '#66795a', updateGlow: '#d2a35a', shelfColor: '#5b4427', shelfHighlight: '#d2a35a' },
    decorations: { mascotName: 'Bramble the Elven Fawn', mascotEmoji: '🦌', profileGreeting: 'Pull up a chair by the hearth,', favoriteIconActive: '👑', favoriteIconInactive: '🌰', favoriteLabel: 'Precious Reread', shelfUnread: 'Unopened Parcels', shelfRead: 'Tales by the Hearth', shelfCurrentlyReading: 'Wandering the Trails', shelfFavorites: 'My Precious Rereads', shelfDecorTreatment: 'Rich warm wooden cottage braiding' },
  },
  blush: {
    id: 'blush',
    name: 'Serene Blush Study',
    colors: { background: '#fadadd', foreground: '#6b3550', card: '#fff9fb', primary: '#e38aa7', primaryForeground: '#ffffff', muted: '#fbeef2', mutedForeground: '#a46b86', border: '#efc6d1', updateGlow: '#d6b15f', shelfColor: '#ffffff', shelfHighlight: '#d6b15f' },
    decorations: { mascotName: 'Pip the Velvet Bunny', mascotEmoji: '🐰🌷', profileGreeting: 'Cozying up with your books,', favoriteIconActive: '💖', favoriteIconInactive: '🎀', favoriteLabel: 'Cherished Story', shelfUnread: 'Sealed Love Letters', shelfRead: 'Fond Memories', shelfCurrentlyReading: 'Afternoon Daydreams', shelfFavorites: 'Cherished Keepsakes', shelfDecorTreatment: 'Quilted panels with soft lace ribbon dividers' },
  },
  lofi: {
    id: 'lofi',
    name: 'Cozy Lo-Fi Coffee Shop',
    colors: { background: '#2b2623', foreground: '#f2eae4', card: '#3b332f', primary: '#a3c6a8', primaryForeground: '#1b261d', muted: '#4a403a', mutedForeground: '#bdae9c', border: '#544942', updateGlow: '#e8be89', shelfColor: '#4a2810', shelfHighlight: '#f5c87a' },
    decorations: { mascotName: 'Mocha the Mug Kitty', mascotEmoji: '🐈🐾', profileGreeting: 'Lo-fi beats and open pages,', favoriteIconActive: '✨', favoriteIconInactive: '☕', favoriteLabel: 'Comfort Track', shelfUnread: 'Unbrewed Beans', shelfRead: 'Empty Espresso Mugs', shelfCurrentlyReading: 'Sipping Slowly', shelfFavorites: 'House Comfort Tracks', shelfDecorTreatment: 'Deep mahogany espresso bars' },
  },
  origami: {
    id: 'origami',
    name: 'Whimsical Origami',
    colors: { background: '#fff6e5', foreground: '#4a3f35', card: '#ffffff', primary: '#ff9f43', primaryForeground: '#ffffff', muted: '#fdf0d5', mutedForeground: '#a08c77', border: '#f0d9b5', updateGlow: '#54a0ff', shelfColor: '#5b9bd5', shelfHighlight: '#a8d4f5' },
    decorations: { mascotName: 'Sora the Paper Crane', mascotEmoji: '🕊️🎨', profileGreeting: 'Unfolding your next chapter,', favoriteIconActive: '💝', favoriteIconInactive: '🦩', favoriteLabel: 'Folded Heart', shelfUnread: 'Unfolded Sheets', shelfRead: 'Masterful Cranes', shelfCurrentlyReading: 'Creasing the Edges', shelfFavorites: 'Folded Hearts', shelfDecorTreatment: 'Minimalist paper-crease border alignments' },
  },
  viking: {
    id: 'viking',
    name: 'Viking Berk',
    colors: { background: '#3A4F5C', foreground: '#e7f0f6', card: '#435965', primary: '#9fc7d6', primaryForeground: '#20313b', muted: '#4f626d', mutedForeground: '#c8d4db', border: '#607580', updateGlow: '#d59e4a', shelfColor: '#2d1f18', shelfHighlight: '#d59e4a' },
    decorations: { mascotName: 'Ignis the Baby Ember Dragon', mascotEmoji: '🐉🌋', profileGreeting: 'To glory and great tales,', favoriteIconActive: '🔥', favoriteIconInactive: '🛡️', favoriteLabel: 'Saga Legend', shelfUnread: 'Unexplored Isles', shelfRead: 'Songs of Valhalla', shelfCurrentlyReading: 'Sailing Open Seas', shelfFavorites: 'Great Chieftain Sagas', shelfDecorTreatment: 'Heavy protective dark iron-rivet borders' },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Phantasm',
    colors: { background: '#E8EAF6', foreground: '#3F51B5', card: '#ffffff', primary: '#7e6ee6', primaryForeground: '#ffffff', muted: '#e7e8fb', mutedForeground: '#7680b8', border: '#d0d4f7', updateGlow: '#a4b1ff', shelfColor: '#7e6ee6', shelfHighlight: '#c7cdfd' },
    decorations: { mascotName: 'Casper the Chibi Ghost', mascotEmoji: '👻📖', profileGreeting: 'Haunting the library with,', favoriteIconActive: '🔮', favoriteIconInactive: '🕯️', favoriteLabel: 'Enchanted Read', shelfUnread: 'Unawakened Spirits', shelfRead: 'Resting Souls', shelfCurrentlyReading: 'Possessed Pages', shelfFavorites: 'Enchanted Grimoires', shelfDecorTreatment: 'Frosted purple overlays with sparkles' },
  },
  archives: {
    id: 'archives',
    name: 'Ancient Archives',
    colors: { background: '#0b0d12', foreground: '#e2e6ed', card: '#131821', primary: '#dcae5b', primaryForeground: '#0b0d12', muted: '#1b222e', mutedForeground: '#8ca0ba', border: '#252f41', updateGlow: '#3a86ff', shelfColor: '#1b222e', shelfHighlight: '#dcae5b' },
    decorations: { mascotName: 'Aurelius', mascotEmoji: '🔷✨', profileGreeting: 'Whispers from the deep vault,', favoriteIconActive: '⚜️', favoriteIconInactive: '⏳', favoriteLabel: 'Chronicled Legend', shelfUnread: 'Sealed Vault Slabs', shelfRead: 'Restored Manuscripts', shelfCurrentlyReading: 'Deciphering Runes', shelfFavorites: 'The Forbidden Lore', shelfDecorTreatment: 'Burnished gold linework framing obsidian stones' },
  },
};

const DEFAULT_THEME_ID = 'botanical';

interface ThemeContextType {
  theme: OidenuTheme;
  themeId: string;
  setTheme: (id: string) => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(DEFAULT_THEME_ID);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const storedThemeId = await AsyncStorage.getItem('@oidenu_theme_id');
        if (typeof storedThemeId === 'string' && THEMES[storedThemeId]) {
          setThemeIdState(storedThemeId);
        }
      } catch (error) {
        console.warn('Theme boot recovery system fallback:', error);
      } finally {
        setIsReady(true);
      }
    }
    loadTheme();
  }, []);

  const setTheme = async (id: string) => {
    const safeId = THEMES[id] ? id : DEFAULT_THEME_ID;
    setThemeIdState(safeId);
    try { await AsyncStorage.setItem('@oidenu_theme_id', safeId); } 
    catch (error) { console.warn('Save context failed:', error); }
  };

  const currentTheme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeId, setTheme, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: THEMES[DEFAULT_THEME_ID],
      themeId: DEFAULT_THEME_ID,
      setTheme: async () => {},
      isReady: true,
    };
  }
  return context;
}
