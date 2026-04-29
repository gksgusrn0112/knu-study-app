import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WriteScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("질문");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>글 쓰기</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.completeText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.categoryPicker}>
          {["질문", "팀원 모집", "정보", "잡담"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, category === cat && styles.activeCat]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.catText,
                  category === cat && styles.activeCatText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.titleInput}
          placeholder="제목을 입력하세요"
          placeholderTextColor="#BBB"
        />
        <View style={styles.divider} />
        <TextInput
          style={styles.contentInput}
          placeholder="내용을 입력하세요"
          placeholderTextColor="#BBB"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={styles.toolbar}>
        <Ionicons name="camera-outline" size={24} color="#666" />
        <Ionicons
          name="list-outline"
          size={24}
          color="#666"
          style={{ marginLeft: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  cancelText: { fontSize: 16, color: "#666" },
  headerTitle: { fontSize: 17, fontWeight: "bold" },
  completeText: { fontSize: 16, color: "#0059A6", fontWeight: "bold" },
  form: { padding: 20 },
  categoryPicker: { flexDirection: "row", gap: 10, marginBottom: 20 },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
  },
  activeCat: { backgroundColor: "#0059A6" },
  catText: { fontSize: 12, color: "#666" },
  activeCatText: { color: "#FFF", fontWeight: "bold" },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 10,
  },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  contentInput: { fontSize: 16, color: "#333", minHeight: 200 },
  toolbar: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
});
