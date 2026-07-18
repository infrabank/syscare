// SYSCARE Landing Page - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initHeaderShadow();
    initCTATracking();
});

// 스크롤 시 헤더에 옅은 그림자 표시
function initHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('shadow-sm', window.scrollY > 8);
    }, { passive: true });
}

// GA4 CTA 클릭 추적 (gtag 미로드 시 무동작)
function initCTATracking() {
    document.querySelectorAll('a[href="diagnosis.html"], a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function () {
            if (typeof gtag !== 'function') return;

            const isTel = this.getAttribute('href').startsWith('tel:');
            gtag('event', isTel ? 'phone_click' : 'cta_click', {
                'event_category': 'engagement',
                'event_label': this.textContent.trim(),
                'button_location': this.closest('section, header, .mobile-cta-bar')?.id || 'unknown',
                'destination': isTel ? 'phone' : 'diagnosis_page'
            });
        });
    });
}

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
});
