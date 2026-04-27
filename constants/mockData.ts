/**
 * KNUSTUDY Mock Data (공통 데이터)
 * - 추후 Supabase API 호출 코드로 쉽게 교체 가능하도록 인터페이스 기반 설계
 * - 각 탭에서 공통으로 사용할 가짜 데이터 관리
 */

// ============================================
// 1. 일정 (Schedule) - PRD 5.5절 기반
// ============================================
export interface Schedule {
  id: string;
  title: string; // 일정 제목
  start_time: string; // 시작 시간 "HH:mm"
  end_time: string; // 종료 시간 "HH:mm"
  date: string; // 날짜 "YYYY-MM-DD"
  category: "수업" | "과제" | "시험" | "개인" | "社团活动";
  is_all_day?: boolean; // 종일 여부
}

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: "s1",
    title: "데이터 구조 및 알고리즘",
    start_time: "10:30",
    end_time: "12:00",
    date: "2026-04-27",
    category: "수업",
  },
  {
    id: "s2",
    title: "운영체제론",
    start_time: "14:00",
    end_time: "15:30",
    date: "2026-04-27",
    category: "수업",
  },
  {
    id: "s3",
    title: "알고리즘 구현 과제 제출",
    start_time: "23:59",
    end_time: "23:59",
    date: "2026-04-29",
    category: "과제",
    is_all_day: true,
  },
  {
    id: "s4",
    title: "중간고사: OS",
    start_time: "09:00",
    end_time: "11:00",
    date: "2026-05-09",
    category: "시험",
  },
  {
    id: "s5",
    title: "팀 회의",
    start_time: "16:00",
    end_time: "17:00",
    date: "2026-04-28",
    category: "개인",
  },
  {
    id: "s6",
    title: "DB 설계 프로젝트",
    start_time: "23:59",
    end_time: "23:59",
    date: "2026-05-15",
    category: "과제",
    is_all_day: true,
  },
  {
    id: "s7",
    title: "소프트웨어 공학",
    start_time: "09:00",
    end_time: "10:30",
    date: "2026-04-28",
    category: "수업",
  },
  {
    id: "s8",
    title: "데이터베이스概论",
    start_time: "13:00",
    end_time: "14:30",
    date: "2026-04-29",
    category: "수업",
  },
];

// ============================================
// 2. Todo (할 일) - PRD 5.4절 기반
// ============================================
export interface Todo {
  id: string;
  title: string; // 제목 (필수)
  description?: string; // 설명 (선택)
  completed: boolean; // 완료 여부
  due_date?: string; // 마감일 "YYYY-MM-DD" (선택)
  category: "공부" | "과제" | "개인" | "社团活动";
  created_at: string; // 생성일
}

export const MOCK_TODOS: Todo[] = [
  {
    id: "t1",
    title: "알고리즘 문제 풀기",
    description: "백준 100문제 중 50번까지",
    completed: false,
    due_date: "2026-04-28",
    category: "공부",
    created_at: "2026-04-25",
  },
  {
    id: "t2",
    title: "OS 과제 제출",
    completed: true,
    due_date: "2026-04-26",
    category: "과제",
    created_at: "2026-04-20",
  },
  {
    id: "t3",
    title: "팀플 자료 정리",
    description: "PPT 제작 및 분장 역할分担",
    completed: false,
    due_date: "2026-05-01",
    category: "개인",
    created_at: "2026-04-24",
  },
  {
    id: "t4",
    title: "DB 모델링 복습",
    completed: false,
    category: "공부",
    created_at: "2026-04-27",
  },
  {
    id: "t5",
    title: "교수님 메일 답변",
    completed: false,
    due_date: "2026-04-30",
    category: "개인",
    created_at: "2026-04-27",
  },
];

