import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../src/store/useThemeStore"; // 💡 전역 상태 사용

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [isNotiModalVisible, setIsNotiModalVisible] = useState(false);

  // 테마 스타일
  const themeBg = isDarkMode ? "#121212" : "#F8F9FA";
  const themeHeaderBg = isDarkMode ? "#1E1E1E" : "#FFF";
  const themeText = isDarkMode ? "#EEE" : "#333";
  const themeCard = isDarkMode ? "#1E1E1E" : "#FFF";
  const themeBorder = isDarkMode ? "#333" : "#F5F5F5";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      {/* 헤더 */}
      <View
        style={[
          styles.header,
          { backgroundColor: themeHeaderBg, borderBottomColor: themeBorder },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkMode ? "#FFF" : "#333"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeText }]}>
          마이페이지
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 카드: 누르면 상세 정보 페이지 이동 */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => router.push("/profile/info" as Href)}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.userName}>한현구</Text>
              <Text style={styles.userSchool}>강남대학교 ICT융합공학과</Text>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>4학년 재학 중</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255,255,255,0.5)"
              style={{ marginLeft: "auto" }}
            />
          </View>
        </TouchableOpacity>

        <View style={[styles.menuSection, { backgroundColor: themeCard }]}>
          {/* 활동 메뉴들 */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeBorder }]}
            onPress={() => router.push("/profile/my-posts" as Href)}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={isDarkMode ? "#AAA" : "#444"}
              />
              <Text style={[styles.menuText, { color: themeText }]}>
                내 게시글 보기
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeBorder }]}
            onPress={() => router.push("/profile/my-comments" as Href)}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="chatbubbles-outline"
                size={22}
                color={isDarkMode ? "#AAA" : "#444"}
              />
              <Text style={[styles.menuText, { color: themeText }]}>
                내 댓글 보기
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeBorder }]}
            onPress={() => setIsNotiModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={isDarkMode ? "#AAA" : "#444"}
              />
              <Text style={[styles.menuText, { color: themeText }]}>
                알림 설정
              </Text>
            </View>
          </TouchableOpacity>

          {/* 다크 모드 토글 */}
          <View style={[styles.menuItem, { borderBottomColor: themeBorder }]}>
            <View style={styles.menuLeft}>
              <Ionicons
                name={isDarkMode ? "moon" : "moon-outline"}
                size={22}
                color={isDarkMode ? "#FFD700" : "#444"}
              />
              <Text style={[styles.menuText, { color: themeText }]}>
                다크 모드
              </Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>

          {/* 로그아웃 */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("로그아웃", "정말 나가시겠어요?")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
              <Text style={[styles.menuText, { color: "#FF4D4D" }]}>
                로그아웃
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 알림 설정 모달 생략 (동일한 로직) */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  profileCard: {
    backgroundColor: "#0059A6",
    margin: 20,
    borderRadius: 22,
    padding: 25,
  },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  nameSection: { marginLeft: 15 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  userSchool: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  gradeBadge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  gradeText: { color: "#0059A6", fontSize: 10, fontWeight: "bold" },
  menuSection: {
    marginHorizontal: 20,
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 15 },
  menuText: { fontSize: 16, fontWeight: "500" },
});
