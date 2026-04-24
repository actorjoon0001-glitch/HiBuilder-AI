// GA4 + Meta Pixel 로더
// window.ANALYTICS_CONFIG 에 ID 가 있을 때만 동적으로 로드합니다.
(function () {
  const cfg = window.ANALYTICS_CONFIG || {};

  // --- Google Analytics 4 ---
  if (cfg.ga4MeasurementId && /^G-[A-Z0-9]{6,}$/i.test(cfg.ga4MeasurementId)) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4MeasurementId);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4MeasurementId, { anonymize_ip: true });
  }

  // --- Meta (Facebook) Pixel ---
  if (cfg.metaPixelId && /^\d{10,20}$/.test(cfg.metaPixelId)) {
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', cfg.metaPixelId);
    fbq('track', 'PageView');
  }

  // 공용 이벤트 헬퍼 - 결제 완료 등에서 호출
  window.track = function (eventName, params) {
    try {
      if (window.gtag && cfg.ga4MeasurementId) {
        window.gtag('event', eventName, params || {});
      }
      if (window.fbq && cfg.metaPixelId) {
        window.fbq('track', eventName, params || {});
      }
    } catch (e) {
      console.warn('[analytics] track 실패', e);
    }
  };
})();
