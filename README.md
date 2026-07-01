# HiBuilder · 건축 자사몰 & 전국 시공업체 매칭 (by 루밍홈)

순수 **HTML + CSS + JavaScript(바닐라)** 로 만든 건축 자사몰입니다.
빌드 과정 없이 정적 호스팅(Netlify, Vercel, Cloudflare Pages, Github Pages 등)에 그대로 올려서 쓸 수 있어요.

**서비스 구성**
- 🏡 **주택모델 카탈로그** — 검증된 주택 모델을 소개하고 무료 시공 상담·견적을 접수 (결제 없음, 리드)
- 🧱 **건축자재 판매** — 마루·창호·단열재·도어 등을 토스페이먼츠로 직접 판매
- 🛋️ **가전·가구 판매** — 빌트인 가전·인테리어 가구 직접 판매
- 🗺️ **전국 시공업체 지도** — 카카오맵으로 지역별 파트너 시공사를 보여주고 상담 신청
- 💰 **수수료 모델** — 루밍홈은 마케팅·매칭을 담당하고 시공 계약은 고객↔파트너 시공사가 직접 체결, 회사는 매칭 수수료 수취

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
├── index.html          # 홈 (히어로 / 카테고리 / 상품 / 지도 프리뷰 / 이용방법 / 후기)
├── product.html        # 상품 상세 (자재·가전=결제 CTA / 주택모델=상담 신청 폼)
├── partners.html       # 전국 시공업체 지도 (카카오맵 + 지역필터 + 상담 모달)
├── checkout.html       # 결제 폼 (자재·가전·가구, 수량 선택)
├── success.html        # 주문 완료
├── terms/privacy/refund.html  # 이용약관 / 개인정보처리방침 / 교환·환불정책
├── assets/
│   ├── css/styles.css  # 전체 스타일 (Pretendard 폰트)
│   └── js/
│       ├── main.js         # 공용 (헤더/푸터/리뷰·주문·리드 스토어)
│       ├── home.js         # 홈 렌더러
│       ├── product.js      # 상세페이지 렌더러 + 리뷰/상담 폼
│       ├── partners.js     # 시공업체 지도 + 상담 모달
│       ├── checkout.js     # 결제 폼
│       ├── success.js      # 완료 화면
│       ├── toss-config.js  # 토스 클라이언트 키 (공개용)
│       └── kakao-config.js # 카카오맵 JS 앱키 (공개용)
├── data/
│   ├── products.js     # 상품 데이터 & 시드 리뷰 (주택/자재/가전가구)
│   └── partners.js     # 전국 시공 파트너 데이터 (지도 마커용)
└── netlify/functions/
    └── confirm-payment.js  # 토스 결제 승인 서버 함수
```

## 상품 추가하기

`data/products.js`를 열고 `PRODUCTS` 배열에 새 객체를 추가하세요.

- `category`: `'house'`(주택모델) | `'material'`(자재) | `'appliance'`(가전·가구)
- `mode`: `'consult'`(상담·견적 신청, 결제 없음) | `'purchase'`(토스 직접 결제)

```js
{
  id: "mat-sample",
  category: "material",
  mode: "purchase",
  title: "상품명",
  subtitle: "한 줄 설명",
  thumbnail: "https://...",
  price: 79000,
  originalPrice: 99000,   // 선택 (정가)
  unit: "/ 박스",          // 선택 (단위 표기)
  discountLabel: "-20%",
  rating: 4.8,
  reviews: 120,
  tags: ["태그1", "태그2"],
  highlights: ["포인트1", "포인트2"],
  description: "상세 설명",
  specs: [ { group: "제품 사양", items: [{ label: "규격", value: "..." }] } ],
  vendor: { name: "...", title: "...", avatar: "...", bio: "..." },
  faqs: [ { q: "...", a: "..." } ]
}
```

주택모델(`mode: 'consult'`)은 `price`(예상 시공가), `priceLabel`, `refPrice` 를 함께 넣으면 됩니다.

## 시공 파트너 추가하기

`data/partners.js`의 `PARTNERS` 배열에 업체를 추가합니다. `lat`/`lng`(위·경도)가 지도 마커 위치가 됩니다.

## 전국 지도 (카카오맵)

`partners.html`은 카카오맵 JavaScript SDK로 파트너를 지도에 표시합니다.

1. https://developers.kakao.com → 내 애플리케이션 → **JavaScript 키** 발급
2. 플랫폼 → Web 에 배포 도메인 등록 (예: `https://your-site.netlify.app`)
3. `assets/js/kakao-config.js`의 `appKey`에 JavaScript 키 입력

> 앱키가 비어 있으면 지도는 표시되지 않고 **업체 목록 + 상담 신청**만 정상 동작합니다.

## Supabase 연동

리뷰·주문·상담신청(리드)을 실제 DB에 저장합니다. 설정이 비어 있으면 자동으로 localStorage fallback으로 동작하므로 세팅 전에도 사이트는 그대로 돕니다.

### 1) 스키마 생성

Supabase 대시보드 → **SQL Editor** 에서 `supabase/schema.sql` 전체를 붙여넣고 Run. 다음이 만들어집니다.

- `public.reviews` — 상품 리뷰 (익명 insert 허용, 누구나 read) — *컬럼명 `course_id`에 상품 id 저장*
- `public.orders` — 주문 기록 (익명 insert 허용, read는 서비스롤만) — *기존 결제 연동 유지를 위해 컬럼명 그대로*
- `public.leads` — 상담·견적 신청 (익명 insert 허용, read는 서비스롤만)
- `public.has_purchased(course_id, email)` RPC — "구매 확인" 뱃지용
- 각 테이블 RLS 정책 활성화

### 2) 키 입력

`assets/js/supabase-config.js` 에 `url`, `anonKey` 입력. (anon/publishable 키는 공개용이라 커밋 안전, RLS가 보안 담당)

## 토스페이먼츠 결제 연동

자재·가전·가구 직접 결제에 사용합니다. **프론트 위젯 + 서버 승인(Netlify Function)** 구조로 안전하게 분리되어 있어요. (주택모델·시공 상담은 결제가 아닌 리드이므로 결제 흐름을 타지 않습니다.)

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

### 1) 키 확보

- **Client Key** (`test_gck_...` / `live_gck_...`) → `assets/js/toss-config.js` (공개 가능)
- **Secret Key** (`test_gsk_...` / `live_gsk_...`) → Netlify 환경변수 (절대 프론트 금지)

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

토스페이먼츠 심사 통과 후: `toss-config.js` client key → `live_gck_...`, Netlify `TOSS_SECRET_KEY` → `live_gsk_...` 교체 후 재배포.

## 실제 서비스 전환 체크리스트

1. **상담 리드 관리**: `leads` 테이블을 관리자 대시보드/알림(Slack·이메일)과 연동해 신속 응대
2. **파트너 시공사 계약·정산**: 매칭 수수료 정산 프로세스 마련
3. **상품 재고·배송**: 재고/배송 연동 및 맞춤 제작 상품의 청약철회 고지 확인
4. **회원 시스템**: Supabase Auth 도입 (주문내역·상담내역 조회)
5. **관리자**: 상품/주문/리뷰/리드 관리는 Supabase Studio 또는 자체 대시보드

## 라이선스

프로젝트 목적에 맞게 자유롭게 수정해 사용하세요.
