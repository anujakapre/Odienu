import * as SQLite from "expo-sqlite";

export interface Work {
  workId: string;
  title: string;
  author: string;
  publisher: string | null;
  storyUuid: string | null;
  fandom: string | null;
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
  description: string;
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

interface WorkRow {
  workId: string;
  title: string;
  author: string;
  publisher: string | null;
  storyUuid: string | null;
  fandom: string | null;
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
  description:string;
  lastReadTimestamp: string | null;
  activeParagraphIndex: number;
  isFavorite: number; 
  isComplete: number;
  isFullyParsed: number;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("nexus-reader-v1.db");
  }
  return dbInstance;
}

function parseRow(row: WorkRow): Work {
  return {
    workId: row.workId,
    title: row.title,
    author: row.author,
    publisher: row.publisher ?? "Local Import",
    storyUuid: row.storyUuid ?? row.workId,
    fandom: row.fandom ?? "General Fanfiction",
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
    description:row.description,
    lastReadTimestamp: row.lastReadTimestamp,
    activeParagraphIndex: row.activeParagraphIndex,
    isFavorite: row.isFavorite === 1,
    isComplete: row.isComplete ?? (row.currentChapters.toString() === row.totalChapters ? 1 : 0),
    isFullyParsed: row.isFullyParsed,
  };
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS works (
      workId TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publisher TEXT,
      storyUuid TEXT,
      fandom TEXT,
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
      description TEXT,
      lastReadTimestamp TEXT,
      activeParagraphIndex INTEGER NOT NULL DEFAULT 0,
      isFavorite INTEGER NOT NULL DEFAULT 0,
      isComplete INTEGER NOT NULL DEFAULT 0,
      isFullyParsed INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workId TEXT NOT NULL,
      chapterNumber INTEGER NOT NULL,
      title TEXT,
      bodyText TEXT,
      UNIQUE(workId, chapterNumber)
    );
  `);

  const migrations = [
    "ALTER TABLE works ADD COLUMN isFavorite INTEGER NOT NULL DEFAULT 0;",
    "ALTER TABLE works ADD COLUMN isComplete INTEGER NOT NULL DEFAULT 0;",
    "ALTER TABLE works ADD COLUMN isFullyParsed INTEGER NOT NULL DEFAULT 0;",
    "ALTER TABLE works ADD COLUMN publisher TEXT;",
    "ALTER TABLE works ADD COLUMN storyUuid TEXT;",
    "ALTER TABLE works ADD COLUMN fandom TEXT;"
  ];

  for (const query of migrations) {
    try { await db.execAsync(query); } catch (e) {}
  }
}

export async function getAllWorks(): Promise<Work[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<WorkRow>("SELECT * FROM works ORDER BY dateDownloaded DESC");
  return rows.map(parseRow);
}

export async function getAllIncompleteWorks(): Promise<Work[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<WorkRow>("SELECT * FROM works WHERE isComplete = 0");
  return rows.map(parseRow);
}

export async function updateWorkStatus(workId: string, status: Work["status"]): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync("UPDATE works SET status = ?, lastReadTimestamp = ? WHERE workId = ?", [status, now, workId]);
}

export async function markReviewed(workId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE works SET needsReview = 0 WHERE workId = ?", [workId]);
}

export async function updateProgress(workId: string, currentChapters: number, activeParagraphIndex: number): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    "UPDATE works SET currentChapters = ?, activeParagraphIndex = ?, lastReadTimestamp = ? WHERE workId = ?",
    [currentChapters, activeParagraphIndex, now, workId]
  );
}

export async function toggleFavorite(workId: string, currentStatus: boolean): Promise<void> {
  const db = await getDb();
  const numericValue = currentStatus ? 0 : 1;
  await db.runAsync("UPDATE works SET isFavorite = ? WHERE workId = ?", [numericValue, workId]);
}

export async function saveWorkToDatabase(work: Work): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO works (
      workId, title, author, publisher, storyUuid, fandom, sourceUrl, sourcePlatform,
      currentChapters, totalChapters, lastCommentedChapter, shelves,
      needsReview, status, dateDownloaded, seriesName, seriesOrder,
      lastReadTimestamp, activeParagraphIndex, isFavorite, isComplete, isFullyParsed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      work.workId,
      work.title,
      work.author,
      work.publisher,
      work.storyUuid,
      work.fandom,
      work.sourceUrl,
      work.sourcePlatform,
      work.currentChapters,
      work.totalChapters,
      work.lastCommentedChapter,
      JSON.stringify(work.shelves),
      work.needsReview ? 1 : 0,
      work.status,
      work.dateDownloaded,
      work.seriesName,
      work.seriesOrder,
      work.description,
      work.lastReadTimestamp,
      work.activeParagraphIndex,
      work.isFavorite ? 1 : 0,
      work.isComplete,
      work.isFullyParsed,
    ]
  );
}

export async function deleteWorkRecord(workId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM works WHERE workId = ?", [workId]);
  await db.runAsync("DELETE FROM chapters WHERE workId = ?", [workId]);
}

export async function insertChapter(chapter: Chapter): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO chapters (workId, chapterNumber, title, bodyText) VALUES (?, ?, ?, ?)`,
    [chapter.workId, chapter.chapterNumber, chapter.title, chapter.bodyText]
  );
}
