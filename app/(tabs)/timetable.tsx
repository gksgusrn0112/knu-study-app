import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 5;

const DAYS = ["월", "화", "수", "목", "금"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 9);

// 학기 리스트
const SEMESTERS = ["2026년 1학기", "2025년 2학기", "2025년 1학기"];

export default function TimetableScreen() {
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);
  const [isSemesterModal, setIsSemesterModal] = useState(false);
  const [isManualModal, setIsManualModal] = useState(false);
  const [isAIModal, setIsAIModal] = useState(false);

  // 학기별 예시 데이터 (실제로는 학기에 따라 filteredClasses를 만들면 돼)
  const [classes, setClasses] = useState([
    {
      id: "1",
      title: "데이터베이스",
      day: "화",
      start: 9,
      duration: 2.5,
      color: "#FF6B6B",
    },
    {
      id: "2",
      title: "알고리즘",
      day: "목",
      start: 13,
      duration: 3,
      color: "#4D96FF",
    },
  ]);

  const renderClasses = () => {
    return classes.map((item) => {
      const dayIndex = DAYS.indexOf(item.day);
      const topOffset = (item.start - 9) * 60;
      const height = item.duration * 60;

      return (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.classBlock,
            {
              top: topOffset,
              left: 35 + dayIndex * COLUMN_WIDTH,
              width: COLUMN_WIDTH - 2,
              height: height,
              backgroundColor: item.color,
            },
          ]}
        >
          <Text style={styles.classTitle}>{item.title}</Text>
          <Text style={styles.classTimeText}>{item.duration}h</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 및 학기 선택 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.univTitle}>강남대학교</Text>
          <TouchableOpacity
            style={styles.semesterSelector}
            onPress={() => setIsSemesterModal(true)}
          >
            <Text style={styles.semesterText}>{selectedSemester}</Text>
            <Ionicons name="chevron-down" size={18} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => setIsAIModal(true)}
            style={styles.aiBadge}
          >
            <Ionicons name="scan-outline" size={18} color="#0059A6" />
            <Text style={styles.aiBadgeText}>AI 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsManualModal(true)}>
            <Ionicons name="add" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.timetableContainer}>
          <View style={styles.dayRow}>
            <View style={{ width: 35 }} />
            {DAYS.map((day) => (
              <View key={day} style={styles.dayLabel}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.gridWrapper}>
            {HOURS.map((hour) => (
              <View key={hour} style={styles.hourRow}>
                <Text style={styles.hourLabel}>{hour}</Text>
                <View style={styles.hourLine} />
              </View>
            ))}
            {renderClasses()}
          </View>
        </View>
      </ScrollView>

      {/* 학기 선택 모달 */}
      <Modal visible={isSemesterModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.semesterModalContent}>
            <Text style={styles.modalTitle}>학기 선택</Text>
            <FlatList
              data={SEMESTERS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.semesterItem}
                  onPress={() => {
                    setSelectedSemester(item);
                    setIsSemesterModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.semesterItemText,
                      selectedSemester === item && styles.activeSemesterText,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedSemester === item && (
                    <Ionicons name="checkmark" size={20} color="#0059A6" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsSemesterModal(false)}
            >
              <Text>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 수동 추가 모달 (기존과 동일) */}
      <Modal visible={isManualModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>과목 직접 추가</Text>
            <TextInput style={styles.input} placeholder="과목명" />
            <TextInput style={styles.input} placeholder="요일 (예: 월)" />
            <TextInput
              style={styles.input}
              placeholder="시작 시간 (예: 9)"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="강의 시간 (예: 2.5)"
              keyboardType="numeric"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsManualModal(false)}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => setIsManualModal(false)}
              >
                <Text style={{ color: "#FFF" }}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI 등록 모달 (기존과 동일) */}
      <Modal visible={isAIModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.aiModalContent}>
            <Ionicons name="image-outline" size={50} color="#0059A6" />
            <Text style={styles.aiModalTitle}>AI 시간표 인식</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => Alert.alert("알림", "이미지 선택창이 열립니다.")}
            >
              <Ionicons name="camera" size={30} color="#999" />
              <Text style={{ color: "#999", marginTop: 5 }}>이미지 업로드</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsAIModal(false)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  univTitle: { fontSize: 12, color: "#666", fontWeight: "bold" },
  semesterSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  semesterText: { fontSize: 20, fontWeight: "bold", color: "#111" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: { color: "#0059A6", fontSize: 12, fontWeight: "bold" },

  timetableContainer: { padding: 10 },
  dayRow: { flexDirection: "row", marginBottom: 10 },
  dayLabel: { flex: 1, alignItems: "center" },
  dayText: { fontWeight: "bold", color: "#666", fontSize: 13 },
  gridWrapper: { position: "relative", height: 12 * 60 },
  hourRow: { flexDirection: "row", height: 60, alignItems: "flex-start" },
  hourLabel: { width: 35, fontSize: 12, color: "#AAA", textAlign: "center" },
  hourLine: { flex: 1, height: 1, backgroundColor: "#F0F0F0", marginTop: 8 },

  classBlock: {
    position: "absolute",
    borderRadius: 4,
    padding: 5,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(0,0,0,0.1)",
  },
  classTitle: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  classTimeText: { color: "#FFF", fontSize: 9, opacity: 0.8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  semesterModalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  semesterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  semesterItemText: { fontSize: 16, color: "#333" },
  activeSemesterText: { color: "#0059A6", fontWeight: "bold" },

  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: { padding: 10 },
  confirmBtn: {
    backgroundColor: "#0059A6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeBtn: { marginTop: 15, alignItems: "center", padding: 10 },

  aiModalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  aiModalTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  uploadBox: {
    width: "100%",
    height: 150,
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
