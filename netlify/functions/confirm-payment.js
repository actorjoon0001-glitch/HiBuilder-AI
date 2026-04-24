// Netlify Function · 토스페이먼츠 결제 승인
//
// 플로우:
// 1) 클라이언트가 success.html 에서 paymentKey/orderId/amount 를 이 함수로 보냄
// 2) 이 함수는:
//    - Supabase 에서 orderId 로 주문 금액을 조회해 amount 일치 검증
//    - 토스페이먼츠 /v1/payments/confirm 호출 (시크릿 키 = 서버 전용)
//    - 성공 시 Supabase orders.status = 'paid' 로 업데이트
// 3) 실패/금액 불일치/중복 호출 모두 안전하게 처리 (idempotent)
//
// 필요한 Netlify 환경변수:
//   TOSS_SECRET_KEY                 (테스트: test_gsk_... / 라이브: live_gsk_...)
//   SUPABASE_URL                    (예: https://xxx.supabase.co)
//   SUPABASE_SERVICE_ROLE_KEY       (service_role 키 · 절대 프론트 노출 금지)
//
// 선택 환경변수 (텔레그램 결제 알림):
//   TELEGRAM_BOT_TOKEN              (BotFather 에서 발급)
//   TELEGRAM_CHAT_ID                (userinfobot 에서 확인)
//   두 값이 모두 있으면 결제 성공 시 텔레그램 메시지 자동 발송

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const res = (code, body) => ({
  statusCode: code,
  headers: JSON_HEADERS,
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST')   return res(405, { error: 'Method Not Allowed' });

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return res(400, { error: 'Invalid JSON' }); }

  const { paymentKey, orderId, amount } = payload;
  if (!paymentKey || !orderId || typeof amount !== 'number') {
    return res(400, { error: 'paymentKey, orderId, amount 모두 필요합니다' });
  }

  const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!TOSS_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res(500, {
      error: 'Netlify 환경변수가 설정되지 않았습니다. TOSS_SECRET_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 확인.'
    });
  }

  // 1) 주문 조회: 금액 검증 + 중복 승인 방지
  const orderRes = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?order_no=eq.${encodeURIComponent(orderId)}&select=price,status,course_title,name,email`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );
  if (!orderRes.ok) {
    return res(500, { error: 'Supabase 주문 조회 실패', detail: await orderRes.text() });
  }
  const orders = await orderRes.json();
  if (!orders.length) return res(404, { error: '주문을 찾을 수 없습니다' });
  const order = orders[0];

  if (Number(order.price) !== Number(amount)) {
    return res(400, { error: '결제 금액이 주문 금액과 일치하지 않습니다' });
  }
  if (order.status === 'paid') {
    return res(200, { status: 'paid', message: '이미 승인된 주문입니다' });
  }

  // 2) 토스페이먼츠 결제 승인
  const auth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ paymentKey, orderId, amount })
  });
  const tossData = await tossRes.json().catch(() => ({}));
  if (!tossRes.ok) {
    return res(tossRes.status, {
      error: tossData.message || '토스페이먼츠 승인 실패',
      code: tossData.code
    });
  }

  // 3) Supabase 주문 상태 업데이트
  const updateRes = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?order_no=eq.${encodeURIComponent(orderId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ status: 'paid' })
    }
  );
  if (!updateRes.ok) {
    // 결제는 됐는데 DB 업데이트 실패 → 수동 조치 필요
    return res(500, {
      error: '결제는 성공했지만 주문 상태 업데이트에 실패했습니다. 관리자에게 문의하세요.',
      paymentKey
    });
  }

  // 4) 텔레그램 결제 알림 (선택 · 실패해도 결제 응답엔 영향 없음)
  await sendTelegramPaymentAlert({
    orderId,
    amount,
    method: tossData.method,
    courseTitle: order.course_title,
    buyerName:   order.name,
    buyerEmail:  order.email,
    approvedAt:  tossData.approvedAt
  }).catch(err => console.warn('[telegram] 알림 발송 실패 (결제는 정상):', err?.message || err));

  return res(200, {
    status: 'paid',
    orderId,
    amount,
    method: tossData.method,
    approvedAt: tossData.approvedAt
  });
};

async function sendTelegramPaymentAlert(order) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const amountFmt = new Intl.NumberFormat('ko-KR').format(order.amount) + '원';
  const when = order.approvedAt
    ? new Date(order.approvedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    : new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const text = [
    '💳 *결제 완료*',
    '━━━━━━━━━━━━━━',
    order.courseTitle ? `📘 ${order.courseTitle}` : null,
    order.buyerName  ? `👤 ${order.buyerName}` : null,
    order.buyerEmail ? `📧 ${order.buyerEmail}` : null,
    `💰 ${amountFmt}${order.method ? ` · ${order.method}` : ''}`,
    `🧾 ${order.orderId}`,
    `🕐 ${when}`
  ].filter(Boolean).join('\n');

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Telegram ${resp.status}: ${body}`);
  }
}