// ============================================
// 3. 익명 게시판 - PRD 5.8절 기반
// ============================================
export interface Post {
  id: string;
  title: string; // 제목
  content: string; // 본문
  category: "전체" | "질문" | "팀원 모집" | "정보" | "잡담";
  author_id: string; // 작성자 ID (익명 처리)
  author_name: string; // 표시용 익명 이름
  created_at: string; // 생성일
  comment_count: number;
  like_count: number;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    title: "OS 중간고사 범위 알려주실 분?",
    content: "교수님이 수업 시간에 말씀하셨는데 잘 못 들었습니다ㅠㅠ",
    category: "질문",
    author_id: "user-002",
    author_name: "익명_001",
    created_at: "2026-04-26",
    comment_count: 5,
    like_count: 12,
  },
  {
    id: "p2",
    title: "팀원 구합니다 (DB 프로젝트)",
    content: "우리대 학생优先, Python 가능하신 분 구합니다.人数은 3명입니다.",
    category: "팀원 모집",
    author_id: "user-003",
    author_name: "익명_002",
    created_at: "2026-04-25",
    comment_count: 8,
    like_count: 20,
  },
  {
    id: "p3",
    title: "강남대 근처 맛집 추천받습니다",
    content:
      "이번 주 금요일 팀 회식 있는데 어디가 좋을까요? 학생 할인되는 곳会更好!",
    category: "잡담",
    author_id: "user-004",
    author_name: "익명_003",
    created_at: "2026-04-24",
    comment_count: 15,
    like_count: 45,
  },
  {
    id: "p4",
    title: "2026년 1학기 기말고사 일정표",
    content: "학교 공지사항에 올라온 기말고사 일정표입니다. 확인하세요!",
    category: "정보",
    author_id: "user-005",
    author_name: "익명_004",
    created_at: "2026-04-23",
    comment_count: 2,
    like_count: 156,
  },
  {
    id: "p5",
    title: "알고리즘 과제 도와주세요",
    content: "DFS 구현에서 막히네요...哪位同学可以帮我看看吗?",
    category: "질문",
    author_id: "user-006",
    author_name: "익명_005",
    created_at: "2026-04-27",
    comment_count: 3,
    like_count: 8,
  },
];

// ============================================
// 4. 카테고리 목록
// ============================================

/** 게시판 카테고리 */
export const POST_CATEGORIES = [
  "전체",
  "질문",
  "팀원 모집",
  "정보",
  "잡담",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

/** 일정 카테고리 */
export const SCHEDULE_CATEGORIES = [
  "수업",
  "과제",
  "시험",
  "개인",
  "社团活动",
] as const;
export type ScheduleCategory = (typeof SCHEDULE_CATEGORIES)[number];

/** Todo 카테고리 */
export const TODO_CATEGORIES = ["공부", "과제", "개인", "社团活动"] as const;
export type TodoCategory = (typeof TODO_CATEGORIES)[number];

// ============================================
// 5. 유틸리티 함수
// ============================================

/**
 * 특정 날짜의 일정 필터링
 * @param date 날짜 "YYYY-MM-DD"
 * @returns 해당 날짜의 일정 목록
 */
export const getSchedulesByDate = (date: string): Schedule[] => {
  return MOCK_SCHEDULES.filter((s) => s.date === date);
};

/**
 * 특정 날짜의 Todo 필터링
 * @param date 날짜 "YYYY-MM-DD"
 * @returns 해당 날짜의 Todo 목록
 */
export const getTodosByDate = (date: string): Todo[] => {
  return MOCK_TODOS.filter((t) => t.due_date === date);
};

/**
 * 카테고리별 게시글 필터링
 * @param category 카테고리
 * @returns 해당 카테고리의 게시글 목록
 */
export const getPostsByCategory = (category: PostCategory | "전체"): Post[] => {
  if (category === "전체") return MOCK_POSTS;
  return MOCK_POSTS.filter((p) => p.category === category);
};

/**
 * 날짜 포맷 변환 (YYYY-MM-DD → YYYY.MM.DD)
 */
export const formatDateDot = (dateStr: string): string => {
  return dateStr.replace(/-/g, ".");
};

/**
 * 시간 포맷 변환 (HH:mm → HH:mm)
 */
export const formatTime = (timeStr: string): string => {
  return timeStr;
};
