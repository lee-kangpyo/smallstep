import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCreateGoalViewModel } from "./models/viewModel";
import { styles } from "./styles";

export const CreateGoalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { createGoal, isLoading, error, clearError } = useCreateGoalViewModel();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      daily_minutes: dailyMinutes ? parseInt(dailyMinutes) : undefined,
      deadline_date: deadlineDate || undefined,
      current_level: currentLevel.trim() || undefined,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 목표</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !title.trim()}
          >
            <Text
              style={[
                styles.saveButton,
                (!title.trim() || isLoading) && styles.saveButtonDisabled,
              ]}
            >
              {isLoading ? "생성 중..." : "저장"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>목표 *</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 토플 100점 달성하기"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>설명</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="목표에 대한 구체적인 설명을 입력필세요"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>하루 가용 시간 (분)</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 60"
                value={dailyMinutes}
                onChangeText={setDailyMinutes}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>마감일 (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 2024-12-31"
                value={deadlineDate}
                onChangeText={setDeadlineDate}
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>현재 수준</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 토플 60점 수준"
                value={currentLevel}
                onChangeText={setCurrentLevel}
                maxLength={100}
              />
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>
                AI가 목표를 분석하고 Phase를 생성하는 중...
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
