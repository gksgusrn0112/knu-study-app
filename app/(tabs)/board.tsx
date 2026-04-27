import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MOCK_POSTS,
  Post,
  POST_CATEGORIES,
  PostCategory,
} from "@/constants/mockData";

// ============================================
// 유틸리티 함수
// ============================================

/** 날짜 포맷: YYYY-MM-DD → MM.DD */
const formatDateShort = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${month}.${day}`;
};

/** 카테고리 색상 반환 */
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "질문":
      return "#3B82F6";
    case "팀원 모집":
      return "#F59E0B";
    case "정보":
      return "#10B981";
    case "잡담":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

// ============================================
// 게시글 아이템 컴포넌트
// ============================================

const PostItem = ({
  post,
  onPress,
}: {
  post: Post;
  onPress: (id: string) => void;
}) => {
  const categoryColor = getCategoryColor(post.category);

  return (
    <Pressable onPress={() => onPress(post.id)} style={styles.postItem}>
      <View style={styles.postHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryColor + "20" },
          ]}
        >
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {post.category}
          </Text>
        </View>
        <Text style={styles.postDate}>{formatDateShort(post.created_at)}</Text>
      </View>

      <Text style={styles.postTitle} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.postContent} numberOfLines={2}>
        {post.content}
      </Text>

      <View style={styles.postFooter}>
        <View style={styles.authorInfo}>
          <FontAwesome name="user-circle-o" size={14} color="#9CA3AF" />
          <Text style={styles.authorName}>{post.author_name}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="comment-o" size={12} color="#9CA3AF" />
            <Text style={styles.statText}>{post.comment_count}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="heart-o" size={12} color="#9CA3AF" />
            <Text style={styles.statText}>{post.like_count}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// ============================================
// 메인 화면
// ============================================

export default function Board() {
  // 선택된 카테고리 필터
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "전체"
  >("전체");

  // 필터링된 게시글 목록
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "전체") return MOCK_POSTS;
    return MOCK_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // 카테고리 선택
  const handleSelectCategory = (category: PostCategory | "전체") => {
    setSelectedCategory(category);
  };

  // 게시글 클릭
  const handlePressPost = (id: string) => {
    const post = MOCK_POSTS.find((p) => p.id === id);
    Alert.alert(post?.title || "", "게시글 상세 화면은 추후 구현됩니다.");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>익명게시판</Text>
          <Text style={styles.headerSubtitle}>
            총 {filteredPosts.length}개의 게시글
          </Text>
        </View>

        {/* 카테고리 필터 칩 (가로 스크롤) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {POST_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => handleSelectCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 게시글 리스트 */}
        <View style={styles.postList}>
          {filteredPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="comments-o" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>게시글이 없습니다</Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <PostItem key={post.id} post={post} onPress={handlePressPost} />
            ))
          )}
        </View>
      </ScrollView>

      {/* 플로팅 버튼 (FAB) - 글쓰기 */}
      <Pressable
        style={styles.fab}
        onPress={() => Alert.alert("글쓰기", "글쓰기 화면은 추후 구현됩니다.")}
      >
        <FontAwesome name="pencil" size={22} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

// ============================================
// 스타일
// ============================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipSelected: {
    backgroundColor: "#0059A6",
    borderColor: "#0059A6",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  postList: {
    gap: 12,
  },
  postItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
    gap: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
  },
  postDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 22,
  },
  postContent: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    lineHeight: 18,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0059A6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
