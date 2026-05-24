import AsyncStorage from "@react-native-async-storage/async-storage";

export interface VoiceProfile {
  voiceIdentifier: string;
  rate: number;
  pitch: number;
  volume: number; // 0.0 to 1.0 internally
}

export interface TTSSettingsProfile {
  narrator: VoiceProfile;
  dialogue: VoiceProfile;
  enableDialogueVoice: boolean;
}

const TTS_SETTINGS_KEY = "nexus_reader_tts_v2_config";

export const DEFAULT_TTS_PROFILE: TTSSettingsProfile = {
  narrator: {
    voiceIdentifier: "en-gb-x-gba-local",
    rate: 1.56,
    pitch: 0.95,
    volume: 0.13, // 13% Loudness attenuation
  },
  dialogue: {
    voiceIdentifier: "en-gb-x-gba-local", 
    rate: 1.56,
    pitch: 1.10,  // Slightly elevated pitch default for dialogue contrast
    volume: 0.13,
  },
  enableDialogueVoice: false,
};

export async function getTTSSettings(): Promise<TTSSettingsProfile> {
  try {
    const raw = await AsyncStorage.getItem(TTS_SETTINGS_KEY);
    if (!raw) return DEFAULT_TTS_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      narrator: { ...DEFAULT_TTS_PROFILE.narrator, ...parsed.narrator },
      dialogue: { ...DEFAULT_TTS_PROFILE.dialogue, ...parsed.dialogue },
      enableDialogueVoice: parsed.enableDialogueVoice ?? DEFAULT_TTS_PROFILE.enableDialogueVoice,
    };
  } catch {
    return DEFAULT_TTS_PROFILE;
  }
}

export async function saveTTSSettings(settings: TTSSettingsProfile): Promise<void> {
  await AsyncStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify(settings));
}
