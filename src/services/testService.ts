import { supabase } from "../lib/supabase";

export const testConnection = async () => {
  try {
    console.log("연결 테스트 시작...");

    // todos 테이블에 테스트 데이터 하나 넣어보기
    // (auth 기능이 없으니 임시로 uuid는 아무거나 넣을게.
    // 만약 RLS 때문에 막히면 Supabase 정책을 잠시 꺼야 할 수도 있어!)
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          task: "연결 테스트 성공!",
          user_id: "00000000-0000-0000-0000-000000000000",
        },
      ])
      .select();

    if (error) {
      console.error("❌ 연결 에러 발생:", error.message);
      return false;
    }

    console.log("✅ 데이터 삽입 성공!:", data);
    return true;
  } catch (e) {
    console.error("시스템 에러:", e);
    return false;
  }
};
