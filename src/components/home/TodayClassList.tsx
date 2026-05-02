import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TodayClassItem = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  meta: string;
  isActive?: boolean;
};

// 홈의 "오늘의 수업" 리스트(와이어프레임 기반)
export const TodayClassList = ({ items, onPressItem }: { items: TodayClassItem[]; onPressItem?: (id: string) => void }) => {
  return (
    <View style={styles.list}>
      {items.map((it) => (
        <Pressable
          key={it.id}
          onPress={() => onPressItem?.(it.id)}
          style={[styles.card, it.isActive ? styles.cardActive : styles.cardInactive]}>
          <View style={[styles.timeBox, it.isActive ? styles.timeBoxActive : styles.timeBoxInactive]}>
            <Text style={[styles.timeText, it.isActive ? styles.timeTextActive : styles.timeTextInactive]}>{it.startTime}</Text>
            <Text style={[styles.timeText, it.isActive ? styles.timeTextActive : styles.timeTextInactive]}>{it.endTime}</Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.title, it.isActive ? styles.titleActive : styles.titleInactive]} numberOfLines={1}>
              {it.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {it.meta}
            </Text>
          </View>

          <View style={[styles.dot, it.isActive ? styles.dotActive : styles.dotHidden]} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardActive: {},
  cardInactive: {
    opacity: 0.55,
  },
  timeBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeBoxActive: {
    backgroundColor: '#EAF3FF',
  },
  timeBoxInactive: {
    backgroundColor: '#F3F4F6',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  timeTextActive: {
    color: '#0059A6',
  },
  timeTextInactive: {
    color: '#9CA3AF',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
  },
  titleActive: {
    color: '#111827',
  },
  titleInactive: {
    color: '#6B7280',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
  dotHidden: {
    backgroundColor: 'transparent',
  },
});

