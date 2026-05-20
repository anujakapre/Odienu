import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const SUGGESTED_FOLDERS = [
  "/sandbox/downloads",
  "/sandbox/oidenu",
  "/storage/emulated/0/Oidenu",
  "/Documents/Oidenu",
];

export function OnboardingWizard({
  onComplete,
}: {
  onComplete: (folder: string) => Promise<void>;
}) {
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
    <Modal transparent visible animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.45)" }]}> 
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.grabber} />
          <Text style={[styles.title, { color: colors.foreground }]}>Choose storage location</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>Pick a folder path for downloaded works.</Text>

          <TextInput
            value={folder}
            onChangeText={setFolder}
            style={[
              styles.input,
              { color: colors.foreground, borderColor: colors.border },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.suggestionsRow}>
            {SUGGESTED_FOLDERS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setFolder(item)}
                style={[
                  styles.suggestionPill,
                  { borderColor: colors.border, backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[styles.suggestionText, { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleContinue}
              disabled={saving || folder.trim().length === 0}
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[styles.primaryButtonText, { color: colors.primaryForeground }]}
              >
                {saving ? "Saving..." : "Continue"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  grabber: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
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
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionsRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  primaryButton: {
    minWidth: 120,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});