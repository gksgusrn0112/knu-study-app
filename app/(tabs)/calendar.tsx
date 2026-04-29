import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// 캘린더 언어 및 헤더 설정
LocaleConfig.locales["ko"] = {
  monthNames: [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ],
  monthNamesShort: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "Today",
};
LocaleConfig.defaultLocale = "ko";

interface ISchedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: string;
}

const CalendarScreen = () => {
  // 초기 데이터
  const [schedules, setSchedules] = useState<ISchedule[]>([
    {
      id: "1",
      title: "데이터 구조 과제 제출",
      date: "2026-04-28",
      time: "23:59",
      category: "과제",
    },
    {
      id: "2",
      title: "ICT 융합프로젝트 랩미팅",
      date: "2026-04-28",
      time: "14:00",
      category: "팀플",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState("2026-04-28");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAIVisible, setIsAIVisible] = useState(false);

  // 폼 입력 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [aiText, setAiText] = useState("");

  // 현재 날짜 일정 필터링
  const filteredSchedules = schedules.filter((s) => s.date === selectedDate);

  // 달력 마킹 (점 표시 + 선택 표시)
  const markedDates = schedules.reduce((acc, curr) => {
    acc[curr.date] = { marked: true, dotColor: "#0059A6" };
    if (curr.date === selectedDate) {
      acc[curr.date] = {
        ...acc[curr.date],
        selected: true,
        selectedColor: "#0059A6",
      };
    }
    return acc;
  }, {} as any);

  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: "#0059A6" };
  }

  // --- [로직 복구] 수동 저장 ---
  const handleSaveForm = () => {
    if (!title.trim()) {
      Alert.alert("알림", "일정 제목을 입력해주세요.");
      return;
    }
    if (editingId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, title, time, category } : s,
        ),
      );
    } else {
      const newSchedule = {
        id: Date.now().toString(),
        title,
        date: selectedDate,
        time: time || "시간 미정",
        category: category || "기타",
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsFormVisible(false);
  };

  // --- [로직 복구] AI 일정 분석 시뮬레이션 ---
  const handleAISubmit = () => {
    if (!aiText.trim()) return;

    Alert.alert("AI 분석 중", "입력하신 내용을 바탕으로 일정을 생성합니다.", [
      {
        text: "확인",
        onPress: () => {
          const aiSchedule = {
            id: Date.now().toString(),
            title: `[AI] ${aiText.split(" ")[0]} 관련 일정`,
            date: selectedDate,
            time: "시간 분석 중",
            category: "AI 생성",
          };
          setSchedules([...schedules, aiSchedule]);
          setAiText("");
          setIsAIVisible(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 2026 APRIL 형식의 캘린더 */}
      <Calendar
        current={selectedDate}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        monthFormat={"yyyy MMMM"}
        theme={{
          selectedDayBackgroundColor: "#0059A6",
          todayTextColor: "#0059A6",
          arrowColor: "#0059A6",
          dotColor: "#0059A6",
          monthTextColor: "#111",
          textMonthFontWeight: "bold",
          textMonthFontSize: 22,
        }}
      />

      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>{selectedDate} 일정</Text>
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }} // [복구] 버튼에 가려지지 않게 여백 추가
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.scheduleCard}
              onPress={() => {
                setEditingId(item.id);
                setTitle(item.title);
                setTime(item.time);
                setCategory(item.category);
                setIsFormVisible(true);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.categoryBadge}>{item.category}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.titleText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>일정이 없습니다.</Text>
          }
        />
      </View>

      {/* FAB 레이아웃 */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.aiFab}
          onPress={() => setIsAIVisible(true)}
        >
          <Ionicons name="sparkles" size={24} color="#0059A6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addFab}
          onPress={() => {
            setEditingId(null);
            setTitle("");
            setTime("");
            setCategory("");
            setIsFormVisible(true);
          }}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* [복구] 수동 추가/수정 모달 (KeyboardAvoidingView 포함) */}
      <Modal visible={isFormVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "일정 수정" : "새 일정 추가"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="일정 제목"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="시간 (예: 14:00)"
              value={time}
              onChangeText={setTime}
            />
            <TextInput
              style={styles.input}
              placeholder="카테고리 (예: 과제, 수업)"
              value={category}
              onChangeText={setCategory}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsFormVisible(false)}
                style={styles.cancelBtn}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveForm} style={styles.saveBtn}>
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* [복구] AI 모달 (KeyboardAvoidingView + 안내문구 포함) */}
      <Modal visible={isAIVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI 일정 등록</Text>
            <Text style={styles.modalSubText}>
              일정을 자연스러운 문장으로 입력해보세요.
            </Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="예: 내일 오후 3시 팀플 회의 추가해줘"
              multiline
              value={aiText}
              onChangeText={setAiText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsAIVisible(false)}
                style={styles.cancelBtn}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAISubmit} style={styles.saveBtn}>
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  분석하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  listContainer: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  listHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  scheduleCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: "#E6F0FA",
    color: "#0059A6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  timeText: { fontSize: 13, color: "#666" },
  titleText: { fontSize: 16, fontWeight: "bold", color: "#111" },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 50,
    fontSize: 15,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
  },
  addFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0059A6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  aiFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "#0059A6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalSubText: { fontSize: 14, color: "#666", marginBottom: 15 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#0059A6",
  },
});
