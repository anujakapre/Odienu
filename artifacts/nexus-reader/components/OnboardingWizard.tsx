import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function OnboardingWizard({ onComplete }: { onComplete: (folder: string) => Promise<void> }) {
  const colors = useColors();
  const [folder, setFolder] = useState("/sandbox/downloads");
  const [saving, setSaving] = useState(false);

  async function pickFolder() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/octet-stream",
      multiple: false,
      copyToCacheDirectory: false,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setFolder(uri.startsWith("file://") ? uri.replace(/\/[^/]*$/, "") : uri);
    }
  }

  async function handleContinue() {
    setSaving(true);
    try {
      await onComplete(folder.trim());
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Choose your storage folder</Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>Set a download path to unlock your library dashboard.</Text>
        <TextInput value={folder} onChangeText={setFolder} style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} autoCapitalize="none" />
        <Pressable onPress={pickFolder} style={[styles.secondaryButton, { borderColor: colors.border }]}>
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Pick Folder</Text>
        </Pressable>
        <Pressable onPress={handleContinue} disabled={saving || folder.trim().length === 0} style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>{saving ? "Saving..." : "Continue"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", padding: 24, zIndex: 50 },
  card: { width: "100%", borderWidth: 1, borderRadius: 20, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  body: { fontSize: 14, lineHeight: 20 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  button: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  secondaryButton: { borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
  secondaryButtonText: { fontSize: 14, fontWeight: "700" },
  buttonText: { fontSize: 15, fontWeight: "700" },
});