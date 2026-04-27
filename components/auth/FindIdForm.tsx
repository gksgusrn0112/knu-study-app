import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AuthInput } from '@/components/auth/AuthInput';
import { LoginBtn } from '@/components/auth/LoginBtn';

type FindIdFormValues = {
  name: string;
  phoneNumber: string;
  verifyCode: string;
};

type FindIdFormProps = {
  onDone: () => void;
};

// 아이디(이메일) 찾기 폼(UI + 휴대폰 인증 흐름)
export const FindIdForm = ({ onDone }: FindIdFormProps) => {
  const [values, setValues] = useState<FindIdFormValues>({
    name: '',
    phoneNumber: '',
    verifyCode: '',
  });
  const [isCodeSent, setIsCodeSent] = useState(false);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FindIdFormValues, string>> = {};
    if (!values.name.trim()) next.name = '이름을 입력해주세요.';
    if (!values.phoneNumber.trim()) next.phoneNumber = '휴대폰 번호를 입력해주세요.';
    if (isCodeSent && values.verifyCode.trim().length !== 6) next.verifyCode = '인증번호 6자리를 입력해주세요.';
    return next;
  }, [isCodeSent, values]);

  const canRequestCode = useMemo(() => !errors.name && !errors.phoneNumber, [errors.name, errors.phoneNumber]);
  const canSubmit = useMemo(() => isCodeSent && Object.keys(errors).length === 0, [errors, isCodeSent]);

  return (
    <View style={styles.container}>
      <AuthInput
        placeholder="이름"
        value={values.name}
        onChangeText={(text) => setValues((prev) => ({ ...prev, name: text }))}
        autoCorrect={false}
        returnKeyType="next"
        errorText={errors.name}
      />
      <View style={styles.gap} />
      <AuthInput
        placeholder="휴대폰 번호"
        value={values.phoneNumber}
        onChangeText={(text) => setValues((prev) => ({ ...prev, phoneNumber: text }))}
        keyboardType="phone-pad"
        autoCorrect={false}
        returnKeyType="done"
        errorText={errors.phoneNumber}
      />

      <View style={styles.btnGap} />
      <LoginBtn
        title="인증번호 받기"
        disabled={!canRequestCode}
        onPress={() => {
          if (!canRequestCode) return;
          setIsCodeSent(true);
          Alert.alert('안내', '입력하신 휴대폰 번호로 인증번호를 보냈어요.\n(서버 연동은 추후 구현됩니다)');
        }}
      />

      {isCodeSent && (
        <>
          <View style={styles.gap} />
          <AuthInput
            placeholder="인증번호 6자리"
            value={values.verifyCode}
            onChangeText={(text) => setValues((prev) => ({ ...prev, verifyCode: text }))}
            keyboardType="number-pad"
            maxLength={6}
            autoCorrect={false}
            returnKeyType="done"
            errorText={errors.verifyCode}
          />
          <View style={styles.btnGap} />
          <LoginBtn
            title="아이디 확인"
            disabled={!canSubmit}
            onPress={() => {
              if (!canSubmit) return;
              Alert.alert('아이디 찾기 성공!', '가입된 이메일(아이디)을 안내해드렸어요.\n(서버 연동은 추후 구현됩니다)');
              onDone();
            }}
          />
        </>
      )}
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

