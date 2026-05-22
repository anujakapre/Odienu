import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

export function OnboardingWizard({
  onComplete,
  onCancel, // Optional close action for when used inside a Settings panel later
}: {
  onComplete: (folder: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const colors = useColors();
  const [folder, setFolder] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const helperText = useMemo(() => {
    if (!folder)
      return "Tap 'Pick location' to select a storage folder from your device.";
    if (folder.startsWith("file://"))
      return "Selected local storage directory path";
    if (folder.startsWith("content://"))
      return "Authorized Android secure system folder location";
    return "Target folder locked and ready.";
  }, [folder]);

  async function pickStorageLocation() {
    try {
      // Safely accessing the subsystem via the FileSystem namespace
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        onComplete(permissions.directoryUri);
      } else {
        setError("Permission to access the selected directory was denied.");
      }
    } catch (err) {
      setError("An error occurred while opening the system folder picker.");
      console.error(err);
    }
  }

  async function handleContinue() {
    if (folder.trim().length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await onComplete(folder.trim());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save folder path.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.grabber} />
          <Text style={[styles.title, { color: colors.foreground }]}>
            Storage Setup
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            {helperText}
          </Text>

          <TextInput
            value={folder}
            onChangeText={setFolder}
            placeholder="No path selected yet..."
            placeholderTextColor={colors.mutedForeground}
            editable={false} // Read-only so users don't break paths with accidental keyboard typos
            style={[
              styles.input,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.actionsRow}>
            <Pressable
              onPress={pickStorageLocation}
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text
                style={[styles.secondaryButtonText, { color: colors.primary }]}
              >
                Pick location
              </Text>
            </Pressable>

            <Pressable
              onPress={handleContinue}
              disabled={saving || folder.trim().length === 0}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: folder.trim().length === 0 ? 0.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: colors.primaryForeground },
                ]}
              >
                {saving ? "Saving..." : "Lock Folder"}
              </Text>
            </Pressable>
          </View>

          {/* Conditional Close/Cancel Action rendered only when editing from Settings screen context */}
          {onCancel && (
            <Pressable onPress={onCancel} style={styles.cancelContainer}>
              <Text style={[styles.cancelText, { color: colors.destructive }]}>
                Cancel Changes
              </Text>
            </Pressable>
          )}

          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}
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
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  grabber: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
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
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  cancelContainer: {
    alignItems: "center",
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
});
