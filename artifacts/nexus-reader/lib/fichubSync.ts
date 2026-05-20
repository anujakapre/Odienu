import { Work, markReviewed, updateProgress } from "@/lib/database";

export async function syncFicHubWork(work: Work): Promise<Work | null> {
  if (!work.sourceUrl || work.sourcePlatform === "AO3" || work.sourcePlatform === "FFN") {
    return null;
  }

  const response = await fetch(
    `https://fichub.net/api/v0/meta?q=${encodeURIComponent(work.sourceUrl)}`
  );
  if (!response.ok) return null;

  const meta = (await response.json()) as { live_chapters?: number };
  if (typeof meta.live_chapters !== "number" || meta.live_chapters <= work.currentChapters) {
    return null;
  }

  void updateProgress(work.workId, meta.live_chapters, work.activeParagraphIndex);
  void markReviewed(work.workId);

  return { ...work, currentChapters: meta.live_chapters, needsReview: true };
}
