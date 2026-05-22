import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { OnboardingWizard } from "@/components/OnboardingWizard";
import { useColors } from "@/hooks/useColors";

export function SettingsScreen() {
  const colors = useColors();

  // Loading state while fetching settings from disk
  const [loading, setLoading] = useState(true);

  // Profile States
  const [username, setUsername] = useState("");
  const [ao3Username, setAo3Username] = useState("");

  // Storage State
  const [folderPath, setFolderPath] = useState("");
  const [showFolderWizard, setShowFolderWizard] = useState(false);

  // TTS States (Default speed to 1.0, pitch to 1.0)
  const [ttsRate, setTtsRate] = useState("1.0");
  const [ttsPitch, setTtsPitch] = useState("1.0");
  const [selectedVoice, setSelectedVoice] = useState("System Default");

  // Load saved preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedName = await AsyncStorage.getItem("user_profile_name");
        const savedAo3 = await AsyncStorage.getItem("user_ao3_name");
        const savedFolder = await AsyncStorage.getItem("user_download_folder");
        const savedRate = await AsyncStorage.getItem("user_tts_rate");
        const savedPitch = await AsyncStorage.getItem("user_tts_pitch");
        const savedVoice = await AsyncStorage.getItem("user_tts_voice");

        if (savedName) setUsername(savedName);
        if (savedAo3) setAo3Username(savedAo3);
        if (savedFolder) setFolderPath(savedFolder);
        if (savedRate) setTtsRate(savedRate);
        if (savedPitch) setTtsPitch(savedPitch);
        if (savedVoice) setSelectedVoice(savedVoice);
      } catch (error) {
        console.error("Failed to load settings configuration.", error);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  // Persist helper functions
  const savePreference = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving key ${key}:`, error);
    }
  };

  const handleUpdateFolder = async (newPath: string) => {
    setFolderPath(newPath);
    await AsyncStorage.setItem("user_download_folder", newPath);
    setShowFolderWizard(false);
  };

  const getInitials = () => {
    if (!username.trim()) return "O";
    return username.trim().slice(0, 2).toUpperCase();
  };

  const formatPathDisplay = (path: string) => {
    if (!path) return "No folder linked yet";
    if (path.startsWith("content://")) {
      return "Secure System Path (Authorized Tree)";
    }
    return path;
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenHeader, { color: colors.foreground }]}>
          Preferences
        </Text>

        {/* --- SECTION 1: USER PROFILE --- */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
              {getInitials()}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>DISPLAY NAME</Text>
            <TextInput
              value={username}
              onChangeText={(val) => {
                setUsername(val);
                savePreference("user_profile_name", val);
              }}
              placeholder="Your reader name"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>AO3 USERNAME</Text>
            <TextInput
              value={ao3Username}
              onChangeText={(val) => {
                setAo3Username(val);
                savePreference("user_ao3_name", val);
              }}
              placeholder="Archive of Our Own handle"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            />
          </View>
        </View>

        {/* --- SECTION 2: TEXT-TO-SPEECH AUDIO --- */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Audio Engine
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Reading Speed</Text>
              <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>Multiplies default playback speed</Text>
            </View>
            <View style={styles.pillSelectorRow}>
              {["0.8", "1.0", "1.25", "1.5"].map((speed) => (
                <Pressable
                  key={speed}
                  onPress={() => {
                    setTtsRate(speed);
                    savePreference("user_tts_rate", speed);
                  }}
                  style={[
                    styles.pillButton,
                    { borderColor: colors.border },
                    ttsRate === speed && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: colors.primary },
                      ttsRate === speed && { color: colors.primaryForeground },
                    ]}
                  >
                    {speed}x
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Voice Pitch</Text>
              <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>Adjust vocal frequency depth</Text>
            </View>
            <View style={styles.pillSelectorRow}>
              {["0.9", "1.0", "1.1"].map((pitch) => (
                <Pressable
                  key={pitch}
                  onPress={() => {
                    setTtsPitch(pitch);
                    savePreference("user_tts_pitch", pitch);
                  }}
                  style={[
                    styles.pillButton,
                    { borderColor: colors.border },
                    ttsPitch === pitch && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: colors.primary },
                      ttsPitch === pitch && { color: colors.primaryForeground },
                    ]}
                  >
                    {pitch === "1.0" ? "Normal" : pitch === "0.9" ? "Low" : "High"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* --- SECTION 3: STORAGE DIRECTORY LINK --- */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Offline Library Storage
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingName, { color: colors.foreground }]}>Active Library Location</Text>
          <Text style={[styles.pathLabel, { color: colors.mutedForeground, backgroundColor: colors.background, borderColor: colors.border }]} numberOfLines={1}>
            {formatPathDisplay(folderPath)}
          </Text>

          <Pressable
            onPress={() => setShowFolderWizard(true)}
            style={[styles.actionButton, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Relocate Storage Folder
            </Text>
          </Pressable>
        </View>

        {/* Embedded OnboardingWizard triggered dynamically for directory mutations */}
        {showFolderWizard && (
          <OnboardingWizard
            onComplete={handleUpdateFolder}
            onCancel={() => setShowFolderWizard(false)}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenHeader: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingName: {
    fontSize: 15,
    fontWeight: "700",
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  pillSelectorRow: {
    flexDirection: "row",
    gap: 6,
  },
  pillButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  pathLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});