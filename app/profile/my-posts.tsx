import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MY_POSTS = [
  {
    id: "1",
    category: "질문",
    title: "데이터베이스 과제 질문있습니다",
    date: "04.27",
    comments: 3,
  },
  {
    id: "3",
    category: "정보",
    title: "중앙도서관 에어컨 가동 시작했네요",
    date: "04.26",
    comments: 2,
  },
];

export default function MyPostsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 게시글 보기</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={MY_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postCard}
            onPress={() =>
              router.push({
                pathname: "/post/[id]",
                params: { id: item.id },
              } as Href)
            }
          >
            <Text style={styles.postCat}>{item.category}</Text>
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.postBottom}>
              <Text style={styles.postDate}>{item.date}</Text>
              <Text style={styles.postComment}>댓글 {item.comments}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  postCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  postCat: {
    color: "#0059A6",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postTitle: { fontSize: 15, fontWeight: "500", marginBottom: 10 },
  postBottom: { flexDirection: "row", gap: 15 },
  postDate: { fontSize: 12, color: "#999" },
  postComment: { fontSize: 12, color: "#666" },
});
