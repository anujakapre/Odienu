    import { useCallback, useEffect, useState } from "react";
    import { getAllWorks, initDatabase, markReviewed, updateWorkStatus, toggleFavorite, Work } from "@/lib/database";
    import { computeDashboard, DashboardData } from "@/lib/nexusEngine";
    import * as DocumentPicker from "expo-document-picker";
    import { syncFicHubWork } from "@/lib/fichubSync";
    import { processAndArchiveDownloads } from "@/lib/fileIngestion";
    import * as FileSystem from 'expo-file-system';


    export interface UseLibraryReturn {
      works: Work[];
      dashboard: DashboardData | null;
      loading: boolean;
      error: string | null;
      refresh: () => Promise<void>;
      markWorkReviewed: (workId: string) => Promise<void>;
      updateStatus: (workId: string, status: Work["status"]) => Promise<void>;
      syncLocalFiles: () => Promise<void>;
      toggleWorkFavorite: (workId: string, currentStatus: boolean) => Promise<void>;
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
          const synced = await Promise.all(all.map((work) => syncFicHubWork(work).catch(() => null)));
          const nextWorks = all.map((work) => synced.find((item) => item?.workId === work.workId) ?? work);
          setWorks(nextWorks);
          setDashboard(computeDashboard(nextWorks));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to load library");
        } finally {
          setLoading(false);
        }
      }, []);

      useEffect(() => {
        refresh();
      }, [refresh]);

      const markWorkReviewed = useCallback(async (workId: string) => {
        await markReviewed(workId);
        await refresh();
      }, [refresh]);

      const updateStatus = useCallback(async (workId: string, status: Work["status"]) => {
        await updateWorkStatus(workId, status);
        await refresh();
      }, [refresh]);

      const syncLocalFiles = async () => {
        try {
          // 1. Open the system's native UI document picker file drawer target
          const result = await DocumentPicker.getDocumentAsync({
            type: "application/epub+zip",
            multiple: true, // Let users select batches of books together
            copyToCacheDirectory: false,
          });

          if (result.canceled || !result.assets) {
            console.log("User canceled book picking transaction.");
            return;
          }

          // 2. Set up the local staging path variable inside the sandboxed file system
          const intakeDir = `${FileSystem.documentDirectory}intake/`;

          // Ensure the intake folder exists before attempting to write into it
          const intakeInfo = await FileSystem.getInfoAsync(intakeDir);
          if (!intakeInfo.exists) {
            await FileSystem.makeDirectoryAsync(intakeDir, { intermediates: true });
          }

          // 3. Loop through picked documents and move copies into your intake directory
          for (const file of result.assets) {
            const destinationUri = `${intakeDir}${file.name}`;

            await FileSystem.copyAsync({
              from: file.uri,
              to: destinationUri,
            });
            console.log(`Staged document asset in sandbox workspace: ${file.name}`);
          }

          // 4. Run your new JSZip deduplication parsing extraction utility machine
          await processAndArchiveDownloads();

          // 5. Force refresh your dashboard view state lines
          await refresh(); 
          console.log("Database synced and view refreshing completed cleanly!");

        } catch (err) {
          console.error("Failed handling native document importing sequences:", err);
        }
      };

      const toggleWorkFavorite = useCallback(async (workId: string, currentStatus: boolean) => {
        await toggleFavorite(workId, currentStatus);
        await refresh();
      }, [refresh]);

      return {
        works,
        dashboard,
        loading,
        error,
        refresh,
        markWorkReviewed,
        updateStatus,
        syncLocalFiles,
        toggleWorkFavorite,
      };
    }