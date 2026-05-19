import { THEME_COLORS } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";

export function useColors() {
  const { themeId } = useTheme();
  return { ...THEME_COLORS[themeId], radius: 12 };
}
