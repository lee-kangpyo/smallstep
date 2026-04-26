import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LevelBadgeProps {
  level: number;
  experiencePoints: number;
  nextLevelXp: number;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  experiencePoints,
  nextLevelXp,
}) => {
  const progress =
    nextLevelXp > 0 ? (experiencePoints / nextLevelXp) * 100 : 100;

  return (
    <View style={styles.container}>
      <View style={styles.levelCircle}>
        <Text style={styles.levelText}>Lv.{level}</Text>
      </View>
      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>{experiencePoints} / {nextLevelXp} XP</Text>
        <View style={styles.xpBarContainer}>
          <View
            style={[styles.xpBar, { width: `${Math.min(progress, 100)}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  levelText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  xpContainer: {
    flex: 1,
  },
  xpText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  xpBarContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  xpBar: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 3,
  },
});
