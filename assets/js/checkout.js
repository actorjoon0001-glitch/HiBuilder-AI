// 결제 페이지 (데모 - 실제 PG 연동 전 단계)
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const id = qs('id');
  const course = getCourse(id);
  if (!course) {
    document.getElementById('checkout-root').innerHTML = `
      <div class="container section text-center">
        <h2>강의를 찾을 수 없습니다</h2>
        <a href="index.html" class="btn btn-primary mt-16">홈으로</a>
      </div>`;
    return;
  }
  renderCheckout(course);
  wireCheckout(course);
});

function renderCheckout(c) {
  document.title = `결제 · ${c.title}`;
  document.getElementById('checkout-root').innerHTML = `
    <div class="container">
      <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.02em;margin:32px 0 8px">수강 신청</h1>
      <p class="muted" style="margin:0 0 24px">아래 정보를 입력하시면 수강 등록이 완료됩니다.</p>
      <div class="checkout-layout">
        <form class="checkout-form" id="checkout-form">
          <div class="form-group">
            <label for="c-name">이름</label>
            <input type="text" id="c-name" required placeholder="홍길동"/>
          </div>
          <div class="form-group">
            <label for="c-email">이메일 (수강 안내 발송)</label>
            <input type="email" id="c-email" required placeholder="you@example.com"/>
          </div>
          <div class="form-group">
            <label for="c-phone">휴대전화</label>
            <input type="tel" id="c-phone" required placeholder="010-1234-5678"/>
          </div>
          <div class="form-group">
            <label for="c-pay">결제 수단</label>
            <select id="c-pay">
              <option value="card">신용/체크카드</option>
              <option value="bank">무통장 입금</option>
              <option value="kakao">카카오페이</option>
              <option value="naver">네이버페이</option>
              <option value="toss">토스페이</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="c-agree" style="width:auto;margin-right:6px"/>
              이용약관 · 개인정보처리방침 · 환불정책에 동의합니다.
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%">
            ${fmtPrice(c.price)} 결제하기
          </button>
          <p class="muted" style="font-size:12.5px;margin-top:12px;line-height:1.6">
            ※ 본 페이지는 데모입니다. 실제 결제 PG 연동은 토스페이먼츠/포트원 등으로 교체해 사용하세요.
          </p>
        </form>

        <aside>
          <div class="order-summary">
            <h3 style="font-size:16px;font-weight:800;margin:0 0 14px">주문 요약</h3>
            <div style="display:flex;gap:12px;margin-bottom:16px">
              <div style="width:80px;aspect-ratio:16/9;border-radius:8px;background:url('${c.thumbnail}') center/cover;flex-shrink:0"></div>
              <div style="font-size:14px;font-weight:600;line-height:1.4;color:var(--ink)">${c.title}</div>
            </div>
            <div class="summary-row">
              <span>강의료</span><span>${fmtPrice(c.originalPrice || c.price)}</span>
            </div>
            ${c.originalPrice ? `
              <div class="summary-row" style="color:#b91c1c">
                <span>할인 (${c.discountLabel || ''})</span><span>-${fmtPrice(c.originalPrice - c.price)}</span>
              </div>
            ` : ''}
            <div class="summary-row total">
              <span>최종 결제금액</span><span>${fmtPrice(c.price)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function wireCheckout(c) {
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const agree = document.getElementById('c-agree').checked;
    if (!agree) return alert('약관에 동의해 주세요.');
    const btn = form.querySelector('button[type="submit"]');
    const order = {
      id: 'ORD-' + Date.now(),
      courseId: c.id,
      courseTitle: c.title,
      name: document.getElementById('c-name').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      phone: document.getElementById('c-phone').value.trim(),
      pay: document.getElementById('c-pay').value,
      price: c.price,
      date: new Date().toISOString()
    };
    btn.disabled = true;
    btn.textContent = '결제 처리 중...';
    try {
      await OrderStore.save(order);
      location.href = `success.html?id=${c.id}`;
    } catch (err) {
      console.error(err);
      alert('주문 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btn.textContent = `${fmtPrice(c.price)} 결제하기`;
    }
  });
}
