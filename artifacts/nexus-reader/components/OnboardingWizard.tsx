import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useAppConfig } from "@/hooks/useAppConfig";
import { useTheme } from "@/contexts/ThemeContext";

// 1️⃣ Define the props expected by _layout.tsx
interface OnboardingWizardProps {
  onComplete: (folder: string) => void;
}

// 🎯 THE FIX: This is the main orchestrator component your _layout.tsx is trying to import!
export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { config } = useAppConfig();

  const handleFolderStepComplete = () => {
    // If we have a folder path saved, finish the wizard completely
    if (config?.user_download_folder) {
      onComplete(config.user_download_folder);
    } else {
      // If they skipped, pass an empty string or default fallback
      onComplete?.("");
    }
  };

  // You can easily add more steps here later (e.g., Profile setting step)
  if (currentStep === 0) {
    return <OnboardingFolderStep onNextStep={handleFolderStepComplete} />;
  }

  return null;
}

// 2️⃣ Your step sub-component remains perfectly intact here
interface StepProps {
  onNextStep: () => void;
}

function OnboardingFolderStep({ onNextStep }: StepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const { config, isPicking, pickAndSaveDirectory } = useAppConfig();

  const handlePress = async () => {
    const savedPath = await pickAndSaveDirectory();
    if (savedPath) {
      onNextStep();
    }
  };

  const formatPathDisplay = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("content://")) return "Secure System Path (Authorized Tree)";
    return path;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>Connect Your Library</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Select the local folder where you save your fanfiction EPUB downloads.
      </Text>

      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: colors.primary },
          isPicking && styles.disabled
        ]} 
        onPress={handlePress}
        disabled={isPicking}
      >
        {isPicking ? (
          <ActivityIndicator color={colors.primaryForeground || "#FFFFFF"} size="small" />
        ) : (
          <Text style={[styles.btnText, { color: colors.primaryForeground || "#FFFFFF" }]}>
            {config?.user_download_folder ? "Change Staging Folder" : "Select Intake Folder"}
          </Text>
        )}
      </TouchableOpacity>

      {config?.user_download_folder && (
        <Text style={[styles.pathLabel, { color: colors.mutedForeground, borderColor: colors.border, backgroundColor: colors.card }]}>
          Linked to: {formatPathDisplay(config.user_download_folder)}
        </Text>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={onNextStep}>
        <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Configure later in settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginHorizontal: 12, elevation: 1 },
  disabled: { opacity: 0.6 },
  btnText: { fontWeight: '700', fontSize: 16 },
  pathLabel: { marginTop: 16, fontSize: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, textAlign: 'center', fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  skipBtn: { marginTop: 28, alignItems: 'center' },
  skipText: { fontSize: 14, textDecorationLine: 'underline' }
});
