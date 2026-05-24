import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { Work, saveWorkToDatabase, insertChapter } from '@/lib/database';

const INTAKE_DIR = `${FileSystem.documentDirectory}intake/`;
const ARCHIVE_DIR = `${FileSystem.documentDirectory}processed_archive/`;

interface ExtractedMetadata {
  title: string;
  author: string;
  publisher: string;
  storyUuid: string;
  fandom: string;
  totalChapters: string;
}

function extractBaseToken(filename: string): string {
  return filename
    .replace(/\s+/g, '_')
    .replace(/\(\d+\)/g, '')
    .replace(/\.epub$/i, '')
    .trim()
    .toLowerCase();
}

function cleanHtmlText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ') 
    .replace(/\s+/g, ' ')     
    .trim();
}

/**
 * PHASE 1: Fast Sync - Extracts precise metadata records and ONLY Chapter 1 text
 */
async function syncMetadataAndFirstChapter(fileUri: string, workId: string): Promise<ExtractedMetadata> {
  const tStart = performance.now();
  console.log(`   [Meta-Sync] 🟢 Starting Fast Sync for workId: ${workId}`);

  let title = "Unknown Title";
  let author = "Unknown Author";
  let publisher = "Local Book";
  let storyUuid = workId;
  let fandom = "General Fanfiction";
  let totalChapters = "?";

  try {
    const tReadStart = performance.now();
    const base64Data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(`   [Meta-Sync] ⏱️ Base64 Disk Read finished in ${(performance.now() - tReadStart).toFixed(2)}ms`);

    const tZipStart = performance.now();
    const zip = await JSZip.loadAsync(base64Data, { base64: true });
    console.log(`   [Meta-Sync] ⏱️ JSZip parsing finished in ${(performance.now() - tZipStart).toFixed(2)}ms`);

    const opfFileKey = Object.keys(zip.files).find(key => key.endsWith('.opf'));

    if (opfFileKey) {
      console.log(`   [Meta-Sync] 📂 Found OPF Manifest file: ${opfFileKey}`);
      const opfContent = await zip.files[opfFileKey].async('string');

      // 1. Text Property Assertions
      const titleMatch = opfContent.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i);
      const authorMatch = opfContent.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i);
      const publisherMatch = opfContent.match(/<dc:publisher[^>]*>([\s\S]*?)<\/dc:publisher>/i);
      const idMatch = opfContent.match(/<dc:identifier[^>]*>([\s\S]*?)<\/dc:identifier>/i);

      if (titleMatch?.[1]) title = titleMatch[1].trim();
      if (authorMatch?.[1]) author = authorMatch[1].trim();

      // 2. Publisher Classification
      if (publisherMatch?.[1]) {
        publisher = publisherMatch[1].trim();
      } else if (opfContent.includes('generator="Ebook-lib')) {
        publisher = "FicHub (FanFiction.Net)";
      }

      // 3. Unique Identifier Fallbacks
      if (idMatch?.[1]) {
        storyUuid = idMatch[1].replace(/<[^>]*>/g, '').trim();
      }

      // 4. Chapter Limits Counting Analysis
      const spineBlockMatch = opfContent.match(/<spine[^>]*>([\s\S]*?)<\/spine>/i);
      if (spineBlockMatch?.[1]) {
        const itemrefMatches = spineBlockMatch[1].match(/<itemref\s+[^>]*>/gi);
        if (itemrefMatches) {
          let count = itemrefMatches.length;
          const navigationNodes = spineBlockMatch[1].match(/idref=["'](nav|toc|introduction|summary)["']/gi);
          if (navigationNodes) count -= navigationNodes.length;
          totalChapters = count > 0 ? count.toString() : "1";
        }
      }

      // 5. Advanced Fandom Extraction Rules
      const subjectMatches = [...opfContent.matchAll(/<dc:subject[^>]*>([\s\S]*?)<\/dc:subject>/gi)];
      const subjects = subjectMatches.map(m => m[1].trim());

      if (subjects.length > 0) {
        const taxonomyBlacklist = [
          'fanworks', 'gen', 'mature', 'explicit', 'teen and up audiences', 
          'general audiences', 'm/m', 'f/m', 'multi', 'other', 'clean',
          'no archive warnings apply', 'choose not to use archive warnings'
        ];

        const targetedFandom = subjects.find(subj => {
          const lower = subj.toLowerCase();
          if (taxonomyBlacklist.includes(lower)) return false;
          if (lower.includes('words complete')) return false;
          return true;
        });

        if (targetedFandom) {
          fandom = targetedFandom.split(' - ')[0].trim();
        }
      } else {
        const descMatch = opfContent.match(/<dc:description[^>]*>([\s\S]*?)<\/dc:description>/i);
        if (descMatch?.[1]) {
          const contextStr = descMatch[1].toLowerCase();
          if (contextStr.includes('harry potter')) fandom = 'Harry Potter';
          else if (contextStr.includes('batman') || contextStr.includes('gotham') || contextStr.includes('dark knight')) fandom = 'DC / Batman';
          else if (contextStr.includes('lord of the rings') || contextStr.includes('lotr') || contextStr.includes('tolkien')) fandom = 'Lord of the Rings';
        }
      }

      // 6. Explicit Normalization Matrix
      const lowerFandom = fandom.toLowerCase();
      if (lowerFandom.includes('harry potter')) fandom = 'Harry Potter';
      else if (lowerFandom.includes('batman') || lowerFandom.includes('dc universe') || lowerFandom.includes('justice league')) fandom = 'DC / Batman';
      else if (lowerFandom.includes('lord of the rings') || lowerFandom.includes('hobbit') || lowerFandom.includes('tolkien')) fandom = 'Lord of the Rings';
    }

    // 7. Extract Chapter 1 Core String Buffer
    const contentFileKeys = Object.keys(zip.files)
      .filter(key => key.endsWith('.html') || key.endsWith('.xhtml'))
      .sort();

    console.log(`   [Meta-Sync] 📄 Found ${contentFileKeys.length} xhtml components inside package.`);

    for (const fileKey of contentFileKeys) {
      const htmlText = await zip.files[fileKey].async('string');
      const cleanText = cleanHtmlText(htmlText);

      if (cleanText.length > 100) {
        if (typeof insertChapter === 'function') {
          const tInsert = performance.now();
          await insertChapter({
            workId: workId,
            chapterNumber: 1,
            title: "Chapter 1",
            bodyText: cleanText
          });
          console.log(`   [Meta-Sync] 💾 Chapter 1 written to database in ${(performance.now() - tInsert).toFixed(2)}ms`);
          break;
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Meta sync extraction processing anomaly:", err);
  }

  console.log(`   [Meta-Sync] 🏁 Total phase 1 execution finish time: ${(performance.now() - tStart).toFixed(2)}ms`);
  return { title, author, publisher, storyUuid, fandom, totalChapters };
}

/**
 * PHASE 2: Lazy Loading - Populates remaining chapters inside background sequences
 */
export async function lazyLoadRemainingChapters(workId: string): Promise<void> {
  const tGlobalStart = performance.now();
  console.log(`🚀 [LazyLoad] 🟠 Running Lazy Unpack Sequence for Book: ${workId}`);

  try {
    const fileUri = `${ARCHIVE_DIR}${workId}.epub`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.warn(`[LazyLoad] ❌ Source binary archive target missing.`);
      return;
    }

    const base64Data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = await JSZip.loadAsync(base64Data, { base64: true });
    const contentFileKeys = Object.keys(zip.files)
      .filter(key => key.endsWith('.html') || key.endsWith('.xhtml'))
      .sort();

    let chapterNum = 1;
    let textBlocksAdded = 0;

    for (const fileKey of contentFileKeys) {
      const htmlText = await zip.files[fileKey].async('string');
      const cleanText = cleanHtmlText(htmlText);

      if (cleanText.length > 100) {
        if (chapterNum > 1) {
          if (typeof insertChapter === 'function') {
            await insertChapter({
              workId: workId,
              chapterNumber: chapterNum,
              title: `Chapter ${chapterNum}`,
              bodyText: cleanText
            });
            textBlocksAdded++;
          }
        }
        chapterNum++;
      }

      // Yield frame computation every 3 files to completely eliminate UI audio stuttering 
      if (chapterNum % 3 === 0) {
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    }
    console.log(`🚀 [LazyLoad] 🎉 Unpack complete in ${(performance.now() - tGlobalStart).toFixed(2)}ms! Loaded ${textBlocksAdded} additional chapters.`);
  } catch (error) {
    console.error("❌ Lazy tracking parse operational failure:", error);
  }
}

/**
 * Master Ingestion Flow Manager Loop
 */
export async function processAndArchiveDownloads(): Promise<void> {
  console.log("📥 [Ingest-Loop] 🔍 Scanning intake staging directory for items...");
  const tLoopStart = performance.now();

  try {
    const intakeInfo = await FileSystem.getInfoAsync(INTAKE_DIR);
    if (!intakeInfo.exists) {
      await FileSystem.makeDirectoryAsync(INTAKE_DIR, { intermediates: true });
      return;
    }

    const archiveInfo = await FileSystem.getInfoAsync(ARCHIVE_DIR);
    if (!archiveInfo.exists) {
      await FileSystem.makeDirectoryAsync(ARCHIVE_DIR, { intermediates: true });
    }

    const fileNames = await FileSystem.readDirectoryAsync(INTAKE_DIR);
    const epubFiles = fileNames.filter(name => name.toLowerCase().endsWith('.epub'));

    if (epubFiles.length === 0) {
      console.log("📥 [Ingest-Loop] ✨ Intake directory clear. No new files found.");
      return;
    }

    console.log(`📥 [Ingest-Loop] 📦 Found ${epubFiles.length} target files to process.`);

    const groups: Record<string, any[]> = {};
    for (const name of epubFiles) {
      const fileUri = `${INTAKE_DIR}${name}`;
      const info = await FileSystem.getInfoAsync(fileUri);
      if (!info.exists) continue;

      const meta = {
        uri: fileUri,
        filename: name,
        baseToken: extractBaseToken(name),
        modificationTime: info.modificationTime || 0
      };

      if (!groups[meta.baseToken]) groups[meta.baseToken] = [];
      groups[meta.baseToken].push(meta);
    }

    for (const token in groups) {
      const variants = groups[token];
      variants.sort((a, b) => b.modificationTime - a.modificationTime);
      const [newestCopy, ...staleDuplicates] = variants;

      for (const duplicate of staleDuplicates) {
        console.log(`   [Ingest-Loop] 🗑️ Purging older duplicated variant: ${duplicate.filename}`);
        await FileSystem.deleteAsync(duplicate.uri, { idempotent: true });
      }

      const generatedWorkId = `local-${token}`;
      const targetArchiveUri = `${ARCHIVE_DIR}${generatedWorkId}.epub`;

      console.log(`📥 [Ingest-Loop] ⏳ Processing file variant layer: ${newestCopy.filename}`);

      // Run Phase 1 Extraction Strategy
      const extracted = await syncMetadataAndFirstChapter(newestCopy.uri, generatedWorkId);

      await FileSystem.moveAsync({
        from: newestCopy.uri,
        to: targetArchiveUri
      });

      const platformSourceType = extracted.publisher.includes("Archive of Our Own") 
        ? "AO3" 
        : extracted.publisher.includes("FicHub") ? "FFN" : "Local Book";

      const newLocalWork: Work = {
        workId: generatedWorkId,
        title: extracted.title !== "Unknown Title" ? extracted.title : newestCopy.filename.replace(/\.epub$/i, '').replace(/_/g, ' '),
        author: extracted.author,
        publisher: extracted.publisher,
        storyUuid: extracted.storyUuid,
        fandom: extracted.fandom,
        sourceUrl: null,
        sourcePlatform: platformSourceType,
        currentChapters: 1,
        totalChapters: extracted.totalChapters,
        lastCommentedChapter: 0,
        shelves: [extracted.fandom],
        needsReview: false,
        status: "Unread",
        dateDownloaded: new Date().toISOString(),
        seriesName: null,
        seriesOrder: 0,
        lastReadTimestamp: null,
        activeParagraphIndex: 0,
        isFavorite: false,
        isComplete: extracted.totalChapters !== "?" && extracted.totalChapters === "1" ? 1 : 0,
        isFullyParsed: 0
      };

      const tDb = performance.now();
      await saveWorkToDatabase(newLocalWork);
      console.log(`📥 [Ingest-Loop] ✅ Meta entry indexed in SQLite database. Total loop block elapsed time: ${(performance.now() - tDb).toFixed(2)}ms`);

      // 🛡️ CRITICAL UI BREATHING ROOM YIELD
      // This stops multiple sequential book conversions from bricking your layout rendering frame streams.
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error("❌ Ingestion engine catastrophic halt:", error);
  }

  console.log(`📥 [Ingest-Loop] 🏁 Global ingestion loop execution completed in ${(performance.now() - tLoopStart).toFixed(2)}ms`);
}
