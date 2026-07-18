// SYSCARE Landing Page - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCTAButtons();
    initMobileMenu();
    initSmoothScrolling();
    initPerformanceOptimizations();
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
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.solution-card, .value-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
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
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Add CSS for ripple animation
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(enhancedStyle);
