import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

// Fix 1: TTS 4000-Character Block Limit Crash
// Chunk text safely below 2400 characters
function chunkText(text: string, maxLength: number = 2400): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  let currentChunk = "";

  const paragraphs = text.split("\n\n");

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length < maxLength) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      if (paragraph.length >= maxLength) {
        const sentences = paragraph.split(/(?<=[.?!])\s+/);
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length < maxLength) {
            currentChunk += (currentChunk ? " " : "") + sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            if (sentence.length >= maxLength) {
              currentChunk = sentence.substring(
                0,
                Math.max(1, maxLength - 100),
              );
            } else {
              currentChunk = sentence;
            }
          }
        }
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Global reference pointer for our silent active background audio anchor
let backgroundAudioAnchor: Audio.Sound | null = null;

export async function configureAudioSession() {
  try {
    // 1. Tell Android and iOS hardware layers we are a persistent playback utility
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true, // Crucial for background tasks
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // 2. Spawn a low-overhead silent media bridge anchor to keep Android's CPU awake
    if (!backgroundAudioAnchor) {
      const { sound } = await Audio.Sound.createAsync(
        // An incredibly small, empty, built-in base64 silent audio sequence track
        { uri: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==\n" },
        { isLooping: true, volume: 0.01 } // Set volume to practically zero
      );
      backgroundAudioAnchor = sound;
    }

    await backgroundAudioAnchor.playAsync();
  } catch (error) {
    console.warn("Failed to set audio session mode safely:", error);
  }
}

let isSpeakingSequence = false;
let currentSequenceIndex = 0;
let activeChunks: string[] = [];

export async function speakChapter(params: {
  text: string;
  workId: string;
  currentChapters: number;
  activeParagraphIndex: number;
}) {
  // Mount our background tracking anchor immediately
  await configureAudioSession();

  isSpeakingSequence = true;
  activeChunks = chunkText(params.text);
  currentSequenceIndex = 0;

  playNextChunk();
}

async function playNextChunk() {
  if (!isSpeakingSequence || currentSequenceIndex >= activeChunks.length) {
    await clearAudioAnchor();
    return;
  }

  const chunk = activeChunks[currentSequenceIndex];
  const config = await getTTSSettings();

  Speech.speak(chunk, {
    rate: config.narrator.rate,
    pitch: config.narrator.pitch,
    voice: config.narrator.voiceIdentifier,
    onDone: () => {
      if (isSpeakingSequence) {
        currentSequenceIndex++;
        playNextChunk();
      }
    },
    onStopped: () => {
      isSpeakingSequence = false;
      clearAudioAnchor();
    },
    onError: (err) => {
      console.error("Speech Error inside background loop: ", err);
      // Continuous playback self-healing loop step: move to next paragraph even if one crashes
      if (isSpeakingSequence) {
        currentSequenceIndex++;
        playNextChunk();
      }
    },
  });
}

async function clearAudioAnchor() {
  isSpeakingSequence = false;
  try {
    if (backgroundAudioAnchor) {
      await backgroundAudioAnchor.stopAsync();
      await backgroundAudioAnchor.unloadAsync();
      backgroundAudioAnchor = null;
    }
  } catch (err) {
    console.warn("Muted background hook disassembly warning:", err);
  }
}

export async function stopSpeaking() {
  isSpeakingSequence = false;
  await clearAudioAnchor();
  await Speech.stop();
}

export interface VoiceProfile {
  voiceIdentifier: string;
  rate: number;
  pitch: number;
  volume: number;
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
    volume: 0.13,
  },
  dialogue: {
    voiceIdentifier: "en-gb-x-gba-local",
    rate: 1.56,
    pitch: 1.1,
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
      enableDialogueVoice:
        parsed.enableDialogueVoice ?? DEFAULT_TTS_PROFILE.enableDialogueVoice,
    };
  } catch {
    return DEFAULT_TTS_PROFILE;
  }
}

export async function saveTTSSettings(
  settings: TTSSettingsProfile,
): Promise<void> {
  await AsyncStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify(settings));
}