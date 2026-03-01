import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface StampButtonProps {
  onStampComplete: () => void;
  disabled?: boolean;
}

export const StampButton: React.FC<StampButtonProps> = ({
  onStampComplete,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inkAnim = useRef(new Animated.Value(0)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (!disabled && !isStamped) {
        setIsPressed(true);
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    },
    onPanResponderRelease: () => {
      if (!disabled && !isStamped && isPressed) {
        handleStampComplete();
      }
      setIsPressed(false);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    },
  });

  const handleStampComplete = () => {
    setIsStamped(true);

    // 잉크 애니메이션
    Animated.sequence([
      Animated.timing(inkAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(inkAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 도장 애니메이션
    Animated.sequence([
      Animated.timing(stampAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(stampAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onStampComplete();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.stampButton,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isStamped ? colors.success : colors.coralPink,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.stampText}>{isStamped ? "✅" : "👣"}</Text>

        {/* 잉크 효과 */}
        <Animated.View
          style={[
            styles.inkEffect,
            {
              opacity: inkAnim,
              transform: [
                {
                  scale: inkAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2],
                  }),
                },
              ],
            },
          ]}
        />

        {/* 도장 효과 */}
        <Animated.View
          style={[
            styles.stampEffect,
            {
              opacity: stampAnim,
              transform: [
                {
                  scale: stampAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.stampEffectText}>👣</Text>
        </Animated.View>
      </Animated.View>

      <Text style={styles.instructionText}>
        {isStamped ? "완료!" : "길게 눌러서 완료"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  stampButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  stampText: {
    fontSize: 50,
    zIndex: 2,
  },
  inkEffect: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.coralPink,
    zIndex: 1,
  },
  stampEffect: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  stampEffectText: {
    fontSize: 60,
    color: colors.coralPink,
  },
  instructionText: {
    ...typography.caption,
    color: colors.secondaryText,
    marginTop: 12,
    textAlign: "center",
  },
});
