import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";

// 탭 바 아이콘 컴포넌트
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

// 메인 탭 레이아웃 (캘린더 - 스터디플래너 - 홈 - 익명게시판 - 시간표)
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = "#0059A6"; // 강남대 공식 블루

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEF2F7",
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {/* 1. 캘린더 탭 */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      {/* 2. 스터디플래너 탭 */}
      <Tabs.Screen
        name="studyplanner"
        options={{
          title: "스터디플래너",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-alt" color={color} />
          ),
        }}
      />
      {/* 3. 홈 탭 */}
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {/* 4. 익명게시판 탭 */}
      <Tabs.Screen
        name="board"
        options={{
          title: "익명게시판",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comments-o" color={color} />
          ),
        }}
      />
      {/* 5. 시간표 탭 */}
      <Tabs.Screen
        name="timetable"
        options={{
          title: "시간표",
          tabBarIcon: ({ color }) => <TabBarIcon name="table" color={color} />,
        }}
      />
    </Tabs>
  );
}
