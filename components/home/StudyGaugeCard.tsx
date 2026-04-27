import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type StudyGaugeCardProps = {
  todayStudyTimeText: string;
  weeklyProgressText: string;
  weeklyProgressRatio: number; // 0~1
  weeklyCurrentText: string;
  weeklyGoalText: string;
  onPress?: () => void;
};

// 홈의 학습 현황 카드(와이어프레임 기반)
export const StudyGaugeCard = ({
  todayStudyTimeText,
  weeklyProgressText,
  weeklyProgressRatio,
  weeklyCurrentText,
  weeklyGoalText,
  onPress,
}: StudyGaugeCardProps) => {
  const ratio = Math.max(0, Math.min(1, weeklyProgressRatio));

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      <View style={styles.topRow}>
        <Text style={styles.smallLabel}>오늘의 학습 시간</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{weeklyProgressText}</Text>
        </View>
        <FontAwesome name="angle-right" size={22} color="#FFFFFF" style={styles.chevron} />
      </View>

      <Text style={styles.time}>{todayStudyTimeText}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>{weeklyCurrentText}</Text>
        <Text style={styles.bottomText}>{weeklyGoalText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#0059A6',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallLabel: {
    fontSize: 14,
    color: '#EAF3FF',
    fontWeight: '700',
  },
  pill: {
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  chevron: {
    marginLeft: 'auto',
  },
  time: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  progressTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomText: {
    fontSize: 12,
    color: '#EAF3FF',
    fontWeight: '700',
  },
});

