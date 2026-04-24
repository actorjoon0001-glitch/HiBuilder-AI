// 강의 수강 페이지
// URL: lecture.html?id=<courseId>&l=<lectureIndex>&email=<선택>
//
// 접근 제어:
//   - lecture.preview === true  → 누구나 열람
//   - 그 외                     → localStorage 의 verified_email 로 has_purchased RPC 확인
//                                   없으면 이메일 입력 게이트 노출

const VERIFIED_EMAIL_KEY = 'verified_email';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  const courseId = qs('id');
  const course   = getCourse(courseId);
  if (!course) return renderNotFound();

  const flat = flattenLectures(course);
  const idx  = clamp(parseInt(qs('l') || '0', 10), 0, flat.length - 1);
  const current = flat[idx];

  // URL 쿼리로 이메일 왔으면 (결제 완료 리다이렉트 등) 저장
  const emailFromUrl = qs('email');
  if (emailFromUrl) localStorage.setItem(VERIFIED_EMAIL_KEY, emailFromUrl);

  const isPreview = current.preview === true;
  let accessGranted = isPreview;
  let verifiedEmail = localStorage.getItem(VERIFIED_EMAIL_KEY) || '';

  if (!accessGranted && verifiedEmail) {
    accessGranted = await hasPurchased(courseId, verifiedEmail);
    if (!accessGranted) {
      // 저장된 이메일로 접근 불가면 삭제 (다른 강의 구매 이력이었을 수 있음)
      // → 게이트에서 새 이메일 받음
    }
  }

  if (!accessGranted) {
    renderGate(course, current, idx, verifiedEmail);
    return;
  }

  renderViewer(course, flat, idx);
});

function flattenLectures(course) {
  const out = [];
  course.curriculum.forEach((sec, si) => {
    sec.lectures.forEach(lec => {
      out.push({ ...lec, sectionIdx: si, sectionName: sec.section });
    });
  });
  return out;
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, isNaN(n) ? 0 : n)); }

async function hasPurchased(courseId, email) {
  if (!SB.enabled) return false;
  try {
    const { data, error } = await SB.client.rpc('has_purchased', {
      p_course_id: courseId,
      p_email:     email
    });
    if (error) { console.warn('[has_purchased]', error.message); return false; }
    return !!data;
  } catch (e) {
    console.warn(e);
    return false;
  }
}

function renderNotFound() {
  document.getElementById('lecture-root').innerHTML = `
    <div class="container section text-center">
      <h2>강의를 찾을 수 없습니다</h2>
      <a href="index.html" class="btn btn-primary mt-16">홈으로</a>
    </div>`;
}

