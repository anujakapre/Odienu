import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const SUGGESTED_FOLDERS = [
  "/sandbox/downloads",
  "/sandbox/oidenu",
  "/storage/emulated/0/Oidenu",
  "/Documents/Oidenu",
];

export function OnboardingWizard({ onComplete }: { onComplete: (folder: string) => Promise<void> }) {
  const colors = useColors();
  const [folder, setFolder] = useState(SUGGESTED_FOLDERS[0]);
  const [saving, setSaving] = useState(false);

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
        <Text style={[styles.body, { color: colors.mutedForeground }]}>Select a path inside the sandboxed file system. You can edit the folder path directly or tap a suggestion below.</Text>

        <TextInput
          value={folder}
          onChangeText={setFolder}
          style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.suggestionsRow}>
          {SUGGESTED_FOLDERS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFolder(item)}
              style={[styles.suggestionPill, { borderColor: colors.border }]}
            >
              <Text style={[styles.suggestionText, { color: colors.primary }]} numberOfLines={1}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={saving || folder.trim().length === 0}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            {saving ? "Saving..." : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 50,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: "100%",
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
