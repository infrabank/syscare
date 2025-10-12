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
- Tests use CommonJS (`require`) while production code uses ES6 modules
- Test data should reflect real-world Korean business scenarios
