import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Phase, ScheduleItem } from '../../../types';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

interface PhaseScheduleModalProps {
  visible: boolean;
  phase: Phase | null;
  scheduleItems: ScheduleItem[];
  onClose: () => void;
}

export const PhaseScheduleModal: React.FC<PhaseScheduleModalProps> = ({
  visible,
  phase,
  scheduleItems,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 백드롭은 fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // 바텀시트는 slide up
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!phase) return null;

  // 해당 phase의 schedule만 필터링
  const phaseSchedules = scheduleItems.filter(
    (item) => item.phase_link === phase.phase
  );

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0], // 아래에서 올라옴
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* 백드롭 - fade in */}
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        {/* 바텀시트 - slide up */}
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{phase.phase_title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.primaryText} />
              </TouchableOpacity>
            </View>

            {/* 스케줄 목록 */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {phaseSchedules.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>활동이 없습니다</Text>
                </View>
              ) : (
                phaseSchedules.map((schedule, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.scheduleHeader}>
                      <View style={styles.scheduleBadge}>
                        <Text style={styles.scheduleBadgeText}>
                          {schedule.week}주차
                        </Text>
                      </View>
                      <Text style={styles.scheduleDay}>Day {schedule.day}</Text>
                    </View>
                    <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                    <Text style={styles.scheduleDescription}>
                      {schedule.description}
                    </Text>
                    {schedule.activity_type && (
                      <View style={styles.activityTypeContainer}>
                        <Ionicons
                          name="fitness-outline" size={14}
                          color={colors.deepMint}
                        />
                        <Text style={styles.activityType}>
                          {schedule.activity_type}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleItem: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  scheduleBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scheduleBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 11,
  },
  scheduleDay: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  scheduleTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: '600',
    marginBottom: 6,
  },
  scheduleDescription: {
    ...typography.body,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 8,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  activityType: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.secondaryText,
  },
});

