import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAppConfig } from "@/hooks/useAppConfig";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Your main dashboard layouts */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Added Settings screen as a slide-up modal layer */}
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: false, 
          presentation: "modal" 
        }} 
      />
    </Stack>
  );
}

function AppShell() {
  const { config, loading, chooseDownloadFolder } = useAppConfig();

  if (loading || !config) return <View style={{ flex: 1 }} />;

  // If no folder is stored yet, lock the user inside our true SAF folder selection prompt
  if (!config.user_download_folder) {
    return <OnboardingWizard onComplete={chooseDownloadFolder} />;
  }

  return <RootLayoutNav />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const bg = colorScheme === "dark" ? "#0f0e17" : "#faf8ff";
    SystemUI.setBackgroundColorAsync(bg).catch(() => {});
  }, [colorScheme]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <AppShell />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}