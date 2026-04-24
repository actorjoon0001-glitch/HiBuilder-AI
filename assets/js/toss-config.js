// 토스페이먼츠 클라이언트 키 (공개 가능)
// 기본값은 토스 공식 문서의 테스트 키 (누구나 사용 가능 · 실제 결제 안 됨)
// 본인 계정 가입 후 키로 교체하시면 됩니다.
//
// 키 받는 법:
//   https://tosspayments.com 가입 → 개발자센터 → 결제위젯 → "테스트 키"/"라이브 키"
//   - Client Key (test_gck_... / live_gck_...) → 이 파일에 넣기 (공개 가능)
//   - Secret Key (test_gsk_... / live_gsk_...) → Netlify 환경변수 TOSS_SECRET_KEY (절대 여기 금지!)
window.TOSS_CONFIG = {
  // 테스트 키 - 실결제 안 됨 (토스 공식 문서 예시 키)
  clientKey: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
};
