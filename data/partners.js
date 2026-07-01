// 전국 시공 파트너 업체 데이터 (지도 마커용)
// lat/lng 는 지역 대표 좌표 기준. 실제 업체 좌표로 교체해 사용하세요.
window.REGIONS = [
  "전체", "서울", "경기·인천", "강원", "충청", "전라", "경상", "제주"
];

window.PARTNERS = [
  {
    id: "p-seoul-01",
    name: "서울하우징건설",
    region: "서울",
    address: "서울특별시 강동구",
    lat: 37.5301, lng: 127.1238,
    specialty: ["철근콘크리트", "단독주택", "리모델링"],
    rating: 4.9, projects: 128,
    phone: "1600-0000",
    desc: "서울·수도권 단독주택과 상가주택 시공 전문. 설계-시공 일괄 수행."
  },
  {
    id: "p-gimpo-01",
    name: "한강종합건설",
    region: "경기·인천",
    address: "경기도 김포시",
    lat: 37.6152, lng: 126.7156,
    specialty: ["ALC", "목조주택", "전원주택"],
    rating: 4.8, projects: 94,
    phone: "1600-0000",
    desc: "김포·파주·고양 전원주택 시공 다수. ALC·목조 구조 강점."
  },
  {
    id: "p-incheon-01",
    name: "인천퍼스트빌드",
    region: "경기·인천",
    address: "인천광역시 서구",
    lat: 37.4563, lng: 126.7052,
    specialty: ["모듈러", "세컨하우스", "증축"],
    rating: 4.7, projects: 61,
    phone: "1600-0000",
    desc: "모듈러·경량 구조 전문. 빠른 공기와 합리적 견적."
  },
  {
    id: "p-chuncheon-01",
    name: "강원우드홈",
    region: "강원",
    address: "강원특별자치도 춘천시",
    lat: 37.8813, lng: 127.7298,
    specialty: ["목조주택", "펜션", "전원주택"],
    rating: 4.9, projects: 77,
    phone: "1600-0000",
    desc: "강원권 목조주택·펜션 시공 전문. 고단열 패시브급 시공 경험 다수."
  },
  {
    id: "p-daejeon-01",
    name: "대전중부건설",
    region: "충청",
    address: "대전광역시 유성구",
    lat: 36.3624, lng: 127.3565,
    specialty: ["철근콘크리트", "상가주택", "다가구"],
    rating: 4.6, projects: 83,
    phone: "1600-0000",
    desc: "충청권 다가구·상가주택 시공. 사업성 검토부터 준공까지 지원."
  },
  {
    id: "p-cheongju-01",
    name: "청주그린하우징",
    region: "충청",
    address: "충청북도 청주시",
    lat: 36.6424, lng: 127.4890,
    specialty: ["목조주택", "ALC", "전원주택"],
    rating: 4.7, projects: 55,
    phone: "1600-0000",
    desc: "청주·세종 전원주택 전문. 친환경 자재 시공 강점."
  },
  {
    id: "p-gwangju-01",
    name: "광주남부종합건설",
    region: "전라",
    address: "광주광역시 광산구",
    lat: 35.1595, lng: 126.7930,
    specialty: ["철근콘크리트", "단독주택", "리모델링"],
    rating: 4.8, projects: 72,
    phone: "1600-0000",
    desc: "호남권 단독주택·리모델링 시공. 하자보수 사후관리 우수."
  },
  {
    id: "p-jeonju-01",
    name: "전주한옥건축",
    region: "전라",
    address: "전라북도 전주시",
    lat: 35.8242, lng: 127.1480,
    specialty: ["한옥", "목조주택", "전통주택"],
    rating: 4.9, projects: 44,
    phone: "1600-0000",
    desc: "한옥·전통 목구조 시공 전문. 현대식 한옥 설계·시공 다수."
  },
  {
    id: "p-busan-01",
    name: "부산해운대건설",
    region: "경상",
    address: "부산광역시 해운대구",
    lat: 35.1631, lng: 129.1636,
    specialty: ["철근콘크리트", "고급주택", "펜션"],
    rating: 4.8, projects: 101,
    phone: "1600-0000",
    desc: "부산·경남 고급 단독주택과 펜션 시공. 오션뷰 주택 경험 다수."
  },
  {
    id: "p-daegu-01",
    name: "대구영남하우징",
    region: "경상",
    address: "대구광역시 수성구",
    lat: 35.8580, lng: 128.6300,
    specialty: ["ALC", "목조주택", "다가구"],
    rating: 4.6, projects: 68,
    phone: "1600-0000",
    desc: "대구·경북 주택 시공 전문. 예산 맞춤 설계 상담 제공."
  },
  {
    id: "p-pohang-01",
    name: "포항동해건설",
    region: "경상",
    address: "경상북도 포항시",
    lat: 36.0190, lng: 129.3435,
    specialty: ["모듈러", "세컨하우스", "농막"],
    rating: 4.7, projects: 49,
    phone: "1600-0000",
    desc: "경북 동해안권 세컨하우스·모듈러 설치 전문."
  },
  {
    id: "p-jeju-01",
    name: "제주돌담건설",
    region: "제주",
    address: "제주특별자치도 제주시",
    lat: 33.4996, lng: 126.5312,
    specialty: ["목조주택", "펜션", "게스트하우스"],
    rating: 4.9, projects: 58,
    phone: "1600-0000",
    desc: "제주 지역 펜션·게스트하우스·주택 시공. 방풍·염해 대응 시공 노하우."
  }
];
