import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MOCK_TIMETABLE, Timetable } from "@/types";

// ============================================
// 타입 별칭 (Timetable 타입을 easier하게 사용하기 위해)
// ============================================

type TimetableData = Timetable;

// ============================================
// 유틸리티 함수
// ============================================

/** 시간대 배열 (1~8교시) */
const TIME_SLOTS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/** 요일 배열 (0=일, 1=월, ..., 5=금) */
const DAYS = ["월", "화", "수", "목", "금"];

/** day_of_week를 요일 문자열로 변환 */
const getDayString = (dayOfWeek: number): string => {
  const dayMap: Record<number, string> = {
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
  };
  return dayMap[dayOfWeek] || "";
};

/** 시간대별 시간 문자열 반환 */
const getTimeString = (period: string): string => {
  const timeMap: Record<string, string> = {
    "1": "09:00",
    "2": "09:50",
    "3": "10:40",
    "4": "11:30",
    "5": "12:20",
    "6": "13:10",
    "7": "14:00",
    "8": "14:50",
  };
  return timeMap[period] || "";
};

/** start_time을 기반으로 교시 계산 */
const getPeriodFromTime = (startTime: string): string => {
  const timeToPeriod: Record<string, string> = {
    "09:00": "1",
    "09:50": "2",
    "10:40": "3",
    "11:30": "4",
    "12:20": "5",
    "13:10": "6",
    "14:00": "7",
    "14:50": "8",
  };
  return timeToPeriod[startTime] || "";
};

// ============================================
// 시간표 셀 컴포넌트
// ============================================

const TimetableCell = ({
  entry,
  onPress,
}: {
  entry: TimetableData | null;
  onPress: (entry: TimetableData) => void;
}) => {
  if (!entry) {
    return <View style={styles.emptyCell} />;
  }

  return (
    <Pressable
      onPress={() => onPress(entry)}
      style={[styles.classCell, { backgroundColor: "#3B82F6" }]}
    >
      <Text style={styles.className} numberOfLines={2}>
        {entry.subject_name}
      </Text>
      <Text style={styles.classLocation} numberOfLines={1}>
        {entry.room}
      </Text>
    </Pressable>
  );
};

// ============================================
// 메인 화면 (TimetableScreen)
// ============================================

const TimetableScreen = () => {
  // 선택된 주 (0: 현재 주, -1: 이전 주, 1: 다음 주)
  const [weekOffset, setWeekOffset] = useState(0);

  // 시간표 데이터 가공 (Timetable[] → 2차원 배열)
  const timetableData = useMemo(() => {
    // 2차원 배열: [dayIndex][periodIndex]
    const grid: (TimetableData | null)[][] = DAYS.map(() =>
      TIME_SLOTS.map(() => null),
    );

    MOCK_TIMETABLE.forEach((entry) => {
      const dayStr = getDayString(entry.day_of_week);
      const dayIndex = DAYS.indexOf(dayStr);
      const period = getPeriodFromTime(entry.start_time);
      const periodIndex = TIME_SLOTS.indexOf(period);

      if (dayIndex >= 0 && periodIndex >= 0) {
        grid[dayIndex][periodIndex] = entry;
      }
    });

    return grid;
  }, []);

  // 주간 정보 계산
  const weekInfo = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7); // 월요일 기준

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // 금요일

    const formatDate = (d: Date) => {
      const month = d.getMonth() + 1;
      const date = d.getDate();
      return `${month}.${date}`;
    };

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
      year: startOfWeek.getFullYear(),
    };
  }, [weekOffset]);

  // 수업 클릭
  const handlePressClass = (entry: TimetableData) => {
    // 추후 상세 화면 구현
  };

  // 이전 주 이동
  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  // 다음 주 이동
  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  // 오늘로 이동
  const handleGoToToday = () => {
    setWeekOffset(0);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>시간표</Text>
        </View>

        {/* 주간 네비게이션 */}
        <View style={styles.weekNav}>
          <Pressable
            onPress={handlePrevWeek}
            hitSlop={10}
            style={styles.navButton}
          >
            <FontAwesome name="chevron-left" size={16} color="#6B7280" />
          </Pressable>

          <Pressable onPress={handleGoToToday} style={styles.weekInfo}>
            <Text style={styles.weekText}>
              {weekInfo.year}년 {weekInfo.start} ~ {weekInfo.end}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleNextWeek}
            hitSlop={10}
            style={styles.navButton}
          >
            <FontAwesome name="chevron-right" size={16} color="#6B7280" />
          </Pressable>
        </View>

        {/* 시간표 그리드 */}
        <View style={styles.timetableGrid}>
          {/* 요일 헤더 행 */}
          <View style={styles.headerRow}>
            <View style={styles.timeColumn} />
            {DAYS.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 시간대별 행 */}
          {TIME_SLOTS.map((period, periodIndex) => (
            <View key={period} style={styles.timeRow}>
              {/* 시간 열 */}
              <View style={styles.timeColumn}>
                <Text style={styles.periodText}>{period}</Text>
                <Text style={styles.timeText}>{getTimeString(period)}</Text>
              </View>

              {/* 요일별 셀 */}
              {DAYS.map((_, dayIndex) => (
                <TimetableCell
                  key={`${dayIndex}-${periodIndex}`}
                  entry={timetableData[dayIndex][periodIndex]}
                  onPress={handlePressClass}
                />
              ))}
            </View>
          ))}
        </View>

        {/* 도움말 */}
        <View style={styles.helpContainer}>
          <FontAwesome name="info-circle" size={14} color="#9CA3AF" />
          <Text style={styles.helpText}>
            수업을 클릭하면 상세 정보가 표시됩니다
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// 스타일
// ============================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  navButton: {
    padding: 8,
  },
  weekInfo: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  weekText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  timetableGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  timeColumn: {
    width: 44,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#374151",
  },
  timeRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    minHeight: 52,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  timeText: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 2,
  },
  emptyCell: {
    flex: 1,
    minHeight: 52,
    borderLeftWidth: 1,
    borderLeftColor: "#F3F4F6",
  },
  classCell: {
    flex: 1,
    minHeight: 52,
    borderLeftWidth: 1,
    borderLeftColor: "#F3F4F6",
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: "center",
    gap: 2,
  },
  className: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 12,
  },
  classLocation: {
    fontSize: 9,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 12,
  },
  helpText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
