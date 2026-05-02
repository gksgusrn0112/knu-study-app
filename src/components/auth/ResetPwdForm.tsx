import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthInput } from '@/components/auth/AuthInput';
import { LoginBtn } from '@/components/auth/LoginBtn';

type ResetPwdFormProps = {
  onDone: () => void;
};

// 비밀번호 재설정 폼(UI + 인증 코드 모달)
export const ResetPwdForm = ({ onDone }: ResetPwdFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');

  const emailErrorText = useMemo(() => {
    if (!email.trim()) return '이메일을 입력해주세요.';
    if (!email.includes('@')) return '이메일 형식을 확인해주세요.';
    return '';
  }, [email]);

  const nameErrorText = useMemo(() => {
    if (!name.trim()) return '이름을 입력해주세요.';
    return '';
  }, [name]);

  const phoneErrorText = useMemo(() => {
    if (!phoneNumber.trim()) return '휴대폰 번호를 입력해주세요.';
    return '';
  }, [phoneNumber]);

  const codeErrorText = useMemo(() => {
    if (!code.trim()) return '인증 코드를 입력해주세요.';
    if (code.trim().length !== 6) return '인증 코드는 6자리입니다.';
    return '';
  }, [code]);

  const canOpenModal = useMemo(() => {
    return emailErrorText.length === 0 && nameErrorText.length === 0 && phoneErrorText.length === 0;
  }, [emailErrorText, nameErrorText, phoneErrorText]);

  const canConfirmCode = useMemo(() => codeErrorText.length === 0, [codeErrorText]);

  return (
    <View style={styles.container}>
      <AuthInput
        placeholder="이메일 아이디"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        errorText={emailErrorText || undefined}
      />
      <View style={styles.gap} />
      <AuthInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        returnKeyType="next"
        errorText={nameErrorText || undefined}
      />
      <View style={styles.gap} />
      <AuthInput
        placeholder="휴대폰 번호"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCorrect={false}
        returnKeyType="done"
        errorText={phoneErrorText || undefined}
      />

      <View style={styles.btnGap} />
      <LoginBtn
        title="인증 메일 받기"
        disabled={!canOpenModal}
        onPress={() => {
          if (!canOpenModal) return;
          setCode('');
          setIsModalOpen(true);
        }}
      />

      <Modal transparent visible={isModalOpen} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>인증 코드 입력</Text>
            <AuthInput
              placeholder="인증 코드 6자리"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoCorrect={false}
              returnKeyType="done"
              errorText={code.length > 0 ? codeErrorText || undefined : undefined}
            />

            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => {
                  setIsModalOpen(false);
                }}
                style={[styles.modalBtn, styles.modalBtnGhost]}>
                <Text style={[styles.modalBtnText, styles.modalBtnTextGhost]}>취소</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (!canConfirmCode) return;
                  setIsModalOpen(false);
                  Alert.alert('비밀번호 재설정 성공!', '인증이 완료되었어요.\n(서버 연동은 추후 구현됩니다)');
                  onDone();
                }}
                style={[styles.modalBtn, styles.modalBtnPrimary, !canConfirmCode ? styles.modalBtnDisabled : null]}
                disabled={!canConfirmCode}>
                <Text style={styles.modalBtnText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  modalTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  modalBtnRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  modalBtnPrimary: {
    backgroundColor: '#0059A6',
    borderColor: '#0059A6',
  },
  modalBtnGhost: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BDBDBD',
  },
  modalBtnDisabled: {
    opacity: 0.6,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBtnTextGhost: {
    color: '#111827',
  },
});

