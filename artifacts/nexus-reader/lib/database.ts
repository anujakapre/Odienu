import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Work {
  workId: string;
  title: string;
  author: string;
  sourceUrl: string | null;
  sourcePlatform: "AO3" | "FFN" | "Local Book";
  currentChapters: number;
  totalChapters: string;
  lastCommentedChapter: number;
  shelves: string[];
  needsReview: boolean;
  status: "Unread" | "Currently Reading" | "Read";
  dateDownloaded: string;
  seriesName: string | null;
  seriesOrder: number;
  lastReadTimestamp: string | null;
  activeParagraphIndex: number;
}

const STORAGE_KEY = "nexus_reader_works";
const SEEDED_KEY = "nexus_reader_seeded";

const SEED_DATA: Work[] = [
  {
    workId: "seed-001",
    title: "The Prophecy Reversed",
    author: "ScrivenWitch88",
    sourceUrl: "https://archiveofourown.org/works/45123456",
    sourcePlatform: "AO3",
    currentChapters: 34,
    totalChapters: "40",
    lastCommentedChapter: 32,
    shelves: ["Harry Potter"],
    needsReview: true,
    status: "Currently Reading",
    dateDownloaded: "2026-04-15T10:00:00.000Z",
    seriesName: null,
    seriesOrder: 0,
    lastReadTimestamp: "2026-05-18T22:30:00.000Z",
    activeParagraphIndex: 847,
  },
  {
    workId: "seed-002",
    title: "A Dark Knight's Hallow",
    author: "PortalInk",
    sourceUrl: "https://archiveofourown.org/works/48901234",
    sourcePlatform: "AO3",
    currentChapters: 12,
    totalChapters: "?",
    lastCommentedChapter: 11,
    shelves: ["Harry Potter", "DC Comics"],
    needsReview: false,
    status: "Currently Reading",
    dateDownloaded: "2026-05-01T08:00:00.000Z",
    seriesName: null,
    seriesOrder: 0,
    lastReadTimestamp: "2026-05-17T20:00:00.000Z",
    activeParagraphIndex: 214,
  },
  {
    workId: "seed-003",
    title: "Infinity Protocol: Assembled",
    author: "NovaSterling",
    sourceUrl: "https://archiveofourown.org/works/39102938",
    sourcePlatform: "AO3",
    currentChapters: 28,
    totalChapters: "28",
    lastCommentedChapter: 28,
    shelves: ["Marvel Avengers"],
    needsReview: false,
    status: "Read",
    dateDownloaded: "2026-02-10T14:00:00.000Z",
    seriesName: "The Infinity Protocol",
    seriesOrder: 1,
    lastReadTimestamp: "2026-05-05T19:00:00.000Z",
    activeParagraphIndex: 0,
  },
  {
    workId: "seed-004",
    title: "Infinity Protocol: Fractured",
    author: "NovaSterling",
    sourceUrl: "https://archiveofourown.org/works/51293847",
    sourcePlatform: "AO3",
    currentChapters: 15,
    totalChapters: "30",
    lastCommentedChapter: 14,
    shelves: ["Marvel Avengers"],
    needsReview: false,
    status: "Currently Reading",
    dateDownloaded: "2026-05-10T09:00:00.000Z",
    seriesName: "The Infinity Protocol",
    seriesOrder: 2,
    lastReadTimestamp: "2026-05-19T21:00:00.000Z",
    activeParagraphIndex: 390,
  },
  {
    workId: "seed-005",
    title: "Infinity Protocol: Reckoning",
    author: "NovaSterling",
    sourceUrl: "https://archiveofourown.org/works/54738291",
    sourcePlatform: "AO3",
    currentChapters: 0,
    totalChapters: "?",
    lastCommentedChapter: 0,
    shelves: ["Marvel Avengers"],
    needsReview: false,
    status: "Unread",
    dateDownloaded: "2026-05-19T06:00:00.000Z",
    seriesName: "The Infinity Protocol",
    seriesOrder: 3,
    lastReadTimestamp: null,
    activeParagraphIndex: 0,
  },
];

async function readWorks(): Promise<Work[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Work[];
}

async function writeWorks(works: Work[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

export async function initDatabase(): Promise<void> {
  const seeded = await AsyncStorage.getItem(SEEDED_KEY);
  if (seeded) return;
  await writeWorks(SEED_DATA);
  await AsyncStorage.setItem(SEEDED_KEY, "1");
}

export async function getAllWorks(): Promise<Work[]> {
  const works = await readWorks();
  return works.sort((a, b) => b.dateDownloaded.localeCompare(a.dateDownloaded));
}

export async function updateWorkStatus(
  workId: string,
  status: Work["status"]
): Promise<void> {
  const works = await readWorks();
  const now = new Date().toISOString();
  const updated = works.map((w) =>
    w.workId === workId ? { ...w, status, lastReadTimestamp: now } : w
  );
  await writeWorks(updated);
}

export async function markReviewed(workId: string): Promise<void> {
  const works = await readWorks();
  const updated = works.map((w) =>
    w.workId === workId ? { ...w, needsReview: false } : w
  );
  await writeWorks(updated);
}

export async function updateProgress(
  workId: string,
  currentChapters: number,
  activeParagraphIndex: number
): Promise<void> {
  const works = await readWorks();
  const now = new Date().toISOString();
  const updated = works.map((w) =>
    w.workId === workId
      ? { ...w, currentChapters, activeParagraphIndex, lastReadTimestamp: now }
      : w
  );
  await writeWorks(updated);
}
