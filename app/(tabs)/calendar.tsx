import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MOCK_SCHEDULES,
  SCHEDULE_CATEGORIES,
  Schedule,
  ScheduleCategory,
  getSchedulesByDate,
} from "@/constants/mockData";

// ============================================
// 유틸리티 함수
// ============================================

/** 날짜 포맷: YYYY-MM-DD */
const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** 월 표시 포맷: YYYY년 MM월 */
const formatMonthYear = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

/** 요일 배열 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 카테고리 색상 반환 */
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "수업":
      return "#3B82F6";
    case "과제":
      return "#F59E0B";
    case "시험":
      return "#EF4444";
    case "개인":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

// ============================================
// 수동 일정 추가 모달
// ============================================

interface AddScheduleModalProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSave: (schedule: Omit<Schedule, "id">) => void;
}

const AddScheduleModal = ({
  visible,
  selectedDate,
  onClose,
  onSave,
}: AddScheduleModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<ScheduleCategory>("수업");
  const [isAllDay, setIsAllDay] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("오류", "제목을 입력해주세요.");
      return;
    }

    onSave({
      title: title.trim(),
      date,
      start_time: isAllDay ? "" : startTime,
      end_time: isAllDay ? "" : endTime,
      is_all_day: isAllDay,
      category,
    });

    setTitle("");
    setStartTime("09:00");
    setEndTime("10:00");
    setCategory("수업");
    setIsAllDay(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>일정 추가</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <FontAwesome name="times" size={20} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>제목</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="일정 제목을 입력하세요"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>날짜</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsAllDay(!isAllDay)}
            >
              <View
                style={[styles.checkbox, isAllDay && styles.checkboxChecked]}
              >
                {isAllDay && (
                  <FontAwesome name="check" size={12} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>종일</Text>
            </TouchableOpacity>

            {!isAllDay && (
              <View style={styles.timeRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>시작 시간</Text>
                  <TextInput
                    style={styles.textInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="HH:MM"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>종료 시간</Text>
                  <TextInput
                    style={styles.textInput}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="HH:MM"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>카테고리</Text>
              <View style={styles.categoryGrid}>
                {SCHEDULE_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                      {
                        borderColor:
                          category === cat ? getCategoryColor(cat) : "#E5E7EB",
                        backgroundColor:
                          category === cat
                            ? getCategoryColor(cat) + "20"
                            : "#FFFFFF",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color:
                            category === cat
                              ? getCategoryColor(cat)
                              : "#6B7280",
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// AI 일정 추가 모달
// ============================================

interface AIAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<Schedule, "id">) => void;
}

const AIAddModal = ({ visible, onClose, onSave }: AIAddModalProps) => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewSchedule, setPreviewSchedule] = useState<Omit<
    Schedule,
    "id"
  > | null>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      Alert.alert("오류", "일정을 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      let detectedDate = formatDateISO(today);
      let detectedTime = "10:00";
      let detectedEndTime = "11:00";
      let detectedCategory: ScheduleCategory = "수업";

      if (inputText.includes("내일")) {
        detectedDate = formatDateISO(tomorrow);
      }

      const timeMatch = inputText.match(/(\d{1,2})시/);
      if (timeMatch) {
        const hour = parseInt(timeMatch[1]);
        detectedTime = `${String(hour).padStart(2, "0")}:00`;
        detectedEndTime = `${String(hour + 1).padStart(2, "0")}:00`;
      }

      if (
        inputText.includes("시험") ||
        inputText.includes("중간") ||
        inputText.includes("기말")
      ) {
        detectedCategory = "시험";
      } else if (inputText.includes("과제") || inputText.includes("제출")) {
        detectedCategory = "과제";
      } else if (inputText.includes("개인") || inputText.includes("약속")) {
        detectedCategory = "개인";
      }

      const title = inputText
        .replace(/추가해줘|추가해줘서|등록해줘|등록해줘서/g, "")
        .replace(/내일|오후|上午|下午/g, "")
        .trim()
        .substring(0, 30);

      setPreviewSchedule({
        title: title || "AI 분석 일정",
        date: detectedDate,
        start_time: detectedTime,
        end_time: detectedEndTime,
        is_all_day: false,
        category: detectedCategory,
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (previewSchedule) {
      onSave(previewSchedule);
      setInputText("");
      setPreviewSchedule(null);
      onClose();
    }
  };

  const handleClose = () => {
    setInputText("");
    setPreviewSchedule(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.aiHeaderRow}>
              <FontAwesome name="magic" size={18} color="#0059A6" />
              <Text style={styles.modalTitle}>AI 일정 추가</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={10}>
              <FontAwesome name="times" size={20} color="#6B7280" />
            </Pressable>
          </View>

          {!previewSchedule ? (
            <>
              <Text style={styles.aiDescription}>
                자연어로 일정을 입력하면 AI가 자동으로 분석하여 추가해줍니다.
              </Text>
              <TextInput
                style={styles.aiTextInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="예: 내일 오후 2시 데이터 구조 수업 추가해줘"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Pressable
                style={[
                  styles.aiButton,
                  isAnalyzing && styles.aiButtonDisabled,
                ]}
                onPress={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <View style={styles.aiButtonLoading}>
                    <FontAwesome name="spinner" size={16} color="#FFFFFF" />
                    <Text style={styles.aiButtonText}>AI 분석 중...</Text>
                  </View>
                ) : (
                  <>
                    <FontAwesome name="magic" size={16} color="#FFFFFF" />
                    <Text style={styles.aiButtonText}>AI 분석</Text>
                  </>
                )}
              </Pressable>
            </>
          ) : (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>분석 결과</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>제목</Text>
                  <Text style={styles.previewValue}>
                    {previewSchedule.title}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>날짜</Text>
                  <Text style={styles.previewValue}>
                    {previewSchedule.date.replace(
                      /^(\d{4})-(\d{2})-(\d{2})$/,
                      "$1년 $2월 $3일",
                    )}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>시간</Text>
                  <Text style={styles.previewValue}>
                    {previewSchedule.start_time} - {previewSchedule.end_time}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>카테고리</Text>
                  <View
                    style={[
                      styles.previewCategoryBadge,
                      {
                        backgroundColor:
                          getCategoryColor(previewSchedule.category) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.previewCategoryText,
                        { color: getCategoryColor(previewSchedule.category) },
                      ]}
                    >
                      {previewSchedule.category}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.previewButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setPreviewSchedule(null)}
                >
                  <Text style={styles.cancelButtonText}>다시 입력</Text>
                </Pressable>
                <Pressable style={styles.confirmButton} onPress={handleSave}>
                  <Text style={styles.confirmButtonText}>저장</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// 캘린더 컴포넌트
// ============================================

/** 월별 캘린더 뷰 */
const CalendarView = ({
  currentDate,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  currentDate: Date;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) => {
  // 해당 월의 첫째 날과 마지막 날
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // 첫째 날의 요일 (0=일요일)
  const startWeekday = firstDay.getDay();
  // 해당 월의 총 일수
  const daysInMonth = lastDay.getDate();

  // 오늘 날짜
  const today = formatDateISO(new Date());

  // 캘린더 그리드 생성
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    // 첫째 주 앞의 빈 공간
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }

    // 실제 날짜들
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return days;
  }, [startWeekday, daysInMonth]);

  return (
    <View style={styles.calendarContainer}>
      {/* 월 이동 헤더 */}
      <View style={styles.calendarHeader}>
        <Pressable onPress={onPrevMonth} hitSlop={10} style={styles.monthArrow}>
          <FontAwesome name="chevron-left" size={18} color="#111827" />
        </Pressable>
        <Text style={styles.monthTitle}>{formatMonthYear(currentDate)}</Text>
        <Pressable onPress={onNextMonth} hitSlop={10} style={styles.monthArrow}>
          <FontAwesome name="chevron-right" size={18} color="#111827" />
        </Pressable>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, idx) => (
          <Text
            key={day}
            style={[
              styles.weekdayText,
              idx === 0 && styles.weekendText,
              idx === 6 && styles.weekendText,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }

          const dateStr = formatDateISO(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
          );
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const isSunday = idx % 7 === 0;
          const isSaturday = idx % 7 === 6;

          return (
            <Pressable
              key={dateStr}
              onPress={() => onSelectDate(dateStr)}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayTextToday,
                  isSunday && styles.weekendText,
                  isSaturday && styles.weekendText,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

/** 일정 아이템 컴포넌트 */
const ScheduleItem = ({ schedule }: { schedule: Schedule }) => {
  return (
    <View style={styles.scheduleItem}>
      <View
        style={[
          styles.categoryDot,
          { backgroundColor: getCategoryColor(schedule.category) },
        ]}
      />
      <View style={styles.scheduleContent}>
        <Text style={styles.scheduleTitle}>{schedule.title}</Text>
        <Text style={styles.scheduleTime}>
          {schedule.is_all_day
            ? "종일"
            : `${schedule.start_time} - ${schedule.end_time}`}
        </Text>
      </View>
      <Text
        style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryColor(schedule.category) + "20" },
        ]}
      >
        {schedule.category}
      </Text>
    </View>
  );
};

// ============================================
// 메인 화면
// ============================================

export default function Calendar() {
  // 현재 표시 중인 월
  const [currentDate, setCurrentDate] = useState(new Date());

  // 선택된 날짜 (기본값: 오늘)
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));

  // 일정 목록 상태 (새 일정 추가 가능)
  const [schedules, setSchedules] = useState<Schedule[]>([...MOCK_SCHEDULES]);

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // 선택된 날짜의 일정 목록
  const filteredSchedules = useMemo(
    () => getSchedulesByDate(selectedDate, schedules),
    [selectedDate, schedules],
  );

  // 일정 추가 핸들러
  const handleAddSchedule = (newSchedule: Omit<Schedule, "id">) => {
    const id = `schedule-${Date.now()}`;
    setSchedules((prev) => [...prev, { ...newSchedule, id }]);
    Alert.alert("성공", "일정이 추가되었습니다.");
  };

  // 이전 월로 이동
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // 다음 월로 이동
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // 날짜 선택
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 캘린더 뷰 */}
        <CalendarView
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />

        {/* 선택된 날짜 표시 */}
        <View style={styles.selectedDateHeader}>
          <Text style={styles.selectedDateText}>
            {selectedDate
              .replace(/-/g, ".")
              .replace(/^(\d{4})\.(\d{2})\.(\d{2})$/, "$1년 $2월 $3일")}
          </Text>
          <Text style={styles.scheduleCount}>{schedules.length}개 일정</Text>
        </View>

        {/* 일정 리스트 */}
        <View style={styles.scheduleList}>
          {filteredSchedules.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="calendar-o" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>일정이 없습니다</Text>
            </View>
          ) : (
            filteredSchedules.map((schedule) => (
              <ScheduleItem key={schedule.id} schedule={schedule} />
            ))
          )}
        </View>
      </ScrollView>

      {/* 이중 FAB 버튼 */}
      <View style={styles.fabContainer}>
        <Pressable style={styles.fabAI} onPress={() => setShowAIModal(true)}>
          <FontAwesome name="magic" size={20} color="#0059A6" />
        </Pressable>
        <Pressable style={styles.fab} onPress={() => setShowAddModal(true)}>
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* 수동 일정 추가 모달 */}
      <AddScheduleModal
        visible={showAddModal}
        selectedDate={selectedDate}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSchedule}
      />

      {/* AI 일정 추가 모달 */}
      <AIAddModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onSave={handleAddSchedule}
      />
    </SafeAreaView>
  );
}

// ============================================
// 스타일
// ============================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 100,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthArrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  weekendText: {
    color: "#EF4444",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  dayTextToday: {
    color: "#0059A6",
    fontWeight: "900",
  },
  dayCellSelected: {
    backgroundColor: "#0059A6",
    borderRadius: 20,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: "#0059A6",
    borderRadius: 20,
  },
  selectedDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  scheduleCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 14,
    gap: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleContent: {
    flex: 1,
    gap: 4,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  scheduleTime: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 24,
    gap: 12,
    alignItems: "center",
  },
  fabAI: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0059A6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  // ============================================
  // 모달 스타일
  // ============================================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  aiHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
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
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  timeRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryChipSelected: {},
  categoryChipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  saveButton: {
    backgroundColor: "#0059A6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  // ============================================
  // AI 모달 스타일
  // ============================================
  aiDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 18,
  },
  aiTextInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  aiButton: {
    backgroundColor: "#0059A6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  aiButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  aiButtonLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  // ============================================
  // 프리뷰 스타일
  // ============================================
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },
  previewValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "800",
  },
  previewCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewCategoryText: {
    fontSize: 12,
    fontWeight: "800",
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B7280",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#0059A6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
