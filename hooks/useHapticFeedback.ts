import { useEffect } from "react";
import * as Haptics from "expo-haptics";

export const useHapticFeedback = () => {
  const triggerSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const triggerWarning = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const triggerError = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const triggerLight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const triggerMedium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const triggerHeavy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return {
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerLight,
    triggerMedium,
    triggerHeavy,
  };
};
