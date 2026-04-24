// 공용 유틸 - 헤더/푸터/렌더 공통 로직
const FMT = new Intl.NumberFormat('ko-KR');
const fmtPrice = n => FMT.format(n) + '원';

// =====================================================
// Supabase 초기화 (설정이 비어 있으면 localStorage fallback)
// =====================================================
const SB = (() => {
  const cfg = window.SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase) {
    return { enabled: false, client: null };
  }
  try {
    const client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: false }
    });
    return { enabled: true, client };
  } catch (e) {
    console.warn('[Supabase] 초기화 실패, localStorage fallback으로 동작합니다.', e);
    return { enabled: false, client: null };
  }
})();

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
        ${!SB.enabled ? `<div class="biz" style="color:#f59e0b;margin-top:10px">⚠ Supabase 미설정 — 현재 로컬(localStorage) 모드로 동작 중</div>` : ''}
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

// =====================================================
// 리뷰 저장소 (Supabase ↔ localStorage fallback)
// =====================================================
const ReviewStore = {
  key: courseId => `reviews::${courseId}`,

  async list(courseId) {
    if (SB.enabled) {
      const { data, error } = await SB.client
        .from('reviews')
        .select('name, rating, text, verified, created_at')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) {
        console.warn('[reviews.list] Supabase 오류, 로컬 fallback:', error.message);
      } else {
        const rows = (data || []).map(r => ({
          name: r.name,
          rating: r.rating,
          text: r.text,
          verified: r.verified,
          date: (r.created_at || '').slice(0, 10)
        }));
        // 초기엔 비어있을 수 있으니 시드 리뷰도 합쳐서 보여줌(서버에 이미 동일건이 있다면 중복될 수 있어 서버 우선)
        if (rows.length) return rows;
      }
    }
    const local = JSON.parse(localStorage.getItem(this.key(courseId)) || 'null');
    if (local && local.length) return local;
    return (window.SEED_REVIEWS && window.SEED_REVIEWS[courseId]) || [];
  },

  async add(courseId, review) {
    if (SB.enabled) {
      const { error } = await SB.client.from('reviews').insert({
        course_id: courseId,
        name:      review.name,
        rating:    review.rating,
        text:      review.text,
        verified:  false
      });
      if (error) {
        console.warn('[reviews.add] Supabase 오류, 로컬에만 저장:', error.message);
      } else {
        return;
      }
    }
    const current = JSON.parse(localStorage.getItem(this.key(courseId)) || 'null')
      || ((window.SEED_REVIEWS && window.SEED_REVIEWS[courseId]) || []).slice();
    current.unshift({ ...review, date: new Date().toISOString().slice(0, 10) });
    localStorage.setItem(this.key(courseId), JSON.stringify(current));
  }
};

// =====================================================
// 주문 저장소 (Supabase ↔ localStorage fallback)
// =====================================================
const OrderStore = {
  key: 'orders',

  async save(order) {
    if (SB.enabled) {
      const { error } = await SB.client.from('orders').insert({
        order_no:     order.id,
        course_id:    order.courseId,
        course_title: order.courseTitle,
        name:         order.name,
        email:        order.email,
        phone:        order.phone,
        pay_method:   order.pay,
        price:        order.price,
        status:       'pending'
      });
      if (error) {
        console.warn('[orders.save] Supabase 오류, 로컬에만 저장:', error.message);
      }
    }
    // 완료 페이지에서 즉시 보여줘야 하므로 로컬에도 항상 저장
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    list.unshift(order);
    localStorage.setItem(this.key, JSON.stringify(list));
  },

  last() {
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    return list[0];
  }
};
