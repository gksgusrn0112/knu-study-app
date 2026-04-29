import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// [추가] 전역 타이머 스토어 가져오기
import { useTimerStore } from "../store/useTimerStore";

const MY_TIMETABLE = [
  { id: "1", title: "통계와 사회" },
  { id: "2", title: "데이터베이스 실습" },
  { id: "3", title: "알고리즘" },
  { id: "4", title: "ICT융합기초" },
];

const STUDY_MEMBERS = [
  { id: "1", nickname: "강남대 수석졸업", time: 15400, isActive: true },
  { id: "2", nickname: "용인벌꿀오소리", time: 12000, isActive: false },
  { id: "3", nickname: "현구짱", time: 8000, isActive: true },
  { id: "4", nickname: "열공하자", time: 5000, isActive: false },
];

export default function StudyStatusScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams(); // 플래너에서 보낸 과목명 받기
  const [selectedSubject, setSelectedSubject] = useState(
    (subject as string) || MY_TIMETABLE[0].title,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // [추가] 타이머 상태 가져오기
  const { seconds, isActive, pause, start } = useTimerStore();

  // 시간 포맷팅 함수
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const sortedMembers = [...STUDY_MEMBERS].sort((a, b) => b.time - a.time);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 헤더 및 드롭다운 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.headerTitle}>{selectedSubject}</Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>

        <View style={{ width: 24 }} />
      </View>

      {/* 2. 드롭다운 목록 */}
      {isDropdownOpen && (
        <View style={styles.dropdownList}>
          {MY_TIMETABLE.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedSubject(item.title);
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 3. 🔥 중앙 실시간 타이머 섹션 추가 */}
      <View style={styles.timerDisplaySection}>
        <Text style={styles.timerSubject}>{selectedSubject} 집중 중</Text>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        <TouchableOpacity
          style={[
            styles.miniControlBtn,
            isActive ? styles.pauseBtn : styles.startBtn,
          ]}
          onPress={isActive ? pause : start}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={20} color="#FFF" />
          <Text style={styles.miniControlText}>
            {isActive ? "잠시 멈춤" : "다시 시작"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. 공부 현황 리스트 */}
      <View style={styles.statusSection}>
        <View style={styles.infoBox}>
          <Ionicons name="megaphone-outline" size={18} color="#0059A6" />
          <Text style={styles.infoText}>학우들의 실시간 학습 현황</Text>
        </View>

        <FlatList
          data={sortedMembers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <View
                style={[
                  styles.iconCircle,
                  item.isActive ? styles.activeBorder : styles.restBorder,
                ]}
              >
                <Ionicons
                  name={item.isActive ? "pencil" : "cafe"}
                  size={32}
                  color={item.isActive ? "#0059A6" : "#AAA"}
                />
              </View>
              <Text style={styles.nickname} numberOfLines={1}>
                {item.nickname}
              </Text>
              <Text style={styles.timeLabel}>
                {Math.floor(item.time / 3600)}시간 달성
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownButton: { flexDirection: "row", alignItems: "center", gap: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  dropdownList: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    position: "absolute",
    top: 60,
    width: "100%",
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FAFAFA",
  },
  dropdownText: { fontSize: 16 },

  // 타이머 디스플레이 스타일
  timerDisplaySection: {
    alignItems: "center",
    paddingVertical: 40,
    borderBottomWidth: 8,
    borderBottomColor: "#F8F9FA",
  },
  timerSubject: { fontSize: 14, color: "#666", marginBottom: 5 },
  timerText: {
    fontSize: 54,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 2,
  },
  miniControlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  startBtn: { backgroundColor: "#0059A6" },
  pauseBtn: { backgroundColor: "#FF4D4D" },
  miniControlText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },

  statusSection: { padding: 20 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  infoText: { color: "#0059A6", fontWeight: "bold", fontSize: 13 },
  memberCard: { alignItems: "center", width: 85, marginRight: 15 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
  },
  activeBorder: { borderColor: "#0059A6" },
  restBorder: { borderColor: "#EEE" },
  nickname: { fontSize: 13, fontWeight: "bold", textAlign: "center" },
  timeLabel: { fontSize: 11, color: "#999", marginTop: 2 },
});
