# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SYSCARE is a Korean IT system management service landing page focused on prevention rather than recovery ("복구가 아니라, 애초에 막는 게 전산의 일입니다"). Static website built with HTML5, CSS3, vanilla JavaScript, Tailwind CSS, and Chart.js.

## Development Commands

No build process required - pure static HTML/CSS/JS.

### Local Development
```bash
# Start local server (choose one)
python -m http.server 8000
npx serve .
# Then open http://localhost:8000
```

### Testing Checklist
- Form submissions: Test both Formspree and REST API backends complete successfully
- Responsive design: Validate at 768px (tablet) and 1024px (desktop) breakpoints
- Admin dashboard: Test all CRUD operations (GET, POST, PATCH, DELETE) against RESTful Table API
- Chart.js: Verify cost comparison and risk analysis charts render correctly
- Cross-browser: Chrome, Safari, Firefox, Edge

## Architecture & Key Files

### Conversion Flow (Active Pages)
- **index.html** - Main landing page with hero section and Chart.js cost comparison chart
- **diagnosis.html** - **PRIMARY CONVERSION FUNNEL** - All major CTAs lead here (unified diagnosis form)
- **diagnosis_success.html** - Post-submission success page
- **system-check.html** - Interactive 20-question self-assessment with risk scoring and Chart.js visualization

### Admin & Support Pages
- **admin-bookings.html** - Full CRUD dashboard for managing diagnosis requests via RESTful Table API
- **security-report-sample.html** - Sample security report (PDF-ready) for customer trust building
- **regular-checkup.html** - Service pricing page

### Legacy Pages (DO NOT USE)
- ~~booking.html~~ - Replaced by diagnosis.html
- ~~consultation.html~~ - Replaced by diagnosis.html

### Core Assets
- **css/style.css** - Custom animations, ripple effects, brand-specific component styles
- **js/main.js** - Landing page functionality, Chart.js integration, scroll animations, counter animations
- **js/system-check.js** - Assessment tool logic with progress tracking and score calculation

## Technical Stack

### Dependencies (CDN-based)
- **Tailwind CSS** - Main styling framework (CDN config in each HTML file)
- **Chart.js** - Data visualizations (cost comparison bar charts, risk analysis charts)
- **Font Awesome 6.4.0** - Icons
- **Pretendard Font** - Korean-optimized web font

### Backend Integration - Dual Submission Strategy

**IMPORTANT**: All forms use dual submission for reliability:

1. **Formspree** (Backup/Email notification)
   - Primary endpoint: `https://formspree.io/f/xldprrkd` (diagnosis form)
   - Secondary endpoint: `https://formspree.io/f/xeqyrkrw` (legacy forms)

2. **RESTful Table API** (Primary data storage for admin dashboard)
   - Base URL: Relative paths from document root (e.g., `tables/diagnosis_requests`)
   - Active table: `diagnosis_requests`
   - Legacy table: `booking_requests` (no longer used)
   - Operations: GET (with filters), POST, PATCH, DELETE
   - No authentication shown in code (likely handled via API key in production)

### Form Submission Pattern
```javascript
// Standard dual submission pattern used across the site
try {
  // 1. Submit to Formspree for email notification
  await fetch('https://formspree.io/f/xldprrkd', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  // 2. Submit to REST API for admin dashboard
  await fetch('tables/diagnosis_requests', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
} catch (error) {
  // Fallback: Retry Formspree if REST API fails
}
```

## Business Logic & Data Flow

### Unified CTA Strategy
**CRITICAL**: All major call-to-actions throughout the site lead to `diagnosis.html` - this is the single conversion funnel. Do NOT create new booking/consultation forms. Maintain this consolidated approach when adding features.

### Admin Dashboard Workflow
Diagnosis requests move through 4 stages:
1. **신청접수** (Application Received) - Initial submission
2. **일정조율** (Scheduling) - Coordinating visit time
3. **진단예정** (Diagnosis Scheduled) - Appointment confirmed
4. **진단완료** (Diagnosis Complete) - Visit completed

### Data Schema - diagnosis_requests
```javascript
{
  id: auto-generated,
  company_name: string,
  contact_name: string,
  phone: string,
  email: string,
  company_address: string,
  employees: string (e.g., "10-50명"),
  preferred_timing: string (e.g., "이번 주 내"),
  concerns: array (e.g., ["보안 취약점", "백업 문제"]),
  additional_notes: text,
  status: enum ("신청접수"|"일정조율"|"진단예정"|"진단완료"),
  created_at: timestamp (auto),
  updated_at: timestamp (auto)
}
```

