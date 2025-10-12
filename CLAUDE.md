# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SYSCARE is a Korean IT system management service landing page focused on prevention rather than recovery ("복구가 아니라, 애초에 막는 게 전산의 일입니다"). The main application is a static website built with HTML5, CSS3, vanilla JavaScript, Tailwind CSS, and Chart.js.

**Repository Structure:**
- `syscare_v0.1/` - Main web application (see [syscare_v0.1/CLAUDE.md](syscare_v0.1/CLAUDE.md) for detailed documentation)
- `__tests__/` - Jest test suite for business logic validation
- Root-level package.json - Testing infrastructure only

## Development Commands

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- calculateScore.test.js
```

### Local Development
The web application requires no build process. To run locally:
```bash
cd syscare_v0.1

# Start local server (choose one)
python -m http.server 8000
npx serve .

# Then open http://localhost:8000
```

## Architecture

### Testing Architecture
- **Framework**: Jest 29.7.0
- **Test Location**: `__tests__/calculateScore.test.js`
- **Module Under Test**: `syscare_v0.1/js/system-check.js` - Risk assessment scoring algorithm
- **Test Coverage**: Score calculation, risk level classification, and recommendation generation

### Key Test Scenarios
1. **Low Risk**: High-scoring configurations (score: 100, enterprise-grade security)
2. **High Risk**: Missing critical safeguards (score: 25, no backup/security)
3. **Medium Risk**: Partially prepared environments (score: 61, basic protections)
4. **Edge Cases**: Single-value vs array responses for optional fields

### Business Logic Under Test
The `calculateScore()` function evaluates IT infrastructure across 9 dimensions:
- Employee count, OS diversity, server count
- Network management level
- Backup frequency (realtime > daily > manual > none)
- Security solutions (enterprise > firewall > antivirus > none)
- Update strategy (automated > scheduled > manual > none)
- Current issues (security/data/network/performance/backup)
- IT manager availability (full-time > part-time > external > none)

**Risk Levels:**
- Low: score ≥ 70
- Medium: 40 ≤ score < 70
- High: score < 40

## Code Conventions

### Language Strategy
- **User-facing text**: 100% Korean
- **Code (variables, functions, classes)**: English
- **Test descriptions**: English (Jest convention)
- **Assertions**: Use Korean strings when validating user-facing messages

### Testing Conventions
- Use descriptive test names: "returns low risk with high-scoring configuration"
- Test complete objects with `toEqual()`, not just individual properties
- Use `arrayContaining()` for recommendation validation (order may vary)
- Test both array and single-value inputs for flexibility

## Adding New Tests

When adding tests for new features in `syscare_v0.1/`:

1. **Create test file** in `__tests__/` matching the source file name:
   ```javascript
   const { functionName } = require('../syscare_v0.1/js/source-file');
   ```

2. **Follow existing patterns**:
   - Group related tests with `describe()`
   - Use `test()` (not `it()`) for consistency
   - Test happy path, edge cases, and error states

3. **Validate Korean output**: Ensure recommendation messages match exactly:
   ```javascript
   expect(result.recommendations).toContain('즉시 백업 시스템을 구축하세요.');
   ```

## Important Notes

- The root `package.json` is for testing only - the web app has no build dependencies
- All web application code resides in `syscare_v0.1/` - refer to [syscare_v0.1/CLAUDE.md](syscare_v0.1/CLAUDE.md) for:
  - Form submission workflows (dual Formspree + REST API)
  - Chart.js implementation details
  - Admin dashboard CRUD operations
  - SEO and regional optimization strategy
  - Complete file structure and page descriptions
  - **Analytics & Performance Tracking** (GA4, Search Console setup and monitoring)
- Tests use CommonJS (`require`) while production code uses ES6 modules
- Test data should reflect real-world Korean business scenarios

## Analytics Implementation

### Status: ✅ Fully Implemented (2025-01-15)

The SYSCARE website now has comprehensive analytics tracking:

**Google Analytics 4 (GA4)**:
- Tracking code installed in all HTML files
- Custom events: `generate_lead`, `cta_click`, `assessment_completed`, `form_submit_start`
- Enhanced measurement enabled for form interactions, scrolls, outbound clicks
- Location: `syscare_v0.1/` - all HTML files have GA4 in `<head>` section

**Google Search Console**:
- Verification meta tag ready in all HTML files (replace placeholder with actual code)
- [sitemap.xml](syscare_v0.1/sitemap.xml) created with all active pages
- [robots.txt](syscare_v0.1/robots.txt) configured to exclude admin/legacy pages

**Key Files Modified**:
- `syscare_v0.1/index.html` - GA4 + GSC verification tag added
- `syscare_v0.1/diagnosis.html` - GA4 + conversion tracking (`generate_lead`)
- `syscare_v0.1/system-check.html` - GA4 tracking
- `syscare_v0.1/js/main.js` - CTA click tracking added to `initCTAButtons()`
- `syscare_v0.1/js/system-check.js` - Assessment completion tracking in `processAssessment()`
- All other HTML files updated with GA4 + GSC tags

**Next Steps** (After deployment):
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Replace `G-XXXXXXXXXX` with actual Measurement ID in all HTML files
3. Enable Enhanced Measurement in GA4 console
4. Mark `generate_lead` as conversion event in GA4
5. Verify site ownership in [Google Search Console](https://search.google.com/search-console)
6. Replace `PASTE_YOUR_VERIFICATION_CODE_HERE` with actual GSC verification code
7. Submit sitemap: `https://yourdomain.com/sitemap.xml` to GSC

**Documentation**:
- [ANALYTICS_IMPLEMENTATION_GUIDE.md](ANALYTICS_IMPLEMENTATION_GUIDE.md) - Complete setup and optimization guide
- [syscare_v0.1/CLAUDE.md](syscare_v0.1/CLAUDE.md) - Analytics section with technical details
