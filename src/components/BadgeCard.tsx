import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge } from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface BadgeCardProps {
  badge: Badge;
  size?: "small" | "medium" | "large";
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  size = "medium",
}) => {
  const sizeStyles = {
    small: {
      container: { width: 60, height: 60, padding: 8 },
      icon: { fontSize: 20 },
      name: { ...typography.caption },
    },
    medium: {
      container: { width: 80, height: 80, padding: 12 },
      icon: { fontSize: 28 },
      name: { ...typography.body },
    },
    large: {
      container: { width: 100, height: 100, padding: 16 },
      icon: { fontSize: 36 },
      name: { ...typography.h2 },
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, currentSize.container]}>
      <Text style={[styles.icon, currentSize.icon]}>{badge.icon}</Text>
      <Text
        style={[
          styles.name,
          currentSize.name,
          !badge.isUnlocked && styles.locked,
        ]}
      >
        {badge.name}
      </Text>
      {!badge.isUnlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  icon: {
    marginBottom: 4,
  },
  name: {
    color: colors.primaryText,
    fontWeight: "600",
    textAlign: "center",
  },
  locked: {
    color: colors.secondaryText,
    opacity: 0.5,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  lockIcon: {
    fontSize: 16,
  },
});
