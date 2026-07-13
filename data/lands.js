// 토지 매물 데이터 (전국 지도 · 체류형 쉼터/주택 부지)
// - jimok(지목): 농지 | 대지 | 임야 | 계획관리
// - canShelter: 체류형 쉼터 설치 가능 여부 (주로 농지)
// - canHouse:   주택 인허가(건축) 가능 여부 (주로 대지/계획관리)
// lat/lng 는 매물 대표 좌표. 실제 매물 좌표로 교체해 사용하세요.
window.LAND_REGIONS = ["전체", "서울", "경기·인천", "강원", "충청", "전라", "경상", "제주"];

// 매물 활용 필터
window.LAND_CAPABILITIES = [
  { key: "all",     label: "전체" },
  { key: "shelter", label: "체류형 쉼터 가능" },
  { key: "house",   label: "주택 인허가 가능" }
];

window.LANDS = [
  {
    id: "land-hongcheon-01",
    title: "홍천 계곡 인접 농지 660㎡",
    region: "강원",
    address: "강원특별자치도 홍천군 서면",
    lat: 37.6970, lng: 127.8887,
    jimok: "농지",
    useZone: "농림지역 (계획관리 인접)",
    areaM2: 660, areaPyeong: 200,
    price: 132000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: false,
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    desc: "계곡과 가까운 평탄한 농지. 체류형 쉼터(데크 포함 33㎡ 이내) 설치에 적합하며 진입로가 확보되어 있습니다.",
    status: "판매중"
  },
  {
    id: "land-yangpyeong-01",
    title: "양평 남향 대지 495㎡",
    region: "경기·인천",
    address: "경기도 양평군 옥천면",
    lat: 37.4917, lng: 127.4874,
    jimok: "대지",
    useZone: "계획관리지역",
    areaM2: 495, areaPyeong: 150,
    price: 385000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: true,
    thumbnail: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    desc: "도로에 접한 남향 대지로 즉시 주택 인허가가 가능합니다. 서울 접근성이 좋아 전원주택 입지로 인기.",
    status: "판매중"
  },
  {
    id: "land-jecheon-01",
    title: "제천 청풍호 조망 농지 991㎡",
    region: "충청",
    address: "충청북도 제천시 청풍면",
    lat: 37.1326, lng: 128.1910,
    jimok: "농지",
    useZone: "생산관리지역",
    areaM2: 991, areaPyeong: 300,
    price: 168000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: false,
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    desc: "청풍호가 내려다보이는 조망 좋은 농지. 세컨하우스용 체류형 쉼터 부지로 추천합니다.",
    status: "판매중"
  },
  {
    id: "land-gurye-01",
    title: "구례 지리산 자락 농지 826㎡",
    region: "전라",
    address: "전라남도 구례군 마산면",
    lat: 35.2024, lng: 127.4629,
    jimok: "농지",
    useZone: "농림지역",
    areaM2: 826, areaPyeong: 250,
    price: 99000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: false,
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    desc: "지리산 자락의 조용한 농지. 귀농·귀촌 및 주말 쉼터용으로 적합하며 가격 경쟁력이 있습니다.",
    status: "판매중"
  },
  {
    id: "land-gapyeong-01",
    title: "가평 계획관리 대지 578㎡",
    region: "경기·인천",
    address: "경기도 가평군 상면",
    lat: 37.8315, lng: 127.5105,
    jimok: "대지",
    useZone: "계획관리지역",
    areaM2: 578, areaPyeong: 175,
    price: 312000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: true,
    thumbnail: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1200&q=80",
    desc: "펜션·전원주택 밀집 지역의 대지. 상수도·전기 인입이 용이해 주택 시공이 수월합니다.",
    status: "판매중"
  },
  {
    id: "land-yangyang-01",
    title: "양양 서핑비치 인근 농지 720㎡",
    region: "강원",
    address: "강원특별자치도 양양군 현남면",
    lat: 38.0754, lng: 128.6190,
    jimok: "농지",
    useZone: "계획관리지역",
    areaM2: 720, areaPyeong: 218,
    price: 245000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: true,
    thumbnail: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?auto=format&fit=crop&w=1200&q=80",
    desc: "서핑 성지 인근으로 세컨하우스 수요가 높은 지역. 계획관리라 주택 인허가도 검토 가능합니다.",
    status: "상담중"
  },
  {
    id: "land-seogwipo-01",
    title: "서귀포 감귤밭 대지 660㎡",
    region: "제주",
    address: "제주특별자치도 서귀포시 남원읍",
    lat: 33.2542, lng: 126.5601,
    jimok: "대지",
    useZone: "계획관리지역",
    areaM2: 660, areaPyeong: 200,
    price: 528000000,
    priceLabel: "매매가",
    canShelter: false, canHouse: true,
    thumbnail: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=80",
    desc: "감귤밭을 낀 제주 대지. 게스트하우스·타운하우스 인허가가 가능한 입지입니다.",
    status: "판매중"
  },
  {
    id: "land-hadong-01",
    title: "하동 섬진강 조망 임야 1,320㎡",
    region: "경상",
    address: "경상남도 하동군 화개면",
    lat: 35.0672, lng: 127.7515,
    jimok: "임야",
    useZone: "계획관리지역",
    areaM2: 1320, areaPyeong: 399,
    price: 176000000,
    priceLabel: "매매가",
    canShelter: true, canHouse: true,
    thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    desc: "섬진강이 보이는 완경사 임야. 개발행위허가를 통해 쉼터·주택 부지로 조성 가능합니다.",
    status: "판매중"
  }
];
