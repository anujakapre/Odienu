import * as SQLite from "expo-sqlite";

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

interface WorkRow {
  workId: string;
  title: string;
  author: string;
  sourceUrl: string | null;
  sourcePlatform: string;
  currentChapters: number;
  totalChapters: string;
  lastCommentedChapter: number;
  shelves: string;
  needsReview: number;
  status: string;
  dateDownloaded: string;
  seriesName: string | null;
  seriesOrder: number;
  lastReadTimestamp: string | null;
  activeParagraphIndex: number;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("nexus-reader.db");
  }
  return dbInstance;
}

function parseRow(row: WorkRow): Work {
  return {
    workId: row.workId,
    title: row.title,
    author: row.author,
    sourceUrl: row.sourceUrl,
    sourcePlatform: row.sourcePlatform as Work["sourcePlatform"],
    currentChapters: row.currentChapters,
    totalChapters: row.totalChapters,
    lastCommentedChapter: row.lastCommentedChapter,
    shelves: JSON.parse(row.shelves || "[]") as string[],
    needsReview: row.needsReview === 1,
    status: row.status as Work["status"],
    dateDownloaded: row.dateDownloaded,
    seriesName: row.seriesName,
    seriesOrder: row.seriesOrder,
    lastReadTimestamp: row.lastReadTimestamp,
    activeParagraphIndex: row.activeParagraphIndex,
  };
}

const SEED_DATA = [
  {
    workId: "seed-001",
    title: "The Prophecy Reversed",
    author: "ScrivenWitch88",
    sourceUrl: "https://archiveofourown.org/works/45123456",
    sourcePlatform: "AO3",
    currentChapters: 34,
    totalChapters: "40",
    lastCommentedChapter: 32,
    shelves: JSON.stringify(["Harry Potter"]),
    needsReview: 1,
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
    shelves: JSON.stringify(["Harry Potter", "DC Comics"]),
    needsReview: 0,
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
    shelves: JSON.stringify(["Marvel Avengers"]),
    needsReview: 0,
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
    shelves: JSON.stringify(["Marvel Avengers"]),
    needsReview: 0,
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
    shelves: JSON.stringify(["Marvel Avengers"]),
    needsReview: 0,
    status: "Unread",
    dateDownloaded: "2026-05-19T06:00:00.000Z",
    seriesName: "The Infinity Protocol",
    seriesOrder: 3,
    lastReadTimestamp: null,
    activeParagraphIndex: 0,
  },
];

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS works (
      workId TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      sourceUrl TEXT,
      sourcePlatform TEXT NOT NULL DEFAULT 'AO3',
      currentChapters INTEGER NOT NULL DEFAULT 0,
      totalChapters TEXT NOT NULL DEFAULT '?',
      lastCommentedChapter INTEGER NOT NULL DEFAULT 0,
      shelves TEXT NOT NULL DEFAULT '[]',
      needsReview INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Unread',
      dateDownloaded TEXT NOT NULL,
      seriesName TEXT,
      seriesOrder INTEGER NOT NULL DEFAULT 0,
      lastReadTimestamp TEXT,
      activeParagraphIndex INTEGER NOT NULL DEFAULT 0
    );
  `);

  const countResult = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM works"
  );
  if (countResult && countResult.count > 0) return;

  for (const seed of SEED_DATA) {
    await db.runAsync(
      `INSERT INTO works (workId, title, author, sourceUrl, sourcePlatform,
        currentChapters, totalChapters, lastCommentedChapter, shelves,
        needsReview, status, dateDownloaded, seriesName, seriesOrder,
        lastReadTimestamp, activeParagraphIndex)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        seed.workId,
        seed.title,
        seed.author,
        seed.sourceUrl,
        seed.sourcePlatform,
        seed.currentChapters,
        seed.totalChapters,
        seed.lastCommentedChapter,
        seed.shelves,
        seed.needsReview,
        seed.status,
        seed.dateDownloaded,
        seed.seriesName,
        seed.seriesOrder,
        seed.lastReadTimestamp,
        seed.activeParagraphIndex,
      ]
    );
  }
}

export async function getAllWorks(): Promise<Work[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<WorkRow>(
    "SELECT * FROM works ORDER BY dateDownloaded DESC"
  );
  return rows.map(parseRow);
}

export async function updateWorkStatus(
  workId: string,
  status: Work["status"]
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    "UPDATE works SET status = ?, lastReadTimestamp = ? WHERE workId = ?",
    [status, now, workId]
  );
}

export async function markReviewed(workId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE works SET needsReview = 0 WHERE workId = ?", [
    workId,
  ]);
}

export async function updateProgress(
  workId: string,
  currentChapters: number,
  activeParagraphIndex: number
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    "UPDATE works SET currentChapters = ?, activeParagraphIndex = ?, lastReadTimestamp = ? WHERE workId = ?",
    [currentChapters, activeParagraphIndex, now, workId]
  );
}
