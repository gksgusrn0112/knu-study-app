import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AuthInput } from '@/components/auth/AuthInput';
import { LoginBtn } from '@/components/auth/LoginBtn';

type SignUpFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  department: string;
};

type SignUpFormProps = {
  onSuccess: () => void;
};

// 회원가입 입력 폼(UI + 유효성 검사만)
export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [values, setValues] = useState<SignUpFormValues>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    department: '',
  });

  const errors = useMemo(() => {
    const next: Partial<Record<keyof SignUpFormValues, string>> = {};

    if (!values.email.trim()) next.email = '이메일을 입력해주세요.';
    if (!values.password) next.password = '비밀번호를 입력해주세요.';
    if (!values.passwordConfirm) next.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    if (values.password && values.passwordConfirm && values.password !== values.passwordConfirm) {
      next.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }
    if (!values.nickname.trim()) next.nickname = '닉네임을 입력해주세요.';
    if (!values.department.trim()) next.department = '학과를 입력해주세요.';

    return next;
  }, [values]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return (
    <View style={styles.container}>
      <AuthInput
        placeholder="이메일 아이디"
        value={values.email}
        onChangeText={(text) => setValues((prev) => ({ ...prev, email: text }))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        errorText={errors.email}
      />
      <View style={styles.gap} />

      <AuthInput
        placeholder="비밀번호"
        value={values.password}
        onChangeText={(text) => setValues((prev) => ({ ...prev, password: text }))}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        errorText={errors.password}
      />
      <View style={styles.gap} />

      <AuthInput
        placeholder="비밀번호 확인"
        value={values.passwordConfirm}
        onChangeText={(text) => setValues((prev) => ({ ...prev, passwordConfirm: text }))}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        errorText={errors.passwordConfirm}
      />
      <View style={styles.gap} />

      <AuthInput
        placeholder="닉네임"
        value={values.nickname}
        onChangeText={(text) => setValues((prev) => ({ ...prev, nickname: text }))}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        errorText={errors.nickname}
      />
      <View style={styles.gap} />

      <AuthInput
        placeholder="학과"
        value={values.department}
        onChangeText={(text) => setValues((prev) => ({ ...prev, department: text }))}
        autoCorrect={false}
        returnKeyType="done"
        errorText={errors.department}
      />

      <View style={styles.btnGap} />
      <LoginBtn
        title="회원가입 완료"
        disabled={!canSubmit}
        onPress={() => {
          if (!canSubmit) return;
          Alert.alert('회원가입 성공!');
          onSuccess();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gap: {
    height: 12,
  },
  btnGap: {
    height: 18,
  },
});

