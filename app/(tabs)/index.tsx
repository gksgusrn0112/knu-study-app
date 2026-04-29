import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  DimensionValue,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 💡 한 단계 더 깊어졌으니 ../../ 로 경로 수정
import { useThemeStore } from "../../store/useThemeStore";
import { useTimerStore } from "../../store/useTimerStore";

const CALENDAR_SCHEDULES = [
  { id: "1", title: "SQLD 보수교육", date: "2026-05-09", color: "#FF4D4D" },
  { id: "2", title: "기말고사 시작", date: "2026-06-11", color: "#0059A6" },
  {
    id: "3",
    title: "데이터베이스 과제 제출",
    date: "2026-05-15",
    color: "#FFD700",
  },
];

const TODAY_CLASSES = [
  {
    id: "1",
    title: "데이터베이스 실습",
    room: "경천관 402호",
    start: "10:30",
    end: "12:00",
  },
  {
    id: "2",
    title: "알고리즘",
    room: "이공관 201호",
    start: "14:00",
    end: "15:30",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { seconds } = useTimerStore();
  const { isDarkMode } = useThemeStore();
  const [dDayList, setDDayList] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const themeBg = isDarkMode ? "#121212" : "#FFF";
  const themeText = isDarkMode ? "#EEE" : "#333";
  const themeSubText = isDarkMode ? "#AAA" : "#666";
  const themeCard = isDarkMode ? "#1E1E1E" : "#FAFAFA";

  const progressPercentValue = Math.min((seconds / (40 * 3600)) * 100, 100);
  const progressWidth = `${progressPercentValue}%` as DimensionValue;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calculateDDay = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0
      ? "D-Day"
      : days > 0
        ? `D-${days}`
        : `D+${Math.abs(days)}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* 헤더: 이미지 경로도 ../../ 로 수정 */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logoImage}
            />
            <View>
              <Text style={styles.brandText}>KNUSTUDY</Text>
              <Text style={[styles.welcomeText, { color: themeSubText }]}>
                안녕하세요, 한현구님!
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push("/profile" as Href)}>
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={isDarkMode ? "#FFF" : "#333"}
            />
          </TouchableOpacity>
        </View>

        {/* ... 나머지 코드 동일 ... */}
        <View style={styles.dashboardCard}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeText }]}>
            오늘의 수업
          </Text>
          {TODAY_CLASSES.map((item) => (
            <View
              key={item.id}
              style={[styles.classCard, { backgroundColor: themeCard }]}
            >
              <Text style={[styles.classTitle, { color: themeText }]}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeText }]}>
              마감 임박
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#0059A6" />
            </TouchableOpacity>
          </View>
          <View style={styles.dDayRow}>
            {[0, 1].map((index) => {
              const item = dDayList[index];
              return item ? (
                <View
                  key={item.id}
                  style={[
                    styles.dDayCard,
                    {
                      backgroundColor: themeCard,
                      borderColor: isDarkMode ? "#333" : "#EEE",
                    },
                  ]}
                >
                  <Text style={[styles.dDayText, { color: item.color }]}>
                    {calculateDDay(item.date)}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  key={index}
                  style={styles.emptyDDayCard}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.emptyText}>일정 추가</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 모달 동일 */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoImage: { width: 38, height: 38, resizeMode: "contain" },
  brandText: { fontSize: 24, fontWeight: "900", color: "#0059A6" },
  welcomeText: { fontSize: 13, fontWeight: "500" },
  dashboardCard: { backgroundColor: "#0059A6", borderRadius: 24, padding: 25 },
  timerText: {
    color: "#FFF",
    fontSize: 52,
    fontWeight: "800",
    textAlign: "center",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginTop: 15,
  },
  progressBarFill: { height: 10, backgroundColor: "#FFF", borderRadius: 5 },
  section: { marginTop: 35 },
  sectionTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 15 },
  classCard: { padding: 20, borderRadius: 18, marginBottom: 10 },
  classTitle: { fontSize: 16, fontWeight: "bold" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dDayRow: { flexDirection: "row", gap: 12 },
  dDayCard: { flex: 1, padding: 18, borderRadius: 15, borderWidth: 1 },
  dDayText: { fontSize: 22, fontWeight: "bold" },
  emptyDDayCard: {
    flex: 1,
    height: 100,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#DDD",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 11, color: "#AAA" },
});
