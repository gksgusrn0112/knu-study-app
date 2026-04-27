import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type DdayItem = {
  id: string;
  typeLabel: string;
  title: string;
  ddayText: string;
};

// 홈의 마감 임박(D-Day) 카드 섹션
export const DdayCards = ({ items, onPressItem }: { items: DdayItem[]; onPressItem?: (id: string) => void }) => {
  return (
    <View style={styles.grid}>
      {items.map((it) => (
        <Pressable key={it.id} onPress={() => onPressItem?.(it.id)} style={styles.card}>
          <Text style={styles.type}>{it.typeLabel}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {it.title}
          </Text>
          <Text style={styles.dday}>{it.ddayText}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  type: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '800',
  },
  title: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '900',
  },
  dday: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '900',
  },
});

