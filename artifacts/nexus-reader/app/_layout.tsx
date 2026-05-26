import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useState } from "react";
import { useColorScheme, ActivityIndicator, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from 'expo-sqlite';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { ThemeProvider } from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [isCheckingFolder, setIsCheckingFolder] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStoredDirectory() {
      try {
        const savedPath = await AsyncStorage.getItem("nexus_reader_picked_folder_path");
        if (savedPath) {
          setFolderPath(savedPath);
        }
      } catch (err) {
        console.warn("Failed to load automatically restored directory tokens:", err);
      } finally {
        setIsCheckingFolder(false);
      }
    }
    loadStoredDirectory();
  }, []);

  if (isCheckingFolder) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c084fc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. The core layout stack is ALWAYS mounted so Expo Router can target it */}
      <RootLayoutNav />

      {/* 2. The Wizard is rendered over top if no folder selection exists yet */}
      {!folderPath && (
        <View style={StyleSheet.absoluteFill}>
          <OnboardingWizard 
            onComplete={(path) => {
              const validatedPath = path || "skipped_setup";
              setFolderPath(validatedPath);

              // Now that the stack is securely mounted underneath, routing works instantly
              router.replace('/(tabs)');
            }} 
          />
        </View>
      )}
    </View>
  );
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
      <SQLiteProvider databaseName="nexus-reader.db">
        <ThemeProvider>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <AppShell />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    backgroundColor: "#0f0e17", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  container: { 
    flex: 1 
  }
});
