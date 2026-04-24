// 홈 화면 렌더링
document.addEventListener('DOMContentLoaded', () => {
  renderHeader('courses');
  renderFooter();
  renderCourses();
  renderFeaturedReviews();
  wireFaq();
});

function renderCourses() {
  const wrap = document.getElementById('course-grid');
  if (!wrap) return;
  wrap.innerHTML = (window.COURSES || []).map(c => `
    <a class="course-card" href="course.html?id=${c.id}">
      <div class="thumb" style="background-image:url('${c.thumbnail}')">
        ${c.discountLabel ? `<span class="badge">${c.discountLabel}</span>` : ''}
      </div>
      <div class="body">
        <h3>${c.title}</h3>
        <p class="sub">${c.subtitle}</p>
        <div class="meta">
          <div>
            ${c.originalPrice ? `<span class="original">${fmtPrice(c.originalPrice)}</span>` : ''}
            <span class="price">${fmtPrice(c.price)}</span>
          </div>
          <div class="rating"><b>★ ${c.rating}</b> (${FMT.format(c.students)})</div>
        </div>
      </div>
    </a>
  `).join('');
}

function renderFeaturedReviews() {
  const wrap = document.getElementById('featured-reviews');
  if (!wrap) return;
  const pooled = [];
  (window.COURSES || []).forEach(c => {
    const revs = ReviewStore.list(c.id);
    revs.slice(0, 2).forEach(r => pooled.push({ ...r, courseTitle: c.title, courseId: c.id }));
  });
  // 별점 높은 순 3개
  const pick = pooled.sort((a, b) => b.rating - a.rating).slice(0, 3);
  wrap.innerHTML = pick.map(r => `
    <div class="course-card" style="padding:22px;cursor:default">
      <div style="color:var(--warning);font-size:16px;margin-bottom:8px">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p style="font-size:15px;line-height:1.6;color:var(--ink);margin:0 0 14px">"${r.text}"</p>
      <div style="font-size:13px;color:var(--muted)">
        <b style="color:var(--ink)">${r.name}</b> · <a href="course.html?id=${r.courseId}" style="color:var(--brand);text-decoration:none">${r.courseTitle}</a>
      </div>
    </div>
  `).join('');
}

function wireFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}
