import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface LevelUpAnimationProps {
  isVisible: boolean;
  newLevel: number;
  onComplete: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  isVisible,
  newLevel,
  onComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // 시작 애니메이션
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 완료 후 페이드 아웃
        setTimeout(() => {
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
          });
        }, 2000);
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [
              {
                scale: scaleAnim,
              },
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.levelUpText}>LEVEL UP!</Text>
        <Text style={styles.newLevelText}>Level {newLevel}</Text>
        <Text style={styles.congratsText}>축하합니다! 🎉</Text>

        {/* 파티클 효과 */}
        <View style={styles.particles}>
          {[...Array(6)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  transform: [
                    {
                      translateX: rotationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.cos(index * 60) * 50],
                      }),
                    },
                    {
                      translateY: rotationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.sin(index * 60) * 50],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.particleText}>✨</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelUpText: {
    ...typography.h1,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 8,
  },
  newLevelText: {
    ...typography.h2,
    color: colors.coralPink,
    fontWeight: "600",
    marginBottom: 16,
  },
  congratsText: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
  particles: {
    position: "absolute",
    width: 200,
    height: 200,
  },
  particle: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  particleText: {
    fontSize: 20,
  },
});
