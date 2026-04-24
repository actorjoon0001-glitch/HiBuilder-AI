// 결제 페이지 - 토스페이먼츠 위젯 연동
document.addEventListener('DOMContentLoaded', async () => {
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
  await wireCheckout(course);
});

function renderCheckout(c) {
  document.title = `결제 · ${c.title}`;
  const isTestKey = (window.TOSS_CONFIG?.clientKey || '').startsWith('test_');
  document.getElementById('checkout-root').innerHTML = `
    <div class="container">
      <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.02em;margin:32px 0 8px">수강 신청</h1>
      <p class="muted" style="margin:0 0 24px">아래 정보를 입력하고 결제 수단을 선택해 주세요.</p>
      <div class="checkout-layout">
        <form class="checkout-form" id="checkout-form" novalidate>
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

          <h3 style="font-size:16px;font-weight:800;margin:28px 0 10px">결제 수단</h3>
          <div id="payment-method" style="border:1px solid var(--line);border-radius:10px;overflow:hidden"></div>
          <div id="agreement" style="margin-top:14px"></div>

          <div class="form-group" style="margin-top:18px">
            <label>
              <input type="checkbox" id="c-agree" style="width:auto;margin-right:6px"/>
              <a href="terms.html" target="_blank" style="color:var(--brand)">이용약관</a> ·
              <a href="privacy.html" target="_blank" style="color:var(--brand)">개인정보처리방침</a> ·
              <a href="refund.html" target="_blank" style="color:var(--brand)">환불정책</a>에 동의합니다.
            </label>
          </div>

          <button type="button" id="pay-btn" class="btn btn-primary btn-lg" style="width:100%" disabled>
            결제창 불러오는 중...
          </button>
          ${isTestKey ? `
            <div style="margin-top:12px;padding:12px 14px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px;font-size:13px;color:#9a3412;line-height:1.55">
              <b>🧪 테스트 모드</b> — 실결제가 되지 않습니다. 테스트 카드번호:
              <code style="background:#fff;padding:2px 6px;border-radius:4px">4330-1234-1234-1234</code>
              (만료 임의, CVC 임의)
            </div>
          ` : ''}
          <p class="muted" style="font-size:12.5px;margin-top:12px;line-height:1.6">
            ※ 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
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

async function wireCheckout(c) {
  const clientKey = window.TOSS_CONFIG?.clientKey;
  if (!clientKey || !window.TossPayments) {
    alert('결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  const payBtn = document.getElementById('pay-btn');
  const form = document.getElementById('checkout-form');

  // 익명 고객 키 (브라우저별 1개 유지)
  let customerKey = localStorage.getItem('toss_customer_key');
  if (!customerKey) {
    customerKey = 'anon-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('toss_customer_key', customerKey);
  }

  let widgets;
  try {
    const tossPayments = TossPayments(clientKey);
    widgets = tossPayments.widgets({ customerKey });
    await widgets.setAmount({ currency: 'KRW', value: c.price });
    await Promise.all([
      widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
      widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })
    ]);
  } catch (err) {
    console.error('[Toss] 위젯 초기화 실패', err);
    payBtn.textContent = '결제창을 불러오지 못했습니다';
    return;
  }

  payBtn.disabled = false;
  payBtn.textContent = `${fmtPrice(c.price)} 결제하기`;

  payBtn.addEventListener('click', async () => {
    const name  = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const agree = document.getElementById('c-agree').checked;

    if (!name)                return alert('이름을 입력해 주세요.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert('이메일을 정확히 입력해 주세요.');
    if (phone.replace(/\D/g, '').length < 9) return alert('휴대전화 번호를 정확히 입력해 주세요.');
    if (!agree)               return alert('약관에 동의해 주세요.');

    // 1) 주문 먼저 생성 (status=pending)
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const order = {
      id: orderId, courseId: c.id, courseTitle: c.title,
      name, email, phone, pay: 'toss', price: c.price,
      date: new Date().toISOString()
    };

    payBtn.disabled = true;
    payBtn.textContent = '주문 생성 중...';
    try {
      await OrderStore.save(order);
    } catch (err) {
      console.error(err);
      alert('주문 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      payBtn.disabled = false;
      payBtn.textContent = `${fmtPrice(c.price)} 결제하기`;
      return;
    }

    // 2) 토스페이먼츠 결제 요청 (리다이렉트)
    try {
      await widgets.requestPayment({
        orderId,
        orderName: c.title.length > 100 ? c.title.slice(0, 97) + '...' : c.title,
        customerName: name,
        customerEmail: email,
        customerMobilePhone: phone.replace(/\D/g, ''),
        successUrl: `${location.origin}/success.html?id=${encodeURIComponent(c.id)}`,
        failUrl:    `${location.origin}/checkout.html?id=${encodeURIComponent(c.id)}&failed=1`
      });
    } catch (err) {
      console.error('[Toss] requestPayment 실패', err);
      alert(err?.message || '결제 요청에 실패했습니다.');
      payBtn.disabled = false;
      payBtn.textContent = `${fmtPrice(c.price)} 결제하기`;
    }
  });

  // 결제 실패로 돌아왔을 때 안내
  if (qs('failed') === '1') {
    setTimeout(() => alert('결제가 취소되었거나 실패했습니다. 다시 시도해 주세요.'), 100);
  }
}
