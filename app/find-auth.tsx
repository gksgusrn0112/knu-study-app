import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FindIdForm } from '@/components/auth/FindIdForm';
import { ResetPwdForm } from '@/components/auth/ResetPwdForm';

type Mode = 'id' | 'pwd';

// 아이디/비밀번호 찾기 화면(토글 전환)
export default function FindAuth() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();

  const initialMode = useMemo<Mode>(() => {
    return params.mode === 'pwd' ? 'pwd' : 'id';
  }, [params.mode]);

  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => {
              router.back();
            }}
            hitSlop={8}>
            <Text style={styles.backText}>로그인으로 돌아가기</Text>
          </Pressable>
        </View>

        <View style={styles.toggleWrap}>
          <Pressable
            onPress={() => setMode('id')}
            style={[styles.toggleBtn, mode === 'id' ? styles.toggleActive : styles.toggleInactive]}>
            <Text style={[styles.toggleText, mode === 'id' ? styles.toggleTextActive : styles.toggleTextInactive]}>
              아이디 찾기
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('pwd')}
            style={[styles.toggleBtn, mode === 'pwd' ? styles.toggleActive : styles.toggleInactive]}>
            <Text style={[styles.toggleText, mode === 'pwd' ? styles.toggleTextActive : styles.toggleTextInactive]}>
              비밀번호 찾기
            </Text>
          </Pressable>
        </View>

        <View style={styles.formArea}>
          {mode === 'id' ? (
            <FindIdForm
              onDone={() => {
                router.replace('/');
              }}
            />
          ) : (
            <ResetPwdForm
              onDone={() => {
                router.replace('/');
              }}
            />
          )}
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
    paddingTop: 56,
  },
  topBar: {
    height: 28,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 12,
    color: '#0059A6',
  },
  toggleWrap: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#0059A6',
    borderColor: '#0059A6',
  },
  toggleInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BDBDBD',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: '#111827',
  },
  formArea: {
    marginTop: 24,
  },
});

