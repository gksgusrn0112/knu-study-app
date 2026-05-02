import { supabase } from "../lib/supabase";

// 공부 시작 데이터 넣기
export const startStudySession = async (userId: string, subject: string) => {
  const { data, error } = await supabase
    .from("study_sessions")
    .insert([{ user_id: userId, subject_name: subject, status: "studying" }]);
  return { data, error };
};
