// 결제 완료 페이지
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const id = qs('id');
  const course = getCourse(id);
  const order = OrderStore.last();
  const root = document.getElementById('success-root');
  root.innerHTML = `
    <div class="container">
      <div class="success-box">
        <div class="check">✓</div>
        <h1 style="font-size:24px;font-weight:800;margin:0 0 8px">결제가 완료되었습니다</h1>
        <p class="muted" style="margin:0 0 22px">수강 안내 메일을 이메일로 보내드렸어요.</p>
        ${course ? `
          <div style="text-align:left;padding:16px;border:1px solid var(--line);border-radius:10px;background:var(--bg);margin-bottom:22px">
            <div style="font-size:13px;color:var(--muted);margin-bottom:4px">주문번호: ${order ? order.id : '-'}</div>
            <div style="font-weight:700">${course.title}</div>
            <div style="margin-top:6px;color:var(--ink-2)">${fmtPrice(course.price)}</div>
          </div>
        ` : ''}
        <a href="course.html?id=${course ? course.id : ''}" class="btn btn-primary btn-lg">강의 바로 수강하기</a>
        <a href="index.html" class="btn btn-ghost btn-lg" style="margin-top:8px">홈으로 돌아가기</a>
      </div>
    </div>
  `;
});
