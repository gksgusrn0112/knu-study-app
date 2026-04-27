import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DdayCards, DdayItem } from "@/components/home/DdayCards";
import { HomeHeader } from "@/components/home/HomeHeader";
import { StudyGaugeCard } from "@/components/home/StudyGaugeCard";
import {
  TodayClassItem,
  TodayClassList,
} from "@/components/home/TodayClassList";
import {
  MOCK_DDAYS,
  MOCK_STUDY_LOG,
  MOCK_TIMETABLE,
  MOCK_USER,
  calculateDDay,
  calculateWeeklyProgress,
  formatCurrentDate,
  formatStudyTime,
  getTodayClasses,
  isClassEnded,
} from "@/types";

// 홈 화면 (PRD 기반 인터페이스 + Mock Data 시스템)
export default function Home() {
  // 알림 상태 (true: 빨간 점 표시)
  const [hasNotification] = useState(true);

  // 실시간 날짜 포맷
  const todayText = useMemo(() => formatCurrentDate(), []);

  // 사용자 정보
  const userName = MOCK_USER.name;

  // 오늘의 학습 시간 (초 단위 → HH:mm:ss 포맷)
  const todayStudyTimeText = useMemo(
    () => formatStudyTime(MOCK_STUDY_LOG.current_study_time),
    [],
  );

  // 주간 목표 달성률 계산
  const weeklyProgressRatio = useMemo(
    () =>
      calculateWeeklyProgress(
        MOCK_STUDY_LOG.weekly_total_time,
        MOCK_USER.target_study_time,
      ),
    [],
  );

  // 주간 목표 달성 텍스트 (예: 70%)
  const weeklyProgressText = useMemo(
    () => `주간 목표 ${Math.round(weeklyProgressRatio * 100)}% 달성`,
    [weeklyProgressRatio],
  );

  // 주간 누적 시간 텍스트
  const weeklyCurrentText = useMemo(
    () => `이번 주 총 ${formatStudyTime(MOCK_STUDY_LOG.weekly_total_time)}`,
    [],
  );

  // 주간 목표 시간 텍스트
  const weeklyGoalText = useMemo(
    () => `목표 ${MOCK_USER.target_study_time * 7}분`,
    [],
  );

  // 오늘의 수업 필터링 (현재 요일과 일치하는 수업)
  const classes = useMemo<TodayClassItem[]>(() => {
    const todayClasses = getTodayClasses(MOCK_TIMETABLE);
    return todayClasses.map((cls) => ({
      id: cls.id,
      startTime: cls.start_time,
      endTime: cls.end_time,
      title: cls.subject_name,
      meta: `${cls.room} · ${cls.professor} 교수`,
      isActive: !isClassEnded(cls.end_time),
    }));
  }, []);

  // D-Day 계산 (남은 일수)
  const ddays = useMemo<DdayItem[]>(() => {
    // 남은 일수가 14일 이내인 항목만 필터링 (마감 임박)
    const upcomingDDays = MOCK_DDAYS.filter((dd) => {
      const dday = calculateDDay(dd.target_date);
      return dday >= 0 && dday <= 14;
    });

    return upcomingDDays.map((dd) => {
      const dday = calculateDDay(dd.target_date);
      const ddayText =
        dday === 0 ? "D-Day!" : dday > 0 ? `D-${dday} 남음` : "마감됨";
      return {
        id: dd.id,
        typeLabel: dd.type === "과제" ? "과제 마감" : "시험 일정",
        title: dd.title,
        ddayText,
      };
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          hasNotification={hasNotification}
          onPressBell={() =>
            Alert.alert("알림", "알림 화면은 추후 구현됩니다.")
          }
          onPressProfile={() =>
            Alert.alert("프로필", "프로필 화면은 추후 구현됩니다.")
          }
        />

        <View style={styles.greeting}>
          <Text style={styles.dateText}>{todayText}</Text>
          <Text style={styles.greetingText}>
            안녕하세요, <Text style={styles.greetingBold}>{userName}님!</Text>
          </Text>
        </View>

        <View style={styles.sectionGap} />
        <StudyGaugeCard
          todayStudyTimeText={todayStudyTimeText}
          weeklyProgressText={weeklyProgressText}
          weeklyProgressRatio={weeklyProgressRatio}
          weeklyCurrentText={weeklyCurrentText}
          weeklyGoalText={weeklyGoalText}
          onPress={() =>
            Alert.alert("학습 현황", "상세 화면은 추후 구현됩니다.")
          }
        />

        <View style={styles.sectionGapLg} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>오늘의 수업</Text>
          <Text style={styles.sectionLink}>전체보기</Text>
        </View>
        <View style={styles.sectionGapSm} />
        <TodayClassList
          items={classes}
          onPressItem={() =>
            Alert.alert("수업", "수업 상세는 추후 구현됩니다.")
          }
        />

        <View style={styles.sectionGapLg} />
        <Text style={styles.sectionTitle}>마감 임박</Text>
        <View style={styles.sectionGapSm} />
        <DdayCards
          items={ddays}
          onPressItem={() =>
            Alert.alert("D-Day", "상세 화면은 추후 구현됩니다.")
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
  },
  greeting: {
    marginTop: 10,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  greetingText: {
    fontSize: 22,
    color: "#111827",
    fontWeight: "800",
  },
  greetingBold: {
    fontWeight: "900",
  },
  sectionGap: {
    height: 12,
  },
  sectionGapLg: {
    height: 22,
  },
  sectionGapSm: {
    height: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "900",
  },
  sectionLink: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "800",
  },
});
