// 공용 유틸 - 헤더/푸터/렌더 공통 로직
const FMT = new Intl.NumberFormat('ko-KR');
const fmtPrice = n => FMT.format(n) + '원';

// 큰 금액을 "2억 3,800만원" 형태로
function fmtMoney(n) {
  n = Number(n) || 0;
  if (n >= 100000000) {
    const eok = Math.floor(n / 100000000);
    const man = Math.round((n % 100000000) / 10000);
    return `${FMT.format(eok)}억${man ? ' ' + FMT.format(man) + '만' : ''}원`;
  }
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    const rest = n % 10000;
    return `${FMT.format(man)}만${rest ? ' ' + FMT.format(rest) : ''}원`;
  }
  return fmtPrice(n);
}

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

const NAV_ITEMS = [
  { href: 'index.html#cat-house',     label: '주택모델' },
  { href: 'index.html#cat-material',  label: '건축자재' },
  { href: 'index.html#cat-appliance', label: '가전·가구' },
  { href: 'partners.html',            label: '전국 시공업체' },
  { href: 'index.html#how',           label: '이용방법' }
];

function renderHeader(active) {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <header class="site-header">
      <div class="container inner">
        <a href="index.html" class="logo">
          <span class="logo-badge">H</span>
          <span>HiBuilder <span style="color:var(--muted);font-weight:600;font-size:13px">by 루밍홈</span></span>
        </a>
        <nav>
          <ul class="nav-links">
            ${NAV_ITEMS.map(n => `<li><a href="${n.href}" ${active === n.label ? 'style="color:var(--brand)"' : ''}>${n.label}</a></li>`).join('')}
          </ul>
        </nav>
        <a href="partners.html" class="btn btn-primary">시공 상담받기</a>
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
          <a href="partners.html">전국 시공업체</a>
          <a href="terms.html">이용약관</a>
          <a href="privacy.html"><b style="color:#e2e8f0">개인정보처리방침</b></a>
          <a href="refund.html">교환·환불정책</a>
          <a href="mailto:harold0001@naver.com">고객센터</a>
        </div>
        <div class="biz">
          상호 <b style="color:#cbd5e1">루밍홈</b> · 대표 이상준 · 사업자등록번호 474-23-01704<br/>
          통신판매업신고 제2025-경기김포-8673호 · 사업장 경기도 김포시 김포한강7로22번길 174-99 201호<br/>
          고객센터 010-8329-8049 · 이메일 <a href="mailto:harold0001@naver.com" style="color:#cbd5e1">harold0001@naver.com</a><br/>
          서비스 브랜드: HiBuilder · © ${new Date().getFullYear()} 루밍홈. All rights reserved.<br/>
          <span style="color:#475569">※ 루밍홈은 자재·가전·가구를 직접 판매하며, 주택 시공은 검증된 파트너 시공사를 중개·매칭합니다. 시공 계약은 고객과 시공사 간에 체결됩니다.</span>
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

function getProduct(id) {
  return (window.PRODUCTS || []).find(p => p.id === id);
}
function productsByCategory(key) {
  return (window.PRODUCTS || []).filter(p => p.category === key);
}
function categoryLabel(key) {
  return (window.CATEGORIES || []).find(c => c.key === key)?.label || key;
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// =====================================================
// 리뷰 저장소 (Supabase ↔ localStorage fallback)
//  · DB 컬럼명은 기존 결제 연동 유지를 위해 course_id 를 그대로 사용하되,
//    값으로는 상품 id(product id)를 저장합니다.
// =====================================================
const ReviewStore = {
  key: productId => `reviews::${productId}`,

  async list(productId) {
    if (SB.enabled) {
      const { data, error } = await SB.client
        .from('reviews')
        .select('name, rating, text, verified, created_at')
        .eq('course_id', productId)
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
        if (rows.length) return rows;
      }
    }
    const local = JSON.parse(localStorage.getItem(this.key(productId)) || 'null');
    if (local && local.length) return local;
    return (window.SEED_REVIEWS && window.SEED_REVIEWS[productId]) || [];
  },

  async add(productId, review) {
    if (SB.enabled) {
      const { error } = await SB.client.from('reviews').insert({
        course_id: productId,
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
    const current = JSON.parse(localStorage.getItem(this.key(productId)) || 'null')
      || ((window.SEED_REVIEWS && window.SEED_REVIEWS[productId]) || []).slice();
    current.unshift({ ...review, date: new Date().toISOString().slice(0, 10) });
    localStorage.setItem(this.key(productId), JSON.stringify(current));
  }
};

// =====================================================
// 주문 저장소 (Supabase ↔ localStorage fallback)
//  · 자재·가전·가구 직접 결제용. DB 컬럼(course_id/course_title)은 그대로 두고
//    상품 id/title 을 저장 → 기존 토스 승인 Function 을 수정 없이 재사용합니다.
// =====================================================
const OrderStore = {
  key: 'orders',

  async save(order) {
    if (SB.enabled) {
      const { error } = await SB.client.from('orders').insert({
        order_no:     order.id,
        course_id:    order.productId,
        course_title: order.productTitle,
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
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    list.unshift(order);
    localStorage.setItem(this.key, JSON.stringify(list));
  },

  last() {
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    return list[0];
  }
};

// =====================================================
// 상담·견적 신청(리드) 저장소 (Supabase ↔ localStorage fallback)
//  · 주택모델 상담, 시공업체 매칭 신청에 사용.
// =====================================================
const LeadStore = {
  key: 'leads',

  async save(lead) {
    if (SB.enabled) {
      const { error } = await SB.client.from('leads').insert({
        kind:        lead.kind,          // 'house' | 'partner'
        target_id:   lead.targetId,      // 상품 id 또는 업체 id
        target_name: lead.targetName,
        name:        lead.name,
        phone:       lead.phone,
        region:      lead.region || null,
        message:     lead.message || null
      });
      if (error) {
        console.warn('[leads.save] Supabase 오류, 로컬에만 저장:', error.message);
      }
    }
    const list = JSON.parse(localStorage.getItem(this.key) || '[]');
    list.unshift({ ...lead, date: new Date().toISOString() });
    localStorage.setItem(this.key, JSON.stringify(list));
  }
};
