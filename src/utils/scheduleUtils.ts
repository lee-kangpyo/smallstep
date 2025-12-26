import { ScheduleItem, WeeklyPattern, Goal } from '../types';

/**
 * 시작일 기준으로 주차 계산
 * @param startDate 시작일 (ISO date string)
 * @param targetDate 계산할 날짜
 * @returns 주차 번호 (1부터 시작)
 */
export const getWeekNumberFromStart = (startDate: string, targetDate: Date): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  
  // 음수일 경우 1주차로 처리 (시작일 이전)
  return diffDays < 0 ? 1 : week;
};

/**
 * 날짜의 요일 반환 (1=월요일, 7=일요일)
 */
export const getDayOfWeek = (date: Date): number => {
  const day = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  return day === 0 ? 7 : day; // 일요일을 7로 변환
};

/**
 * 시작일 기준으로 특정 주차의 특정 요일 날짜 계산
 * @param startDate 시작일 (ISO date string)
 * @param week 주차 (1부터 시작)
 * @param day 요일 (1=월, 2=화, ..., 7=일)
 * @returns 날짜 객체
 */
export const getDateFromWeekAndDay = (
  startDate: string,
  week: number,
  day: number
): Date => {
  const start = new Date(startDate);
  const startDayOfWeek = getDayOfWeek(start);
  
  // 시작일이 해당 요일보다 앞서면 그 주의 해당 요일
  // 시작일이 해당 요일보다 뒤면 다음 주의 해당 요일
  let daysToAdd = (week - 1) * 7;
  
  if (week === 1) {
    // 첫째 주: 시작일의 요일부터 계산
    if (day >= startDayOfWeek) {
      daysToAdd = day - startDayOfWeek;
    } else {
      // 시작일보다 이전 요일이면 다음 주로
      daysToAdd = 7 - startDayOfWeek + day;
    }
  } else {
    // 둘째 주 이후: 시작일 기준으로 계산
    const firstWeekDays = 7 - startDayOfWeek + 1; // 첫째 주 남은 일수
    daysToAdd = firstWeekDays + (week - 2) * 7 + day;
  }
  
  const targetDate = new Date(start);
  targetDate.setDate(start.getDate() + daysToAdd);
  return targetDate;
};

/**
 * 주간 패턴에 맞게 schedule 재생성
 * @param originalSchedule 원본 schedule
 * @param startDate 시작일 (ISO date string)
 * @param weeklyPattern 주간 패턴
 * @returns 재생성된 schedule
 */
export const regenerateSchedule = (
  originalSchedule: ScheduleItem[],
  startDate: string,
  weeklyPattern: WeeklyPattern
): ScheduleItem[] => {
  const { frequency, selectedDays } = weeklyPattern;
  
  // 원본 schedule을 주차별로 그룹화
  const scheduleByWeek = new Map<number, ScheduleItem[]>();
  originalSchedule.forEach((item) => {
    if (!scheduleByWeek.has(item.week)) {
      scheduleByWeek.set(item.week, []);
    }
    scheduleByWeek.get(item.week)!.push(item);
  });
  
  const regeneratedSchedule: ScheduleItem[] = [];
  const maxWeek = Math.max(...originalSchedule.map((item) => item.week));
  
  // 각 주차별로 처리
  for (let week = 1; week <= maxWeek; week++) {
    const weekItems = scheduleByWeek.get(week) || [];
    
    // 주간 패턴에 맞게 요일 재배치
    const sortedWeekItems = weekItems.sort((a, b) => a.day - b.day);
    
    // 선택된 요일 순서대로 재배치
    // selectedDays의 모든 요일에 대해 활동 생성
    selectedDays.forEach((selectedDay, index) => {
      // 원본 항목을 순환하여 재사용 (원본이 부족하면 반복)
      // 원본이 없으면 기본 활동 생성
      const originalItem = sortedWeekItems.length > 0 
        ? sortedWeekItems[index % sortedWeekItems.length]
        : null;
      
      if (originalItem) {
        // 원본 항목이 있으면 재사용
        regeneratedSchedule.push({
          ...originalItem,
          week,
          day: selectedDay,
        });
      } else if (sortedWeekItems.length === 0 && week === 1) {
        // 첫째 주에 원본이 없으면 기본 활동 생성 (fallback)
        regeneratedSchedule.push({
          week,
          day: selectedDay,
          phase_link: 1,
          activity_type: '활동',
          title: `Week ${week} Day ${selectedDay} 활동`,
          description: '',
        });
      }
    });
  }
  
  return regeneratedSchedule;
};

/**
 * 첫째 주 처리: 시작일이 속한 주의 모든 요일 포함, 시작일 이전 주의 날짜만 제외
 * @param schedule schedule 배열
 * @param startDate 시작일 (ISO date string)
 * @returns 첫째 주에서 시작일이 속한 주의 요일들은 모두 포함된 schedule
 */
