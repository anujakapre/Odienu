import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppConfig {
  user_download_folder: string | null;
}

const STORAGE_KEY = "nexus_reader_config";

const DEFAULT_CONFIG: AppConfig = {
  user_download_folder: null,
};

export async function getConfig(): Promise<AppConfig> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      user_download_folder:
        typeof parsed.user_download_folder === "string"
          ? parsed.user_download_folder
          : null,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setConfig(next: AppConfig): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function setDownloadFolder(folder: string): Promise<void> {
  await setConfig({ user_download_folder: folder });
}
