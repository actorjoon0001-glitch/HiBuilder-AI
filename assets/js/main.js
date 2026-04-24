// 공용 유틸 - 헤더/푸터/렌더 공통 로직
const FMT = new Intl.NumberFormat('ko-KR');
const fmtPrice = n => FMT.format(n) + '원';

function renderHeader(active) {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <header class="site-header">
      <div class="container inner">
        <a href="index.html" class="logo">
          <span class="logo-badge">H</span>
          <span>HiBuilder</span>
        </a>
        <nav>
          <ul class="nav-links">
            <li><a href="index.html#courses" ${active === 'courses' ? 'style="color:var(--brand)"' : ''}>전체 강의</a></li>
            <li><a href="index.html#features">특장점</a></li>
            <li><a href="index.html#reviews">수강 후기</a></li>
            <li><a href="index.html#faq">자주 묻는 질문</a></li>
          </ul>
        </nav>
        <a href="index.html#courses" class="btn btn-primary">강의 보러가기</a>
      </div>
    </header>
  `;
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div>
          <a href="index.html">회사소개</a>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">환불정책</a>
          <a href="#">고객센터</a>
        </div>
        <div class="biz">
          HiBuilder · 대표 김하이 · 사업자등록번호 000-00-00000<br/>
          통신판매업신고 제0000-서울강남-0000호 · 이메일 help@hibuilder.ai<br/>
          © ${new Date().getFullYear()} HiBuilder. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}

function starRow(n, size) {
  const full = Math.round(n);
  const s = size || '';
  return `<span class="stars" style="${s ? 'font-size:' + s : ''}">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span>`;
}

function getCourse(id) {
  return (window.COURSES || []).find(c => c.id === id || c.slug === id);
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

// 리뷰 저장소 - 현재는 localStorage를 쓰고, 추후 백엔드로 교체 시 이 네 함수만 바꿔 주면 됩니다.
const ReviewStore = {
  key: courseId => `reviews::${courseId}`,
  list(courseId) {
    const local = JSON.parse(localStorage.getItem(this.key(courseId)) || 'null');
    if (local && local.length) return local;
    return (window.SEED_REVIEWS && window.SEED_REVIEWS[courseId]) || [];
  },
  add(courseId, review) {
    const current = JSON.parse(localStorage.getItem(this.key(courseId)) || 'null')
      || ((window.SEED_REVIEWS && window.SEED_REVIEWS[courseId]) || []).slice();
    current.unshift(review);
    localStorage.setItem(this.key(courseId), JSON.stringify(current));
    return current;
  }
};

// 주문 저장소
const OrderStore = {
  key: 'orders',
  save(order) {
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    list.unshift(order);
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  last() {
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    return list[0];
  }
};
