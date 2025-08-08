import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useGenerateFeedback } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { AIFeedbackRequest } from '../types/api';

interface AIFeedbackProps {
  feedbackData: AIFeedbackRequest;
  onFeedbackGenerated?: (feedback: any) => void;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ 
  feedbackData, 
  onFeedbackGenerated 
}) => {
  const generateFeedbackMutation = useGenerateFeedback();
  const { showToast } = useUIActions();

  const handleGenerateFeedback = async () => {
    try {
      const feedback = await generateFeedbackMutation.mutateAsync(feedbackData);
      showToast('피드백이 생성되었습니다!', 'success');
      if (onFeedbackGenerated) {
        onFeedbackGenerated(feedback);
      }
    } catch (error) {
      showToast('피드백 생성에 실패했습니다.', 'error');
    }
  };

  const feedback = generateFeedbackMutation.data;

  return (
    <View style={styles.container}>
      {!feedback && !generateFeedbackMutation.isPending && (
        <View style={styles.generateSection}>
          <Text style={styles.generateTitle}>AI 피드백 받기</Text>
          <Text style={styles.generateDescription}>
            완료한 활동과 현재 진행 상황을 바탕으로 개인화된 피드백을 받아보세요.
          </Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateFeedback}
            disabled={generateFeedbackMutation.isPending}
          >
            {generateFeedbackMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.generateButtonText}>피드백 생성</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {generateFeedbackMutation.isPending && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>AI가 피드백을 생성하는 중...</Text>
        </View>
      )}

      {feedback && (
        <ScrollView style={styles.feedbackContainer} showsVerticalScrollIndicator={false}>
          {/* 메인 피드백 메시지 */}
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>💬 피드백 메시지</Text>
            <View style={styles.messageContainer}>
              <Text style={styles.feedbackMessage}>{feedback.feedback_message}</Text>
            </View>
          </View>

          {/* 다음 단계 */}
          {feedback.next_steps && feedback.next_steps.length > 0 && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>🎯 다음 단계</Text>
              {feedback.next_steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 동기부여 문구 */}
          {feedback.motivation_quote && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>💪 동기부여</Text>
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>"{feedback.motivation_quote}"</Text>
              </View>
            </View>
          )}

          {/* 진행 상황 분석 */}
          {feedback.progress_analysis && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>📊 진행 상황 분석</Text>
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>{feedback.progress_analysis}</Text>
              </View>
            </View>
          )}

          {/* 새로운 피드백 생성 버튼 */}
          <TouchableOpacity 
            style={styles.newFeedbackButton}
            onPress={handleGenerateFeedback}
            disabled={generateFeedbackMutation.isPending}
          >
            <Text style={styles.newFeedbackButtonText}>새로운 피드백 받기</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {generateFeedbackMutation.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {generateFeedbackMutation.error.message || '피드백 생성에 실패했습니다.'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleGenerateFeedback}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  generateSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  generateDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  feedbackContainer: {
    flex: 1,
    padding: 16,
  },
  feedbackSection: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  messageContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  feedbackMessage: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#3498db',
    color: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  quoteContainer: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  quoteText: {
    fontSize: 16,
    color: '#856404',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  analysisContainer: {
    backgroundColor: '#d1ecf1',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  analysisText: {
    fontSize: 16,
    color: '#0c5460',
    lineHeight: 24,
  },
  newFeedbackButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  newFeedbackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
