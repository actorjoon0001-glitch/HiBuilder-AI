// 결제 완료 페이지 - 토스에서 돌아오면 paymentKey/orderId/amount 를 서버로 보내 승인 확정
document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  const id = qs('id');
  const course = getCourse(id);

  const paymentKey = qs('paymentKey');
  const orderId    = qs('orderId');
  const amount     = qs('amount');

  const root = document.getElementById('success-root');

  // 토스에서 돌아온 경우: 서버 승인 호출
  if (paymentKey && orderId && amount) {
    renderPending(root, course);
    try {
      const resp = await fetch('/.netlify/functions/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data.status !== 'paid') {
        return renderError(root, course, data.error || '결제 승인에 실패했습니다.');
      }
      // 결제 완료된 이메일을 '인증 이메일'로 저장 → 수강 페이지에서 자동 인증
      const order = OrderStore.last();
      if (order?.email) {
        localStorage.setItem('verified_email', order.email);
      }
      if (typeof window.track === 'function') {
        window.track('Purchase', {
          value:    Number(amount),
          currency: 'KRW',
          transaction_id: orderId,
          items: course ? [{ id: course.id, name: course.title, price: course.price }] : []
        });
      }
      renderSuccess(root, course, { orderId, amount, method: data.method });
    } catch (err) {
      console.error(err);
      renderError(root, course, '결제 승인 중 통신 오류가 발생했습니다.');
    }
    return;
  }

  // 직접 방문한 경우 (로컬 주문 정보 기반 간이 화면)
  const order = OrderStore.last();
  renderSuccess(root, course, { orderId: order?.id, amount: course?.price });
});

function renderPending(root, course) {
  root.innerHTML = `
    <div class="container">
      <div class="success-box">
        <div class="check" style="background:#e0e7ff;color:var(--brand)">⋯</div>
        <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">결제를 확인하고 있어요</h1>
        <p class="muted">잠시만 기다려 주세요. 창을 닫지 마세요.</p>
        ${course ? `<p class="muted" style="margin-top:10px">${course.title}</p>` : ''}
      </div>
    </div>
  `;
}

function renderSuccess(root, course, info) {
  root.innerHTML = `
    <div class="container">
      <div class="success-box">
        <div class="check">✓</div>
        <h1 style="font-size:24px;font-weight:800;margin:0 0 8px">결제가 완료되었습니다</h1>
        <p class="muted" style="margin:0 0 22px">수강 안내 메일을 보내드렸어요.</p>
        ${course ? `
          <div style="text-align:left;padding:16px;border:1px solid var(--line);border-radius:10px;background:var(--bg);margin-bottom:22px">
            <div style="font-size:13px;color:var(--muted);margin-bottom:4px">주문번호: ${info?.orderId || '-'}</div>
            <div style="font-weight:700">${course.title}</div>
            <div style="margin-top:6px;color:var(--ink-2)">
              ${info?.amount ? fmtPrice(Number(info.amount)) : fmtPrice(course.price)}
              ${info?.method ? ` · ${info.method}` : ''}
            </div>
          </div>
        ` : ''}
        <a href="lecture.html?id=${course ? course.id : ''}" class="btn btn-primary btn-lg">강의 바로 수강하기</a>
        <a href="index.html" class="btn btn-ghost btn-lg" style="margin-top:8px">홈으로 돌아가기</a>
      </div>
    </div>
  `;
}

function renderError(root, course, message) {
  root.innerHTML = `
    <div class="container">
      <div class="success-box">
        <div class="check" style="background:#fee2e2;color:#b91c1c">!</div>
        <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">결제가 완료되지 않았어요</h1>
        <p class="muted" style="margin:0 0 8px">${escapeHtml2(message)}</p>
        <p class="muted" style="margin-bottom:22px;font-size:13px">문제가 계속되면 <a href="mailto:harold0001@naver.com">harold0001@naver.com</a> 으로 문의해 주세요.</p>
        <a href="checkout.html?id=${course ? course.id : ''}" class="btn btn-primary btn-lg">다시 시도</a>
        <a href="index.html" class="btn btn-ghost btn-lg" style="margin-top:8px">홈으로</a>
      </div>
    </div>
  `;
}

function escapeHtml2(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
