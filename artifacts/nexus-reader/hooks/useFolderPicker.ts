import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const FOLDER_PATH_KEY = "nexus_reader_picked_folder_path";
const FOLDER_URI_KEY = "nexus_reader_picked_folder_uri";

export function useFolderPicker() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState<boolean>(false);

  // 🔄 Automatically fetch the saved path on boot
  useEffect(() => {
    async function loadStoredDirectory() {
      try {
        const savedPath = await AsyncStorage.getItem(FOLDER_PATH_KEY);
        const savedUri = await AsyncStorage.getItem(FOLDER_URI_KEY);
        if (savedPath) setFolderPath(savedPath);
        if (savedUri) setFolderUri(savedUri);
      } catch (err) {
        console.warn("Failed to load automatically restored directory tokens:", err);
      }
    }
    loadStoredDirectory();
  }, []);

  const pickFolder = async (): Promise<boolean> => {
    if (isPicking) return false;
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.canceled) {
        setIsPicking(false);
        return false;
      }

      const selectedUri = result.assets[0].uri;
      const displayPath = result.assets[0].name || "Custom Storage Directory";

      // Save to persistence layer
      await AsyncStorage.setItem(FOLDER_PATH_KEY, displayPath);
      await AsyncStorage.setItem(FOLDER_URI_KEY, selectedUri);

      // Update state instantly across components
      setFolderPath(displayPath);
      setFolderUri(selectedUri);

      return true;
    } catch (error) {
      console.error("Directory target allocation failure:", error);
      return false;
    } finally {
      setIsPicking(false);
    }
  };

  return { folderPath, folderUri, isPicking, pickFolder };
}
