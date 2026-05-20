import * as Speech from "expo-speech";

import { updateProgress } from "@/lib/database";

export interface SpeechChapterBlock {
  workId: string;
  currentChapters: number;
  text: string;
  activeParagraphIndex: number;
}

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function chunkSentences(text: string): string[] {
  const clean = stripTags(text);
  return clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
}

export async function speakChapter(block: SpeechChapterBlock): Promise<void> {
  const sentences = chunkSentences(block.text);
  for (let index = 0; index < sentences.length; index += 1) {
    const sentence = sentences[index];
    await new Promise<void>((resolve) => {
      Speech.speak(sentence, {
        language: "en-US",
        rate: 0.95,
        pitch: 1,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: () => resolve(),
      });
    });
    void updateProgress(block.workId, block.currentChapters, block.activeParagraphIndex + index + 1);
  }
}
