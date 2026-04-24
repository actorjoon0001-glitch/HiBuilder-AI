// Supabase 연결 설정 - publishable key 는 클라이언트 공개용이라 커밋 안전.
// 실제 보안은 schema.sql 에서 설정한 RLS 정책이 담당합니다.
// ⚠ service_role / sb_secret_* 키는 절대 여기 넣지 마세요!
window.SUPABASE_CONFIG = {
  url:     "https://mnfehgyaypdywoxskope.supabase.co",
  anonKey: "sb_publishable_fyAu0mfoYxBvBViWCFutrQ_I3ol6LPs"
};
