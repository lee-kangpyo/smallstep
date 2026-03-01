// 날짜 관련 유틸리티 함수들
// 긍정 리포트에서 사용할 날짜 처리 로직

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasStamp: boolean;
}

export interface WeekData {
  weekNumber: number;
  days: CalendarDay[];
  successCount: number;
  totalDays: number;
}

export interface MonthData {
  year: number;
  month: number;
  weeks: WeekData[];
  totalSuccess: number;
  totalDays: number;
}

// 현재 날짜 기준으로 월간 캘린더 데이터 생성
export const generateMonthCalendar = (date: Date = new Date()): MonthData => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const weeks: WeekData[] = [];
  let currentDate = new Date(startDate);
  let weekNumber = 1;

  while (currentDate <= endDate) {
    const weekDays: CalendarDay[] = [];
    let weekSuccessCount = 0;

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDate);
      dayDate.setDate(currentDate.getDate() + i);

      const isCurrentMonth = dayDate.getMonth() === month;
      const isToday = isSameDay(dayDate, new Date());
      const hasStamp = generateMockStampData(dayDate); // 목업 데이터

      if (hasStamp) weekSuccessCount++;

      weekDays.push({
        date: dayDate,
        day: dayDate.getDate(),
        isCurrentMonth,
        isToday,
        hasStamp,
      });
    }

    weeks.push({
      weekNumber,
      days: weekDays,
      successCount: weekSuccessCount,
      totalDays: 7,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;
  }

  const totalSuccess = weeks.reduce((sum, week) => sum + week.successCount, 0);
  const totalDays = weeks.reduce((sum, week) => sum + week.totalDays, 0);

  return {
    year,
    month,
    weeks,
    totalSuccess,
    totalDays,
  };
};

// 주간 데이터 생성
export const generateWeekData = (date: Date = new Date()): WeekData => {
  const startOfWeek = getStartOfWeek(date);
  const days: CalendarDay[] = [];
  let successCount = 0;

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);

    const isToday = isSameDay(dayDate, new Date());
    const hasStamp = generateMockStampData(dayDate);

    if (hasStamp) successCount++;

    days.push({
      date: dayDate,
      day: dayDate.getDate(),
      isCurrentMonth: true,
      isToday,
      hasStamp,
    });
  }

  return {
    weekNumber: getWeekNumber(date),
    days,
    successCount,
    totalDays: 7,
  };
};

// 목업 스탬프 데이터 생성 (실제로는 백엔드에서 가져올 데이터)
export const generateMockStampData = (date: Date): boolean => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 최근 30일 중 70% 확률로 스탬프 생성
  if (diffDays <= 30) {
    return Math.random() < 0.7;
  }

  return false;
};

// 주의 시작일 계산
export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// 주차 번호 계산
export const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

// 날짜 비교 함수
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// 날짜 포맷팅
export const formatDate = (
  date: Date,
  format: "short" | "long" = "short"
): string => {
  if (format === "long") {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
};

// 성공률 계산
export const calculateSuccessRate = (
  success: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
};
