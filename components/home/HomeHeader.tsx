import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// 홈 상단 헤더(로고/서비스명 + 알림/프로필 아이콘)
// hasNotification: true일 때 종 아이콘에 빨간 점(Badge) 표시
export const HomeHeader = ({
  onPressBell,
  onPressProfile,
  hasNotification = false,
}: {
  onPressBell: () => void;
  onPressProfile: () => void;
  hasNotification?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>KNUSTUDY</Text>
      </View>

      <View style={styles.right}>
        <Pressable onPress={onPressBell} hitSlop={10} style={styles.iconBtn}>
          <FontAwesome name="bell-o" size={20} color="#111827" />
          {hasNotification && <View style={styles.badgeDot} />}
        </Pressable>
        <Pressable onPress={onPressProfile} hitSlop={10} style={styles.iconBtn}>
          <FontAwesome name="user-circle-o" size={22} color="#111827" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: 0.2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
});
