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
  MOCK_TODOS,
  Todo,
  TODO_CATEGORIES,
  TodoCategory,
} from "@/constants/mockData";

// ============================================
// 유틸리티 함수
// ============================================

/** 날짜 포맷: YYYY-MM-DD → YYYY.MM.DD */
const formatDateDisplay = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".");
};

/** 카테고리 색상 반환 */
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "공부":
      return "#3B82F6";
    case "과제":
      return "#F59E0B";
    case "개인":
      return "#10B981";
    case "社团活动":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

// ============================================
// Todo 아이템 컴포넌트
// ============================================

const TodoItem = ({
  todo,
  onToggle,
  onPress,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}) => {
  const categoryColor = getCategoryColor(todo.category);

  return (
    <Pressable onPress={() => onPress(todo.id)} style={styles.todoItem}>
      <Pressable
        onPress={() => onToggle(todo.id)}
        hitSlop={10}
        style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
      >
        {todo.completed && (
          <FontAwesome name="check" size={12} color="#FFFFFF" />
        )}
      </Pressable>

      <View style={styles.todoContent}>
        <Text
          style={[
            styles.todoTitle,
            todo.completed && styles.todoTitleCompleted,
          ]}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text style={styles.todoDescription} numberOfLines={1}>
            {todo.description}
          </Text>
        )}
        <View style={styles.todoMeta}>
          {todo.due_date && (
            <View style={styles.dueDateBadge}>
              <FontAwesome name="clock-o" size={10} color="#6B7280" />
              <Text style={styles.dueDateText}>
                {formatDateDisplay(todo.due_date)}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColor + "20" },
            ]}
          >
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {todo.category}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// ============================================
// 메인 화면
// ============================================

export default function StudyPlanner() {
  // 선택된 카테고리 필터
  const [selectedCategory, setSelectedCategory] = useState<
    TodoCategory | "전체"
  >("전체");

  // Todo 완료 상태 관리 (로컬 상태)
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);

  // 필터링된 Todo 목록
  const filteredTodos = useMemo(() => {
    if (selectedCategory === "전체") return todos;
    return todos.filter((t) => t.category === selectedCategory);
  }, [todos, selectedCategory]);

  // 완료된 Todo 개수
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  // Todo 완료 토글
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  // Todo 클릭
  const handlePressTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    Alert.alert(todo?.title || "", "Todo 상세 화면은 추후 구현됩니다.");
  };

  // 카테고리 선택
  const handleSelectCategory = (category: TodoCategory | "전체") => {
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>스터디플래너</Text>
          <Text style={styles.headerSubtitle}>
            오늘의 할 일: {completedCount}/{todos.length} 완료
          </Text>
        </View>

        {/* 진행률 바 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* 카테고리 필터 칩 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {["전체", ...TODO_CATEGORIES].map((cat) => (
            <Pressable
              key={cat}
              onPress={() => handleSelectCategory(cat as TodoCategory | "전체")}
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

        {/* Todo 리스트 */}
        <View style={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="check-circle-o" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>할 일이 없습니다</Text>
            </View>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onPress={handlePressTodo}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* 플로팅 버튼 (FAB) */}
      <Pressable
        style={styles.fab}
        onPress={() =>
          Alert.alert("할 일 추가", "할 일 추가 화면은 추후 구현됩니다.")
        }
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
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
  progressContainer: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#0059A6",
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
  todoList: {
    gap: 12,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 14,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  todoContent: {
    flex: 1,
    gap: 6,
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  todoTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  todoDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  todoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  dueDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "700",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
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
