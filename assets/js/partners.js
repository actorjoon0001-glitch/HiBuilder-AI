// 전국 시공업체 지도 페이지 (카카오맵 + 지역 필터 + 상담 모달)
let currentRegion = '전체';
let kakaoMap = null;
let markers = [];
let infoWindow = null;

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('전국 시공업체');
  renderFooter();
  renderRegionFilter();
  renderList();
  wireModal();
  initMap();
});

function filtered() {
  const all = window.PARTNERS || [];
  return currentRegion === '전체' ? all : all.filter(p => p.region === currentRegion);
}

function renderRegionFilter() {
  const wrap = document.getElementById('region-filter');
  wrap.innerHTML = (window.REGIONS || []).map(r =>
    `<button class="region-btn ${r === currentRegion ? 'active' : ''}" data-region="${r}">${r}</button>`
  ).join('');
  wrap.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentRegion = btn.dataset.region;
      wrap.querySelectorAll('.region-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderList();
      renderMarkers();
    });
  });
}

function renderList() {
  const wrap = document.getElementById('partners-list');
  const list = filtered();
  if (!list.length) {
    wrap.innerHTML = '<p class="muted" style="padding:20px">해당 지역에 등록된 시공업체가 없습니다.</p>';
    return;
  }
  wrap.innerHTML = list.map(p => `
    <div class="partner-card" data-id="${p.id}">
      <div class="pc-head">
        <div>
          <div class="pc-name">${escapeHtml(p.name)}</div>
          <div class="pc-addr">${escapeHtml(p.address)}</div>
        </div>
        <span class="pc-rating">★ ${p.rating}</span>
      </div>
      <div class="pc-tags">${p.specialty.map(s => `<span>${escapeHtml(s)}</span>`).join('')}</div>
      <p class="pc-desc">${escapeHtml(p.desc)}</p>
      <div class="pc-foot">
        <span class="muted">시공 실적 ${FMT.format(p.projects)}건</span>
        <button class="btn btn-primary pc-consult" data-id="${p.id}">상담 신청</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.pc-consult').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.dataset.id);
    });
  });
  wrap.querySelectorAll('.partner-card').forEach(card => {
    card.addEventListener('click', () => focusPartner(card.dataset.id));
  });
}

// ---------- 카카오맵 ----------
function initMap() {
  const appKey = window.KAKAO_CONFIG?.appKey;
  const fallback = document.getElementById('map-fallback');
  if (!appKey) {
    showMapFallback('지도를 표시하려면 카카오맵 JavaScript 앱키가 필요합니다. <br/>아래 목록에서 지역별 시공업체를 확인하고 상담을 신청하실 수 있습니다.');
    return;
  }
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
  script.onload = () => {
    if (!window.kakao || !window.kakao.maps) return showMapFallback('지도를 불러오지 못했습니다. 목록에서 시공업체를 확인해 주세요.');
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      kakaoMap = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(36.5, 127.8),
        level: 13
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

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

function renderMarkers() {
  if (!kakaoMap) return;
  clearMarkers();
  const list = filtered();
  const bounds = new kakao.maps.LatLngBounds();
  list.forEach(p => {
    const pos = new kakao.maps.LatLng(p.lat, p.lng);
    const marker = new kakao.maps.Marker({ map: kakaoMap, position: pos, title: p.name });
    kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.setContent(`
        <div style="padding:10px 12px;min-width:180px;font-family:inherit">
          <b style="font-size:14px">${escapeHtml(p.name)}</b>
          <div style="color:#64748b;font-size:12px;margin:2px 0 6px">${escapeHtml(p.address)} · ★ ${p.rating}</div>
          <button onclick="openModal('${p.id}')" style="border:none;background:#5b5bf5;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer">상담 신청</button>
        </div>`);
      infoWindow.open(kakaoMap, marker);
    });
    markers.push(marker);
    bounds.extend(pos);
  });
  if (list.length) kakaoMap.setBounds(bounds);
}

function focusPartner(id) {
  const p = (window.PARTNERS || []).find(x => x.id === id);
  if (!p || !kakaoMap) return;
  kakaoMap.setLevel(8);
  kakaoMap.panTo(new kakao.maps.LatLng(p.lat, p.lng));
}

// ---------- 상담 모달 ----------
let modalTargetId = null;

function openModal(id) {
  modalTargetId = id;
  const p = (window.PARTNERS || []).find(x => x.id === id);
  document.getElementById('modal-title').textContent = p ? `${p.name} 상담 신청` : '시공 상담 신청';
  document.getElementById('modal-sub').textContent = p ? `${p.address} · ${p.specialty.join(', ')}` : '';
  document.getElementById('lead-modal').classList.remove('hide');
}
function closeModal() {
  document.getElementById('lead-modal').classList.add('hide');
}

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
    const p = (window.PARTNERS || []).find(x => x.id === modalTargetId);
    btn.disabled = true;
    btn.textContent = '신청 중...';
    try {
      await LeadStore.save({
        kind: 'partner',
        targetId: modalTargetId,
        targetName: p ? p.name : '',
        name, phone, region: p ? p.region : '', message
      });
      alert('상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다. 감사합니다!');
      ['m-name', 'm-phone', 'm-message'].forEach(id => document.getElementById(id).value = '');
      closeModal();
    } catch (e) {
      console.error(e);
      alert('상담 신청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      btn.disabled = false;
      btn.textContent = '상담 신청하기';
    }
  });
}
