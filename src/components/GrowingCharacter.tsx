import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface GrowingCharacterProps {
  level: number;
  isGrowing?: boolean;
  onGrowthComplete?: () => void;
}

export const GrowingCharacter: React.FC<GrowingCharacterProps> = ({
  level,
  isGrowing = false,
  onGrowthComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isGrowing) {
      // 성장 애니메이션
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onGrowthComplete?.();
      });

      // 글로우 효과
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isGrowing]);

  const getCharacterEmoji = (level: number) => {
    if (level <= 3) return "🌱"; // 새싹
    if (level <= 6) return "🌿"; // 작은 식물
    if (level <= 9) return "🌳"; // 나무
    return "🌲"; // 큰 나무
  };

  const getCharacterText = (level: number) => {
    if (level <= 3) return "새싹";
    if (level <= 6) return "작은 식물";
    if (level <= 9) return "나무";
    return "큰 나무";
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.characterContainer,
          {
            transform: [{ scale: scaleAnim }],
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      >
        <Text style={styles.characterEmoji}>{getCharacterEmoji(level)}</Text>
      </Animated.View>

      <View style={styles.potContainer}>
        <View style={styles.pot} />
      </View>

      <Text style={styles.levelText}>Lv.{level}</Text>
      <Text style={styles.characterName}>{getCharacterText(level)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  characterContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: colors.deepMint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 4,
  },
  characterEmoji: {
    fontSize: 40,
  },
  potContainer: {
    marginBottom: 8,
  },
  pot: {
    width: 60,
    height: 20,
    backgroundColor: colors.warmOrange,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.deepMint,
  },
  levelText: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "600",
    marginBottom: 4,
  },
  characterName: {
    ...typography.body,
    color: colors.primaryText,
    textAlign: "center",
  },
});
