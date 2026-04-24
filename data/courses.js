// 강의 데이터 - 새 강의를 추가하려면 courses 배열에 객체를 추가하세요.
window.COURSES = [
  {
    id: "ai-booking-form",
    slug: "ai-booking-form",
    title: "AI로 만드는 방문예약폼 자동화 마스터클래스",
    subtitle: "코딩 몰라도 OK. 노코드 + ChatGPT로 예약부터 알림톡까지 완전 자동화",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    price: 149000,
    originalPrice: 299000,
    discountLabel: "런칭 특가 50% OFF",
    rating: 4.9,
    students: 1832,
    duration: "총 7시간 38분 · 42개 강의",
    level: "입문 ~ 실무",
    tags: ["AI자동화", "노코드", "예약시스템", "실전"],
    highlights: [
      "방문예약폼을 ChatGPT + 구글폼 + Apps Script로 완전 자동화",
      "카카오 알림톡·문자 자동 발송으로 노쇼율 절반 이하로 감소",
      "예약 데이터를 스프레드시트에 자동 저장 & 대시보드 구축",
      "실제 치과·미용실·부동산·학원 4개 업종 사례 그대로 복제"
    ],
    description: `예약 전화 받다가 하루가 다 가고, 노쇼 때문에 매출이 새는 사장님·마케터를 위한 강의입니다.
AI와 노코드 도구만으로 <b>방문예약 접수 → 일정 확정 → 리마인드 → 재방문 유도</b>까지 전 과정을 자동화하는 방법을 실습 중심으로 알려드립니다.
강의가 끝나면 여러분의 업종에 바로 붙여 쓸 수 있는 예약 자동화 시스템 한 세트를 갖게 됩니다.`,
    curriculum: [
      {
        section: "1부. 왜 지금 AI 예약 자동화인가",
        lectures: [
          { title: "오리엔테이션 & 완성 결과물 미리보기", time: "08:12", preview: true },
          { title: "예약 업무에서 새는 시간과 돈 진단하기", time: "12:30" },
          { title: "자동화로 얻게 되는 3가지 효과", time: "09:48" }
        ]
      },
      {
        section: "2부. 도구 준비 (구글폼 · Apps Script · ChatGPT)",
        lectures: [
          { title: "구글 계정/스프레드시트 세팅", time: "10:05" },
          { title: "ChatGPT 프롬프트 작성 공식", time: "14:21", preview: true },
          { title: "Apps Script 기본 문법 10분 완성", time: "11:50" }
        ]
      },
      {
        section: "3부. 예약폼 만들기 실습",
        lectures: [
          { title: "업종별 예약폼 필드 설계", time: "13:40" },
          { title: "조건부 로직으로 똑똑한 폼 만들기", time: "16:22" },
          { title: "모바일 반응형 디자인 적용", time: "09:30" }
        ]
      },
      {
        section: "4부. 자동화 파이프라인 구축",
        lectures: [
          { title: "예약 접수 → 스프레드시트 자동 저장", time: "15:10" },
          { title: "ChatGPT로 예약 확인 메시지 자동 생성", time: "17:55" },
          { title: "카카오 알림톡 API 연동", time: "20:12" },
          { title: "리마인드 & 노쇼 방지 시퀀스", time: "14:02" }
        ]
      },
      {
        section: "5부. 운영 & 성과 측정",
        lectures: [
          { title: "예약 데이터 대시보드 만들기", time: "13:25" },
          { title: "월 리포트 자동 생성하기", time: "10:08" },
          { title: "4개 업종 템플릿 배포 & 커스터마이징", time: "22:17" }
        ]
      }
    ],
    instructor: {
      name: "김하이 (HiBuilder)",
      title: "AI 자동화 컨설턴트 · 누적 수강생 1.2만명",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      bio: "중소 사업장 200곳 이상의 예약·상담 업무를 AI 자동화로 개선했습니다. 복잡한 개발 지식 없이도 따라 할 수 있도록 강의합니다."
    },
    faqs: [
      { q: "코딩을 전혀 몰라도 따라할 수 있나요?", a: "네. 복사-붙여넣기로 완성할 수 있게 모든 코드를 제공하고, 줄 단위로 해설합니다." },
      { q: "어떤 업종에 활용할 수 있나요?", a: "치과·미용실·학원·부동산·식당·헬스장 등 예약이 필요한 모든 오프라인 업종에서 바로 쓸 수 있습니다." },
      { q: "강의 수강 기간은 어떻게 되나요?", a: "구매 후 평생 소장입니다. 업데이트되는 신규 강의도 무료로 제공됩니다." },
      { q: "환불 정책이 어떻게 되나요?", a: "구매 후 7일 이내, 전체 강의의 10% 미만 수강 시 100% 환불해 드립니다." }
    ]
  },
  {
    id: "ai-chatbot-consult",
    slug: "ai-chatbot-consult",
    title: "AI 상담봇으로 24시간 예약 받는 법",
    subtitle: "채널톡 + ChatGPT로 밤에도 예약이 들어오는 가게 만들기",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    price: 99000,
    originalPrice: 189000,
    discountLabel: "얼리버드 -47%",
    rating: 4.8,
    students: 921,
    duration: "총 4시간 22분 · 26개 강의",
    level: "입문",
    tags: ["챗봇", "AI상담", "채널톡"],
    highlights: [
      "채널톡·카카오채널과 ChatGPT 연동 세팅",
      "업종별 FAQ 데이터로 상담 정확도 90% 이상",
      "상담 → 예약 전환 시나리오 자동화"
    ],
    description: "고객이 궁금한 걸 물어보면 AI가 먼저 답하고, 예약 단계까지 연결해 주는 상담봇을 만들어 봅니다.",
    curriculum: [
      {
        section: "1부. 상담봇 기획",
        lectures: [
          { title: "오리엔테이션", time: "06:30", preview: true },
          { title: "FAQ 수집과 정리", time: "12:08" }
        ]
      },
      {
        section: "2부. 챗봇 구축 실습",
        lectures: [
          { title: "채널톡 연동", time: "15:22" },
          { title: "ChatGPT 프롬프트 설계", time: "18:41" }
        ]
      }
    ],
    instructor: {
      name: "김하이 (HiBuilder)",
      title: "AI 자동화 컨설턴트",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      bio: "상담 자동화로 실제 매장 매출을 30% 이상 끌어올린 사례를 다수 보유."
    },
    faqs: [
      { q: "채널톡 유료 플랜이 필요한가요?", a: "무료 플랜으로도 실습 가능하며, 유료 플랜에서만 되는 기능은 대안을 안내합니다." }
    ]
  },
  {
    id: "ai-marketing-auto",
    slug: "ai-marketing-auto",
    title: "자영업자를 위한 AI 마케팅 자동화 실전",
    subtitle: "블로그 · 인스타 · 문자 마케팅을 AI로 주 1회만에 끝내기",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    price: 129000,
    originalPrice: 219000,
    discountLabel: "-41%",
    rating: 4.7,
    students: 648,
    duration: "총 5시간 15분 · 31개 강의",
    level: "입문 ~ 중급",
    tags: ["마케팅", "AI콘텐츠", "자영업"],
    highlights: [
      "ChatGPT로 블로그·인스타 콘텐츠 30개 한 번에 생산",
      "고객 DB 기반 문자 마케팅 자동 발송",
      "월 단위 마케팅 캘린더 자동화"
    ],
    description: "혼자 운영하는 사장님도 주 1회 관리만으로 온라인 마케팅을 꾸준히 돌릴 수 있게 해 주는 실전 커리큘럼.",
    curriculum: [
      {
        section: "1부. AI 콘텐츠 공장 만들기",
        lectures: [
          { title: "오리엔테이션 & 결과물", time: "07:45", preview: true },
          { title: "브랜드 프롬프트 설계", time: "13:10" }
        ]
      }
    ],
    instructor: {
      name: "김하이 (HiBuilder)",
      title: "AI 자동화 컨설턴트",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      bio: "200곳 이상의 자영업 마케팅을 AI로 자동화해 왔습니다."
    },
    faqs: [
      { q: "유료 AI 도구가 꼭 필요한가요?", a: "대부분 무료로 실습 가능하며, 유료 도구는 옵션입니다." }
    ]
  }
];

