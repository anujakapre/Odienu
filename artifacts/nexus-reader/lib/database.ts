import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Work {
  workId: string;
  title: string;
  author: string;
  publisher: string | null;     // 👈 NEW
  storyUuid: string | null;     // 👈 NEW
  fandom: string | null;        // 👈 NEW
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
  isFavorite: boolean;
  isComplete: number; 
  isFullyParsed: number;   
}

export interface Chapter {
  workId: string;
  chapterNumber: number;
  title: string;
  bodyText: string;
}

const STORAGE_KEY = "nexus_reader_works";
const CHAPTERS_STORAGE_KEY = "nexus_reader_chapters_mock";
const SEEDED_KEY = "nexus_reader_seeded";

const SEED_DATA: Work[] = [
  {
    workId: "seed-001",
    title: "The Prophecy Reversed",
    author: "ScrivenWitch88",
    publisher: "Archive of Our Own",
    storyUuid: "c05f1e6f-5752-4393-8cab-c88d23b4b0c2",
    fandom: "Harry Potter",
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
    isFavorite: false,
    isComplete: 0,
    isFullyParsed: 1
  },
  {
    workId: "seed-002",
    title: "A Dark Knight's Hallow",
    author: "PortalInk",
    publisher: "Archive of Our Own",
    storyUuid: "3kskhpHe",
    fandom: "DC / Batman",
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
    isFavorite: false,
    isComplete: 0,
    isFullyParsed: 1
  }
];

async function readWorks(): Promise<Work[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Work[];
  return parsed.map((w) => ({
    ...w,
    isFavorite: w.isFavorite ?? false,
    isComplete: w.isComplete ?? (w.currentChapters.toString() === w.totalChapters ? 1 : 0),
    publisher: w.publisher ?? "Unknown",
    storyUuid: w.storyUuid ?? w.workId,
    fandom: w.fandom ?? "General Fanfiction"
  }));
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

export async function getAllIncompleteWorks(): Promise<Work[]> {
  const works = await readWorks();
  return works.filter((w) => w.isComplete === 0);
}

export async function updateWorkStatus(workId: string, status: Work["status"]): Promise<void> {
  const works = await readWorks();
  const now = new Date().toISOString();
  const updated = works.map((w) =>
    w.workId === workId ? { ...w, status, lastReadTimestamp: now } : w
  );
  await writeWorks(updated);
}

export async function markReviewed(workId: string): Promise<void> {
  const works = await readWorks();
  const updated = works.map((w) => (w.workId === workId ? { ...w, needsReview: false } : w));
  await writeWorks(updated);
}

export async function updateProgress(workId: string, currentChapters: number, activeParagraphIndex: number): Promise<void> {
  const works = await readWorks();
  const now = new Date().toISOString();
  const updated = works.map((w) =>
    w.workId === workId ? { ...w, currentChapters, activeParagraphIndex, lastReadTimestamp: now } : w
  );
  await writeWorks(updated);
}

export async function toggleFavorite(workId: string, currentStatus: boolean): Promise<void> {
  const works = await readWorks();
  const updated = works.map((w) =>
    w.workId === workId ? { ...w, isFavorite: !currentStatus } : w
  );
  await writeWorks(updated);
}

export async function saveWorkToDatabase(work: Work): Promise<void> {
  const works = await readWorks();
  const exists = works.some((w) => w.workId === work.workId);
  const updated = exists ? works.map((w) => (w.workId === work.workId ? work : w)) : [...works, work];
  await writeWorks(updated);
}

export async function deleteWorkRecord(workId: string): Promise<void> {
  const works = await readWorks();
  const updated = works.filter((w) => w.workId !== workId);
  await writeWorks(updated);
}

// 📦 NEW WEB/MOCK IMPLEMENTATION: Saves chapter strings to safe mock storage
export async function insertChapter(chapter: Chapter): Promise<void> {
  const raw = await AsyncStorage.getItem(CHAPTERS_STORAGE_KEY);
  const currentChapters = raw ? (JSON.parse(raw) as Chapter[]) : [];

  const filtered = currentChapters.filter(
    (c) => !(c.workId === chapter.workId && c.chapterNumber === chapter.chapterNumber)
  );

  await AsyncStorage.setItem(CHAPTERS_STORAGE_KEY, JSON.stringify([...filtered, chapter]));
}
