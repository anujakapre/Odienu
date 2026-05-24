import { useCallback, useEffect, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import { AppConfig, getConfig, setDownloadFolder } from "@/lib/config";

export function useAppConfig() {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPicking, setIsPicking] = useState(false); // 🛡️ Anti-stacking execution lock

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getConfig();
      setConfigState(next);
    } catch (err) {
      console.error("Failed reading core runtime configurations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 📂 Unified, safe picker method exposed globally
  const pickAndSaveDirectory = useCallback(async (): Promise<string | null> => {
    if (isPicking) return null; // Abort if another window instance is pending
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.canceled) {
        return null;
      }

      const selectedUri = result.assets[0].uri;

      // Save directly to your central configuration layer
      await setDownloadFolder(selectedUri);

      // Update local state instantly so UI redraws
      setConfigState((prev) => prev ? { ...prev, user_download_folder: selectedUri } : null);

      return selectedUri;
    } catch (error) {
      console.error("Catastrophic error handling file explorer tree assignment:", error);
      return null;
    } finally {
      setIsPicking(false); // Release structural concurrency lock
    }
  }, [isPicking]);

  return { 
    config, 
    loading, 
    isPicking, 
    refresh, 
    pickAndSaveDirectory 
  };
}
