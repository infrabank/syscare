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
The web application itself requires no build process, but its Tailwind CSS is compiled ahead of time (see below). To run locally:
```bash
cd syscare_v0.1

# Start local server (choose one)
python -m http.server 8000
npx serve .

# Then open http://localhost:8000
```

### Building CSS
Run from the repo root whenever HTML markup or JS template classes change:
```bash
npm run build:css   # one-time build, writes syscare_v0.1/css/tailwind.css
npm run watch:css   # rebuild on change while editing
```
`syscare_v0.1/css/tailwind.css` is a committed build artifact, not a CDN script. Netlify has no build step for this repo, so the compiled file must be regenerated and committed any time markup or class names change.

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

### Status: Not Loaded (2026-07 신뢰성 개편에서 제거, commit 26311cc)

GA4는 사이트에서 로드하지 않는다. `syscare_v0.1/CLAUDE.md`의 "Current Security State" 절이 이 사안의 기준 문서다.

- 어떤 HTML 파일에도 `gtag.js` 스크립트나 Measurement ID가 없다.
- `js/main.js`, `js/system-check.js`, `diagnosis.html`의 `gtag('event', ...)` 호출은 `typeof gtag === 'function'` 가드 뒤에 남아 있어, gtag가 없으면 아무 동작도 하지 않는다. 코드를 지우지 않고 재활성화 지점으로만 남겨둔 상태다.
- Search Console 인증 메타 태그도 placeholder 상태로 실제 배포에 넣지 않는다.

분석 도구를 다시 넣으려면 동의 배너와 기본 거부(default-denied) 설계, 정확한 개인정보 처리방침 고지를 먼저 갖춘 뒤에만 진행한다.

**참고 문서**:
- [syscare_v0.1/CLAUDE.md](syscare_v0.1/CLAUDE.md) - Current Security State, Analytics 관련 세부 사항
- [ANALYTICS_IMPLEMENTATION_GUIDE.md](ANALYTICS_IMPLEMENTATION_GUIDE.md) - 재도입 시 참고할 설정 가이드(현재 미적용 상태 기준으로 다시 검토 필요)
