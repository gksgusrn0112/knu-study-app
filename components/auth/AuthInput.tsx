import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type AuthInputProps = TextInputProps & {
  placeholder: string;
  containerStyle?: ViewStyle;
  errorText?: string;
};

// 로그인 와이어프레임의 입력창 UI 컴포넌트
export const AuthInput = ({ style, placeholder, containerStyle, errorText, ...props }: AuthInputProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#9CA3AF'}
        style={[
          styles.input,
          {
            borderColor: '#BDBDBD',
            backgroundColor: '#FFFFFF',
            color: theme.text,
          },
          style,
        ]}
        {...props}
      />
      {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 6,
    paddingLeft: 2,
    fontSize: 12,
    color: '#EF4444',
  },
});
