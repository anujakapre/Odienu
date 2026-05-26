import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const FOLDER_PATH_KEY = "nexus_reader_picked_folder_path";
const FOLDER_URI_KEY = "nexus_reader_picked_folder_uri";

function deriveReadablePath(uri: string): string {
  try {
    const decoded = decodeURIComponent(uri);
    const parts = decoded.split('/tree/');
    if (parts.length > 1) {
      const pathSegment = parts[1].split(':');
      if (pathSegment.length > 1) {
        return pathSegment[1]; 
      }
    }
    return "Selected Storage Folder";
  } catch {
    return "Custom Storage Folder";
  }
}

// Ensure the folderPath state update bubbles up correctly so AppShell re-renders!
export function useFolderPicker() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState<boolean>(false);

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

  const pickFolder = async (): Promise<string | null> => {
    if (isPicking) return null;
    setIsPicking(true);

    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        setIsPicking(false);
        return null; // Return null instead of false 
      }

      const selectedUri = permissions.directoryUri;
      const displayPath = deriveReadablePath(selectedUri);

      await AsyncStorage.setItem(FOLDER_PATH_KEY, displayPath);
      await AsyncStorage.setItem(FOLDER_URI_KEY, selectedUri);

      // Important: Ensure React state batches this properly so the hook returns new values
      setFolderPath(displayPath);
      setFolderUri(selectedUri);

      return displayPath;
    } catch (error) {
      console.error("Directory target allocation failure:", error);
      return null;
    } finally {
      setIsPicking(false);
    }
  };

  return { folderPath, folderUri, isPicking, pickFolder };
}