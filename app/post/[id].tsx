import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>익명게시판</Text>
        <View style={styles.headerRight}>
          <Ionicons name="share-social-outline" size={22} color="#333" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.postBody}>
          <View style={styles.authorRow}>
            <Ionicons name="person-circle" size={32} color="#DDD" />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>익명</Text>
              <Text style={styles.postDate}>10분 전</Text>
            </View>
          </View>
          <Text style={styles.title}>데이터베이스 과제 질문있습니다</Text>
          <Text style={styles.bodyText}>
            ERD 설계할 때 다대다 관계는 어떻게 풀어서 작성해야 하나요? 교수님
            설명이 너무 어려워서 이해가 잘 안 가네요.
          </Text>
          <View style={styles.stats}>
            <Text style={styles.statsText}>공감 12 댓글 3</Text>
          </View>
        </View>

        <View style={styles.commentSection}>
          <View style={styles.commentItem}>
            <Text style={styles.commentAuthor}>익명 1</Text>
            <Text style={styles.commentText}>
              네, 중간에 매핑 테이블을 하나 더 만드셔야 해요!
            </Text>
            <Text style={styles.commentDate}>5분 전</Text>
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputBar}>
          <TextInput style={styles.input} placeholder="댓글을 입력하세요..." />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#0059A6" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  headerRight: { flexDirection: "row", gap: 15 },
  content: { flex: 1 },
  postBody: { padding: 20, borderBottomWidth: 8, borderBottomColor: "#F8F9FA" },
  authorRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  authorInfo: { marginLeft: 10 },
  authorName: { fontSize: 14, fontWeight: "bold" },
  postDate: { fontSize: 12, color: "#999" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  bodyText: { fontSize: 15, color: "#444", lineHeight: 22 },
  stats: { marginTop: 20 },
  statsText: { fontSize: 12, color: "#999" },
  commentSection: { padding: 20 },
  // 💡 pb: 10을 paddingBottom: 10으로 수정 완료
  commentItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 10,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
  commentText: { fontSize: 14, color: "#333", marginBottom: 6 },
  commentDate: { fontSize: 11, color: "#BBB" },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendBtn: { justifyContent: "center", paddingHorizontal: 5 },
});
