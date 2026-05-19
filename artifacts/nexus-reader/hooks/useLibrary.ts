import { useCallback, useEffect, useState } from "react";

import {
  getAllWorks,
  initDatabase,
  markReviewed,
  updateWorkStatus,
  Work,
} from "@/lib/database";
import { computeDashboard, DashboardData } from "@/lib/nexusEngine";

export interface UseLibraryReturn {
  works: Work[];
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markWorkReviewed: (workId: string) => Promise<void>;
  updateStatus: (workId: string, status: Work["status"]) => Promise<void>;
}

export function useLibrary(): UseLibraryReturn {
  const [works, setWorks] = useState<Work[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      await initDatabase();
      const all = await getAllWorks();
      setWorks(all);
      setDashboard(computeDashboard(all));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markWorkReviewed = useCallback(
    async (workId: string) => {
      await markReviewed(workId);
      await refresh();
    },
    [refresh]
  );

  const updateStatus = useCallback(
    async (workId: string, status: Work["status"]) => {
      await updateWorkStatus(workId, status);
      await refresh();
    },
    [refresh]
  );

  return { works, dashboard, loading, error, refresh, markWorkReviewed, updateStatus };
}
