# SYSCARE 분석 시스템 빠른 시작 가이드

## 🎯 목표
이 가이드를 따라하면 30분 안에 Google Analytics 4와 Search Console이 작동하는 상태가 됩니다.

---

## ✅ 준비사항 체크리스트

시작하기 전에 다음 항목을 확인하세요:

- [ ] 웹사이트가 이미 배포되어 있고 URL이 있음 (예: https://syscare.co.kr)
- [ ] Google 계정 보유 (Gmail)
- [ ] 도메인 관리 권한 (DNS 설정 가능) 또는 웹사이트 HTML 수정 권한
- [ ] 코드 에디터 (VS Code 등)로 HTML 파일 수정 가능

---

## 1단계: Google Analytics 4 설정 (15분)

### 1-1. GA4 계정 생성

1. **Google Analytics 접속**
   - 브라우저에서 https://analytics.google.com 접속
   - Google 계정으로 로그인

2. **관리 메뉴 클릭**
   - 왼쪽 하단의 ⚙️ **관리** 버튼 클릭

3. **계정 만들기**
   - 계정 열 상단의 **+ 계정 만들기** 클릭
   - **계정 이름**: `SYSCARE` 입력
   - 데이터 공유 설정: 모두 체크 (권장)
   - **다음** 클릭

4. **속성 만들기**
   - **속성 이름**: `SYSCARE 웹사이트` 입력
   - **시간대**: `대한민국 (GMT+09:00)` 선택
   - **통화**: `대한민국 원 (KRW)` 선택
   - **다음** 클릭

5. **비즈니스 정보 입력**
   - **업종**: `컴퓨터 및 정보기술` 선택
   - **비즈니스 규모**: `소규모` 선택
   - **사용 목적**: `리드 생성`, `고객 참여도 측정` 선택
   - **만들기** 클릭

6. **데이터 스트림 생성**
   - **플랫폼**: `웹` 선택
   - **웹사이트 URL**: 실제 웹사이트 주소 입력 (예: `https://syscare.co.kr`)
   - **스트림 이름**: `SYSCARE 메인 사이트` 입력
   - **스트림 만들기** 클릭

### 1-2. 측정 ID 복사

✨ **중요: 이 코드를 복사하세요!**

스트림 생성 후 화면에 표시되는 **측정 ID**를 복사합니다.
- 형식: `G-XXXXXXXXXX` (예: `G-ABC123DEF4`)
- 이 코드는 다음 단계에서 사용됩니다.

📋 **측정 ID 메모**:
```
G-____________________
```

---

## 2단계: 웹사이트에 GA4 코드 적용 (10분)

### 2-1. HTML 파일 수정

VS Code 또는 텍스트 에디터로 다음 파일들을 엽니다:

**수정할 파일 (총 7개)**:
- `syscare_v0.1/index.html`
- `syscare_v0.1/diagnosis.html`
- `syscare_v0.1/system-check.html`
- `syscare_v0.1/diagnosis_success.html`
- `syscare_v0.1/regular-checkup.html`
- `syscare_v0.1/security-report-sample.html`
- `syscare_v0.1/admin-bookings.html`

### 2-2. 측정 ID 교체

각 파일에서 `Ctrl+F` (또는 `Cmd+F`)로 다음 텍스트를 찾습니다:
```
G-XXXXXXXXXX
```

**2곳**이 발견됩니다:
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX', {
    ↑ 여기 2곳을 교체
```

**교체 방법**:
1. VS Code에서 `Ctrl+H` (찾기 및 바꾸기)
2. **찾을 내용**: `G-XXXXXXXXXX`
3. **바꿀 내용**: 1-2단계에서 복사한 실제 측정 ID (예: `G-ABC123DEF4`)
4. **모두 바꾸기** 클릭 (파일당 2개 교체됨)
5. **저장** (`Ctrl+S`)

**모든 7개 파일에 대해 반복**합니다.

### 2-3. 변경사항 확인

예시 (index.html):
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ABC123DEF4', {
    'send_page_view': true,
    'allow_google_signals': true,
    'allow_enhanced_conversions': true
  });
</script>
```

✅ **완료!** 이제 GA4 추적이 준비되었습니다.

---

## 3단계: GA4 향상된 측정 활성화 (3분)

### 3-1. 향상된 측정 설정

1. **GA4 관리 화면**으로 이동
   - 좌측 하단 ⚙️ **관리** 클릭
   - **데이터 수집 및 수정** > **데이터 스트림** 클릭
   - 방금 만든 웹 스트림 클릭

2. **향상된 측정 켜기**
   - 하단의 **향상된 측정** 섹션 찾기
   - 토글 스위치가 **켜짐** 상태인지 확인 (파란색)
   - 설정 아이콘 ⚙️ 클릭

3. **다음 항목 모두 체크**:
   - ✅ 페이지 조회수
   - ✅ 스크롤 수 (90%)
   - ✅ 이탈 클릭
   - ✅ 사이트 검색
   - ✅ 동영상 참여
   - ✅ 파일 다운로드
   - ✅ **양식 상호작용** ⭐ (중요!)

4. **저장** 클릭

### 3-2. 전환 이벤트 설정

1. **이벤트 메뉴 이동**
   - 좌측 메뉴: **관리** > **이벤트** 클릭

2. **24-48시간 후 다시 확인**
   - `generate_lead` 이벤트가 목록에 나타날 때까지 대기
   - (실제 사용자가 진단 신청을 해야 이벤트가 수집됨)

3. **전환으로 표시**
   - `generate_lead` 이벤트 옆의 **전환으로 표시** 토글 켜기

---

## 4단계: Google Search Console 설정 (10분)

### 4-1. Search Console 계정 생성

1. **Google Search Console 접속**
   - https://search.google.com/search-console 접속
   - 같은 Google 계정으로 로그인

2. **속성 추가**
   - 좌측 상단 드롭다운 클릭 > **+ 속성 추가** 선택

### 4-2. 인증 방법 선택

**방법 A: 도메인 인증** (권장 - DNS 접근 가능한 경우)

1. **도메인** 탭 선택
2. 도메인 입력: `syscare.co.kr` (http://, www 제외)
3. **계속** 클릭
4. **TXT 레코드 복사** (예: `google-site-verification=abc123...`)

5. **도메인 DNS 설정**
   - 도메인 등록업체 사이트 접속 (가비아, 호스팅케이알 등)
   - DNS 관리 페이지로 이동
   - TXT 레코드 추가:
     - **호스트**: `@` 또는 빈칸
     - **유형**: `TXT`
     - **값**: 복사한 인증 코드 붙여넣기
     - **TTL**: 3600 (또는 기본값)
   - 저장

6. **5분~1시간 대기** 후 Search Console에서 **확인** 클릭

**방법 B: HTML 태그 인증** (간단 - DNS 접근 불가능한 경우)

1. **URL 접두어** 탭 선택
2. 전체 URL 입력: `https://syscare.co.kr`
3. **계속** 클릭
4. **HTML 태그** 방법 선택
5. 메타 태그 복사:
   ```html
   <meta name="google-site-verification" content="abc123xyz..." />
   ```

6. **HTML 파일 수정**
   - 7개 HTML 파일 열기 (2-1 참조)
   - 각 파일에서 다음 줄 찾기:
     ```html
     <meta name="google-site-verification" content="PASTE_YOUR_VERIFICATION_CODE_HERE" />
     ```
   - `PASTE_YOUR_VERIFICATION_CODE_HERE`를 **content 값만** 교체:
     ```html
     <meta name="google-site-verification" content="abc123xyz" />
     ```
   - 모든 파일 저장

7. **웹사이트에 업로드** (FTP, GitHub Pages 등)
8. Search Console에서 **확인** 클릭

### 4-3. Sitemap 제출

인증 완료 후:

1. 좌측 메뉴: **Sitemaps** 클릭
2. **새 사이트맵 추가** 입력란:
   ```
   sitemap.xml
   ```
3. **제출** 클릭

4. 상태가 **성공**으로 변경될 때까지 대기 (최대 24시간)

---

## 5단계: 작동 테스트 (5분)

### 5-1. GA4 실시간 테스트

1. **수정한 웹사이트 배포**
   - FTP, GitHub Pages, Netlify 등으로 업로드

2. **GA4 실시간 보고서 열기**
   - GA4 > 보고서 > 실시간

3. **자신의 사이트 방문**
   - 새 브라우저 탭에서 웹사이트 접속
   - 여러 페이지 클릭
   - CTA 버튼 클릭
   - 진단 페이지 방문

4. **실시간 보고서 확인**
   - 사용자 수: 1명 이상 표시
   - 이벤트: `page_view`, `cta_click` 등 표시

✅ **성공!** 실시간으로 데이터가 들어오면 정상 작동 중입니다.

### 5-2. 이벤트 디버깅 (선택사항)

더 자세한 테스트를 원하면:

1. **브라우저 개발자 도구 열기**
   - `F12` 또는 `Ctrl+Shift+I`
   - **Console** 탭 선택

2. **Network 탭 확인**
   - `gtag` 또는 `collect` 요청 확인
   - 200 OK 상태 확인

3. **GA4 DebugView 사용**
   - GA4 > 관리 > DebugView
   - Chrome Extension "Google Analytics Debugger" 설치
   - 확장 프로그램 활성화 후 사이트 재방문
   - DebugView에서 실시간 이벤트 스트림 확인

---

## 6단계: 첫 주 모니터링

### 배포 후 할 일

**Day 1 (배포일)**:
- [ ] GA4 실시간 보고서에서 데이터 수집 확인
- [ ] Search Console 인증 완료 확인
- [ ] Sitemap 제출 확인

**Day 2-3**:
- [ ] GA4 > 보고서 > 수명 주기 > 획득 확인 (데이터 쌓이기 시작)
- [ ] 전환 이벤트 (`generate_lead`) 수집 확인
- [ ] Search Console > 실적 보고서 확인 (노출 데이터 나타남)

**Week 1 (첫 주 종료 시)**:
- [ ] 전환 이벤트를 전환으로 표시 (GA4 > 관리 > 이벤트)
- [ ] 첫 주간 리포트 확인:
  - 총 방문자 수
  - 전환 수 (진단 신청)
  - 주요 유입 경로
- [ ] 키워드 순위 확인 (Search Console > 실적)

---

## 🎯 예상 결과

### 즉시 (배포 후 1시간 내)
- ✅ GA4 실시간 보고서에 방문자 표시
- ✅ 페이지뷰, 클릭 이벤트 수집

### 24-48시간 후
- ✅ GA4 표준 보고서에 데이터 표시
- ✅ Search Console에 노출수 데이터 나타남
- ✅ 전환 이벤트 수집 시작 (진단 신청 발생 시)

### 1주일 후
- ✅ 트래픽 패턴 파악 가능
- ✅ 주요 유입 키워드 확인 가능
- ✅ 전환율 초기 데이터 확보

### 1개월 후
- ✅ 지역별 트래픽 분석 가능
- ✅ 키워드 순위 변화 추적
- ✅ 전환 퍼널 최적화 시작
- ✅ 월간 성과 리포트 작성

---

## ❓ 자주 묻는 질문

### Q1: GA4에서 데이터가 안 보여요
**A**: 다음을 확인하세요:
1. 측정 ID가 올바르게 교체되었는지 확인 (`G-XXXXXXXXXX` 남아있지 않은지)
2. 웹사이트가 실제로 배포되었는지 확인
3. 브라우저 광고 차단기 비활성화
4. 최대 48시간 대기 (초기 데이터 처리 시간)
5. 크롬 시크릿 모드로 테스트 (캐시 문제 방지)

### Q2: Search Console 인증이 안 돼요
**A**: 인증 방법별 체크:
- **DNS 방법**: TXT 레코드 전파 대기 (5분~48시간), `nslookup -type=TXT yourdomain.com` 명령으로 확인
- **HTML 태그 방법**: 메타 태그가 `<head>` 섹션에 있는지, 파일이 실제 서버에 업로드되었는지 확인

### Q3: 전환 이벤트가 안 보여요
**A**:
1. 실제로 진단 신청을 한 번 해보세요 (테스트 제출)
2. 브라우저 콘솔에서 JavaScript 오류 확인
3. GA4 DebugView에서 `generate_lead` 이벤트 발생 확인
4. diagnosis.html 파일의 코드 수정 확인

### Q4: Sitemap이 오류가 나요
**A**:
1. sitemap.xml의 `yourdomain.com`을 실제 도메인으로 교체했는지 확인
2. https://www.xml-sitemaps.com/validate-xml-sitemap.html 에서 검증
3. robots.txt에 sitemap 경로 확인

---

## 📞 추가 도움이 필요하면

### 공식 문서
- **GA4 도움말**: https://support.google.com/analytics
- **Search Console 도움말**: https://support.google.com/webmasters

### 상세 가이드
- **ANALYTICS_IMPLEMENTATION_GUIDE.md**: 완전한 구현 가이드 (고급 기능)
- **syscare_v0.1/CLAUDE.md**: 기술적 상세 정보

### 테스트 도구
- **GA4 Event Builder**: https://ga-dev-tools.google/ga4/event-builder/
- **구조화된 데이터 테스트**: https://search.google.com/test/rich-results
- **Sitemap 검증**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## ✅ 완료 체크리스트

설정이 모두 끝났는지 확인하세요:

- [ ] GA4 계정 생성 완료
- [ ] 측정 ID 복사 및 7개 HTML 파일에 적용
- [ ] 웹사이트에 업로드/배포 완료
- [ ] GA4 실시간 보고서에서 데이터 확인
- [ ] 향상된 측정 활성화 완료
- [ ] Search Console 속성 추가 및 인증 완료
- [ ] Sitemap 제출 완료
- [ ] 실제 방문 테스트 완료

🎉 **축하합니다!** 이제 SYSCARE 웹사이트의 모든 성과를 추적할 수 있습니다!

---

**마지막 업데이트**: 2025년 1월 15일
**작성자**: Claude Code for SYSCARE
