# HiBuilder · AI 강의 판매 웹앱

순수 **HTML + CSS + JavaScript(바닐라)** 로 만든 강의 판매 사이트입니다.
빌드 과정 없이 정적 호스팅(Github Pages, Netlify, Vercel, Cloudflare Pages, S3 등)에 그대로 올려서 쓸 수 있어요.

## 빠른 시작

```bash
# 저장소 루트에서
python3 -m http.server 8080
# 또는
npx serve .
```

브라우저에서 `http://localhost:8080` 열기.

## 폴더 구조

```
├── index.html          # 홈 (히어로 / 강의 목록 / 추천 후기 / FAQ)
├── course.html         # 강의 상세페이지 (커리큘럼/리뷰/FAQ/결제 CTA)
├── checkout.html       # 결제 폼
├── success.html        # 결제 완료
├── assets/
│   ├── css/styles.css  # 전체 스타일 (Pretendard 폰트)
│   └── js/
│       ├── main.js     # 공용 (헤더/푸터/리뷰·주문 스토어)
│       ├── home.js     # 홈 렌더러
│       ├── course.js   # 상세페이지 렌더러 + 리뷰 폼
│       ├── checkout.js # 결제 폼
│       └── success.js  # 완료 화면
└── data/
    └── courses.js      # 강의 데이터 & 시드 리뷰
```

## 주요 기능

- **강의 카탈로그**: `data/courses.js`의 `COURSES` 배열로 관리. 항목 추가만 하면 홈과 상세페이지에 자동 반영.
- **상세페이지**: 커리큘럼(섹션 접기/펼치기), 이런 걸 배워요, 강사 소개, FAQ, 결제 CTA 스티키 박스.
- **리뷰 시스템**: ★ 별점 + 텍스트 작성. 현재는 `localStorage`에 저장(브라우저별). `SEED_REVIEWS` 값은 초기 시드로 표시되는 샘플 후기.
- **결제 플로우**: 이름/이메일/전화/결제수단 입력 → 주문 `localStorage` 저장 → 완료 페이지. 실제 서비스에서는 PG(토스페이먼츠/포트원 등)로 교체.
- **반응형**: 900px 이하 모바일 레이아웃 지원.

## 강의 추가하기

`data/courses.js`를 열고 `COURSES` 배열에 새 객체를 추가하세요:

```js
{
  id: "my-new-course",
  slug: "my-new-course",
  title: "강의 제목",
  subtitle: "한 줄 설명",
  thumbnail: "https://...",
  price: 99000,
  originalPrice: 199000,
  discountLabel: "-50%",
  rating: 4.8,
  students: 320,
  duration: "총 3시간",
  level: "입문",
  tags: ["AI", "자동화"],
  highlights: ["포인트1", "포인트2"],
  description: "상세 설명",
  curriculum: [ { section: "...", lectures: [{ title:"...", time:"10:00" }] } ],
  instructor: { name:"...", title:"...", avatar:"...", bio:"..." },
  faqs: [ { q:"...", a:"..." } ]
}
```

## Supabase 연동

리뷰·주문을 실제 DB에 저장합니다. 설정이 비어 있으면 자동으로 localStorage fallback으로 동작하므로 세팅 전에도 사이트는 그대로 돕니다.

### 1) 스키마 생성

Supabase 대시보드 → **SQL Editor** 에서 `supabase/schema.sql` 전체를 붙여넣고 Run. 다음이 만들어집니다.

- `public.reviews` — 리뷰 저장 (익명 insert 허용, 누구나 read)
- `public.orders` — 주문 기록 (익명 insert 허용, read는 서비스롤만)
- `public.has_purchased(course_id, email)` RPC — "구매 확인" 뱃지용
- 각 테이블 RLS 정책 활성화

### 2) 키 입력

`assets/js/supabase-config.js` 열고 값 채우기:

```js
window.SUPABASE_CONFIG = {
  url:     "https://xxxxx.supabase.co",
  anonKey: "eyJhbGciOi..."
};
```

이 파일은 `.gitignore`에 포함되어 저장소에 올라가지 않습니다. 팀 공유용 템플릿은 `supabase-config.example.js` 참고.

### 3) 확인

- 상세페이지에서 후기 등록 → Supabase Table Editor의 `reviews` 행 생성 확인
- 결제 페이지에서 주문 → `orders` 행 생성 확인
- 미설정 상태에서는 푸터에 "⚠ Supabase 미설정" 배너가 뜹니다.

## 토스페이먼츠 결제 연동

결제 플로우는 **프론트 위젯 + 서버 승인(Netlify Function)** 구조로 안전하게 분리되어 있어요.

```
체크아웃 페이지 ── 위젯 ──→ 토스페이먼츠 결제창
                                │
                                ↓ 리다이렉트
                         /success.html?paymentKey=...&orderId=...&amount=...
                                │
                                ↓ POST
             /.netlify/functions/confirm-payment
                - Supabase에서 주문 조회 & 금액 검증
                - 토스 /v1/payments/confirm 호출 (시크릿 키 = 서버 전용)
                - orders.status = 'paid' 로 업데이트
```

### 1) 토스페이먼츠 가입 + 키 확보

1. https://tosspayments.com 가입 → 개발자센터
2. **결제위젯** 선택 → 테스트 키 4종 확인:
   - **Client Key** (`test_gck_...`) → `assets/js/toss-config.js` 에 입력 (공개 가능)
   - **Secret Key** (`test_gsk_...`) → Netlify 환경변수 (절대 프론트 금지)

### 2) Netlify 환경변수 설정

Netlify 대시보드 → Site configuration → **Environment variables** 에 3개 추가:

| 변수명 | 값 |
|---|---|
| `TOSS_SECRET_KEY` | `test_gsk_...` (테스트) / `live_gsk_...` (라이브) |
| `SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API Keys → **service_role** (⚠ 비밀!) |

저장 후 **Deploys → Trigger deploy → Clear cache and deploy** 한 번 돌려야 적용됩니다.

### 3) 테스트

- 테스트 카드: `4330-1234-1234-1234`, 유효기간/CVC 임의
- 결제 성공 후 Supabase `orders.status` 가 `paid` 로 바뀌면 완료

### 4) 라이브 전환

토스페이먼츠 심사 통과 후:
1. `assets/js/toss-config.js` 의 client key → `live_gck_...` 로 교체
2. Netlify `TOSS_SECRET_KEY` 환경변수 → `live_gsk_...` 로 교체
3. 재배포

## 실제 서비스 전환 체크리스트

1. **구매 확인 뱃지**: `has_purchased` RPC를 호출해 리뷰 작성자가 실제 구매자일 때만 `verified=true`로 저장하도록 보강.
2. **강의 콘텐츠 영상**: Vimeo/JW Player 등 스트리밍 서비스 연동 후 상세 페이지에 플레이어 삽입
3. **회원 시스템**: Supabase Auth 도입 (이메일/소셜 로그인, 내 강의 목록)
4. **관리자**: 강의/주문/후기 관리는 Supabase Studio 또는 자체 대시보드

## 라이선스

프로젝트 목적에 맞게 자유롭게 수정해 사용하세요.
