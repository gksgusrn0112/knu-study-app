import React, { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthInput } from '@/components/auth/AuthInput';
import { LoginBtn } from '@/components/auth/LoginBtn';
import { AuthLink } from '@/components/auth/AuthLink';

// 와이어프레임 기반 로그인 화면(현재는 UI/상태만)
export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={styles.container}>
        <View style={styles.brandArea}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>KNUSTUDY</Text>
        </View>

        <View style={styles.formArea}>
          <AuthInput
            placeholder="이메일 아이디"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          <View style={styles.gap} />
          <AuthInput
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />

          <View style={styles.btnGap} />
          <LoginBtn
            title="로그인"
            disabled={!canSubmit}
            onPress={() => {
              router.replace('/(tabs)');
            }}
          />

          <View style={styles.linksGap} />
          <AuthLink
            left={{
              label: '아이디 찾기',
              onPress: () => {
                router.push({ pathname: '/find-auth', params: { mode: 'id' } });
              },
            }}
            middle={{
              label: '비밀번호 찾기',
              onPress: () => {
                router.push({ pathname: '/find-auth', params: { mode: 'pwd' } });
              },
            }}
            right={{
              label: '회원가입',
              onPress: () => {
                router.push('/signup');
              },
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 96,
  },
  brandArea: {
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  title: {
    marginTop: 4,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#111827',
  },
  formArea: {
    marginTop: 54,
  },
  gap: {
    height: 12,
  },
  btnGap: {
    height: 18,
  },
  linksGap: {
    height: 16,
  },
});
