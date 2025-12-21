import { useState, useCallback, useMemo } from 'react';
import { Roadmap, Goal, WeeklyPattern, GoalProgress } from '../../types';
import { regenerateSchedule, filterPastDatesInFirstWeek } from '../../utils/scheduleUtils';
import { saveGoal, setActiveGoalId, getGoalCount } from '../../services/storage/goalStorage';

interface TemplateData {
  title: string;
  description?: string;
  roadmap: Roadmap;
  weeklyFrequency?: number;
}

interface UseCalendarCustomizationViewModelProps {
  templateData: TemplateData;
  onSaveComplete: () => void;
}

export const useCalendarCustomizationViewModel = ({
  templateData,
  onSaveComplete,
}: UseCalendarCustomizationViewModelProps) => {
  // 오늘 날짜가 포함된 주의 첫 번째 날(일요일)을 기본값으로 설정
  const getDefaultStartDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 초기화
    const dayOfWeek = today.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // 일요일로 맞춤
    
    // 로컬 시간대를 유지하면서 YYYY-MM-DD 형식으로 변환
    const year = startOfWeek.getFullYear();
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [startDate, setStartDate] = useState<string>(getDefaultStartDate);
  
  // 템플릿의 주 횟수를 초기값으로 설정
  const initialFrequency = templateData.weeklyFrequency || 3;
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPattern | null>(
    initialFrequency ? {
      frequency: initialFrequency,
      selectedDays: [1, 3, 5], // 기본값: 월, 수, 금
    } : null
  );
  const [isSaving, setIsSaving] = useState(false);

  /**
   * 시작일 설정
   */
  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
  }, []);

  /**
   * 주간 패턴 설정
   */
  const handleWeeklyPatternChange = useCallback((pattern: WeeklyPattern) => {
    setWeeklyPattern(pattern);
  }, []);

  /**
   * 스케줄 재생성
   */
  const regenerateScheduleFromPattern = useCallback((): Roadmap['schedule'] => {
    if (!startDate || !weeklyPattern) {
      return templateData.roadmap.schedule;
    }

    const regenerated = regenerateSchedule(
      templateData.roadmap.schedule,
      startDate,
      weeklyPattern
    );

    // 첫째 주 처리: 이미 지난 날짜 제외
    return filterPastDatesInFirstWeek(regenerated, startDate);
  }, [startDate, weeklyPattern, templateData.roadmap.schedule]);

  /**
   * Goal 객체 생성
   */
  const createGoal = useCallback((): Goal | null => {
    if (!startDate || !weeklyPattern) {
      return null;
    }

    const regeneratedSchedule = regenerateScheduleFromPattern();
    
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: templateData.title,
      description: templateData.description || '',
      status: 'active',
      priority: 1,
      createdAt: new Date(),
      roadmap: {
        roadmap: templateData.roadmap.roadmap,
        schedule: regeneratedSchedule,
      },
      progress: {
        currentPhase: 1,
        completedPhases: [],
        completedScheduleItems: [],
        totalProgress: 0,
        consecutiveDays: 0,
      },
      startDate,
      weeklyPattern,
    };

    return goal;
  }, [startDate, weeklyPattern, templateData, regenerateScheduleFromPattern]);

  /**
   * 목표 저장
   */
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!startDate || !weeklyPattern) {
      return false;
    }

    setIsSaving(true);
    try {
      const goal = createGoal();
      if (!goal) {
        return false;
      }

      // 목표 저장
      const saved = await saveGoal(goal);
      if (!saved) {
        return false;
      }

      // 활성 목표로 설정
      await setActiveGoalId(goal.id);

      // 저장 완료 콜백 호출
      onSaveComplete();
      return true;
    } catch (error) {
      console.error('목표 저장 실패:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [startDate, weeklyPattern, createGoal, onSaveComplete]);

  /**
   * 저장 가능 여부 확인
   */
  const canSave = startDate !== null && weeklyPattern !== null && !isSaving && weeklyPattern.selectedDays.length === weeklyPattern.frequency;

  return {
    startDate,
    weeklyPattern,
    isSaving,
    handleStartDateChange,
    handleWeeklyPatternChange,
    handleSave,
    canSave,
    regenerateScheduleFromPattern,
  };
};

