// 강의 상세페이지 렌더링
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const id = qs('id');
  const course = getCourse(id);
  if (!course) {
    document.getElementById('detail-root').innerHTML = `
      <div class="container section text-center">
        <h2>강의를 찾을 수 없습니다</h2>
        <p class="muted">목록으로 돌아가 주세요.</p>
        <a href="index.html" class="btn btn-primary mt-16">홈으로</a>
      </div>`;
    return;
  }
  document.title = `${course.title} · HiBuilder`;
  renderDetail(course);
  renderReviews(course.id);
  wireReviewForm(course.id);
  wireFaq();
  wireCurriculum();
});

function renderDetail(c) {
  const root = document.getElementById('detail-root');
  const totalLectures = c.curriculum.reduce((s, x) => s + x.lectures.length, 0);
  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <div class="tags">
          ${c.tags.map(t => `<span class="pill">${t}</span>`).join('')}
        </div>
        <h1>${c.title}</h1>
        <p class="sub">${c.subtitle}</p>
        <div class="meta-row">
          <div><b>★ ${c.rating}</b> · 수강생 ${FMT.format(c.students)}명</div>
          <div>${c.duration}</div>
          <div>난이도 · ${c.level}</div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="detail-layout">
        <div class="detail-main">
          <section>
            <h2>이런 걸 배웁니다</h2>
            <ul class="highlight-list">
              ${c.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </section>

          <section>
            <h2>강의 소개</h2>
            <p>${c.description.replace(/\n/g, '<br/>')}</p>
          </section>

          <section>
            <h2>커리큘럼 <span class="muted" style="font-size:14px;font-weight:500">· ${totalLectures}개 강의</span></h2>
            <div class="curriculum">
              ${c.curriculum.map((s, i) => `
                <div class="cu-section ${i === 0 ? 'open' : ''}">
                  <div class="cu-head">
                    <span>${s.section}</span>
                    <span class="count">${s.lectures.length}개 · 펼치기</span>
                  </div>
                  <div class="cu-list" ${i === 0 ? '' : 'style="display:none"'}>
                    ${s.lectures.map(l => `
                      <div class="cu-item">
                        <span>${l.title}${l.preview ? '<span class="pv">맛보기</span>' : ''}</span>
                        <span class="muted">${l.time}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <section>
            <h2>강사 소개</h2>
            <div class="instructor-card">
              <img src="${c.instructor.avatar}" alt="${c.instructor.name}"/>
              <div>
                <div class="name">${c.instructor.name}</div>
                <div class="title">${c.instructor.title}</div>
                <div style="color:var(--ink-2);line-height:1.65;font-size:14.5px">${c.instructor.bio}</div>
              </div>
            </div>
          </section>

          <section id="reviews">
            <h2>수강 후기</h2>
            <div id="review-summary"></div>
            <div class="review-form">
              <h3>후기 남기기</h3>
              <div class="stars-input" id="stars-input">
                <span data-v="1">★</span><span data-v="2">★</span><span data-v="3">★</span><span data-v="4">★</span><span data-v="5">★</span>
              </div>
              <input type="text" id="review-name" placeholder="이름 (예: 홍길동)" maxlength="20"/>
              <textarea id="review-text" placeholder="강의 수강 후 솔직한 후기를 남겨 주세요."></textarea>
              <button class="btn btn-primary" id="submit-review">후기 등록</button>
            </div>
            <div id="review-list"></div>
          </section>

          <section id="faq">
            <h2>자주 묻는 질문</h2>
            ${c.faqs.map(f => `
              <div class="faq-item">
                <div class="faq-q">${f.q}</div>
                <div class="faq-a">${f.a}</div>
              </div>
            `).join('')}
          </section>
        </div>

        <aside>
          <div class="buy-box">
            ${c.discountLabel ? `<span class="dc">${c.discountLabel}</span>` : ''}
            <div class="price-row">
              <span class="price-now">${fmtPrice(c.price)}</span>
              ${c.originalPrice ? `<span class="price-was">${fmtPrice(c.originalPrice)}</span>` : ''}
            </div>
            <a href="checkout.html?id=${c.id}" class="btn btn-primary btn-lg">지금 수강 신청</a>
            <button class="btn btn-ghost btn-lg" onclick="copyLink()">공유하기</button>
            <ul class="features">
              <li>평생 소장 · 업데이트 무료</li>
              <li>${c.duration}</li>
              <li>PC · 모바일 어디서나 수강</li>
              <li>7일 무조건 환불 보장</li>
              <li>강사 Q&A 답변 제공</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `;
}

async function renderReviews(courseId) {
  const list = await ReviewStore.list(courseId);
  const sumEl = document.getElementById('review-summary');
  const listEl = document.getElementById('review-list');
  if (!list.length) {
    sumEl.innerHTML = `<p class="muted">아직 후기가 없습니다. 첫 후기를 남겨 보세요.</p>`;
    listEl.innerHTML = '';
    return;
  }
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
  const dist = [5, 4, 3, 2, 1].map(n => ({
    n, count: list.filter(r => r.rating === n).length
  }));
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

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function wireReviewForm(courseId) {
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
      await ReviewStore.add(courseId, { name, rating, text, verified: false });
      document.getElementById('review-name').value = '';
      document.getElementById('review-text').value = '';
      await renderReviews(courseId);
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

function wireCurriculum() {
  document.querySelectorAll('.curriculum .cu-head').forEach(h => {
    h.addEventListener('click', () => {
      const list = h.nextElementSibling;
      if (!list) return;
      const opened = list.style.display !== 'none';
      list.style.display = opened ? 'none' : 'block';
      h.querySelector('.count').textContent = h.querySelector('.count').textContent.replace(
        opened ? '접기' : '펼치기',
        opened ? '펼치기' : '접기'
      );
    });
  });
}

function wireFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

function copyLink() {
  navigator.clipboard.writeText(location.href).then(() => {
    alert('강의 링크가 복사되었습니다.');
  });
}
