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
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";

import { useAppConfig } from "@/hooks/useAppConfig"; // 👈 Import our upgraded config engine
import { ThemeMascot } from "@/components/ThemeMascot";
import { useTheme } from "@/contexts/ThemeContext";
import { getTTSSettings, saveTTSSettings, TTSSettingsProfile, VoiceProfile } from "@/lib/ttsSettings";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;

  // 🔄 Load AppConfig management layer
  const { config, isPicking, pickAndSaveDirectory } = useAppConfig();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [ao3Username, setAo3Username] = useState("");

  // Advanced Vocal Processing Engines States
  const [ttsConfig, setTtsConfig] = useState<TTSSettingsProfile | null>(null);
  const [systemVoices, setSystemVoices] = useState<Speech.Voice[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedName = await AsyncStorage.getItem("user_profile_name");
        const savedAo3 = await AsyncStorage.getItem("user_ao3_name");

        if (savedName) setUsername(savedName);
        if (savedAo3) setAo3Username(savedAo3);

        const ttsSettings = await getTTSSettings();
        setTtsConfig(ttsSettings);

        const voices = await Speech.getAvailableVoicesAsync();
        setSystemVoices(voices.filter(v => v.language.toLowerCase().startsWith("en")));
      } catch (error) {
        console.error("Failed to load settings configuration.", error);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const savePreference = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving key ${key}:`, error);
    }
  };

  const updateVoiceProfile = async (target: "narrator" | "dialogue", key: keyof VoiceProfile, value: any) => {
    if (!ttsConfig) return;
    const updatedConfig = {
      ...ttsConfig,
      [target]: { ...ttsConfig[target], [key]: value }
    };
    setTtsConfig(updatedConfig);
    await saveTTSSettings(updatedConfig);
  };

  const toggleDialoguePlayback = async () => {
    if (!ttsConfig) return;
    const updatedConfig = { ...ttsConfig, enableDialogueVoice: !ttsConfig.enableDialogueVoice };
    setTtsConfig(updatedConfig);
    await saveTTSSettings(updatedConfig);
  };

  const triggerAudioPreview = async () => {
    if (!ttsConfig) return;

    if (isPreviewing) {
      await Speech.stop();
      setIsPreviewing(false);
      return;
    }

    setIsPreviewing(true);
    const narratorText = "This is how the narrator voice sounds.";
    const dialogueText = "And this is a line of spoken dialogue!";

    const voices = await Speech.getAvailableVoicesAsync();
    const getVoiceId = (id: string) => voices.find(v => v.id === id)?.id || voices.find(v => v.language.toLowerCase().startsWith("en-gb"))?.id;

    Speech.speak(narratorText, {
      voice: getVoiceId(ttsConfig.narrator.voiceIdentifier),
      rate: ttsConfig.narrator.rate,
      pitch: ttsConfig.narrator.pitch,
      volume: ttsConfig.narrator.volume,
      onDone: () => {
        if (ttsConfig.enableDialogueVoice) {
          Speech.speak(dialogueText, {
            voice: getVoiceId(ttsConfig.dialogue.voiceIdentifier),
            rate: ttsConfig.dialogue.rate,
            pitch: ttsConfig.dialogue.pitch,
            volume: ttsConfig.dialogue.volume,
            onDone: () => setIsPreviewing(false),
            onStopped: () => setIsPreviewing(false)
          });
        } else {
          setIsPreviewing(false);
        }
      },
      onStopped: () => setIsPreviewing(false)
    });
  };

  const formatPathDisplay = (path?: string | null) => {
    if (!path) return "No folder linked yet";
    if (path.startsWith("content://")) return "Secure System Path (Authorized Target)";
    return path;
  };

  if (loading || !ttsConfig) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.screenHeader, { color: colors.foreground }]}>Preferences</Text>

        {/* --- SECTION 1: USER PROFILE --- */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.mascotProfileBadgeRow}>
            <ThemeMascot size={72} />
            <View style={styles.mascotTextBox}>
              <Text style={[styles.mascotGreetingText, { color: colors.mutedForeground }]}>{theme.decorations.profileGreeting}</Text>
              <Text style={[styles.mascotIdentityText, { color: colors.primary }]}>{theme.decorations.mascotEmoji} {theme.decorations.mascotName}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 4 }]} />
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>DISPLAY NAME</Text>
            <TextInput value={username} onChangeText={(val) => { setUsername(val); savePreference("user_profile_name", val); }} placeholder="Your reader name" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>AO3 USERNAME</Text>
            <TextInput value={ao3Username} onChangeText={(val) => { setAo3Username(val); savePreference("user_ao3_name", val); }} placeholder="Archive of Our Own handle" placeholderTextColor={colors.mutedForeground} autoCapitalize="none" autoCorrect={false} style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} />
          </View>
        </View>

        {/* --- SECTION 2: AUDIO SYNTHESIS MANAGEMENT CARD --- */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Narrator Synthesis Engine</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>ACTIVE VOICE MODEL</Text>
            <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Picker
                selectedValue={ttsConfig.narrator.voiceIdentifier}
                onValueChange={(val) => updateVoiceProfile("narrator", "voiceIdentifier", val)}
                style={{ color: colors.foreground }}
                dropdownIconColor={colors.foreground}
              >
                {systemVoices.map(v => (
                  <Picker.Item key={v.id} label={`${v.name} (${v.language})`} value={v.id} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Reading Speed</Text>
            </View>
            <View style={styles.pillSelectorRow}>
              {["1.0", "1.25", "1.56", "1.8"].map((speed) => (
                <Pressable key={speed} onPress={() => updateVoiceProfile("narrator", "rate", parseFloat(speed))} style={[styles.pillButton, { borderColor: colors.border }, ttsConfig.narrator.rate === parseFloat(speed) && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  <Text style={[styles.pillText, { color: colors.primary }, ttsConfig.narrator.rate === parseFloat(speed) && { color: colors.primaryForeground }]}>{speed}x</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Vocal Pitch</Text>
            </View>
            <View style={styles.pillSelectorRow}>
              {["0.85", "0.95", "1.05"].map((pitch) => (
                <Pressable key={pitch} onPress={() => updateVoiceProfile("narrator", "pitch", parseFloat(pitch))} style={[styles.pillButton, { borderColor: colors.border }, ttsConfig.narrator.pitch === parseFloat(pitch) && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  <Text style={[styles.pillText, { color: colors.primary }, ttsConfig.narrator.pitch === parseFloat(pitch) && { color: colors.primaryForeground }]}>{pitch === "0.95" ? "0.95 (Deep)" : pitch}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Volume Intensity</Text>
            </View>
            <View style={styles.pillSelectorRow}>
              {["0.13", "0.50", "1.0"].map((vol) => (
                <Pressable key={vol} onPress={() => updateVoiceProfile("narrator", "volume", parseFloat(vol))} style={[styles.pillButton, { borderColor: colors.border }, ttsConfig.narrator.volume === parseFloat(vol) && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  <Text style={[styles.pillText, { color: colors.primary }, ttsConfig.narrator.volume === parseFloat(vol) && { color: colors.primaryForeground }]}>{vol === "0.13" ? "13%" : vol === "0.50" ? "50%" : "100%"}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable onPress={triggerAudioPreview} style={[styles.actionButton, { backgroundColor: isPreviewing ? "#EF4444" : colors.primary + "15", borderColor: isPreviewing ? "#EF4444" : colors.primary }]}>
            <Text style={[styles.actionButtonText, { color: isPreviewing ? "#FFFFFF" : colors.primary }]}>
              {isPreviewing ? "🛑 Stop Sound Test Preview" : "🔊 Live Audio Sandbox Test"}
            </Text>
          </Pressable>
        </View>

        {/* --- SECTION 3: DIALOGUE INJECTION CARD --- */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Dialogue Handling Options</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={[styles.settingName, { color: colors.foreground }]}>Character Dialogue Split</Text>
              <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>Alters system voice properties automatically inside quotation clauses</Text>
            </View>
            <Pressable onPress={toggleDialoguePlayback} style={[styles.pillButton, { borderColor: colors.border, backgroundColor: ttsConfig.enableDialogueVoice ? colors.primary : "transparent" }]}>
              <Text style={[styles.pillText, { color: ttsConfig.enableDialogueVoice ? colors.primaryForeground : colors.primary }]}>
                {ttsConfig.enableDialogueVoice ? "ENABLED" : "DISABLED"}
              </Text>
            </Pressable>
          </View>

          {ttsConfig.enableDialogueVoice && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 8 }]} />
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>DIALOGUE CHARACTER VOICE</Text>
                <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Picker
                    selectedValue={ttsConfig.dialogue.voiceIdentifier}
                    onValueChange={(val) => updateVoiceProfile("dialogue", "voiceIdentifier", val)}
                    style={{ color: colors.foreground }}
                    dropdownIconColor={colors.foreground}
                  >
                    {systemVoices.map(v => (
                      <Picker.Item key={v.id} label={`${v.name} (${v.language})`} value={v.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </>
          )}
        </View>

        {/* --- SECTION 4: OFFLINE LIBRARY STORAGE --- */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Offline Library Storage</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingName, { color: colors.foreground }]}>Active Library Location</Text>

          {/* 📁 Automatically references config state from hook mount */}
          <Text style={[styles.pathLabel, { color: colors.mutedForeground, backgroundColor: colors.background, borderColor: colors.border }]} numberOfLines={1}>
            {formatPathDisplay(config?.user_download_folder)}
          </Text>

          <Pressable 
            onPress={pickAndSaveDirectory} 
            disabled={isPicking}
            style={[styles.actionButton, { backgroundColor: colors.primary + "15", borderColor: colors.primary }, isPicking && { opacity: 0.5 }]}
          >
            {isPicking ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Relocate Storage Folder</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Keep your existing styles as defined below...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: Platform.OS === "ios" ? 60 : 30, paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screenHeader: { fontSize: 28, fontWeight: "900", marginBottom: 24, letterSpacing: -0.5 },
  sectionTitle: { fontSize: 12, fontWeight: "800", marginTop: 24, marginBottom: 8, marginLeft: 4, letterSpacing: 1.2, textTransform: "uppercase" },
  card: { borderWidth: 1, borderRadius: 24, padding: 16, gap: 16 },
  mascotProfileBadgeRow: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 4 },
  mascotTextBox: { flex: 1, justifyContent: "center" },
  mascotGreetingText: { fontSize: 13, fontWeight: "500" },
  mascotIdentityText: { fontSize: 16, fontWeight: "800", marginTop: 2 },
  inputGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: "700", marginLeft: 4 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontWeight: "500" },
  pickerWrapper: { borderWidth: 1, borderRadius: 14, overflow: "hidden", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  settingName: { fontSize: 15, fontWeight: "700" },
  settingSub: { fontSize: 12, marginTop: 2 },
  pillSelectorRow: { flexDirection: "row", gap: 6 },
  pillButton: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", justifyContent: "center" },
  pillText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, width: "100%" },
  pathLabel: { fontSize: 12, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, marginTop: 4 },
  actionButton: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", justifyContent: "center", marginTop: 4 },
  actionButtonText: { fontSize: 14, fontWeight: "700" },
});
