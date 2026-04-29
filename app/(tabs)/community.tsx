import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router"; // 💡 1. Href 타입 추가
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- [Mock Data] 동일 ---
const CATEGORIES = ["전체", "질문", "팀원 모집", "정보", "잡담"];

const POSTS = [
  {
    id: "1",
    category: "질문",
    title: "데이터베이스 과제 질문있습니다",
    content: "ERD 설계할 때 다대다 관계는 어떻게 풀어서 작성해야 하나요?",
    author: "익명_001",
    date: "04.27",
    comments: 3,
    likes: 12,
  },
  {
    id: "2",
    category: "팀원 모집",
    title: "캡스톤 프로젝트 팀원 구합니다",
    content: "리액트 네이티브 가능하신 개발자 한 분 더 모십니다!",
    author: "익명_042",
    date: "04.26",
    comments: 8,
    likes: 5,
  },
  {
    id: "3",
    category: "정보",
    title: "중앙도서관 에어컨 가동 시작했네요",
    content: "공부하기 딱 좋은 온도입니다.",
    author: "익명_110",
    date: "04.26",
    comments: 2,
    likes: 24,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 필터링 로직 동일
  const filteredPosts =
    selectedCategory === "전체"
      ? POSTS
      : POSTS.filter((post) => post.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* 타이틀 영역 동일 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>익명게시판</Text>
        <Text style={styles.headerSub}>
          총 {filteredPosts.length}개의 게시글
        </Text>
      </View>

      {/* 카테고리 필터 동일 */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.activeChip,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 게시글 리스트 영역 */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postCard}
            // 💡 [2. 수정] 게시글 상세 이동: href 객체를 사용하고 Href로 타입을 명시합니다.
            onPress={() => {
              router.push({
                pathname: "/post/[id]",
                params: { id: item.id },
              } as Href); // 이렇게 작성해야 동적 라우팅이 TS 에러 없이 작동해!
            }}
          >
            {/* 카드 내부 동일 */}
            <View style={styles.postTop}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.postTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.postContent} numberOfLines={2}>
              {item.content}
            </Text>
            <View style={styles.postBottom}>
              <View style={styles.authorArea}>
                <Ionicons name="person-circle" size={18} color="#DDD" />
                <Text style={styles.authorText}>{item.author}</Text>
              </View>
              <View style={styles.reactionArea}>
                <View style={styles.reactionItem}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.reactionText}>{item.comments}</Text>
                </View>
                <View style={styles.reactionItem}>
                  <Ionicons name="heart-outline" size={16} color="#FF4D4D" />
                  <Text style={[styles.reactionText, { color: "#FF4D4D" }]}>
                    {item.likes}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 글쓰기 플로팅 버튼 (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        // 💡 [3. 수정] 글쓰기 이동: 단순 문자열로 처리하되 Href 타입 단언을 해줍니다.
        onPress={() => {
          router.push("/write" as Href); // 만약 app/write.tsx 파일이 없다면 넘어가지 않으니 확인 필수!
        }}
      >
        <Ionicons name="pencil" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// styles는 동일하므로 생략
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#111" },
  headerSub: { fontSize: 13, color: "#999", marginTop: 4 },
  filterWrapper: { marginBottom: 10 },
  filterScroll: { paddingHorizontal: 20, gap: 10 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeChip: { backgroundColor: "#0059A6", borderColor: "#0059A6" },
  categoryText: { fontSize: 13, color: "#666", fontWeight: "500" },
  activeText: { color: "#FFF" },
  listContainer: { padding: 20, paddingBottom: 100 },
  postCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  postTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: { fontSize: 11, color: "#0059A6", fontWeight: "bold" },
  dateText: { fontSize: 11, color: "#BBB" },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 15,
  },
  postBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorArea: { flexDirection: "row", alignItems: "center", gap: 6 },
  authorText: { fontSize: 12, color: "#999" },
  reactionArea: { flexDirection: "row", gap: 12 },
  reactionItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  reactionText: { fontSize: 12, color: "#666" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0059A6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
