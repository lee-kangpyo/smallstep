import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface AIFeedbackCardProps {
  successRate: number;
  consecutiveDays: number;
  totalSteps: number;
  completedSteps: number;
}

export const AIFeedbackCard: React.FC<AIFeedbackCardProps> = ({
  successRate,
  consecutiveDays,
  totalSteps,
  completedSteps,
}) => {
  const getFeedbackMessage = () => {
    if (successRate >= 80) {
      return {
        title: "완벽한 한 주였어요! 🌟",
        message:
          "당신의 꾸준함이 정말 인상적입니다. 이대로 가면 큰 목표도 충분히 달성할 수 있을 거예요.",
        emoji: "🎉",
      };
    } else if (successRate >= 60) {
      return {
        title: "정말 잘하고 있어요! 💪",
        message:
          "꾸준함이 습관이 되어가고 있어요. 작은 성취들이 모여 큰 변화를 만들어가고 있습니다.",
        emoji: "✨",
      };
    } else if (successRate >= 40) {
      return {
        title: "좋은 시작이에요! 🌱",
        message:
          "무엇보다 시작했다는 것이 중요해요. 천천히, 꾸준히 나아가면 됩니다.",
        emoji: "🌿",
      };
    } else {
      return {
        title: "괜찮아요, 휴식도 필요해요! 😌",
        message:
          "완벽하지 않아도 괜찮아요. 휴식도 성장의 일부예요. 내일 다시 시작하면 됩니다.",
        emoji: "☀️",
      };
    }
  };

  const getConsecutiveMessage = () => {
    if (consecutiveDays >= 7) {
      return `🔥 ${consecutiveDays}일 연속으로 꾸준히 하고 있어요!`;
    } else if (consecutiveDays >= 3) {
      return `🌱 ${consecutiveDays}일째 습관이 자리잡고 있어요!`;
    } else if (consecutiveDays >= 1) {
      return `💪 첫 걸음을 떼셨네요!`;
    } else {
      return "오늘부터 시작해보세요!";
    }
  };

  const feedback = getFeedbackMessage();

  return (
    <View style={styles.container}>
      {/* AI 아이콘 */}
      <View style={styles.aiIconContainer}>
        <Text style={styles.aiIcon}>🤖</Text>
      </View>

      {/* 메인 메시지 */}
      <View style={styles.messageContainer}>
        <Text style={styles.title}>{feedback.title}</Text>
        <Text style={styles.message}>{feedback.message}</Text>
      </View>

      {/* 통계 정보 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{successRate}%</Text>
          <Text style={styles.statLabel}>성공률</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{consecutiveDays}일</Text>
          <Text style={styles.statLabel}>연속 성공</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedSteps}</Text>
          <Text style={styles.statLabel}>완료한 스텝</Text>
        </View>
      </View>

      {/* 연속 성공 메시지 */}
      <View style={styles.consecutiveContainer}>
        <Text style={styles.consecutiveMessage}>{getConsecutiveMessage()}</Text>
      </View>

      {/* 격려 이모지 */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{feedback.emoji}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  aiIconContainer: {
    position: "absolute",
    top: -15,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.deepMint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  aiIcon: {
    fontSize: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    ...typography.h2,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  consecutiveContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  consecutiveMessage: {
    ...typography.body,
    color: colors.coralPink,
    fontWeight: "600",
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 40,
  },
});
