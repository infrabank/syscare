const fs = require('fs');
const path = require('path');

const siteRoot = path.join(__dirname, '..', 'syscare_v0.1');
const read = (name) => fs.readFileSync(path.join(siteRoot, name), 'utf8');

describe('site content integrity', () => {
  test('legacy navigation anchors exist on the rewritten landing page', () => {
    const index = read('index.html');
    const existingIds = new Set(
      [...index.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1])
    );

    for (const name of ['booking.html', 'consultation.html', 'system-check.html']) {
      const html = read(name);
      const anchors = [...html.matchAll(/href=["']index\.html#([^"']+)["']/g)]
        .map((match) => match[1]);

      for (const anchor of anchors) {
        expect(existingIds.has(anchor)).toBe(true);
      }
    }
  });

  test('required region collection is disclosed consistently', () => {
    const diagnosis = read('diagnosis.html');
    const privacy = read('privacy.html');

    expect(diagnosis).toMatch(/name=["']region["'][^>]*required/);
    expect(diagnosis).toContain('필수 항목: 회사명, 담당자명, 연락처, 사업장 지역');
    expect(privacy).toContain('회사명, 담당자명, 연락처, 사업장 지역');
  });

  test('analytics and verification placeholders are not loaded in production pages', () => {
    const htmlFiles = fs.readdirSync(siteRoot).filter((name) => name.endsWith('.html'));

    for (const name of htmlFiles) {
      const html = read(name);
      expect(html).not.toContain('googletagmanager.com/gtag/js');
      expect(html).not.toContain('PASTE_YOUR_VERIFICATION_CODE_HERE');
    }
  });

  test('insecure client-side administrator implementation is disabled', () => {
    const admin = read('admin-bookings.html');

    expect(admin).not.toContain('syscare2024!');
    expect(admin).not.toContain('syscare_admin_auth');
    expect(admin).not.toContain('tables/diagnosis_requests');
    expect(admin).toContain('관리자 기능이 비활성화되어 있습니다');
  });
});