export const filterPastDatesInFirstWeek = (
  schedule: ScheduleItem[],
  startDate: string
): ScheduleItem[] => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const startDayOfWeek = getDayOfWeek(start); // 시작일의 요일 (1=월, 7=일)
  
  return schedule.filter((item) => {
    // 첫째 주가 아니면 그대로 통과
    if (item.week !== 1) return true;
    
    // 첫째 주인 경우: 해당 날짜 계산
    const itemDate = getDateFromWeekAndDay(startDate, item.week, item.day);
    itemDate.setHours(0, 0, 0, 0);
    
    // 시작일이 속한 주의 요일들은 모두 포함
    // 시작일의 요일보다 크거나 같으면 같은 주, 작으면 다음 주
    // 같은 주면 포함, 다음 주면 시작일 이후인지 확인
    if (item.day >= startDayOfWeek) {
      // 시작일과 같은 주의 요일이면 포함
      return true;
    } else {
      // 다음 주의 요일이면 시작일 이후인지 확인
      return itemDate >= start;
    }
  });
};

/**
 * schedule에 실제 날짜 매핑 추가 (달력 표시용)
 * @param schedule schedule 배열
 * @param startDate 시작일 (ISO date string)
 * @returns 날짜 정보가 추가된 schedule
 */
export const addDatesToSchedule = (
  schedule: ScheduleItem[],
  startDate: string
): Array<ScheduleItem & { date: string }> => {
  return schedule.map((item) => {
    const date = getDateFromWeekAndDay(startDate, item.week, item.day);
    return {
      ...item,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
    };
  });
};

/**
 * 같은 날인지 확인
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 특정 날짜에 해당하는 활동 찾기
 * @param schedule schedule 배열
 * @param startDate 시작일 (ISO date string)
 * @param targetDate 찾을 날짜
 * @returns 해당 날짜의 활동들
 */
export const getActivitiesForDate = (
  schedule: ScheduleItem[],
  startDate: string,
  targetDate: Date
): ScheduleItem[] => {
  const targetWeek = getWeekNumberFromStart(startDate, targetDate);
  const targetDay = getDayOfWeek(targetDate);
  
  console.log('[getActivitiesForDate]', {
    startDate,
    targetDate: targetDate.toISOString().split('T')[0],
    targetWeek,
    targetDay,
    scheduleLength: schedule.length,
    scheduleSample: schedule.slice(0, 3).map(s => ({ week: s.week, day: s.day }))
  });
  
  const matched = schedule.filter(
    (item) => item.week === targetWeek && item.day === targetDay
  );
  
  console.log('[getActivitiesForDate] matched:', matched.length);
  
  return matched;
};

/**
 * 여러 목표에서 오늘의 활동 가져오기
 * @param goals 목표 배열
 * @param targetDate 찾을 날짜 (기본값: 오늘)
 * @returns 오늘의 활동들 (goalId 포함)
 */
export const getTodayActivitiesFromGoals = (
  goals: Array<Goal & { id: string }>,
  targetDate: Date = new Date()
): Array<ScheduleItem & { goalId: string; goalTitle: string }> => {
  const activities: Array<ScheduleItem & { goalId: string; goalTitle: string }> = [];
  
  goals.forEach((goal) => {
    if (!goal.startDate || !goal.roadmap?.schedule) return;
    
    // weeklyPattern이 있으면 동적으로 활동 생성
    if (goal.weeklyPattern && goal.weeklyPattern.selectedDays) {
      const targetWeek = getWeekNumberFromStart(goal.startDate, targetDate);
      const targetDay = getDayOfWeek(targetDate);
      
      // 선택된 요일에 포함되는지 확인
      if (goal.weeklyPattern.selectedDays.includes(targetDay)) {
        // 해당 주차의 schedule에서 활동 찾기
        const weekActivities = goal.roadmap.schedule.filter(
          (item) => item.week === targetWeek
        );
        
        if (weekActivities.length > 0) {
          // 해당 주차의 활동이 있으면 재사용
          const activity = weekActivities[0]; // 첫 번째 활동 재사용
          activities.push({
            ...activity,
            day: targetDay, // 요일 업데이트
            goalId: goal.id,
            goalTitle: goal.title,
          });
        } else {
          // 해당 주차의 활동이 없으면 기본 활동 생성
          activities.push({
            week: targetWeek,
            day: targetDay,
            phase_link: 1,
            activity_type: '활동',
            title: `${goal.title} - Week ${targetWeek} Day ${targetDay}`,
            description: '',
            goalId: goal.id,
            goalTitle: goal.title,
          });
        }
      }
    } else {
      // weeklyPattern이 없으면 기존 방식 사용
      const todayActivities = getActivitiesForDate(
        goal.roadmap.schedule,
        goal.startDate,
        targetDate
      );
      
      todayActivities.forEach((activity) => {
        activities.push({
          ...activity,
          goalId: goal.id,
          goalTitle: goal.title,
        });
      });
    }
  });
  
  return activities;
};

