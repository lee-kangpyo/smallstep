import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalTemplate } from '../../../types/api';
import { colors } from '../../../constants/colors';

interface TemplateListViewProps {
  templates: Record<string, GoalTemplate[]>;
  selectedTemplate: GoalTemplate | null;
  onTemplatePress: (template: GoalTemplate) => void;
}

export const TemplateListView: React.FC<TemplateListViewProps> = ({
  templates,
  selectedTemplate,
  onTemplatePress,
}) => {
  const renderCategory = (categoryName: string, categoryTemplates: GoalTemplate[]) => (
    <View key={categoryName} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <View style={styles.templatesGrid}>
        {categoryTemplates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplate?.id === template.id && styles.selectedTemplateCard,
            ]}
            onPress={() => onTemplatePress(template)}
          >
            <Text
              style={[
                styles.templateText,
                selectedTemplate?.id === template.id && styles.selectedTemplateText,
              ]}
            >
              {template.goal_text}
            </Text>
            
            {template.preview_data && (
              <View style={styles.previewInfo}>
                <Text style={styles.previewText}>
                  {template.preview_data.duration_weeks}주 • 주 {template.preview_data.weekly_frequency}회
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>목표를 선택해보세요</Text>
          <Text style={styles.subtitle}>
            원하는 목표를 선택하면 맞춤형 계획을 경험해볼 수 있어요
          </Text>
        </View>

        {/* 템플릿 목록 */}
        {Object.entries(templates).map(([categoryName, categoryTemplates]) =>
          renderCategory(categoryName, categoryTemplates)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTemplateCard: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightMint,
  },
  templateText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primaryText,
    lineHeight: 16,
    marginBottom: 6,
  },
  selectedTemplateText: {
    color: colors.deepMint,
    fontWeight: '600',
  },
  previewInfo: {
    marginTop: 4,
  },
  previewText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
});

