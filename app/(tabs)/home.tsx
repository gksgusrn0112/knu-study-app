import React, { useMemo } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeHeader } from '@/components/home/HomeHeader';
import { StudyGaugeCard } from '@/components/home/StudyGaugeCard';
import { TodayClassList, TodayClassItem } from '@/components/home/TodayClassList';
import { DdayCards, DdayItem } from '@/components/home/DdayCards';

// PRD 기반 Mock Data로 구성한 홈 화면
export default function Home() {
  const todayText = '2026.03.12 (목)';
  const userName = '김강남';

  const classes = useMemo<TodayClassItem[]>(
    () => [
      {
        id: 'c1',
        startTime: '10:30',
        endTime: '12:00',
        title: '데이터 구조 및 알고리즘',
        meta: '공학관 402호 · 김철수 교수',
        isActive: true,
      },
      {
        id: 'c2',
        startTime: '14:00',
        endTime: '15:30',
        title: '운영체제론',
        meta: '온라인 강의 · 이영희 교수',
        isActive: false,
      },
    ],
    []
  );

  const ddays = useMemo<DdayItem[]>(
    () => [
      { id: 'd1', typeLabel: '과제 마감', title: '알고리즘 구현', ddayText: 'D-2 남음' },
      { id: 'd2', typeLabel: '시험 일정', title: '중간고사: OS', ddayText: 'D-12 남음' },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHeader
          onPressBell={() => Alert.alert('알림', '알림 화면은 추후 구현됩니다.')}
          onPressProfile={() => Alert.alert('프로필', '프로필 화면은 추후 구현됩니다.')}
        />

        <View style={styles.greeting}>
          <Text style={styles.dateText}>{todayText}</Text>
          <Text style={styles.greetingText}>
            안녕하세요, <Text style={styles.greetingBold}>{userName}님!</Text>
          </Text>
        </View>

        <View style={styles.sectionGap} />
        <StudyGaugeCard
          todayStudyTimeText="04:25:12"
          weeklyProgressText="주간 목표 70% 달성"
          weeklyProgressRatio={0.7}
          weeklyCurrentText="이번 주 총 28시간 40분"
          weeklyGoalText="목표 40시간"
          onPress={() => Alert.alert('학습 현황', '상세 화면은 추후 구현됩니다.')}
        />

        <View style={styles.sectionGapLg} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>오늘의 수업</Text>
          <Text style={styles.sectionLink}>전체보기</Text>
        </View>
        <View style={styles.sectionGapSm} />
        <TodayClassList items={classes} onPressItem={() => Alert.alert('수업', '수업 상세는 추후 구현됩니다.')} />

        <View style={styles.sectionGapLg} />
        <Text style={styles.sectionTitle}>마감 임박</Text>
        <View style={styles.sectionGapSm} />
        <DdayCards items={ddays} onPressItem={() => Alert.alert('D-Day', '상세 화면은 추후 구현됩니다.')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#6B7280',
    fontWeight: '700',
  },
  greetingText: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '800',
  },
  greetingBold: {
    fontWeight: '900',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '900',
  },
  sectionLink: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '800',
  },
});

