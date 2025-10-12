// SYSCARE Landing Page - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCostChart();
    initSafetyCounter();
    initCTAButtons();
    initMobileMenu();
    initSmoothScrolling();
    initPerformanceOptimizations();
    initRealTimeCounters();
    initCountdownTimer();
    initThreatAnimations();
    initUrgencyElements();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters when they come into view
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.solution-card, .value-card, .stat-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Cost comparison chart
function initCostChart() {
    const ctx = document.getElementById('costChart');
    if (!ctx) return;

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['복구 비용', '예방 비용'],
            datasets: [{
                label: '비용 (만원)',
                data: [300, 100],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(34, 197, 94, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const percentage = context.dataIndex === 0 ? '100%' : '33%';
                            return `${context.label}: ${value}만원 (${percentage})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#374151'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 350,
                    grid: {
                        color: 'rgba(156, 163, 175, 0.3)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#6B7280',
                        callback: function(value) {
                            return value + '만원';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Add comparison text annotation
    setTimeout(() => {
        addChartAnnotation(chart);
    }, 2500);
}

// Add annotation to chart
function addChartAnnotation(chart) {
    const canvas = chart.canvas;
    const ctx = canvas.getContext('2d');
    
    // Add "3배 차이" text
    chart.options.plugins.afterDraw = function(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = 'bold 16px "Pretendard"';
        ctx.fillStyle = '#DC2626';
        ctx.textAlign = 'center';
        
        const chartArea = chart.chartArea;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = chartArea.top + 30;
        
        ctx.fillText('3배 차이!', x, y);
        ctx.restore();
    };
    
    chart.update();
}

// Safety counter animation
function initSafetyCounter() {
    const counter = document.getElementById('safetyCounter');
    if (!counter) return;

    function updateCounter() {
        const startDate = new Date('2020-01-01');
        const currentDate = new Date();
        const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        
        animateNumber(counter, parseInt(counter.textContent), daysDiff, 2000);
    }

    // Update counter on page load and every day
    updateCounter();
    setInterval(updateCounter, 24 * 60 * 60 * 1000); // Update daily
}

// Number animation function
function animateNumber(element, start, end, duration, options = {}) {
    const range = end - start;
    const startTime = performance.now();
    const { formatter, decimals = 0 } = options;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentRaw = start + (range * easeOutCubic);

        let displayValue;
        if (decimals > 0) {
            displayValue = parseFloat(currentRaw.toFixed(decimals));
        } else {
            displayValue = Math.round(currentRaw);
        }

        if (formatter) {
            element.textContent = formatter(displayValue);
        } else {
            element.textContent = displayValue.toLocaleString('ko-KR', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Counter animation for statistics
function animateStatCounter(element) {
    const numberElement = element.querySelector('.text-4xl');
    if (!numberElement) return;

    const finalValue = numberElement.textContent;
    const numberMatch = finalValue.match(/[+-]?\d[\d.,]*/);
    if (!numberMatch) return;

    const prefix = finalValue.slice(0, numberMatch.index);
    const numericPart = numberMatch[0];
    const suffix = finalValue.slice(numberMatch.index + numericPart.length);

    const normalizedNumber = parseFloat(numericPart.replace(/,/g, ''));
    if (Number.isNaN(normalizedNumber)) return;

    const hasPlus = numericPart.trim().startsWith('+');
    const decimalMatch = numericPart.split('.')[1];
    const decimals = decimalMatch ? decimalMatch.replace(/[^0-9]/g, '').length : 0;

    const formatter = (value) => {
        const formattedNumber = value.toLocaleString('ko-KR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        const sign = hasPlus && value >= 0 ? '+' : '';
        return `${prefix}${sign}${formattedNumber}${suffix}`;
    };

    animateNumber(numberElement, 0, normalizedNumber, 1500, {
        decimals,
        formatter
    });
}

// CTA Button functionality
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('button, a[href$=".html"]');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // GA4 이벤트 전송 - diagnosis.html로 가는 링크만 추적
            if (this.tagName === 'A' && this.getAttribute('href') === 'diagnosis.html') {
                if (typeof gtag === 'function') {
                    const buttonText = this.textContent.trim();
                    const buttonLocation = this.closest('section')?.id || 'unknown';

                    gtag('event', 'cta_click', {
                        'event_category': 'engagement',
                        'event_label': buttonText,
                        'button_location': buttonLocation,
                        'destination': 'diagnosis_page'
                    });
                }
            }

            // Add ripple effect for buttons only
            if (this.tagName === 'BUTTON') {
                createRipple(e);
            }
            
            // Handle different button actions
            const buttonText = this.textContent.trim();
            
            // Only handle modal actions for buttons, not links
            if (this.tagName === 'BUTTON' && (buttonText.includes('예방 점검 예약') || buttonText.includes('무료 상담') || buttonText.includes('전산 상태 확인') || buttonText.includes('무료 예방 진단'))) {
                handleCTAClick(buttonText);
            }
            
            // Track analytics for all CTA interactions
            trackButtonClick(buttonText);
        });
    });
}

// Create ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Handle CTA clicks
function handleCTAClick(buttonText) {
    // Show modal or redirect based on button type
    if (buttonText.includes('예방 점검 예약')) {
        showBookingModal();
    } else if (buttonText.includes('무료 상담') || buttonText.includes('무료 예방 진단')) {
        showConsultationModal();
    } else if (buttonText.includes('전산 상태 확인')) {
        showSystemCheckModal();
    }
    
    // Analytics tracking (placeholder)
    trackButtonClick(buttonText);
}

// Modal functions (simplified versions)
function showBookingModal() {
    alert('예방 점검 예약 페이지로 이동합니다.\n전화: 02-1234-5678\n이메일: booking@syscare.co.kr');
}

function showConsultationModal() {
    alert('무료 상담 신청 페이지로 이동합니다.\n전화: 02-1234-5678\n이메일: consult@syscare.co.kr');
}

function showSystemCheckModal() {
    alert('전산 상태 확인 서비스 페이지로 이동합니다.\n온라인 진단을 시작하시겠습니까?');
}

// Analytics tracking
function trackButtonClick(buttonText) {
    // Google Analytics or other tracking service integration
    console.log('Button clicked:', buttonText);
    
    // Example: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': buttonText });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden flex items-center px-3 py-2 border border-gray-300 rounded text-gray-500 hover:text-gray-600 hover:border-gray-400';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav .container');
    nav.appendChild(mobileMenuButton);
    
    mobileMenuButton.addEventListener('click', function() {
        const menu = document.querySelector('nav .hidden.md\\:flex');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        menu.classList.toggle('flex-col');
        menu.classList.toggle('absolute');
        menu.classList.toggle('top-full');
        menu.classList.toggle('left-0');
        menu.classList.toggle('w-full');
        menu.classList.toggle('bg-white');
        menu.classList.toggle('shadow-lg');
        menu.classList.toggle('p-4');
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('skeleton');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            img.classList.add('skeleton');
            imageObserver.observe(img);
        }
    });
    
    // Preload critical resources
    preloadCriticalResources();
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'css/style.css',
        'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.css') ? 'style' : 'font';
        if (resource.includes('fonts')) {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Send error to analytics or monitoring service
});

// Performance monitoring
window.addEventListener('load', function() {
    // Check Core Web Vitals
    if ('web-vital' in window) {
        // Monitor LCP, FID, CLS
        console.log('Performance monitoring initialized');
    }
});

// Real-time counters for threat status
function initRealTimeCounters() {
    const realTimeAttacks = document.getElementById('realTimeAttacks');
    const protectedCompanies = document.getElementById('protectedCompanies');

    if (realTimeAttacks) {
        let attackCount = 1247;
        setInterval(() => {
            attackCount += Math.floor(Math.random() * 3) + 1;
            realTimeAttacks.textContent = attackCount.toLocaleString('ko-KR');
        }, 10000); // Update every 10 seconds
    }

    if (protectedCompanies) {
        let companyCount = 127;
        setInterval(() => {
            // Occasionally increment protected companies
            if (Math.random() < 0.1) {
                companyCount++;
                protectedCompanies.textContent = companyCount;
            }
        }, 60000); // Check every minute
    }
}

// Countdown timer for limited offer
function initCountdownTimer() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (!days || !hours || !minutes || !seconds) return;

    // Set countdown to 3 days from now
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3);
    endTime.setHours(23, 59, 59, 999);

    function updateCountdown() {
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

            days.textContent = d.toString().padStart(2, '0');
            hours.textContent = h.toString().padStart(2, '0');
            minutes.textContent = m.toString().padStart(2, '0');
            seconds.textContent = s.toString().padStart(2, '0');

            // Add urgency when time is running low
            if (d === 0 && h < 24) {
                document.querySelector('#limited-offer').classList.add('urgent-blink');
            }
        } else {
            // Reset timer if expired
            endTime.setDate(endTime.getDate() + 7);
            days.textContent = '7';
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Animated counters for threat status section
function initThreatAnimations() {
    const counterElements = document.querySelectorAll('.counter-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.dataset.target);
                const start = element.dataset.start ? parseFloat(element.dataset.start) : 0;
                const decimals = element.dataset.decimals ? parseInt(element.dataset.decimals, 10) : 0;
                const prefix = element.dataset.prefix || '';
                const suffix = element.dataset.suffix || '';
                const showPlus = element.dataset.showPlus === 'true';

                if (!Number.isNaN(target) && !Number.isNaN(start)) {
                    animateCounter(element, start, target, 2000, {
                        decimals,
                        prefix,
                        suffix,
                        showPlus
                    });
                    observer.unobserve(element);
                }
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));
}

// Enhanced counter animation with formatting options
function animateCounter(element, start, end, duration, options = {}) {
    const { prefix = '', suffix = '', decimals = 0, showPlus = false } = options;

    const formatter = (value) => {
        const formattedNumber = value.toLocaleString('ko-KR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        const sign = showPlus && value > 0 ? '+' : '';
        return `${prefix}${sign}${formattedNumber}${suffix}`;
    };

    animateNumber(element, start, end, duration, {
        decimals,
        formatter
    });

    // Add subtle scaling animation for visual feedback
    const startTime = performance.now();

    function updateScale(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
            element.style.transform = `scale(${1 + 0.1 * Math.sin(progress * Math.PI)})`;
            requestAnimationFrame(updateScale);
        } else {
            element.style.transform = 'scale(1)';
        }
    }

    requestAnimationFrame(updateScale);
}

// Urgency elements management
function initUrgencyElements() {
    // Simulate decreasing availability
    const slotElement = document.querySelector('.bg-gradient-to-r.from-yellow-400.to-orange-400');
    if (slotElement) {
        let currentWidth = 23;
        setInterval(() => {
            if (currentWidth > 2) {
                currentWidth -= 0.1;
                slotElement.style.width = currentWidth + '%';

                const remaining = Math.ceil(50 * (currentWidth / 23));
                const remainingElement = document.querySelector('.font-bold.text-yellow-300');
                if (remainingElement) {
                    remainingElement.textContent = remaining + '개';
                }
            }
        }, 30000); // Decrease every 30 seconds
    }

    // Add exit-intent detection
    let exitIntentTriggered = false;
    document.addEventListener('mouseleave', function(e) {
        if (!exitIntentTriggered && e.clientY <= 0) {
            exitIntentTriggered = true;
            showExitIntentModal();
        }
    });
}

// Exit intent modal (simplified version)
function showExitIntentModal() {
    // Create a simple alert for now - can be enhanced with a proper modal
    const confirmed = confirm(
        '잠깐! 정말 나가시나요?\n\n' +
        '지금 나가시면:\n' +
        '• 50% 할인 혜택을 놓칩니다\n' +
        '• 무료 보안점검 기회를 잃습니다\n' +
        '• 다음 사이버 공격의 타겟이 될 수 있습니다\n\n' +
        '마지막 기회입니다. 지금 신청하시겠습니까?'
    );

    if (confirmed) {
        window.location.href = 'diagnosis.html';
    }
}

// Enhanced button tracking with urgency
function trackUrgentAction(action, element) {
    // Add visual feedback
    if (element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    // Track with urgency context
    console.log('Urgent action:', action, {
        timestamp: new Date().toISOString(),
        element: element?.textContent?.trim(),
        urgency: 'high'
    });

    // Could integrate with analytics here
}

// Add CSS for new animations
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .urgent-pulse {
        animation: urgent-pulse 1s infinite;
    }

    @keyframes urgent-pulse {
        0%, 100% {
            background-color: rgba(239, 68, 68, 0.9);
            transform: scale(1);
        }
        50% {
            background-color: rgba(239, 68, 68, 1);
            transform: scale(1.05);
        }
    }

    .countdown-urgent {
        animation: countdown-urgent 1s infinite;
    }

    @keyframes countdown-urgent {
        0%, 100% { color: #ffffff; }
        50% { color: #fbbf24; }
    }
`;
document.head.appendChild(enhancedStyle);