## Code Conventions

### Language Strategy
- **User-facing text**: 100% Korean (buttons, labels, headings, descriptions)
- **Code (variables, functions, classes)**: English
- **HTML attributes/CSS classes**: English
- **Comments**: Korean for business logic explanations, English for technical implementation notes

### JavaScript Architecture
- Vanilla ES6+ JavaScript (no frameworks)
- Progressive enhancement (core functionality works without JS)
- Chart.js initialized in `initCostChart()` with custom Korean labels and tooltips
- Intersection Observer API for scroll animations and lazy loading
- Counter animations use `requestAnimationFrame` with easeOutCubic easing

### CSS Architecture
- Tailwind CSS utility-first approach (inline classes)
- Custom animations in `css/style.css`:
  - `.fade-in-up` - Scroll-triggered entrance animations
  - Ripple effects for button interactions
  - Smooth hover transforms and shadows
- Mobile-first responsive design
- Consistent breakpoints: `md:` (768px), `lg:` (1024px)

### Main.js Module Pattern
```javascript
// All functions initialized on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();        // Scrolled nav background
  initScrollAnimations();  // Intersection Observer for cards
  initCostChart();         // Chart.js cost comparison
  initSafetyCounter();     // Animated day counter
  initCTAButtons();        // Ripple effects
  initMobileMenu();        // Mobile hamburger menu
  initSmoothScrolling();   // Anchor link scrolling
  initPerformanceOptimizations(); // Lazy loading
  initRealTimeCounters();  // Live threat counters
  initCountdownTimer();    // Limited offer timer
  initThreatAnimations();  // Threat status animations
  initUrgencyElements();   // Exit intent detection
});
```

## Key Business Requirements

### Contact Information
- Phone: **070-8015-8079**
- Email: **jhw@mlkit.co.kr**
- Service Area: **세종·대전·충청도** (free on-site diagnostic visits, same-day dispatch available)
- Primary Target: 세종특별자치시, 대전광역시, 천안시, 청주시 중소기업

### Core Value Proposition
**Prevention vs Recovery Cost Ratio**: Maintain the "1/3 cost" messaging throughout the site:
- Recovery cost: 300만원 (shown in red)
- Prevention cost: 100만원 (shown in green)
- Chart.js visualization shows this comparison on index.html

### Chart.js Implementation
Two main chart types used:
1. **Cost Comparison** (index.html) - Bar chart showing 300만원 vs 100만원
2. **Risk Analysis** (system-check.html) - Radar/bar chart showing security assessment scores

## Design System

### Color Palette
```css
/* Primary Brand Colors */
--blue-primary: #3b82f6;
--blue-dark: #1e3a8a;
--blue-light: #60a5fa;

/* Status Colors */
--success: #22c55e;
--error: #ef4444;
--warning: #8b5cf6;

/* Neutrals */
--gray-dark: #374151;
--gray-medium: #6b7280;
--gray-light: #f3f4f6;
```

### Animation Patterns
- **Scroll animations**: Fade-in-up with Intersection Observer (100ms stagger)
- **Button hovers**: `transform: translateY(-2px)` + shadow increase
- **Counters**: easeOutCubic easing from 0 to target value over 2000ms
- **Ripples**: Circular expand animation on button click (600ms duration)

## Admin Dashboard Implementation

### CRUD Operations Pattern
```javascript
// GET - List with filters
fetch('tables/diagnosis_requests?page=1&limit=50&sort=created_at')

// POST - Create new
fetch('tables/diagnosis_requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(diagnosisData)
})

// PATCH - Update status
fetch(`tables/diagnosis_requests/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: '진단완료' })
})

