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

---

## Analytics & Performance Tracking

### Google Analytics 4 (GA4) Implementation

**Setup Status**: ✅ Implemented (2025-01-15)

#### Tracking Code Location
GA4 tracking code installed in `<head>` section of all HTML files:
- index.html, diagnosis.html, system-check.html
- diagnosis_success.html, regular-checkup.html
- security-report-sample.html, admin-bookings.html

**Measurement ID**: `G-XXXXXXXXXX` (replace with actual ID from GA4 console)

#### Core Events Tracked

**1. Conversion Events (Primary)**
- `generate_lead` - Diagnosis form submission (diagnosis.html)
  - Triggers: On successful Formspree submission
  - Parameters: event_category, event_label, value, currency, form_type
  - Location: diagnosis.html inline script (line ~490)

**2. Engagement Events**
- `cta_click` - CTA button clicks to diagnosis.html
  - Triggers: Click on any `<a href="diagnosis.html">` link
  - Parameters: event_label (button text), button_location (section ID)
  - Location: js/main.js - `initCTAButtons()` function

- `assessment_completed` - System check completion
  - Triggers: After calculateScore() in system-check.js
  - Parameters: risk_level, score, has_contact_info
  - Location: js/system-check.js - `processAssessment()` function

- `form_submit_start` - Diagnosis form submission initiated
  - Triggers: On form submit (before API call)
  - Location: diagnosis.html inline script (line ~418)

**3. Automatic Events (Enhanced Measurement)**
Enable in GA4 console:
- Page views (automatic)
- Scrolls (90% depth)
- Outbound clicks
- File downloads
- Form interactions (form_start, form_submit)

#### Custom Dimensions to Configure in GA4

Recommended custom dimensions:
1. **button_location** - Where on page CTA was clicked
2. **risk_level** - System check risk level (low/medium/high)
3. **form_type** - Type of form submitted
4. **destination** - Target page for navigation events

### Google Search Console

**Setup Status**: ✅ Ready for verification

#### Verification Methods

**Option 1: DNS Verification** (Recommended for domain property)
- Add TXT record to domain DNS settings
- Covers all subdomains and protocols (http/https)

**Option 2: HTML Meta Tag** (Already added)
- Verification meta tag in `<head>` of all HTML files
- Replace `PASTE_YOUR_VERIFICATION_CODE_HERE` with actual code from GSC

#### Sitemap Configuration

**Location**: `syscare_v0.1/sitemap.xml`

**Included Pages**:
- index.html (priority 1.0)
- diagnosis.html (priority 0.9) - PRIMARY CONVERSION PAGE
- system-check.html (priority 0.8)
- regular-checkup.html (priority 0.7)
- security-report-sample.html (priority 0.6)
- diagnosis_success.html (priority 0.3)

**Excluded Pages**:
- admin-bookings.html (admin only)
- booking.html (legacy, deprecated)
- consultation.html (legacy, deprecated)

**Submit to GSC**: `https://yourdomain.com/sitemap.xml`

#### Robots.txt Configuration

**Location**: `syscare_v0.1/robots.txt`

**Disallowed paths**:
- /admin-bookings.html (sensitive admin page)
- /diagnosis_success.html (thank you page - no direct search traffic needed)
- /booking.html (legacy page)
- /consultation.html (legacy page)

### Target Keywords & Tracking

**Primary Keywords** (Monitor in GSC Performance report):
1. 세종 전산 관리
2. 대전 IT 유지보수
3. 충청 전산 보안
4. 세종 IT 관리
5. 대전 전산 유지보수

**Secondary Keywords**:
- 세종 랜섬웨어 예방
- 대전 서버 관리
- 천안 IT 아웃소싱
- 청주 전산실 관리
- 세종 네트워크 보안

**Long-tail Keywords**:
- 세종 중소기업 전산 관리
- 대전 전산 장애 예방
- 충청도 IT 전문 업체
- 세종시 무료 전산 진단

### Regional Traffic Segmentation

**Target Cities** (GA4 Custom Segment):
- 세종특별자치시 (Sejong)
- 대전광역시 (Daejeon)
- 천안시 (Cheonan)
- 청주시 (Cheongju)
- 아산시, 공주시, 논산시, 계룡시

**GA4 Segment Configuration**:
1. Explore > Create custom segment
2. Name: "타겟 지역 (세종·대전·충청)"
3. Condition: City matches any of [above cities]
4. Use in all funnel and exploration reports

### Key Performance Indicators (KPIs)

**Traffic Goals**:
- Total monthly visitors: 3,000-5,000
- Target region visitors: 40-50% of total
- Organic search traffic: 60%+

**Conversion Goals**:
- Diagnosis form submissions: 30-50/month
- Overall conversion rate: 2-3%
- Phone inquiries: 10-15/month

**Engagement Goals**:
- Average session duration: 2m 30s+
- Bounce rate: <50%
- Pages per session: 2.5+

**Keyword Goals**:
- Top 5 ranking: 5-7 keywords
- Top 10 ranking: 15-20 keywords
- Average CTR: 5%+

### Monitoring Schedule

**Daily** (10 min):
- GA4 Realtime report (anomaly detection)
- Form submission count (target: 5+ per day)
- Check error notifications

**Weekly** (30 min, Mondays):
- GSC keyword ranking spreadsheet update
- Regional traffic comparison (week-over-week)
- Conversion funnel analysis
- Identify 3 action items

**Monthly** (2 hours, first week):
- Regional ROI analysis
- Content performance evaluation (CTR, rankings)
- User behavior patterns (path exploration)
- Technical SEO audit (Core Web Vitals, indexing)

**Quarterly** (4 hours, first week):
- Goal achievement evaluation
- Competitor analysis
- New content planning (data-driven topics)
- Strategy adjustment for next quarter

### Useful Dashboards

**Looker Studio Templates**:
1. Regional Performance Dashboard
   - Map: Users by city
   - Table: City, users, conversions, conversion rate
   - Time series: Daily trend by region

2. Conversion Funnel Dashboard
   - Funnel: Landing → CTA click → Diagnosis page → Form start → Conversion
   - Breakdown by: Device, source, region

3. Keyword Performance Dashboard
   - GSC data: Keyword, impressions, clicks, CTR, position
   - Trend: Ranking changes over time
   - Opportunities: High impressions + low CTR

### Debug Mode

**Enable GA4 Debug Mode** (for testing):
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'debug_mode': true
});
```

View events in: GA4 Console > Admin > DebugView

**Test Checklist**:
1. Page view events firing on all pages
2. `cta_click` event when clicking diagnosis CTA
3. `form_submit_start` when submitting form
4. `generate_lead` after successful submission
5. `assessment_completed` after system check

### Troubleshooting

**If data not appearing in GA4**:
1. Check browser console for JavaScript errors
2. Verify gtag.js loads (Network tab)
3. Confirm Measurement ID is correct
4. Check ad blockers disabled
5. Wait 48-72 hours for initial data processing

**If GSC not indexing**:
1. Verify robots.txt allows crawling
2. Submit individual URLs via URL Inspection tool
3. Check sitemap.xml format is valid
4. Ensure server allows Googlebot
5. Wait 1-2 weeks for new sites

### Documentation Reference

See **ANALYTICS_IMPLEMENTATION_GUIDE.md** (root directory) for:
- Detailed setup instructions
- Code snippets for custom events
- Advanced tracking (call tracking, heatmaps, UTM parameters)
- Optimization strategies
- Complete troubleshooting guide
