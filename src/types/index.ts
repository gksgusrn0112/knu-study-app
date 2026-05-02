/**
 * KNUSTUDY 데이터 타입 및 Mock Data 정의
 * - 추후 Supabase API 호출 코드로 쉽게 교체 가능하도록 인터페이스 기반 설계
 */

// ============================================
// 1. 사용자 (User)
// ============================================
export interface User {
  id: string;
  name: string;
  target_study_time: number; // 분 단위 (예: 240 = 4시간)
}

// ============================================
// 2. 학습 로그 (StudyLog)
// ============================================
export interface StudyLog {
  current_study_time: number; // 오늘 공부한 시간 (초 단위)
  weekly_total_time: number; // 이번 주 누적 시간 (초 단위)
}

// ============================================
// 3. 시간표 (Timetable)
// ============================================
export interface Timetable {
  id: string;
  subject_name: string;
  start_time: string; // "HH:mm" 형식
  end_time: string; // "HH:mm" 형식
  room: string; // 강의실
  professor: string; // 교수명
  day_of_week: number; // 0=일요일, 1=월요일, ..., 6=토요일
}

// ============================================
// 4. D-Day (마감/시험)
// ============================================
export interface DDay {
  id: string;
  title: string;
  target_date: string; // "YYYY-MM-DD" 형식
  type: "과제" | "시험";
}

// ============================================
// 5. Mock Data (추후 API로 교체)
// ============================================

/** 현재 로그인한 사용자 Mock Data */
export const MOCK_USER: User = {
  id: "user-001",
  name: "한현구",
  target_study_time: 240, // 4시간 (240분)
};

/** 학습 로그 Mock Data */
export const MOCK_STUDY_LOG: StudyLog = {
  current_study_time: 15912, // 4시간 25분 12초 (초 단위)
  weekly_total_time: 103200, // 28시간 40분 (초 단위)
};

/** 시간표 Mock Data (주간 전체) */
export const MOCK_TIMETABLE: Timetable[] = [
  {
    id: "t1",
    subject_name: "데이터 구조 및 알고리즘",
    start_time: "10:30",
    end_time: "12:00",
    room: "공학관 402호",
    professor: "김철수",
    day_of_week: 1, // 월요일
  },
  {
    id: "t2",
    subject_name: "운영체제론",
    start_time: "14:00",
    end_time: "15:30",
    room: "온라인 강의",
    professor: "이영희",
    day_of_week: 1, // 월요일
  },
  {
    id: "t3",
    subject_name: "소프트웨어 공학",
    start_time: "09:00",
    end_time: "10:30",
    room: "공학관 301호",
    professor: "박민수",
    day_of_week: 2, // 화요일
  },
  {
    id: "t4",
    subject_name: "데이터베이스概论",
    start_time: "13:00",
    end_time: "14:30",
    room: "정보관 205호",
    professor: "정수진",
    day_of_week: 3, // 수요일
  },
  {
    id: "t5",
    subject_name: "알고리즘 설계",
    start_time: "11:00",
    end_time: "12:30",
    room: "공학관 502호",
    professor: "최동현",
    day_of_week: 4, // 목요일
  },
  {
    id: "t6",
    subject_name: "컴퓨터 네트워크",
    start_time: "15:00",
    end_time: "16:30",
    room: "공학관 401호",
    professor: "강지현",
    day_of_week: 5, // 금요일
  },
];

/** D-Day Mock Data */
export const MOCK_DDAYS: DDay[] = [
  {
    id: "d1",
    title: "알고리즘 구현 과제",
    target_date: "2026-04-29",
    type: "과제",
  },
  {
    id: "d2",
    title: "중간고사: OS",
    target_date: "2026-05-09",
    type: "시험",
  },
  {
    id: "d3",
    title: "DB 설계 프로젝트",
    target_date: "2026-05-15",
    type: "과제",
  },
  {
    id: "d4",
    title: "기말고사: 알고리즘",
    target_date: "2026-06-10",
    type: "시험",
  },
];

// ============================================
// 6. 유틸리티 함수
// ============================================

/**
 * 초 단위 시간을 HH:mm:ss 포맷으로 변환
 * @param seconds 초 단위 시간
 * @returns 포맷된 문자열
 */
export const formatStudyTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

/**
 * 주간 목표 달성률 계산
 * @param weeklyTotalSeconds 이번 주 누적 시간 (초)
 * @param dailyTargetMinutes 일일 목표 시간 (분)
 * @returns 0~1 사이의 달성률
 */
export const calculateWeeklyProgress = (
  weeklyTotalSeconds: number,
  dailyTargetMinutes: number,
): number => {
  const weeklyTargetSeconds = dailyTargetMinutes * 7 * 60; // 주간 목표 (초)
  return Math.min(1, weeklyTotalSeconds / weeklyTargetSeconds);
};

/**
 * D-Day 계산
 * @param targetDate 목표 날짜 ("YYYY-MM-DD")
 * @returns 남은 일수 (양수: 미래, 0: 오늘, 음수: 지남)
 */
export const calculateDDay = (targetDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 현재 날짜를 YYYY.MM.DD (요일) 포맷으로 변환
 * @returns 포맷된 날짜 문자열
 */
export const formatCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[now.getDay()];
  return `${year}.${month}.${day} (${dayName})`;
};

/**
 * 현재 요일 번호 반환 (0=일요일, 1=월요일, ..., 6=토요일)
 * @returns 요일 번호
 */
export const getCurrentDayOfWeek = (): number => {
  return new Date().getDay();
};

/**
 * 오늘의 수업 필터링 (현재 요일과 일치하는 수업만)
 * @param timetable 전체 시간표 데이터
 * @returns 오늘 해당하는 수업 목록
 */
export const getTodayClasses = (timetable: Timetable[]): Timetable[] => {
  const today = getCurrentDayOfWeek();
  return timetable.filter((item) => item.day_of_week === today);
};

/**
 * 수업 종료 여부 확인
 * @param endTime 종료 시간 ("HH:mm")
 * @returns 종료 여부
 */
export const isClassEnded = (endTime: string): boolean => {
  const now = new Date();
  const [hours, minutes] = endTime.split(":").map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes, 0, 0);
  return now > endDate;
};