// 초기 시드 리뷰 데이터 (localStorage에 저장된 리뷰가 없을 때만 노출)
window.SEED_REVIEWS = {
  "ai-booking-form": [
    { name: "박정은", rating: 5, date: "2026-03-02", text: "정말로 예약 업무가 반으로 줄었어요. 노쇼율이 30% → 9%가 됐습니다. 투자 대비 최고의 강의였어요.", verified: true },
    { name: "이지훈", rating: 5, date: "2026-02-18", text: "코딩 아예 몰랐는데 실습 그대로 따라 하니까 3시간 만에 제 학원용 예약폼이 완성됐네요. 강추!", verified: true },
    { name: "김민서", rating: 4, date: "2026-01-27", text: "카카오 알림톡 연동 파트가 좀 어려웠는데 2번 반복해서 보니 다 됐습니다. Q&A 답변도 빠르고 좋았어요.", verified: true },
    { name: "최하나", rating: 5, date: "2026-01-10", text: "치과 운영하는데 스텝 1명 몫을 AI가 해 주는 느낌이에요. 강의료 한 달만에 뽑았습니다.", verified: true }
  ],
  "ai-chatbot-consult": [
    { name: "홍길동", rating: 5, date: "2026-02-11", text: "밤에 들어오는 문의가 정말로 예약까지 이어지네요. 놀랍습니다.", verified: true }
  ],
  "ai-marketing-auto": [
    { name: "정수영", rating: 5, date: "2026-03-05", text: "블로그 30개 진짜로 하루 만에 썼어요. 구독자 늘어나는 게 보입니다.", verified: true }
  ]
};
