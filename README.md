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

## 실제 서비스 전환 체크리스트

1. **결제**: `assets/js/checkout.js`의 `wireCheckout` 내부를 PG SDK 호출로 교체
2. **리뷰 저장**: `assets/js/main.js`의 `ReviewStore`를 REST API/Firebase 호출로 교체
3. **강의 콘텐츠 영상**: Vimeo/JW Player 등 스트리밍 서비스 연동 후 상세 페이지에 플레이어 삽입
4. **회원 시스템**: 필요 시 Firebase Auth / Supabase Auth 도입
5. **관리자**: 강의/주문/후기 관리 CMS는 Strapi, Supabase Studio, 또는 자체 대시보드

## 라이선스

프로젝트 목적에 맞게 자유롭게 수정해 사용하세요.
