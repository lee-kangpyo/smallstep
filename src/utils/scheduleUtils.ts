import { ScheduleItem, WeeklyPattern } from '../types';

/**
 * 시작일 기준으로 주차 계산
 * @param startDate 시작일 (ISO date string)
 * @param targetDate 계산할 날짜
 * @returns 주차 번호 (1부터 시작)
 */
export const getWeekNumberFromStart = (startDate: string, targetDate: Date): number => {
  const start = new Date(startDate);
  const diffTime = targetDate.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
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
    selectedDays.forEach((selectedDay, index) => {
      const originalItem = sortedWeekItems[index % sortedWeekItems.length];
      
      if (originalItem) {
        regeneratedSchedule.push({
          ...originalItem,
          week,
          day: selectedDay,
        });
      }
    });
  }
  
  return regeneratedSchedule;
};

/**
 * 첫째 주 처리: 이미 지난 날짜 제외
 * @param schedule schedule 배열
 * @param startDate 시작일 (ISO date string)
 * @returns 첫째 주에서 지난 날짜가 제외된 schedule
 */
export const filterPastDatesInFirstWeek = (
  schedule: ScheduleItem[],
  startDate: string
): ScheduleItem[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  return schedule.filter((item) => {
    // 첫째 주가 아니면 그대로 통과
    if (item.week !== 1) return true;
    
    // 첫째 주인 경우: 해당 날짜가 오늘 이후인지 확인
    const itemDate = getDateFromWeekAndDay(startDate, item.week, item.day);
    itemDate.setHours(0, 0, 0, 0);
    
    return itemDate >= today;
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

