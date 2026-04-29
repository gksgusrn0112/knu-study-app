import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // [추가] 페이지 이동을 위한 라우터
import React, { useState } from "react";
import {
  DimensionValue,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTimerStore } from "../../store/useTimerStore"; //

const HOUR_HEIGHT = 30;
const HOURS = Array.from({ length: 24 }, (_, i) => (i + 9) % 24);

// --- [1] 데이터 타입 정의 ---
interface ITodo {
  id: string;
  subject: string;
  completed: boolean;
  color: string;
}

interface ITimelineItem {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  color: string;
}

const INITIAL_TODOS: ITodo[] = [
  { id: "1", subject: "데이터베이스 실습", completed: false, color: "#FFD700" },
  { id: "2", subject: "ICT 융합프로젝트", completed: false, color: "#8CE68C" },
];

export default function StudyPlannerScreen() {
  const router = useRouter(); // [추가] 라우터 초기화
  const { seconds, isActive, start, pause } = useTimerStore(); //

  const [todos, setTodos] = useState<ITodo[]>(INITIAL_TODOS);
  const [timeline, setTimeline] = useState<ITimelineItem[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<ITodo>(INITIAL_TODOS[0]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // 시간 포맷팅
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // --- [수정] 공부 시작 시 이동 로직 ---
  const handleStartStudy = () => {
    start(); // 1. 타이머 시작[cite: 1]
    // 2. 공부 현황 페이지로 이동 (as any로 타입 에러 방지)
    router.push({
      pathname: "/study-status" as any,
      params: { subject: selectedTodo?.subject || "자율학습" },
    });
  };

  // 타이머 중단 시 타임라인 기록 (기존 로직 유지)
  const handleStopTimer = () => {
    if (isActive && seconds > 10) {
      const now = new Date();
      const startTimeDate = new Date(now.getTime() - seconds * 1000);
      const newEntry: ITimelineItem = {
        id: Date.now().toString(),
        subject: selectedTodo.subject,
        startTime: getTimeString(startTimeDate),
        endTime: getTimeString(now),
        color: selectedTodo.color || "#0059A6",
      };
      setTimeline([...timeline, newEntry]);
    }
    pause(); //[cite: 1]
  };

  // 새로운 Todo 추가
  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") return;
    const colors = ["#FFD700", "#8CE68C", "#87CEFA", "#FFA07A", "#DDA0DD"];
    const newTodo: ITodo = {
      id: Date.now().toString(),
      subject: newTodoTitle,
      completed: false,
      color: colors[todos.length % colors.length],
    };
    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
    setIsModalVisible(false);
  };

  // 가로 위치 및 너비 계산
  const getLeftAndWidth = (startTime: string, endTime: string) => {
    const startMin = Number(startTime.split(":")[1]);
    const endMin = Number(endTime.split(":")[1]);

    const left = `${(startMin / 60) * 100}%` as DimensionValue;
    const width = `${((endMin - startMin) / 60) * 100}%` as DimensionValue;

    return { left, width };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단: 타이머 영역 */}
      <View style={styles.timerHeader}>
        <View
          style={[
            styles.subjectBadge,
            { backgroundColor: (selectedTodo?.color || "#EEEEEE") + "33" },
          ]}
        >
          <View
            style={[
              styles.colorDot,
              { backgroundColor: selectedTodo?.color || "#CCCCCC" },
            ]}
          />
          <Text style={styles.subjectLabel}>
            {selectedTodo?.subject || "과목 선택"}
          </Text>
        </View>

        <View style={styles.timerRow}>
          <Text style={styles.mainTimeText}>{formatTime(seconds)}</Text>
          <TouchableOpacity
            style={[styles.playBtn, isActive && styles.pauseBtn]}
            onPress={isActive ? handleStopTimer : handleStartStudy} // [수정] 이동 함수로 교체
          >
            <Ionicons
              name={isActive ? "pause" : "play"}
              size={28}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 중앙 레이아웃 */}
      <View style={styles.mainLayout}>
        {/* 좌측: TODO LIST */}
        <View style={styles.todoContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODO LIST</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Ionicons name="add-circle" size={24} color="#0059A6" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.todoItem,
                  selectedTodo?.id === item.id && styles.selectedTodo,
                ]}
              >
                <TouchableOpacity
                  onPress={() => setSelectedTodo(item)}
                  style={styles.todoContent}
                >
                  <View
                    style={[
                      styles.todoColorBar,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.todoText,
                      item.completed && styles.completedText,
                    ]}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setTodos(
                      todos.map((t) =>
                        t.id === item.id
                          ? { ...t, completed: !t.completed }
                          : t,
                      ),
                    )
                  }
                >
                  <Ionicons
                    name={item.completed ? "checkbox" : "square-outline"}
                    size={20}
                    color={item.completed ? "#AAA" : "#CCC"}
                  />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* 우측: TIME TABLE */}
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>TIME TABLE</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.gridWrapper}>
              {HOURS.map((hour) => (
                <View key={hour} style={styles.hourRow}>
                  <View style={styles.timeLabelBox}>
                    <Text style={styles.timeLabelText}>
                      {hour.toString().padStart(2, "0")}
                    </Text>
                  </View>

                  <View style={styles.cellsRow}>
                    {[0, 10, 20, 30, 40, 50].map((min) => (
                      <View
                        key={min}
                        style={[styles.cell, min === 30 && styles.midLine]}
                      />
                    ))}

                    {timeline
                      .filter(
                        (item) => Number(item.startTime.split(":")[0]) === hour,
                      )
                      .map((item) => {
                        const { left, width } = getLeftAndWidth(
                          item.startTime,
                          item.endTime,
                        );
                        return (
                          <View
                            key={item.id}
                            style={[
                              styles.timeBlock,
                              {
                                left: left,
                                width: width,
                                backgroundColor: item.color + "A0",
                              },
                            ]}
                          />
                        );
                      })}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 할 일 추가 모달 */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>새 할 일 추가</Text>
            <TextInput
              style={styles.input}
              placeholder="과목명 또는 할 일"
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTodo} style={styles.saveBtn}>
                <Text style={{ color: "#FFF" }}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  timerHeader: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  subjectBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 5,
  },
  colorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  subjectLabel: { fontSize: 13, color: "#555", fontWeight: "600" },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  mainTimeText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#222",
    letterSpacing: 1,
  },
  playBtn: {
    backgroundColor: "#0059A6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBtn: { backgroundColor: "#FF4D4D" },

  mainLayout: { flex: 1, flexDirection: "row" },
  todoContainer: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#F0F0F0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 8,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
  },
  todoContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  selectedTodo: { backgroundColor: "#F0F7FF", borderRadius: 6 },
  todoColorBar: { width: 3, height: 16, borderRadius: 2, marginRight: 8 },
  todoText: { fontSize: 13, color: "#333" },
  completedText: { color: "#AAA" },

  tableContainer: { flex: 1.5, padding: 12 },
  gridWrapper: { borderWidth: 1, borderColor: "#DDD", borderRadius: 2 },
  hourRow: {
    flexDirection: "row",
    height: HOUR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  timeLabelBox: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F9F9F9",
  },
  timeLabelText: { fontSize: 10, fontWeight: "bold", color: "#666" },
  cellsRow: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  cell: { flex: 1, borderRightWidth: 0.5, borderRightColor: "#EEE" },
  midLine: { borderRightWidth: 1, borderRightColor: "#DDD" },
  timeBlock: { position: "absolute", height: "100%", top: 0 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { padding: 10, borderRadius: 8, backgroundColor: "#EEE" },
  saveBtn: { padding: 10, borderRadius: 8, backgroundColor: "#0059A6" },
});
