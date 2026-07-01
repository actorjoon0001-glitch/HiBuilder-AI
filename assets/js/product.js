// 상품 상세페이지 렌더링 (자재/가전가구=결제, 주택모델=상담 신청)
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const id = qs('id');
  const product = getProduct(id);
  if (!product) {
    document.getElementById('detail-root').innerHTML = `
      <div class="container section text-center">
        <h2>상품을 찾을 수 없습니다</h2>
        <p class="muted">목록으로 돌아가 주세요.</p>
        <a href="index.html" class="btn btn-primary mt-16">홈으로</a>
      </div>`;
    return;
  }
  document.title = `${product.title} · HiBuilder`;
  renderDetail(product);
  renderReviews(product.id);
  wireReviewForm(product.id);
  wireFaq();
  wireSpecs();
  if (product.mode === 'consult') wireLeadForm(product);
});

function renderDetail(p) {
  const isConsult = p.mode === 'consult';
  const root = document.getElementById('detail-root');
  const specCount = (p.specs || []).reduce((s, x) => s + x.items.length, 0);

  const buyBox = isConsult ? `
    <div class="buy-box">
      <span class="dc">${p.discountLabel || '주택모델'}</span>
      <div class="price-row">
        <span class="price-now">${fmtMoney(p.price)}~</span>
      </div>
      <div class="muted" style="font-size:13px;margin-bottom:4px">${p.priceLabel || '예상 시공가'}</div>
      ${p.refPrice ? `<div class="muted" style="font-size:13px;margin-bottom:14px">${p.refPrice}</div>` : ''}
      <a href="#lead" class="btn btn-primary btn-lg">무료 상담·견적 신청</a>
      <a href="partners.html" class="btn btn-ghost btn-lg">전국 시공업체 보기</a>
      <ul class="features">
        <li>상담·견적 무료</li>
        <li>지역 파트너 시공사 매칭</li>
        <li>맞춤 설계 상담 가능</li>
        <li>설계~준공 원스톱 안내</li>
      </ul>
    </div>` : `
    <div class="buy-box">
      ${p.discountLabel ? `<span class="dc">${p.discountLabel}</span>` : ''}
      <div class="price-row">
        <span class="price-now">${fmtPrice(p.price)}</span>
        ${p.originalPrice ? `<span class="price-was">${fmtPrice(p.originalPrice)}</span>` : ''}
      </div>
      ${p.unit ? `<div class="muted" style="font-size:13px;margin-bottom:14px">${p.unit}</div>` : ''}
      <a href="checkout.html?id=${p.id}" class="btn btn-primary btn-lg">바로 구매하기</a>
      <button class="btn btn-ghost btn-lg" onclick="copyLink()">공유하기</button>
      <ul class="features">
        <li>정품 · 하자 시 교환·환불 보장</li>
        <li>전국 배송</li>
        <li>시공팀 매칭 상담 가능</li>
        <li>토스페이먼츠 안전결제</li>
      </ul>
    </div>`;

  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <div class="tags">
          <span class="pill">${categoryLabel(p.category)}</span>
          ${p.tags.map(t => `<span class="pill">${t}</span>`).join('')}
        </div>
        <h1>${p.title}</h1>
        <p class="sub">${p.subtitle}</p>
        <div class="meta-row">
          <div><b>★ ${p.rating}</b> · 후기 ${FMT.format(p.reviews)}개</div>
          <div>${isConsult ? (p.priceLabel || '예상 시공가') : '자사몰 직접 판매'}</div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="detail-layout">
        <div class="detail-main">
          <section>
            <h2>주요 특징</h2>
            <ul class="highlight-list">
              ${p.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </section>

          <section>
            <h2>상품 소개</h2>
            <p>${p.description.replace(/\n/g, '<br/>')}</p>
          </section>

          <section>
            <h2>${isConsult ? '모델 사양' : '제품 사양'} <span class="muted" style="font-size:14px;font-weight:500">· ${specCount}개 항목</span></h2>
            <div class="curriculum">
              ${(p.specs || []).map((s, i) => `
                <div class="cu-section ${i === 0 ? 'open' : ''}">
                  <div class="cu-head">
                    <span>${s.group}</span>
                    <span class="count">${s.items.length}개 · 펼치기</span>
                  </div>
                  <div class="cu-list" ${i === 0 ? '' : 'style="display:none"'}>
                    ${s.items.map(it => `
                      <div class="cu-item">
                        <span>${it.label}</span>
                        <span class="muted">${it.value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          ${isConsult ? `
          <section id="lead">
            <h2>무료 상담·견적 신청</h2>
            <p class="muted" style="margin-bottom:16px">연락처를 남겨 주시면 지역 파트너 시공사와 연결해 정식 견적을 안내해 드립니다. 상담은 무료입니다.</p>
            <div class="lead-form">
              <div class="form-group">
                <label for="lead-name">이름</label>
                <input type="text" id="lead-name" placeholder="홍길동"/>
              </div>
              <div class="form-group">
                <label for="lead-phone">연락처</label>
                <input type="tel" id="lead-phone" placeholder="010-1234-5678"/>
              </div>
              <div class="form-group">
                <label for="lead-region">희망 지역</label>
                <input type="text" id="lead-region" placeholder="예: 경기 김포시"/>
              </div>
              <div class="form-group">
                <label for="lead-message">문의 내용 (선택)</label>
                <textarea id="lead-message" placeholder="대지 조건, 예산, 희망 시기 등을 적어주시면 상담이 빨라집니다."></textarea>
              </div>
              <button class="btn btn-primary btn-lg" id="lead-submit" style="width:100%">상담 신청하기</button>
              <p class="muted" style="font-size:12.5px;margin-top:10px">신청 시 <a href="privacy.html" target="_blank" style="color:var(--brand)">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.</p>
            </div>
          </section>
          ` : ''}

          <section>
            <h2>${isConsult ? '주관' : '판매/브랜드'}</h2>
            <div class="instructor-card">
              <img src="${p.vendor.avatar}" alt="${p.vendor.name}"/>
              <div>
                <div class="name">${p.vendor.name}</div>
                <div class="title">${p.vendor.title}</div>
                <div style="color:var(--ink-2);line-height:1.65;font-size:14.5px">${p.vendor.bio}</div>
              </div>
            </div>
          </section>

          <section id="reviews">
            <h2>고객 후기</h2>
            <div id="review-summary"></div>
            <div class="review-form">
              <h3>후기 남기기</h3>
              <div class="stars-input" id="stars-input">
                <span data-v="1">★</span><span data-v="2">★</span><span data-v="3">★</span><span data-v="4">★</span><span data-v="5">★</span>
              </div>
              <input type="text" id="review-name" placeholder="이름 (예: 홍길동)" maxlength="20"/>
              <textarea id="review-text" placeholder="구매/시공 후 솔직한 후기를 남겨 주세요."></textarea>
              <button class="btn btn-primary" id="submit-review">후기 등록</button>
            </div>
            <div id="review-list"></div>
          </section>

          <section id="faq">
            <h2>자주 묻는 질문</h2>
            ${p.faqs.map(f => `
              <div class="faq-item">
                <div class="faq-q">${f.q}</div>
                <div class="faq-a">${f.a}</div>
              </div>
            `).join('')}
          </section>
        </div>

        <aside>${buyBox}</aside>
      </div>
    </div>
  `;
}

async function renderReviews(productId) {
  const list = await ReviewStore.list(productId);
  const sumEl = document.getElementById('review-summary');
  const listEl = document.getElementById('review-list');
  if (!list.length) {
    sumEl.innerHTML = `<p class="muted">아직 후기가 없습니다. 첫 후기를 남겨 보세요.</p>`;
    listEl.innerHTML = '';
    return;
  }
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
  const dist = [5, 4, 3, 2, 1].map(n => ({ n, count: list.filter(r => r.rating === n).length }));
  const max = Math.max(...dist.map(d => d.count), 1);
  sumEl.innerHTML = `
    <div class="review-summary">
      <div>
        <div class="big-score">${avg.toFixed(1)}</div>
        <div class="stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</div>
        <div class="total">총 ${list.length}개 후기</div>
      </div>
      <div>
        ${dist.map(d => `
          <div class="bar-row">
            <span style="width:30px">${d.n}점</span>
            <div class="bar"><div class="fill" style="width:${(d.count / max) * 100}%"></div></div>
            <span style="width:30px;text-align:right">${d.count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  listEl.innerHTML = list.map(r => `
    <div class="review-item">
      <div class="head">
        <span class="name">${escapeHtml(r.name)}</span>
        ${r.verified ? '<span class="verified">구매 확인</span>' : ''}
        <span class="date">${r.date}</span>
      </div>
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <div class="text">${escapeHtml(r.text)}</div>
    </div>
  `).join('');
}

function wireReviewForm(productId) {
  let rating = 5;
  const starsEl = document.getElementById('stars-input');
  const setStars = v => {
    rating = v;
    starsEl.querySelectorAll('span').forEach(s => {
      s.classList.toggle('active', Number(s.dataset.v) <= v);
    });
  };
  setStars(5);
  starsEl.querySelectorAll('span').forEach(s => {
    s.addEventListener('click', () => setStars(Number(s.dataset.v)));
  });
  const btn = document.getElementById('submit-review');
  btn.addEventListener('click', async () => {
    const name = document.getElementById('review-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    if (!name) return alert('이름을 입력해 주세요.');
    if (text.length < 10) return alert('후기는 최소 10자 이상 작성해 주세요.');
    btn.disabled = true;
    btn.textContent = '등록 중...';
    try {
      await ReviewStore.add(productId, { name, rating, text, verified: false });
      document.getElementById('review-name').value = '';
      document.getElementById('review-text').value = '';
      await renderReviews(productId);
      alert('후기가 등록되었습니다. 감사합니다!');
    } catch (e) {
      alert('후기 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = '후기 등록';
    }
  });
}

function wireLeadForm(product) {
  const btn = document.getElementById('lead-submit');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const name    = document.getElementById('lead-name').value.trim();
    const phone   = document.getElementById('lead-phone').value.trim();
    const region  = document.getElementById('lead-region').value.trim();
    const message = document.getElementById('lead-message').value.trim();
    if (!name) return alert('이름을 입력해 주세요.');
    if (phone.replace(/\D/g, '').length < 9) return alert('연락처를 정확히 입력해 주세요.');
    btn.disabled = true;
    btn.textContent = '신청 중...';
    try {
      await LeadStore.save({
        kind: 'house', targetId: product.id, targetName: product.title,
        name, phone, region, message
      });
      alert('상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다. 감사합니다!');
      ['lead-name', 'lead-phone', 'lead-region', 'lead-message'].forEach(id => document.getElementById(id).value = '');
    } catch (e) {
      console.error(e);
      alert('상담 신청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      btn.disabled = false;
      btn.textContent = '상담 신청하기';
    }
  });
}

function wireSpecs() {
  document.querySelectorAll('.curriculum .cu-head').forEach(h => {
    h.addEventListener('click', () => {
      const list = h.nextElementSibling;
      if (!list) return;
      const opened = list.style.display !== 'none';
      list.style.display = opened ? 'none' : 'block';
      const c = h.querySelector('.count');
      c.textContent = c.textContent.replace(opened ? '접기' : '펼치기', opened ? '펼치기' : '접기');
    });
  });
}

function wireFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => item.classList.toggle('open'));
  });
}

function copyLink() {
  navigator.clipboard.writeText(location.href).then(() => alert('상품 링크가 복사되었습니다.'));
}
