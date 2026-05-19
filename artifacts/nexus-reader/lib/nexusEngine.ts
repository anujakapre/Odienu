import { Work } from "./database";

export interface SeriesCluster {
  seriesName: string;
  works: Work[];
}

export type TrackItem =
  | { type: "work"; work: Work }
  | { type: "series"; cluster: SeriesCluster };

export interface FandomShelf {
  fandomName: string;
  displayName: string;
  isNexus: boolean;
  nexusFandoms?: string[];
  activeTrack: TrackItem[];
  toReadTrack: TrackItem[];
}

export interface DashboardData {
  newUpdates: Work[];
  currentlyReading: Work[];
  recentlyRead: Work[];
  readThisMonth: Work[];
  originalFiction: FandomShelf | null;
  fandomShelves: FandomShelf[];
}

const ORIGINAL_FICTION_TAGS = ["original work", "original fiction"];

function isOriginalFiction(shelves: string[]): boolean {
  if (shelves.length === 0) return true;
  return shelves.some((s) => ORIGINAL_FICTION_TAGS.includes(s.toLowerCase()));
}

function isCurrentMonth(timestamp: string): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function buildGlobalSeriesCounts(allWorks: Work[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const w of allWorks) {
    if (w.seriesName) {
      counts.set(w.seriesName, (counts.get(w.seriesName) ?? 0) + 1);
    }
  }
  return counts;
}

function buildTrackItems(
  shelfWorks: Work[],
  globalSeriesCounts: Map<string, number>
): { activeItems: TrackItem[]; toReadItems: TrackItem[] } {
  const seriesMap = new Map<string, Work[]>();
  for (const w of shelfWorks) {
    if (w.seriesName && (globalSeriesCounts.get(w.seriesName) ?? 0) >= 3) {
      if (!seriesMap.has(w.seriesName)) seriesMap.set(w.seriesName, []);
      seriesMap.get(w.seriesName)!.push(w);
    }
  }

  const clusteredIds = new Set<string>();
  seriesMap.forEach((works) => works.forEach((w) => clusteredIds.add(w.workId)));

  const individual = shelfWorks.filter((w) => !clusteredIds.has(w.workId));

  const activeItems: TrackItem[] = individual
    .filter((w) => w.status === "Currently Reading" || w.status === "Read")
    .sort((a, b) =>
      (b.lastReadTimestamp ?? "0").localeCompare(a.lastReadTimestamp ?? "0")
    )
    .map((w) => ({ type: "work" as const, work: w }));

  const toReadItems: TrackItem[] = individual
    .filter((w) => w.status === "Unread")
    .sort((a, b) => b.dateDownloaded.localeCompare(a.dateDownloaded))
    .map((w) => ({ type: "work" as const, work: w }));

  seriesMap.forEach((works, seriesName) => {
    const sorted = [...works].sort((a, b) => a.seriesOrder - b.seriesOrder);
    const cluster: SeriesCluster = { seriesName, works: sorted };
    const activeCount = works.filter((w) => w.status !== "Unread").length;
    if (activeCount > 0) {
      activeItems.push({ type: "series", cluster });
    } else {
      toReadItems.push({ type: "series", cluster });
    }
  });

  return { activeItems, toReadItems };
}

export function computeDashboard(works: Work[]): DashboardData {
  const newUpdates = works.filter((w) => w.needsReview);
  const currentlyReading = works.filter(
    (w) => w.status === "Currently Reading"
  );
  const recentlyRead = works
    .filter((w) => w.lastReadTimestamp != null)
    .sort((a, b) =>
      (b.lastReadTimestamp ?? "0").localeCompare(a.lastReadTimestamp ?? "0")
    )
    .slice(0, 10);
  const readThisMonth = works.filter(
    (w) =>
      w.status === "Read" &&
      w.lastReadTimestamp != null &&
      isCurrentMonth(w.lastReadTimestamp)
  );

  const globalSeriesCounts = buildGlobalSeriesCounts(works);

  const originalWorks = works.filter((w) => isOriginalFiction(w.shelves));
  const fandomWorks = works.filter((w) => !isOriginalFiction(w.shelves));

  const fandomMap = new Map<string, Work[]>();

  for (const work of fandomWorks) {
    for (const fandom of work.shelves) {
      if (!fandomMap.has(fandom)) fandomMap.set(fandom, []);
      fandomMap.get(fandom)!.push(work);
    }

    if (work.shelves.length >= 2) {
      const sortedFandoms = [...work.shelves].sort();
      const nexusKey = `__nexus__${sortedFandoms.join("__x__")}`;
      if (!fandomMap.has(nexusKey)) fandomMap.set(nexusKey, []);
      fandomMap.get(nexusKey)!.push(work);
    }
  }

  const fandomShelves: FandomShelf[] = [];

  fandomMap.forEach((shelfWorks, key) => {
    const isNexus = key.startsWith("__nexus__");
    let displayName: string;
    let nexusFandoms: string[] | undefined;

    if (isNexus) {
      nexusFandoms = key.replace("__nexus__", "").split("__x__");
      displayName = `Nexus \u2014 ${nexusFandoms.join(" \u00d7 ")}`;
    } else {
      displayName = key;
    }

    const { activeItems, toReadItems } = buildTrackItems(
      shelfWorks,
      globalSeriesCounts
    );

    if (activeItems.length === 0 && toReadItems.length === 0) return;

    fandomShelves.push({
      fandomName: key,
      displayName,
      isNexus,
      nexusFandoms,
      activeTrack: activeItems,
      toReadTrack: toReadItems,
    });
  });

  fandomShelves.sort((a, b) => {
    if (a.isNexus !== b.isNexus) return a.isNexus ? 1 : -1;
    return a.displayName.localeCompare(b.displayName);
  });

  let originalFiction: FandomShelf | null = null;
  if (originalWorks.length > 0) {
    const { activeItems, toReadItems } = buildTrackItems(
      originalWorks,
      globalSeriesCounts
    );
    originalFiction = {
      fandomName: "__original__",
      displayName: "Original Fiction",
      isNexus: false,
      activeTrack: activeItems,
      toReadTrack: toReadItems,
    };
  }

  return {
    newUpdates,
    currentlyReading,
    recentlyRead,
    readThisMonth,
    originalFiction,
    fandomShelves,
  };
}
