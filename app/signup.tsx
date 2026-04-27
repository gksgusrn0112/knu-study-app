import React from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SignUpForm } from '@/components/auth/SignUpForm';

// 로그인 톤앤매너를 유지한 회원가입 화면
export default function Signup() {
  const router = useRouter();

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
          <SignUpForm
            onSuccess={() => {
              router.replace('/');
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
    paddingTop: 72,
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
    marginTop: 38,
  },
});

