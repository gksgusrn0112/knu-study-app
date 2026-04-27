import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LinkItem = {
  label: string;
  onPress: () => void;
};

type AuthLinkProps = {
  left: LinkItem;
  middle: LinkItem;
  right: LinkItem;
};

// 로그인 와이어프레임 하단 텍스트 링크 묶음 컴포넌트
export const AuthLink = ({ left, middle, right }: AuthLinkProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={left.onPress} hitSlop={8}>
        <Text style={styles.link}>{left.label}</Text>
      </Pressable>
      <Text style={styles.divider}>|</Text>
      <Pressable onPress={middle.onPress} hitSlop={8}>
        <Text style={styles.link}>{middle.label}</Text>
      </Pressable>
      <Text style={styles.divider}>|</Text>
      <Pressable onPress={right.onPress} hitSlop={8}>
        <Text style={styles.link}>{right.label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  link: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  divider: {
    fontSize: 12,
    color: '#BDBDBD',
  },
});
