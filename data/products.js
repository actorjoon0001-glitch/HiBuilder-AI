// 상품 데이터 - 건축 자사몰 (주택모델 / 자재 / 가전·가구)
// - category: 'house'(주택모델) | 'material'(자재) | 'appliance'(가전·가구)
// - mode:     'consult'(상담·견적 신청, 결제 없음) | 'purchase'(토스 직접 결제)
// 새 상품을 추가하려면 PRODUCTS 배열에 객체를 추가하세요.

window.CATEGORIES = [
  { key: 'house',     label: '주택모델',   emoji: '🏡', desc: '검증된 주택 모델을 골라 상담·견적을 받아보세요.' },
  { key: 'material',  label: '건축자재',   emoji: '🧱', desc: '마루·창호·단열재·도어까지 시공 자재를 바로 구매.' },
  { key: 'appliance', label: '가전·가구',  emoji: '🛋️', desc: '빌트인 가전과 인테리어 가구를 한 번에.' }
];

window.PRODUCTS = [
  // =====================================================
  // 주택모델 (상담·견적 신청)
  // =====================================================
  {
    id: "house-modern-34",
    category: "house",
    mode: "consult",
    title: "모던 단층 주택 34평형",
    subtitle: "군더더기 없는 박공지붕 라인의 4인 가족 표준 단독주택",
    thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    price: 238000000,
    priceLabel: "예상 시공가 (토지 별도)",
    refPrice: "3.3㎡당 약 690만원",
    discountLabel: "인기 모델",
    rating: 4.9,
    reviews: 42,
    tags: ["단층", "박공지붕", "4인가족", "ALC"],
    highlights: [
      "방 3 · 욕실 2 · 주방/거실 오픈형 34평 표준 평면",
      "고단열 ALC 구조 + 3중 유리 시스템창호 기본 적용",
      "설계·인허가·시공·준공까지 파트너 시공사 원스톱 매칭",
      "옵션으로 다락·테라스·주차 캐노피 추가 가능"
    ],
    description: `합리적인 예산으로 완성도 높은 단독주택을 원하는 분들이 가장 많이 선택하는 대표 모델입니다.
표준 평면을 기반으로 대지 형태와 예산에 맞춰 <b>맞춤 설계</b>가 가능하며, 상담 신청을 남기시면
지역 파트너 시공사와 연결해 현장 실측·정식 견적을 안내해 드립니다.`,
    specs: [
      { group: "규모 · 구조", items: [
        { label: "연면적", value: "112.4㎡ (약 34평)" },
        { label: "구조", value: "ALC 조적 + 경량 목조 지붕" },
        { label: "층수", value: "지상 1층" },
        { label: "방 / 욕실", value: "3개 / 2개" }
      ]},
      { group: "기본 사양", items: [
        { label: "단열", value: "외단열 + 그래스울 R37" },
        { label: "창호", value: "3중 유리 시스템창호 (독일식)" },
        { label: "냉난방", value: "가스보일러 + 시스템에어컨 배관" },
        { label: "예상 공기", value: "착공 후 약 4~5개월" }
      ]}
    ],
    vendor: {
      name: "루밍홈 주택사업부",
      title: "표준주택 모델 · 전국 시공사 네트워크",
      avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=256&q=80",
      bio: "전국 검증된 시공 파트너와 함께 설계부터 준공까지 책임 매칭합니다. 상담은 무료이며 계약은 시공사와 직접 진행합니다."
    },
    faqs: [
      { q: "표시된 금액에 토지가 포함되나요?", a: "아니요. 표시가는 건축 시공가 기준이며 토지·부대비용은 별도입니다. 상담 시 총사업비를 안내해 드립니다." },
      { q: "평면을 바꿀 수 있나요?", a: "네. 표준 평면을 기준으로 대지 조건과 요구사항에 맞춰 맞춤 설계가 가능합니다." },
      { q: "계약은 누구와 하나요?", a: "루밍홈은 모델·자재·시공사 매칭을 담당하고, 시공 계약은 매칭된 파트너 시공사와 직접 체결하십니다." }
    ]
  },
  {
    id: "house-woodframe-42",
    category: "house",
    mode: "consult",
    title: "2층 목조주택 42평형",
    subtitle: "다락과 넓은 거실을 갖춘 프리미엄 경량목구조 주택",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    price: 336000000,
    priceLabel: "예상 시공가 (토지 별도)",
    refPrice: "3.3㎡당 약 800만원",
    discountLabel: "프리미엄",
    rating: 4.8,
    reviews: 27,
    tags: ["2층", "목조", "다락", "고단열"],
    highlights: [
      "1층 공용 · 2층 침실 분리형 42평 2층 평면",
      "북미식 경량목구조(2x6)로 우수한 단열·기밀 성능",
      "층고 높은 거실 + 다락 서비스 면적 활용",
      "패시브급 창호·환기 옵션 선택 가능"
    ],
    description: `가족 구성원의 프라이버시와 넓은 공용 공간을 모두 원하는 분께 추천하는 2층 목조주택입니다.
경량목구조 특유의 따뜻하고 쾌적한 실내 환경이 강점이며, 상담 신청 시 지역 파트너 시공사와 연결해 드립니다.`,
    specs: [
      { group: "규모 · 구조", items: [
        { label: "연면적", value: "138.8㎡ (약 42평)" },
        { label: "구조", value: "경량목구조 (2x6)" },
        { label: "층수", value: "지상 2층 + 다락" },
        { label: "방 / 욕실", value: "4개 / 2개" }
      ]},
      { group: "기본 사양", items: [
        { label: "단열", value: "가등급 단열재 + 기밀시공" },
        { label: "창호", value: "3중 유리 시스템창호" },
        { label: "지붕", value: "리얼징크 / 아스팔트슁글 선택" },
        { label: "예상 공기", value: "착공 후 약 5~6개월" }
      ]}
    ],
    vendor: {
      name: "루밍홈 주택사업부",
      title: "표준주택 모델 · 전국 시공사 네트워크",
      avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=256&q=80",
      bio: "전국 검증된 시공 파트너와 함께 설계부터 준공까지 책임 매칭합니다. 상담은 무료이며 계약은 시공사와 직접 진행합니다."
    },
    faqs: [
      { q: "목조주택은 관리가 어렵지 않나요?", a: "현대 경량목구조는 기밀·방수 시공이 표준화되어 유지관리가 까다롭지 않습니다. 정기 점검 가이드를 함께 제공합니다." },
      { q: "다락도 면적에 포함되나요?", a: "다락은 서비스 면적으로 연면적에 포함되지 않는 경우가 많으며, 지역 조례에 따라 다릅니다. 상담 시 확인해 드립니다." }
    ]
  },
  {
    id: "house-modular-18",
    category: "house",
    mode: "consult",
    title: "모듈러 소형주택 18평형",
    subtitle: "공장 제작 후 현장 설치, 세컨하우스·농막으로 인기",
    thumbnail: "https://images.unsplash.com/photo-1595877244574-e90ce41ce089?auto=format&fit=crop&w=1200&q=80",
    price: 96000000,
    priceLabel: "예상 공급가 (운반·설치 포함)",
    refPrice: "3.3㎡당 약 530만원",
    discountLabel: "빠른 시공",
    rating: 4.7,
    reviews: 61,
    tags: ["모듈러", "세컨하우스", "농막", "단기시공"],
    highlights: [
      "공장에서 80% 제작 → 현장 설치로 공기 대폭 단축",
      "방 2 · 욕실 1 · 주방/거실 컴팩트 18평 구성",
      "세컨하우스·전원주택·농막 용도로 활용",
      "이축·재배치가 가능한 모듈러 구조"
    ],
    description: `짧은 공기와 합리적 예산으로 세컨하우스를 마련하려는 분께 인기 있는 모듈러 주택입니다.
공장 제작 방식이라 날씨 영향이 적고 품질이 균일합니다. 상담 신청 시 부지 조건을 확인해 설치 가능 여부를 안내합니다.`,
    specs: [
      { group: "규모 · 구조", items: [
        { label: "연면적", value: "59.5㎡ (약 18평)" },
        { label: "구조", value: "철골 모듈러 유닛" },
        { label: "층수", value: "지상 1층" },
        { label: "방 / 욕실", value: "2개 / 1개" }
      ]},
      { group: "기본 사양", items: [
        { label: "단열", value: "우레탄 패널 + 그래스울" },
        { label: "설치", value: "크레인 현장 설치 (1~2일)" },
        { label: "옵션", value: "데크 · 처마 · 보조주방" },
        { label: "예상 공기", value: "발주 후 약 6~8주" }
      ]}
    ],
    vendor: {
      name: "루밍홈 주택사업부",
      title: "표준주택 모델 · 전국 시공사 네트워크",
      avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=256&q=80",
      bio: "전국 검증된 시공 파트너와 함께 설계부터 준공까지 책임 매칭합니다. 상담은 무료이며 계약은 시공사와 직접 진행합니다."
    },
    faqs: [
      { q: "농막으로 쓰려면 신고가 필요한가요?", a: "지역·용도에 따라 가설건축물 신고 또는 건축 인허가가 필요할 수 있습니다. 상담 시 안내해 드립니다." }
    ]
  },

  // =====================================================
  // 건축자재 (직접 결제)
  // =====================================================
  {
    id: "mat-flooring-oak",
    category: "material",
    mode: "purchase",
    title: "프리미엄 강마루 (내추럴 오크)",
    subtitle: "생활 스크래치에 강한 표면강화 강마루 · 1박스(1평)",
    thumbnail: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80",
    price: 79000,
    originalPrice: 99000,
    unit: "/ 박스(1평)",
    discountLabel: "-20%",
    rating: 4.8,
    reviews: 214,
    tags: ["강마루", "오크", "표면강화", "친환경"],
    highlights: [
      "표면강화 라미네이트로 눌림·긁힘에 강함",
      "친환경 E0 등급 자재 · 반려동물 가정 적합",
      "클릭 시공 방식으로 셀프 시공도 가능",
      "1박스 = 약 1평(3.3㎡) 시공 분량"
    ],
    description: `공간을 가장 크게 바꾸는 건 바닥입니다. 내추럴 오크 무늬의 프리미엄 강마루로 밝고 따뜻한 실내를 완성하세요.
필요 수량은 시공 면적(평) 기준으로 담아주시면 되고, 시공이 필요하시면 결제 후 지역 시공팀 매칭도 도와드립니다.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "규격", value: "1210 x 145 x 8mm" },
        { label: "표면", value: "표면강화 라미네이트" },
        { label: "포장", value: "1박스 = 약 3.3㎡ (1평)" },
        { label: "친환경", value: "E0 등급" }
      ]}
    ],
    vendor: {
      name: "루밍홈 자재관",
      title: "국내외 검증 브랜드 정품 유통",
      avatar: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=256&q=80",
      bio: "정품 자재만 취급하며 하자 시 교환·환불을 보장합니다. 대량 구매·현장 배송 문의는 고객센터로 연락 주세요."
    },
    faqs: [
      { q: "몇 박스를 주문해야 하나요?", a: "시공 면적(평)만큼 담으시되, 로스율을 감안해 5~10% 여유분을 추천드립니다." },
      { q: "시공도 해주나요?", a: "결제 후 지역 시공팀 매칭을 도와드립니다. 시공비는 별도이며 상담 시 안내됩니다." }
    ]
  },
  {
    id: "mat-window-system",
    category: "material",
    mode: "purchase",
    title: "3중 유리 시스템창호 세트",
    subtitle: "고단열·고기밀 독일식 시스템창호 · 1창(1200x1500 기준)",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    price: 480000,
    originalPrice: 560000,
    unit: "/ 창 1EA",
    discountLabel: "-14%",
    rating: 4.9,
    reviews: 88,
    tags: ["창호", "3중유리", "고단열", "결로방지"],
    highlights: [
      "3중 로이유리 + 아르곤 가스로 열손실 최소화",
      "기밀 가스켓 적용으로 결로·외풍 차단",
      "이중 잠금 하드웨어로 방범성 강화",
      "1200x1500 기준가 · 사이즈별 견적 조정"
    ],
    description: `냉난방비의 상당 부분이 창을 통해 새어 나갑니다. 3중 유리 시스템창호로 사계절 쾌적하고 조용한 실내를 만드세요.
표시가는 표준 사이즈 기준이며, 실측 사이즈에 따라 결제 후 견적이 조정될 수 있습니다.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "유리", value: "3중 로이유리 + 아르곤" },
        { label: "프레임", value: "독일식 6챔버 PVC" },
        { label: "기준 규격", value: "1200 x 1500mm" },
        { label: "열관류율", value: "약 1.0 W/㎡·K" }
      ]}
    ],
    vendor: {
      name: "루밍홈 자재관",
      title: "국내외 검증 브랜드 정품 유통",
      avatar: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=256&q=80",
      bio: "정품 자재만 취급하며 하자 시 교환·환불을 보장합니다. 대량 구매·현장 배송 문의는 고객센터로 연락 주세요."
    },
    faqs: [
      { q: "실측은 어떻게 하나요?", a: "결제 후 시공팀이 현장 실측을 진행하며, 사이즈 변동분은 추가/환불 정산됩니다." }
    ]
  },
  {
    id: "mat-insulation-glasswool",
    category: "material",
    mode: "purchase",
    title: "그래스울 단열재 (가등급)",
    subtitle: "벽체·지붕용 고성능 유리섬유 단열재 · 1롤(약 3.3㎡)",
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    price: 42000,
    originalPrice: 49000,
    unit: "/ 롤",
    discountLabel: "-14%",
    rating: 4.7,
    reviews: 133,
    tags: ["단열재", "그래스울", "가등급", "불연"],
    highlights: [
      "가등급 열전도율로 우수한 단열 성능",
      "불연 성능으로 화재 안전성 확보",
      "벽체·천장·지붕 다용도 시공 가능",
      "1롤 = 약 3.3㎡ 시공 분량"
    ],
    description: `단열은 집의 냉난방비와 쾌적함을 좌우하는 핵심입니다. 가등급 그래스울로 확실한 단열 성능을 확보하세요.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "종류", value: "유리섬유 (그래스울)" },
        { label: "두께", value: "100mm" },
        { label: "단열등급", value: "가등급" },
        { label: "포장", value: "1롤 = 약 3.3㎡" }
      ]}
    ],
    vendor: {
      name: "루밍홈 자재관",
      title: "국내외 검증 브랜드 정품 유통",
      avatar: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=256&q=80",
      bio: "정품 자재만 취급하며 하자 시 교환·환불을 보장합니다. 대량 구매·현장 배송 문의는 고객센터로 연락 주세요."
    },
    faqs: [
      { q: "시공 시 주의사항이 있나요?", a: "시공 시 장갑·마스크 착용을 권장합니다. 방습층과 함께 시공해야 성능이 유지됩니다." }
    ]
  },
  {
    id: "mat-door-abs",
    category: "material",
    mode: "purchase",
    title: "ABS 실내도어 세트 (도어+문틀)",
    subtitle: "변형에 강한 ABS 방문 · 문틀·경첩·손잡이 포함 1세트",
    thumbnail: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    price: 168000,
    originalPrice: 210000,
    unit: "/ 세트",
    discountLabel: "-20%",
    rating: 4.8,
    reviews: 156,
    tags: ["도어", "ABS", "방수", "시공포함옵션"],
    highlights: [
      "습기·변형에 강한 ABS 소재 방문",
      "문틀·경첩·레버 손잡이 포함 풀세트",
      "화이트·그레이·우드 3색 선택",
      "표준 규격 · 교체 시공 간편"
    ],
    description: `오래된 방문만 바꿔도 집 분위기가 확 달라집니다. 변형과 습기에 강한 ABS 도어 풀세트로 손쉽게 교체하세요.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "소재", value: "ABS + 허니컴 코어" },
        { label: "구성", value: "도어 + 문틀 + 경첩 + 레버" },
        { label: "규격", value: "800 x 2100mm (표준)" },
        { label: "색상", value: "화이트 / 그레이 / 우드" }
      ]}
    ],
    vendor: {
      name: "루밍홈 자재관",
      title: "국내외 검증 브랜드 정품 유통",
      avatar: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=256&q=80",
      bio: "정품 자재만 취급하며 하자 시 교환·환불을 보장합니다. 대량 구매·현장 배송 문의는 고객센터로 연락 주세요."
    },
    faqs: [
      { q: "문틀 사이즈가 안 맞으면요?", a: "표준 규격 기준이며, 비표준 개구부는 주문 제작이 가능합니다. 고객센터로 문의 주세요." }
    ]
  },

  // =====================================================
  // 가전·가구 (직접 결제)
  // =====================================================
  {
    id: "app-fridge-builtin",
    category: "appliance",
    mode: "purchase",
    title: "빌트인 냉장고 (양문형 600L)",
    subtitle: "주방 가구와 일체화되는 빌트인 타입 대용량 냉장고",
    thumbnail: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80",
    price: 1890000,
    originalPrice: 2290000,
    unit: "",
    discountLabel: "-17%",
    rating: 4.8,
    reviews: 74,
    tags: ["빌트인", "냉장고", "600L", "1등급"],
    highlights: [
      "주방 가구와 매립되는 빌트인 디자인",
      "600L 대용량 · 4인 가족 이상 적합",
      "에너지효율 1등급으로 전기료 절감",
      "인버터 컴프레서 · 저소음 운전"
    ],
    description: `주방을 깔끔하게 완성하는 빌트인 냉장고입니다. 신축·리모델링 시 가구와 함께 매립해 통일감 있는 주방을 만드세요.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "용량", value: "600L (양문형)" },
        { label: "타입", value: "빌트인 매립형" },
        { label: "에너지효율", value: "1등급" },
        { label: "설치", value: "전문 설치 포함" }
      ]}
    ],
    vendor: {
      name: "루밍홈 리빙관",
      title: "빌트인 가전 · 인테리어 가구 전문",
      avatar: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=256&q=80",
      bio: "신축·리모델링에 맞는 빌트인 가전과 가구를 큐레이션합니다. 설치와 A/S를 함께 안내해 드립니다."
    },
    faqs: [
      { q: "설치비가 포함인가요?", a: "기본 설치가 포함됩니다. 매립 가구 제작이 필요한 경우 별도 견적으로 안내됩니다." }
    ]
  },
  {
    id: "app-ac-system",
    category: "appliance",
    mode: "purchase",
    title: "시스템 에어컨 (천장형 2way)",
    subtitle: "매립형 천장 카세트 · 거실/방 냉난방 겸용 1대",
    thumbnail: "https://images.unsplash.com/photo-1631545806609-27b8b3a4c4c3?auto=format&fit=crop&w=1200&q=80",
    price: 2400000,
    originalPrice: 2800000,
    unit: "/ 1대",
    discountLabel: "-14%",
    rating: 4.7,
    reviews: 39,
    tags: ["시스템에어컨", "천장형", "냉난방", "인버터"],
    highlights: [
      "천장 매립형으로 공간 활용 극대화",
      "냉난방 겸용 인버터로 사계절 사용",
      "정속 대비 낮은 전기료 · 저소음",
      "실내기 1대 기준 · 다실 구성 견적 가능"
    ],
    description: `깔끔한 인테리어를 위한 천장 매립형 시스템 에어컨입니다. 신축·리모델링 배관 작업과 함께 시공하기 좋습니다.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "타입", value: "천장형 2way 카세트" },
        { label: "기능", value: "냉난방 겸용" },
        { label: "구성", value: "실내기 1 + 실외기" },
        { label: "설치", value: "전문 설치 포함 (배관 별도)" }
      ]}
    ],
    vendor: {
      name: "루밍홈 리빙관",
      title: "빌트인 가전 · 인테리어 가구 전문",
      avatar: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=256&q=80",
      bio: "신축·리모델링에 맞는 빌트인 가전과 가구를 큐레이션합니다. 설치와 A/S를 함께 안내해 드립니다."
    },
    faqs: [
      { q: "여러 방에 설치하려면요?", a: "실내기 대수와 실외기 용량에 따라 견적이 달라집니다. 결제 전 고객센터로 상담 주시면 최적 구성을 안내합니다." }
    ]
  },
  {
    id: "app-kitchen-set",
    category: "appliance",
    mode: "purchase",
    title: "주방 상·하부장 세트 (3.6m)",
    subtitle: "인조대리석 상판 + 상·하부장 풀세트 · 3.6m 기준",
    thumbnail: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80",
    price: 3500000,
    originalPrice: 4200000,
    unit: "/ 세트",
    discountLabel: "-17%",
    rating: 4.9,
    reviews: 52,
    tags: ["주방가구", "인조대리석", "빌트인", "맞춤제작"],
    highlights: [
      "인조대리석 상판 + 상·하부장 풀세트",
      "소프트 클로징 경첩·레일 기본 적용",
      "싱크볼·수전 포함, 빌트인 가전 매립 대응",
      "3.6m 기준 · 현장 사이즈 맞춤 제작"
    ],
    description: `주방은 집의 중심입니다. 상판부터 수납까지 완성된 주방 가구 풀세트로 실용적이고 감각적인 주방을 만드세요.
표시가는 3.6m 일자형 기준이며, ㄱ자·ㄷ자 구성이나 사이즈 변경 시 견적이 조정됩니다.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "구성", value: "상부장 + 하부장 + 상판 + 싱크볼" },
        { label: "상판", value: "인조대리석" },
        { label: "기준 규격", value: "일자형 3.6m" },
        { label: "설치", value: "전문 설치 + 맞춤 제작" }
      ]}
    ],
    vendor: {
      name: "루밍홈 리빙관",
      title: "빌트인 가전 · 인테리어 가구 전문",
      avatar: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=256&q=80",
      bio: "신축·리모델링에 맞는 빌트인 가전과 가구를 큐레이션합니다. 설치와 A/S를 함께 안내해 드립니다."
    },
    faqs: [
      { q: "ㄱ자 주방도 가능한가요?", a: "가능합니다. 결제 후 실측을 통해 형태·사이즈에 맞춰 제작하며 차액은 정산됩니다." }
    ]
  },
  {
    id: "app-sofa-fabric",
    category: "appliance",
    mode: "purchase",
    title: "패브릭 3인 소파",
    subtitle: "포근한 구스 필 쿠션의 모던 3인용 패브릭 소파",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    price: 690000,
    originalPrice: 890000,
    unit: "",
    discountLabel: "-22%",
    rating: 4.8,
    reviews: 198,
    tags: ["소파", "패브릭", "3인용", "거실"],
    highlights: [
      "구스 필 쿠션으로 포근한 착좌감",
      "탈부착 커버로 세탁·관리 간편",
      "튼튼한 원목 프레임 구조",
      "라이트그레이·차콜·베이지 3색"
    ],
    description: `거실 분위기를 완성하는 3인용 패브릭 소파입니다. 어떤 인테리어에도 잘 어울리는 모던한 디자인과 편안한 착좌감을 갖췄습니다.`,
    specs: [
      { group: "제품 사양", items: [
        { label: "규격", value: "W2000 x D900 x H850mm" },
        { label: "소재", value: "폴리 패브릭 + 원목 프레임" },
        { label: "쿠션", value: "구스 필 + 고탄성 폼" },
        { label: "색상", value: "라이트그레이 / 차콜 / 베이지" }
      ]}
    ],
    vendor: {
      name: "루밍홈 리빙관",
      title: "빌트인 가전 · 인테리어 가구 전문",
      avatar: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=256&q=80",
      bio: "신축·리모델링에 맞는 빌트인 가전과 가구를 큐레이션합니다. 설치와 A/S를 함께 안내해 드립니다."
    },
    faqs: [
      { q: "배송·설치는 어떻게 되나요?", a: "전국 배송되며 거실 설치까지 진행합니다. 도서산간은 추가 배송비가 발생할 수 있습니다." }
    ]
  }
];

// 초기 시드 리뷰 (Supabase/localStorage에 저장된 리뷰가 없을 때만 노출)
window.SEED_REVIEWS = {
  "house-modern-34": [
    { name: "김도현", rating: 5, date: "2026-04-12", text: "상담부터 시공사 매칭까지 정말 편했어요. 예산 안에서 원하는 집을 지었습니다.", verified: true },
    { name: "이수연", rating: 5, date: "2026-03-20", text: "표준 평면을 우리 대지에 맞게 조정해줘서 만족스러웠습니다. 준공까지 꼼꼼히 챙겨줬어요.", verified: true }
  ],
  "house-woodframe-42": [
    { name: "박준영", rating: 5, date: "2026-02-28", text: "2층 목조로 지었는데 겨울에도 따뜻하고 조용해요. 매칭해준 시공사도 성실했습니다.", verified: true }
  ],
  "house-modular-18": [
    { name: "정하늘", rating: 5, date: "2026-05-02", text: "세컨하우스로 모듈러 주택 설치했는데 정말 빨리 끝났어요. 8주 만에 입주!", verified: true }
  ],
  "mat-flooring-oak": [
    { name: "최민지", rating: 5, date: "2026-05-11", text: "오크 색감이 사진 그대로예요. 셀프로 클릭 시공했는데 생각보다 쉬웠습니다.", verified: true },
    { name: "한지훈", rating: 4, date: "2026-04-18", text: "품질 좋고 배송도 빨랐어요. 여유분 조금 더 시킬 걸 그랬네요.", verified: true }
  ],
  "mat-window-system": [
    { name: "오세영", rating: 5, date: "2026-03-30", text: "창 바꾸고 외풍이 확실히 줄었어요. 결로도 없어졌습니다.", verified: true }
  ],
  "app-fridge-builtin": [
    { name: "서지원", rating: 5, date: "2026-04-25", text: "주방 가구랑 딱 맞게 매립돼서 훨씬 깔끔해졌어요. 설치도 깔끔했습니다.", verified: true }
  ],
  "app-sofa-fabric": [
    { name: "장예린", rating: 5, date: "2026-05-08", text: "착좌감 최고예요. 커버 분리돼서 관리도 편하고 색상도 예뻐요.", verified: true },
    { name: "윤태호", rating: 4, date: "2026-04-02", text: "가성비 좋은 소파입니다. 거실이 확 살아났어요.", verified: true }
  ]
};