// DELETE - Remove entry
fetch(`tables/diagnosis_requests/${id}`, {
  method: 'DELETE'
})
```

### Dashboard Features
- Real-time statistics cards (total, pending, completed, today)
- Status filter dropdown + date range filters
- Pagination (50 records per page)
- CSV export for Google Sheets integration
- Modal detail view with full request information
- Inline status updates with color-coded badges

## Performance Considerations

- All external resources from CDNs (jsDelivr for Pretendard, Font Awesome CDN)
- Chart.js uses `maintainAspectRatio: false` for responsive sizing
- Lazy image loading via Intersection Observer
- Minimal JavaScript execution on initial page load
- Mobile-optimized Chart.js animations (reduced motion on small screens)
- Admin dashboard pagination prevents loading thousands of records

## Common Maintenance Tasks

### Adding a New Form Field to diagnosis.html
1. Add HTML input in diagnosis.html form
2. Update form submission handler to include new field in JSON payload
3. Update admin-bookings.html detail modal to display new field
4. Update data schema documentation above

### Modifying Chart.js Visualizations
- Cost comparison chart config: `js/main.js` - `initCostChart()`
- Risk analysis chart: `js/system-check.js` - search for `new Chart()`
- Always use Korean labels and format numbers with `toLocaleString('ko-KR')`

### Changing CTA Destinations
- All major CTAs point to `diagnosis.html` (青diagnosis icon: `fa-stethoscope`)
- Update href attributes: `<a href="diagnosis.html">무료 예방 진단 받기</a>`
- Modal handlers in `js/main.js` - `handleCTAClick()` function

### Updating Contact Information
Files to update when contact details change:
- index.html (footer, contact section, JSON-LD schema)
- diagnosis.html (support info)
- admin-bookings.html (emergency contact)
- security-report-sample.html (24/7 support section)

## SEO & Regional Optimization

### Local SEO Strategy
**Target Region**: 세종특별자치시, 대전광역시, 충청남도, 충청북도

The site is optimized for regional search visibility targeting SMBs in the Sejong-Daejeon-Chungcheong area:

### Key SEO Elements in index.html

**1. Structured Data (JSON-LD Schema)**
- Location: `<head>` section after custom CSS
- Type: `LocalBusiness` schema
- Critical fields:
  - `areaServed`: Array of cities (세종, 대전, 천안, 청주)
  - `address`: 세종특별자치시 집현중앙7로 6, B동 609호
  - `aggregateRating`: 4.9/5.0 (127 reviews)
  - `knowsAbout`: AI 랜섬웨어 예방, 24시간 모니터링 등
- **DO NOT** modify schema structure without validating at schema.org/validator

**2. Regional Content Sections**
Three key sections for local relevance (maintain order):

a. **Hero Section H2**: "세종, 대전, 충청도 지역 중소기업을 위한 전산 관리 솔루션"
   - Location: Immediately after H1 in hero section
   - Purpose: Primary regional keyword targeting

b. **Local Testimonials Section** (`#local-testimonials`)
   - Location: Before `#results` section
   - 3 testimonial cards with specific cities:
     - (주)충남테크 - 충남 천안
     - 세종IT솔루션 - 세종특별자치시
     - 바이오메드㈜ - 대전광역시
   - Bottom banner: "세종, 대전, 충청도 지역 무료 방문 진단 서비스 제공 (당일 출동 가능)"

c. **Regional Trust Badges** (`#regional-trust-badges`)
   - Location: In `#results` section, before general trust indicators
   - 3 authority badges:
     - 세종특별자치시 우수 IT 파트너사
     - 세종상공회의소 추천 기업
     - 세종테크노파크 협력 업체
   - Note: These are placeholder badges for design purposes

**3. Regionalized CTA Buttons**
Primary CTA variations (A/B testing enabled):
- Hero section: "대전·세종 지역 무료 진단 신청" (main) + "충청도 소재 기업 특가 혜택" (secondary)
- Final CTA: "세종·대전·충청도 무료 진단 신청"
- All CTAs maintain `href="diagnosis.html"` (unified conversion funnel)

### SEO Maintenance Guidelines

**When adding new content:**
1. Include regional keywords naturally: 세종, 대전, 충청도, 천안, 청주
2. Maintain semantic HTML hierarchy (H1 → H2 → H3)
3. Update JSON-LD schema if business info changes

**Title & Meta Description Pattern:**
- Title format: `SYSCARE | [서비스] [지역] [타겟고객]`
- Meta description: Include region + value prop + CTA within 155 characters
- Current title: "SYSCARE | 세종, 대전, 충청도 중소기업 전산 유지보수 및 보안 서비스"

**Regional Keyword Density:**
- Primary: 세종, 대전, 충청도
- Secondary: 천안, 청주, 세종특별자치시, 대전광역시
- Target density: 1-2% (natural integration, avoid keyword stuffing)

### AI Search Engine Optimization
Structured data optimizes for:
- ChatGPT, Perplexity, Google AI Overviews
- Local business queries: "세종 전산 관리", "대전 IT 유지보수"
- Trust signals: Reviews, ratings, service area coverage
