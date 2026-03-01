import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { Goal } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface GoalModalProps {
  visible: boolean;
  goal?: Goal | null;
  onClose: () => void;
  onSave: (goalData: Partial<Goal>) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  goal,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Goal["priority"]>(3);
  const [status, setStatus] = useState<Goal["status"]>("active");

  const isEditing = !!goal;

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setPriority(goal.priority);
      setStatus(goal.status);
    } else {
      setTitle("");
      setDescription("");
      setPriority(3);
      setStatus("active");
    }
  }, [goal, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("오류", "목표 제목을 입력해주세요.");
      return;
    }

    const goalData: Partial<Goal> = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    };

    onSave(goalData);
    onClose();
  };

  const handleCancel = () => {
    Alert.alert(
      "취소",
      "변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?",
      [
        { text: "계속 편집", style: "cancel" },
        { text: "취소", style: "destructive", onPress: onClose },
      ]
    );
  };

  const priorityOptions = [
    { value: 1, label: "매우 높음", color: colors.coralPink },
    { value: 2, label: "높음", color: colors.deepMint },
    { value: 3, label: "보통", color: colors.primaryText },
    { value: 4, label: "낮음", color: colors.secondaryText },
  ];

  const statusOptions = [
    { value: "active", label: "진행 중", color: colors.deepMint },
    { value: "paused", label: "일시정지", color: colors.coralPink },
    { value: "completed", label: "완료", color: colors.success },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? "목표 편집" : "새 목표 추가"}
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 목표 제목 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>목표 제목 *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="목표를 간단히 설명해주세요"
              placeholderTextColor={colors.secondaryText}
              maxLength={50}
            />
          </View>

          {/* 목표 설명 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상세 설명</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="목표에 대한 자세한 설명을 입력해주세요"
              placeholderTextColor={colors.secondaryText}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          {/* 우선순위 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>우선순위</Text>
            <View style={styles.optionsContainer}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    priority === option.value && styles.selectedOption,
                  ]}
                  onPress={() => setPriority(option.value)}
                >
                  <View
                    style={[
                      styles.optionDot,
                      { backgroundColor: option.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      priority === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 상태 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상태</Text>
            <View style={styles.optionsContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    status === option.value && styles.selectedOption,
                  ]}
                  onPress={() => setStatus(option.value as Goal["status"])}
                >
                  <View
                    style={[
                      styles.optionDot,
                      { backgroundColor: option.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      status === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <Button
            title="취소"
            onPress={handleCancel}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={isEditing ? "수정" : "추가"}
            onPress={handleSave}
            variant="primary"
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    padding: 4,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.deepMint,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightBlue,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.primaryText,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  selectedOption: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightMint,
  },
  optionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  optionText: {
    ...typography.body,
    color: colors.primaryText,
  },
  selectedOptionText: {
    color: colors.deepMint,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
