// 전국 토지 매물 지도 페이지 (카카오맵 + 지역/활용 필터 + 문의 모달)
let currentRegion = '전체';
let currentCap = 'all';
let kakaoMap = null;
let markers = [];
let infoWindow = null;

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('토지 매물');
  renderFooter();
  renderRegionFilter();
  renderCapFilter();
  renderList();
  wireModal();
  initMap();
});

function filtered() {
  let list = window.LANDS || [];
  if (currentRegion !== '전체') list = list.filter(l => l.region === currentRegion);
  if (currentCap === 'shelter') list = list.filter(l => l.canShelter);
  if (currentCap === 'house')   list = list.filter(l => l.canHouse);
  return list;
}

function capBadges(l) {
  const b = [];
  if (l.canShelter) b.push('<span class="cap-badge shelter">체류형 쉼터 가능</span>');
  if (l.canHouse)   b.push('<span class="cap-badge house">주택 인허가 가능</span>');
  return b.join('');
}

function renderRegionFilter() {
  const wrap = document.getElementById('region-filter');
  wrap.innerHTML = (window.LAND_REGIONS || []).map(r =>
    `<button class="region-btn ${r === currentRegion ? 'active' : ''}" data-region="${r}">${r}</button>`
  ).join('');
  wrap.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentRegion = btn.dataset.region;
      wrap.querySelectorAll('.region-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderList(); renderMarkers();
    });
  });
}

function renderCapFilter() {
  const wrap = document.getElementById('cap-filter');
  wrap.innerHTML = (window.LAND_CAPABILITIES || []).map(c =>
    `<button class="cap-btn ${c.key === currentCap ? 'active' : ''}" data-cap="${c.key}">${c.label}</button>`
  ).join('');
  wrap.querySelectorAll('.cap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCap = btn.dataset.cap;
      wrap.querySelectorAll('.cap-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderList(); renderMarkers();
    });
  });
}

function renderList() {
  const wrap = document.getElementById('lands-list');
  const list = filtered();
  if (!list.length) {
    wrap.innerHTML = '<p class="muted" style="padding:20px">조건에 맞는 토지 매물이 없습니다.</p>';
    return;
  }
  wrap.innerHTML = list.map(l => `
    <div class="partner-card land-card" data-id="${l.id}">
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
          <span>${FMT.format(l.areaPyeong)}평 (${FMT.format(l.areaM2)}㎡)</span>
          <span>${escapeHtml(l.useZone)}</span>
        </div>
        <div class="pc-tags">${capBadges(l)}</div>
        <p class="pc-desc">${escapeHtml(l.desc)}</p>
        <div class="pc-foot">
          <a class="text-link" href="index.html#cat-house">이 땅에 맞는 모델 보기 →</a>
          <button class="btn btn-primary pc-consult" data-id="${l.id}">매물 문의</button>
        </div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.pc-consult').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.id); });
  });
  wrap.querySelectorAll('.land-card').forEach(card => {
    card.addEventListener('click', () => focusLand(card.dataset.id));
  });
}

// ---------- 카카오맵 ----------
function initMap() {
  const appKey = window.KAKAO_CONFIG?.appKey;
  if (!appKey) {
    showMapFallback('지도를 표시하려면 카카오맵 JavaScript 앱키가 필요합니다. <br/>아래 목록에서 지역별 토지 매물을 확인하고 문의하실 수 있습니다.');
    return;
  }
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
  script.onload = () => {
    if (!window.kakao || !window.kakao.maps) return showMapFallback('지도를 불러오지 못했습니다. 목록에서 매물을 확인해 주세요.');
    kakao.maps.load(() => {
      kakaoMap = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(36.5, 127.8), level: 13
      });
      infoWindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      renderMarkers();
    });
  };
  script.onerror = () => showMapFallback('지도를 불러오지 못했습니다. 앱키와 도메인 등록을 확인해 주세요.');
  document.head.appendChild(script);
}

function showMapFallback(msg) {
  document.getElementById('map').classList.add('hide');
  const fb = document.getElementById('map-fallback');
  fb.classList.remove('hide');
  fb.innerHTML = `<div><div class="fb-icon">🗺️</div><p>${msg}</p></div>`;
}

function clearMarkers() { markers.forEach(m => m.setMap(null)); markers = []; }

function renderMarkers() {
  if (!kakaoMap) return;
  clearMarkers();
  const list = filtered();
  const bounds = new kakao.maps.LatLngBounds();
  list.forEach(l => {
    const pos = new kakao.maps.LatLng(l.lat, l.lng);
    const marker = new kakao.maps.Marker({ map: kakaoMap, position: pos, title: l.title });
    kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.setContent(`
        <div style="padding:10px 12px;min-width:200px;font-family:inherit">
          <b style="font-size:14px">${escapeHtml(l.title)}</b>
          <div style="color:#64748b;font-size:12px;margin:2px 0 4px">${escapeHtml(l.address)}</div>
          <div style="font-size:12px;margin-bottom:6px">지목 ${escapeHtml(l.jimok)} · ${FMT.format(l.areaPyeong)}평 · <b>${fmtMoney(l.price)}</b></div>
          <button onclick="openModal('${l.id}')" style="border:none;background:#5b5bf5;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer">매물 문의</button>
        </div>`);
      infoWindow.open(kakaoMap, marker);
    });
    markers.push(marker);
    bounds.extend(pos);
  });
  if (list.length) kakaoMap.setBounds(bounds);
}

function focusLand(id) {
  const l = (window.LANDS || []).find(x => x.id === id);
  if (!l || !kakaoMap) return;
  kakaoMap.setLevel(8);
  kakaoMap.panTo(new kakao.maps.LatLng(l.lat, l.lng));
}

// ---------- 문의 모달 ----------
let modalTargetId = null;

function openModal(id) {
  modalTargetId = id;
  const l = (window.LANDS || []).find(x => x.id === id);
  document.getElementById('modal-title').textContent = l ? `${l.title} 문의` : '토지 매물 문의';
  document.getElementById('modal-sub').textContent = l ? `${l.address} · 지목 ${l.jimok} · ${fmtMoney(l.price)}` : '';
  document.getElementById('lead-modal').classList.remove('hide');
}
function closeModal() { document.getElementById('lead-modal').classList.add('hide'); }

function wireModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('lead-modal').addEventListener('click', e => {
    if (e.target.id === 'lead-modal') closeModal();
  });
  document.getElementById('m-submit').addEventListener('click', async () => {
    const btn = document.getElementById('m-submit');
    const name = document.getElementById('m-name').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    const message = document.getElementById('m-message').value.trim();
    if (!name) return alert('이름을 입력해 주세요.');
    if (phone.replace(/\D/g, '').length < 9) return alert('연락처를 정확히 입력해 주세요.');
    const l = (window.LANDS || []).find(x => x.id === modalTargetId);
    btn.disabled = true; btn.textContent = '문의 중...';
    try {
      await LeadStore.save({
        kind: 'land',
        targetId: modalTargetId,
        targetName: l ? l.title : '',
        name, phone, region: l ? l.region : '', message
      });
      alert('매물 문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다. 감사합니다!');
      ['m-name', 'm-phone', 'm-message'].forEach(id => document.getElementById(id).value = '');
      closeModal();
    } catch (e) {
      console.error(e);
      alert('문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      btn.disabled = false; btn.textContent = '매물 문의하기';
    }
  });
}
