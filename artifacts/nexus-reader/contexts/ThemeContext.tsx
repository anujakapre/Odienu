import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ThemeId, THEME_ORDER } from "@/constants/themes";

interface ThemeContextValue {
  themeId: ThemeId;
  cycleTheme: () => void;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: "default",
  cycleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "nexus_reader_theme";

function resolveThemeId(value: string | null): ThemeId {
  if (!value) return "botanical";
  return THEME_ORDER.includes(value as ThemeId) ? (value as ThemeId) : "botanical";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("botanical");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        const next = resolveThemeId(saved);
        setThemeId(next);
      } catch {
        if (mounted) setThemeId("botanical");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeId((prev) => {
      const currentIndex = THEME_ORDER.indexOf(prev);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const next = THEME_ORDER[(safeIndex + 1) % THEME_ORDER.length] ?? "default";
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    const next = THEME_ORDER.includes(id) ? id : "botanical";
    setThemeId(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
