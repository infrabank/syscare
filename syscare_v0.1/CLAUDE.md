# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SYSCARE is a Korean IT system management service landing page focused on prevention rather than recovery ("복구가 아니라, 애초에 막는 게 전산의 일입니다"). It's a static website built with HTML5, CSS3, and vanilla JavaScript, using Tailwind CSS for styling and Chart.js for data visualization.

## Development Commands

This project requires no build process - it's pure HTML/CSS/JS ready for static hosting.

### Local Development
```bash
# Start local server (choose one)
python -m http.server 8000
npx serve .
# Then open http://localhost:8000
```

### Testing
- Manual browser testing across devices required
- Test all form submissions with both Formspree and RESTful API backends
- Validate responsive design at breakpoints: 768px (tablet), 1024px (desktop)
- Test admin dashboard CRUD operations with RESTful Table API
- Verify Chart.js visualizations render correctly across browsers

## Architecture & Key Files

### Core Pages (Conversion Flow)
- `index.html` - Main landing page with hero section and Chart.js cost comparison
- `diagnosis.html` - Primary CTA target with unified diagnosis form (main conversion funnel)
- `diagnosis_success.html` - Conversion success page
- `system-check.html` - Interactive 20-question assessment tool with risk analysis and Chart.js visualization

### Admin & Management
- `admin-bookings.html` - Full CRUD dashboard for managing diagnosis requests with RESTful Table API
- `security-report-sample.html` - Sample report for customer trust building (PDF-ready)
- `regular-checkup.html` - Service pricing page

### Legacy Pages (No Longer Used)
- `booking.html` - Legacy booking form (replaced by unified diagnosis.html)
- `consultation.html` - Legacy consultation form (replaced by unified diagnosis.html)

### Core Assets
- `css/style.css` - Custom animations and component styles
- `js/main.js` - Landing page functionality and Chart.js integration
- `js/system-check.js` - Assessment tool logic with progress tracking

## Technical Stack

### Dependencies (CDN-based)
- **Tailwind CSS**: Main styling framework via CDN
- **Chart.js**: Cost comparison and risk analysis visualizations
- **Font Awesome 6.4.0**: Icons throughout the interface
- **Pretendard Font**: Korean-optimized typography

### Backend Integration
- **Formspree**: Form handling (endpoints: xldprrkd, xeqyrkrw) for backup form submission
- **RESTful Table API**: Primary backend for admin dashboard data persistence
  - Base URL: Use environment-specific API endpoints
  - Tables: `diagnosis_requests` (active), `booking_requests` (legacy)
  - Full CRUD operations: GET, POST, PATCH, DELETE
  - Dual submission strategy: Forms submit to both Formspree and REST API for reliability

## Business Logic Patterns

### Unified CTA Strategy
All major call-to-actions lead to `diagnosis.html` - this is the primary conversion funnel. Maintain this pattern when adding new features.

### Status Workflow (Admin Dashboard)
Diagnosis requests follow 4-stage workflow:
1. `신청접수` (Application Received)
2. `일정조율` (Scheduling)
3. `진단예정` (Diagnosis Scheduled)
4. `진단완료` (Diagnosis Complete)

### Data Schema (Active)
```javascript
diagnosis_requests {
  company_name: string,
  contact_name: string,
  phone: string,
  email: string,
  company_address: string,
  employees: string,
  preferred_timing: string,
  concerns: array,
  additional_notes: text,
  status: enum
}
```

## Code Conventions

### Language Strategy
- **Interface Text**: Korean (all user-facing content)
- **Code/Variables**: English (HTML attributes, CSS classes, JavaScript)
- **Comments**: Korean for business logic, English for technical implementation

### CSS Architecture
- Utility-first approach with Tailwind CSS
- Custom animations in `style.css` for brand-specific interactions
- Mobile-first responsive design with consistent breakpoints

### JavaScript Patterns
- Vanilla JS with modern ES6+ features
- Progressive enhancement (functionality works without JS)
- Chart.js for all data visualizations
- Form validation on both client and server side

## Key Business Requirements

### Contact Information
- Phone: 070-8015-8079
- Email: jhw@mlkit.co.kr
- Service Area: 수도권/세종시 (free on-site visits)

### Value Proposition
Prevention cost (100만원) vs Recovery cost (300만원) - maintain this 1/3 cost advantage messaging throughout the site.

### Conversion Tracking
All forms submit to dual backends (Formspree + REST API) for reliability and admin management.

## Performance Considerations

- All external resources load from fast CDNs (jsDelivr, Google Fonts)
- Minimize JavaScript execution on page load
- Optimize images for Korean market (faster loading in Korea)
- Maintain Lighthouse scores above 90 for all core pages
- Chart.js animations are optimized for mobile performance
- Admin dashboard uses pagination for large datasets

## Color Palette & Design System

### Primary Colors
- **Blue Gradient**: #3b82f6, #1e3a8a, #60a5fa (main brand colors)
- **Success Green**: #22c55e
- **Error Red**: #ef4444
- **Warning Purple**: #8b5cf6
- **Neutral Grays**: #374151, #6b7280, #f3f4f6

### Animation Standards
- **Scroll Animations**: fade-in-up effects using Intersection Observer
- **Hover Effects**: transform and shadow transitions on cards/buttons
- **Counter Animations**: easeOutCubic easing for numerical displays
- **Ripple Effects**: Custom button interaction animations

## Form Integration Details

### Formspree Configuration
- Primary endpoint: `xldprrkd` (diagnosis form)
- Secondary endpoint: `xeqyrkrw` (fallback/legacy forms)
- All forms implement dual submission for reliability

### RESTful Table API Schema
- **GET /tables/diagnosis_requests**: Retrieve diagnosis requests with filtering
- **POST /tables/diagnosis_requests**: Create new diagnosis request
- **PATCH /tables/diagnosis_requests/{id}**: Update request status/details
- **DELETE /tables/diagnosis_requests/{id}**: Remove diagnosis request
- **CSV Export**: Admin dashboard supports Google Sheets integration