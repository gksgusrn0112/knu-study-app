import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type LoginBtnProps = {
  title?: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

// 로그인 와이어프레임의 메인 버튼 컴포넌트
export const LoginBtn = ({ title = '로그인', onPress, style, disabled }: LoginBtnProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        style,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    borderRadius: 10,
    backgroundColor: '#0059A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});
