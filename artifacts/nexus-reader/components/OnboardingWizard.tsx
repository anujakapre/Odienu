import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useFolderPicker } from '@/hooks/useFolderPicker';
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from 'expo-router';

export function OnboardingWizard({ onComplete }: { onComplete: (path: string) => void }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const { folderPath, pickFolder, isPicking } = useFolderPicker();

  const handlePress = async () => {
    const savedPath = await pickFolder();
    if (savedPath) {
      onComplete(savedPath);
    }
  };

  const formatPathDisplay = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("content://")) return "Secure System Path (Authorized Tree)";
    return path;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>Connect Your Library</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Select the local folder where you save your fanfiction EPUB downloads.
      </Text>

      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: colors.primary },
          isPicking && styles.disabled
        ]} 
        onPress={handlePress}
        disabled={isPicking}
      >
        {isPicking ? (
          <ActivityIndicator color={colors.primaryForeground || "#FFFFFF"} size="small" />
        ) : (
          <Text style={[styles.btnText, { color: colors.primaryForeground || "#FFFFFF" }]}>
            {folderPath ? "Change Staging Folder" : "Select Intake Folder"}
          </Text>
        )}
      </TouchableOpacity>

      {folderPath && (
        <Text style={[styles.pathLabel, { color: colors.mutedForeground, borderColor: colors.border, backgroundColor: colors.card }]}>
          Linked to: {formatPathDisplay(folderPath)}
        </Text>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={() => onComplete("skipped_setup")}>
        <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Configure later in settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginHorizontal: 12, elevation: 1 },
  disabled: { opacity: 0.6 },
  btnText: { fontWeight: '700', fontSize: 16 },
  pathLabel: { marginTop: 16, fontSize: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, textAlign: 'center', fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  skipBtn: { marginTop: 28, alignItems: 'center' },
  skipText: { fontSize: 14, textDecorationLine: 'underline' }
});
