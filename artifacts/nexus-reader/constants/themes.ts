export type ThemeId = "default" | "botanical" | "lofi" | "origami";

export interface AppThemeColors {
  text: string;
  tint: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  nexusGlow: string;
  updateGlow: string;
  statusRead: string;
  statusReading: string;
  statusUnread: string;
  shelfColor: string;
  shelfHighlight: string;
}

export const THEME_COLORS: Record<ThemeId, AppThemeColors> = {
  default: {
    text: "#f0e6d3",
    tint: "#c084fc",
    background: "#0f0e17",
    foreground: "#fffffe",
    card: "#1a1833",
    cardForeground: "#f0e6d3",
    primary: "#c084fc",
    primaryForeground: "#0f0e17",
    secondary: "#2d2b50",
    secondaryForeground: "#f0e6d3",
    muted: "#1e1d36",
    mutedForeground: "#a7a9be",
    accent: "#f59e0b",
    accentForeground: "#0f0e17",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#2d2b50",
    input: "#2d2b50",
    nexusGlow: "#e879f9",
    updateGlow: "#f59e0b",
    statusRead: "#34d399",
    statusReading: "#c084fc",
    statusUnread: "#6b7280",
    shelfColor: "#1e1d36",
    shelfHighlight: "#2d2b50",
  },
  botanical: {
    text: "#2d1f0a",
    tint: "#4a7c40",
    background: "#f4ead5",
    foreground: "#2d1f0a",
    card: "#fffdf4",
    cardForeground: "#2d1f0a",
    primary: "#4a7c40",
    primaryForeground: "#ffffff",
    secondary: "#e0d4b0",
    secondaryForeground: "#2d1f0a",
    muted: "#ede2cc",
    mutedForeground: "#7a5f3a",
    accent: "#d4625a",
    accentForeground: "#ffffff",
    destructive: "#c0392b",
    destructiveForeground: "#ffffff",
    border: "#c8b08a",
    input: "#e0d4b0",
    nexusGlow: "#9b59b6",
    updateGlow: "#d4a853",
    statusRead: "#4a7c40",
    statusReading: "#c4785a",
    statusUnread: "#9a8068",
    shelfColor: "#8B6914",
    shelfHighlight: "#d4a853",
  },
  lofi: {
    text: "#f0ddb5",
    tint: "#e8a857",
    background: "#160c06",
    foreground: "#f0ddb5",
    card: "#251408",
    cardForeground: "#f0ddb5",
    primary: "#e8a857",
    primaryForeground: "#160c06",
    secondary: "#3a1e0c",
    secondaryForeground: "#f0ddb5",
    muted: "#251408",
    mutedForeground: "#9a7a52",
    accent: "#c8765a",
    accentForeground: "#ffffff",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#4a2810",
    input: "#3a1e0c",
    nexusGlow: "#c8765a",
    updateGlow: "#f5c87a",
    statusRead: "#6ab569",
    statusReading: "#e8a857",
    statusUnread: "#7a6040",
    shelfColor: "#100604",
    shelfHighlight: "#6b3a1a",
  },
  origami: {
    text: "#2a3050",
    tint: "#5b9bd5",
    background: "#f5f3ee",
    foreground: "#2a3050",
    card: "#ffffff",
    cardForeground: "#2a3050",
    primary: "#5b9bd5",
    primaryForeground: "#ffffff",
    secondary: "#d4ebf9",
    secondaryForeground: "#2a3050",
    muted: "#eef5fc",
    mutedForeground: "#7a90b0",
    accent: "#f5a0c0",
    accentForeground: "#2a3050",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#c0d8f0",
    input: "#d4ebf9",
    nexusGlow: "#9070e0",
    updateGlow: "#f5c040",
    statusRead: "#5bbf9f",
    statusReading: "#5b9bd5",
    statusUnread: "#9aabb5",
    shelfColor: "#5b9bd5",
    shelfHighlight: "#a8d4f5",
  },
};

export const THEME_META: Record<
  ThemeId,
  { name: string; label: string; isDark: boolean }
> = {
  default: { name: "default", label: "Dark Mode", isDark: true },
  botanical: { name: "botanical", label: "Botanical Library", isDark: false },
  lofi: { name: "lofi", label: "Lo-Fi Café", isDark: true },
  origami: { name: "origami", label: "Whimsical Origami", isDark: false },
};

export const THEME_ORDER: ThemeId[] = [
  "default",
  "botanical",
  "lofi",
  "origami",
];
