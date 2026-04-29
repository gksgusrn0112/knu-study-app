import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0059A6", // 강남대 블루
        tabBarInactiveTintColor: "#888",
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      {/* 1. 캘린더 */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      {/* 2. 스터디플래너 */}
      <Tabs.Screen
        name="studyplanner"
        options={{
          title: "플래너",
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer" size={24} color={color} />
          ),
        }}
      />
      {/* 3. 홈 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      {/* 4. 익명게시판 */}
      <Tabs.Screen
        name="community"
        options={{
          title: "게시판",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
        }}
      />
      {/* 5. 시간표 */}
      <Tabs.Screen
        name="timetable"
        options={{
          title: "시간표",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
