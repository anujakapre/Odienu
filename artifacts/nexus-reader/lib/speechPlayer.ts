import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioSession } from 'expo-audio';
import * as Speech from 'expo-speech';

// Fix 1: TTS 4000-Character Block Limit Crash
// Chunk text safely below 2400 characters
function chunkText(text: string, maxLength: number = 2400): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  let currentChunk = '';

  // Split by paragraph blocks first
  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    if ((currentChunk.length + paragraph.length) < maxLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      // If adding the paragraph exceeds the limit, push the current chunk (if any)
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      // If a single paragraph is still too long, split by sentence boundaries
      if (paragraph.length >= maxLength) {
        const sentences = paragraph.split(/(?<=[.?!])\s+/);
        for (const sentence of sentences) {
          if ((currentChunk.length + sentence.length) < maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            // If a SINGLE sentence is somehow huge, cut it raw (fallback)
            if (sentence.length >= maxLength) {
               currentChunk = sentence.substring(0, Math.max(1, maxLength - 100)); // Rough safe cut
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

export async function configureAudioSession() {
  await AudioSession.setCategoryAsync('Playback', { 
    duckOthers: true, 
    audioAttributes: { 
      usage: 'Media', 
      contentType: 'Speech' 
    } 
  });
}

let isSpeakingSequence = false;
let currentSequenceIndex = 0;
let activeChunks: string[] = [];

export async function speakChapter(params: { text: string; workId: string; currentChapters: number; activeParagraphIndex: number }) {
  await configureAudioSession();

  isSpeakingSequence = true;
  activeChunks = chunkText(params.text);
  currentSequenceIndex = 0;

  playNextChunk();
}

function playNextChunk() {
  if (!isSpeakingSequence || currentSequenceIndex >= activeChunks.length) {
    isSpeakingSequence = false;
    return;
  }

  const chunk = activeChunks[currentSequenceIndex];

  Speech.speak(chunk, {
    rate: 1.5,
    pitch: 1.0,
    onDone: () => {
      currentSequenceIndex++;
      playNextChunk();
    },
    onStopped: () => {
      isSpeakingSequence = false;
    },
    onError: (err) => {
      console.error("Speech Error: ", err);
      isSpeakingSequence = false;
    }
  });
}

export async function stopSpeaking() {
  isSpeakingSequence = false;
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
    pitch: 1.10,  
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