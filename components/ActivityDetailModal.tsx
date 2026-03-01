import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScheduleItem } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ActivityDetailModalProps {
  visible: boolean;
  activity: (ScheduleItem & { goalId: string; goalTitle: string }) | null;
  isCompleted?: boolean;
  onClose: () => void;
  onComplete: (completed: boolean) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  visible,
  activity,
  isCompleted = false,
  onClose,
  onComplete,
}) => {
  const [completed, setCompleted] = useState(isCompleted);

  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted, visible]);

  const handleToggleComplete = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    onComplete(newCompleted);
  };

  if (!activity) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={2}>
                {activity.goalTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* 활동 제목 */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{activity.title}</Text>
            </View>

            {/* 상세 설명 */}
            {activity.description ? (
              <View style={styles.descriptionSection}>
                <Text style={styles.description}>{activity.description}</Text>
              </View>
            ) : (
              <View style={styles.descriptionSection}>
                <Text style={styles.emptyDescription}>상세 설명이 없습니다.</Text>
              </View>
            )}
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                completed ? styles.completeButtonSecondary : styles.completeButtonPrimary,
              ]}
              onPress={handleToggleComplete}
              activeOpacity={0.7}
            >
              <Ionicons
                name={completed ? "close-circle" : "checkmark-circle"}
                size={20}
                color={completed ? colors.secondaryText : colors.white}
                style={styles.completeButtonIcon}
              />
              <Text
                style={[
                  styles.completeButtonText,
                  completed ? styles.completeButtonTextSecondary : styles.completeButtonTextPrimary,
                ]}
              >
                {completed ? "완료 취소" : "완료하기"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    borderRadius: 20,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "700",
    lineHeight: 24,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    color: colors.primaryText,
    lineHeight: 24,
    fontSize: 16,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.secondaryText,
    fontStyle: "italic",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
    backgroundColor: colors.background,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
  },
  completeButtonPrimary: {
    backgroundColor: colors.deepMint,
  },
  completeButtonSecondary: {
    backgroundColor: colors.lightBlue,
  },
  completeButtonIcon: {
    marginRight: 8,
  },
  completeButtonText: {
    ...typography.h4,
    fontWeight: "600",
  },
  completeButtonTextPrimary: {
    color: colors.white,
  },
  completeButtonTextSecondary: {
    color: colors.secondaryText,
  },
});

