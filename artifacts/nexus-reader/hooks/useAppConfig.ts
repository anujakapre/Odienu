import { useCallback, useEffect, useState } from "react";

import { AppConfig, getConfig, setDownloadFolder } from "@/lib/config";

export function useAppConfig() {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getConfig();
      setConfigState(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const chooseDownloadFolder = useCallback(async (folder: string) => {
    await setDownloadFolder(folder);
    setConfigState({ user_download_folder: folder });
  }, []);

  return { config, loading, refresh, chooseDownloadFolder };
}
