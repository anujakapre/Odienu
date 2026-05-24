import AsyncStorage from '@react-native-async-storage/async-storage';
import { Work, markReviewed, updateProgress, getAllIncompleteWorks } from "@/lib/database";

const GLOBAL_UPDATE_CHECK_KEY = 'last_global_update_check';
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

interface FicHubMetaResponse {
  live_chapters?: number;
  is_complete?: boolean;
  title?: string;
  author?: string;
}

/**
 * Syncs an individual work with FicHub, handling completion tags
 */
export async function syncFicHubWork(work: Work): Promise<Work | null> {
  if (!work.sourceUrl || work.sourcePlatform === "AO3" || work.sourcePlatform === "FFN") {
    return null;
  }

  try {
    const response = await fetch(
      `https://fichub.net/api/v0/meta?q=${encodeURIComponent(work.sourceUrl)}`
    );
    if (!response.ok) return null;

    const meta = (await response.json()) as FicHubMetaResponse;
    const targetChapters = meta.live_chapters ?? work.currentChapters;

    // Determine status from metadata response structure
    const isCompleteFlag = meta.is_complete ? 1 : 0;

    if (typeof meta.live_chapters === "number" && meta.live_chapters > work.currentChapters) {
      // New chapters found, push layout structural mutation blocks downstream
      await updateProgress(work.workId, targetChapters, work.activeParagraphIndex);
      await markReviewed(work.workId);

      return { 
        ...work, 
        currentChapters: targetChapters, 
        needsReview: true,
        isComplete: isCompleteFlag 
      };
    }
  } catch (error) {
    console.warn(`FicHub tracking error on work ${work.workId}:`, error);
  }

  return null;
}

/**
 * Low-overhead app-launch sweep targeting incomplete entries
 */
export async function executeWeeklyIncompleteSweep(): Promise<void> {
  try {
    const lastCheck = await AsyncStorage.getItem(GLOBAL_UPDATE_CHECK_KEY);
    const now = Date.now();

    if (lastCheck && now - Number(lastCheck) < ONE_WEEK_IN_MS) {
      console.log("Incomplete sweep skipped: threshold interval is active.");
      return;
    }

    // Select * From database Where isComplete = 0
    const incompleteWorks = await getAllIncompleteWorks();
    if (incompleteWorks.length === 0) return;

    console.log(`Starting background sync process for ${incompleteWorks.length} incomplete titles.`);

    // Sequentially process items with a defensive execution gap to avoid rate limits
    for (let i = 0; i < incompleteWorks.length; i++) {
      const work = incompleteWorks[i];

      // Postpone subsequent task iterations by 3.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 3500));
      await syncFicHubWork(work);
    }

    await AsyncStorage.setItem(GLOBAL_UPDATE_CHECK_KEY, String(now));
    console.log("Weekly incomplete book sweep sync finalized successfully.");
  } catch (error) {
    console.error("Global background updater failure:", error);
  }
}
