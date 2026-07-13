// 홈 화면 렌더링
document.addEventListener('DOMContentLoaded', () => {
  renderHeader('주택모델');
  renderFooter();
  renderCatNav();
  renderCategoryGrids();
  renderLandTeaser();
  renderPartnerPreview();
  renderFeaturedReviews();
});

function renderLandTeaser() {
  const wrap = document.getElementById('land-teaser-grid');
  if (!wrap) return;
  const top = (window.LANDS || []).slice(0, 3);
  wrap.innerHTML = top.map(l => {
    const caps = [
      l.canShelter ? '<span class="cap-badge shelter">체류형 쉼터 가능</span>' : '',
      l.canHouse ? '<span class="cap-badge house">주택 인허가 가능</span>' : ''
    ].join('');
    return `
    <a class="partner-card land-card" href="lands.html" style="text-decoration:none;color:inherit">
      <div class="land-thumb" style="background-image:url('${l.thumbnail}')">
        <span class="land-status ${l.status === '판매중' ? 'on' : ''}">${escapeHtml(l.status)}</span>
      </div>
      <div class="land-body">
        <div class="pc-head">
          <div>
            <div class="pc-name">${escapeHtml(l.title)}</div>
            <div class="pc-addr">${escapeHtml(l.address)}</div>
          </div>
          <span class="land-price">${fmtMoney(l.price)}</span>
        </div>
        <div class="land-specs">
          <span>지목 ${escapeHtml(l.jimok)}</span>
          <span>${FMT.format(l.areaPyeong)}평</span>
        </div>
        <div class="pc-tags">${caps}</div>
      </div>
    </a>`;
  }).join('');
}

function productCard(p) {
  const isConsult = p.mode === 'consult';
  const priceHtml = isConsult
    ? `<span class="price">${fmtMoney(p.price)}</span><span class="unit"> ~</span>`
    : `${p.originalPrice ? `<span class="original">${fmtPrice(p.originalPrice)}</span>` : ''}<span class="price">${fmtPrice(p.price)}</span>${p.unit ? `<span class="unit"> ${p.unit}</span>` : ''}`;
  return `
    <a class="product-card" href="product.html?id=${p.id}">
      <div class="thumb" style="background-image:url('${p.thumbnail}')">
        ${p.discountLabel ? `<span class="badge">${p.discountLabel}</span>` : ''}
        <span class="badge cat-badge">${categoryLabel(p.category)}</span>
      </div>
      <div class="body">
        <h3>${p.title}</h3>
        <p class="sub">${p.subtitle}</p>
        <div class="meta">
          <div>${priceHtml}</div>
          <div class="rating"><b>★ ${p.rating}</b> (${FMT.format(p.reviews)})</div>
        </div>
        <div class="card-action">${isConsult ? '무료 상담 신청 →' : '바로 구매하기 →'}</div>
      </div>
    </a>
  `;
}

function renderCatNav() {
  const wrap = document.getElementById('cat-nav');
  if (!wrap) return;
  wrap.innerHTML = (window.CATEGORIES || []).map(c => `
    <a class="cat-chip" href="#cat-${c.key}">
      <span class="emoji">${c.emoji}</span>
      <span class="t">
        <b>${c.label}</b>
        <span>${c.desc}</span>
      </span>
    </a>
  `).join('');
}

function renderCategoryGrids() {
  document.querySelectorAll('.product-grid[data-cat]').forEach(grid => {
    const cat = grid.dataset.cat;
    grid.innerHTML = productsByCategory(cat).map(productCard).join('');
  });
}

function renderPartnerPreview() {
  const wrap = document.getElementById('partner-preview');
  if (!wrap) return;
  const top = (window.PARTNERS || []).slice().sort((a, b) => b.rating - a.rating).slice(0, 4);
  wrap.innerHTML = top.map(p => `
    <a class="partner-mini" href="partners.html">
      <div>
        <b>${p.name}</b>
        <span>${p.address} · ${p.specialty.slice(0, 2).join(', ')}</span>
      </div>
      <span class="pr">★ ${p.rating}</span>
    </a>
  `).join('');
}

async function renderFeaturedReviews() {
  const wrap = document.getElementById('featured-reviews');
  if (!wrap) return;
  const pooled = [];
  for (const p of (window.PRODUCTS || [])) {
    const revs = await ReviewStore.list(p.id);
    revs.slice(0, 1).forEach(r => pooled.push({ ...r, productTitle: p.title, productId: p.id }));
  }
  const pick = pooled.sort((a, b) => b.rating - a.rating).slice(0, 3);
  if (!pick.length) { wrap.innerHTML = '<p class="muted">아직 후기가 없습니다.</p>'; return; }
  wrap.innerHTML = pick.map(r => `
    <div class="product-card" style="padding:22px;cursor:default">
      <div style="color:var(--warning);font-size:16px;margin-bottom:8px">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p style="font-size:15px;line-height:1.6;color:var(--ink);margin:0 0 14px">"${escapeHtml(r.text)}"</p>
      <div style="font-size:13px;color:var(--muted)">
        <b style="color:var(--ink)">${escapeHtml(r.name)}</b> · <a href="product.html?id=${r.productId}" style="color:var(--brand);text-decoration:none">${escapeHtml(r.productTitle)}</a>
      </div>
    </div>
  `).join('');
}