function renderGate(course, current, idx, prefillEmail) {
  document.title = `수강 인증 · ${course.title}`;
  document.getElementById('lecture-root').innerHTML = `
    <div class="purchase-gate">
      <div class="lock-icon">🔒</div>
      <h2>구매하신 이메일로 인증해 주세요</h2>
      <p>결제 시 입력하신 이메일을 적어주시면 바로 수강할 수 있어요.</p>
      <input type="email" id="g-email" placeholder="you@example.com" value="${escapeAttr(prefillEmail)}"/>
      <button class="btn btn-primary btn-lg" id="g-verify" style="width:100%">수강 시작</button>
      <div style="margin-top:14px;font-size:13px;color:var(--muted)">
        아직 구매 전이신가요? <a href="course.html?id=${course.id}" style="color:var(--brand)">강의 소개 보기</a>
      </div>
      ${current.preview ? `
        <div style="margin-top:12px;font-size:13px">
          <a href="lecture.html?id=${course.id}&l=${idx}&preview=1" style="color:var(--brand)">미리보기로 계속 시청하기</a>
        </div>
      ` : ''}
      <div id="g-msg" style="margin-top:12px;font-size:13.5px;color:#b91c1c;min-height:18px"></div>
    </div>
  `;
  const btn = document.getElementById('g-verify');
  const input = document.getElementById('g-email');
  const msg = document.getElementById('g-msg');
  input.focus();
  btn.addEventListener('click', async () => {
    const email = input.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      msg.textContent = '이메일을 정확히 입력해 주세요.';
      return;
    }
    btn.disabled = true;
    btn.textContent = '확인 중...';
    const ok = await hasPurchased(course.id, email);
    if (!ok) {
      btn.disabled = false;
      btn.textContent = '수강 시작';
      msg.textContent = '해당 이메일로 결제된 주문을 찾지 못했습니다. 결제 시 입력한 이메일을 확인해 주세요.';
      return;
    }
    localStorage.setItem(VERIFIED_EMAIL_KEY, email);
    location.reload();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
}

function renderViewer(course, flat, idx) {
  const current = flat[idx];
  document.title = `${current.title} · ${course.title}`;
  const isPlaceholder = flat.every(l => l.videoId === 'jNQXAC9IVRw');

  const sidebarHtml = course.curriculum.map((sec, si) => {
    const items = sec.lectures.map((lec, li) => {
      const globalIdx = flat.findIndex(f => f.sectionIdx === si && f.title === lec.title);
      const active = globalIdx === idx ? 'active' : '';
      return `
        <a href="lecture.html?id=${course.id}&l=${globalIdx}" class="lec-item ${active}">
          <span>${escapeHtml3(lec.title)}${lec.preview ? '<span class="pv">맛보기</span>' : ''}</span>
          <span class="dur">${lec.time}</span>
        </a>
      `;
    }).join('');
    return `
      <div class="lec-section">${escapeHtml3(sec.section)}</div>
      ${items}
    `;
  }).join('');

  const prev = idx > 0 ? idx - 1 : -1;
  const next = idx < flat.length - 1 ? idx + 1 : -1;

  document.getElementById('lecture-root').innerHTML = `
    <div class="lecture-wrap">
      <aside class="lecture-sidebar">
        <div class="lec-course">${escapeHtml3(course.title)}</div>
        ${sidebarHtml}
      </aside>
      <section class="lecture-main">
        ${isPlaceholder ? `
          <div class="placeholder-banner">
            ⚠ 모든 강의가 샘플 영상입니다 — <code>data/courses.js</code> 의 <code>videoId</code> 를 실제 YouTube 영상 ID로 교체해 주세요.
          </div>
        ` : ''}
        <iframe class="video-frame"
          src="https://www.youtube-nocookie.com/embed/${current.videoId}?rel=0&modestbranding=1"
          title="${escapeAttr(current.title)}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        <div class="lecture-info">
          <div class="sec-name">${escapeHtml3(current.sectionName)}</div>
          <h1>${escapeHtml3(current.title)}</h1>
          <div class="muted" style="font-size:14px">재생 시간 ${current.time}</div>
          <div class="lecture-nav">
            ${prev >= 0
              ? `<a href="lecture.html?id=${course.id}&l=${prev}" class="btn btn-ghost btn-lg">← 이전 강의</a>`
              : '<span class="btn btn-ghost btn-lg" style="opacity:0.4;pointer-events:none">처음 강의</span>'}
            ${next >= 0
              ? `<a href="lecture.html?id=${course.id}&l=${next}" class="btn btn-primary btn-lg">다음 강의 →</a>`
              : '<span class="btn btn-primary btn-lg" style="opacity:0.6;pointer-events:none">마지막 강의</span>'}
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--line);font-size:13.5px;color:var(--muted)">
            수강 중인 계정: <b style="color:var(--ink)">${escapeHtml3(localStorage.getItem(VERIFIED_EMAIL_KEY) || '미리보기 모드')}</b>
            ${localStorage.getItem(VERIFIED_EMAIL_KEY) ? `
              · <a href="#" id="signout" style="color:var(--brand)">로그아웃</a>
            ` : ''}
          </div>
        </div>
      </section>
    </div>
  `;

  const so = document.getElementById('signout');
  if (so) so.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('로그아웃하시겠어요? 재수강 시 이메일을 다시 입력해야 합니다.')) {
      localStorage.removeItem(VERIFIED_EMAIL_KEY);
      location.href = 'index.html';
    }
  });
}

function escapeHtml3(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function escapeAttr(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
