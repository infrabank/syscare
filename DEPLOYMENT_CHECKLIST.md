# SYSCARE 분석 시스템 배포 체크리스트

이 문서는 분석 시스템을 실제로 활성화할 때 빠뜨리지 말아야 할 항목들을 정리한 것입니다.

---

## 📋 배포 전 체크리스트

### 코드 수정 사항

#### ✅ 1. GA4 측정 ID 교체
**위치**: 7개 HTML 파일 모두

**현재 상태**:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
...
gtag('config', 'G-XXXXXXXXXX', {
```

**수정 후**:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
...
gtag('config', 'G-ABC123DEF4', {
```

**파일 목록**:
- [ ] `syscare_v0.1/index.html` (2개 위치)
- [ ] `syscare_v0.1/diagnosis.html` (2개 위치)
- [ ] `syscare_v0.1/system-check.html` (2개 위치)
- [ ] `syscare_v0.1/diagnosis_success.html` (2개 위치)
- [ ] `syscare_v0.1/regular-checkup.html` (2개 위치)
- [ ] `syscare_v0.1/security-report-sample.html` (2개 위치)
- [ ] `syscare_v0.1/admin-bookings.html` (2개 위치)

**총 교체 횟수**: 14곳 (파일당 2곳 × 7개 파일)

---

#### ✅ 2. Search Console 인증 코드 교체
**위치**: 7개 HTML 파일 모두

**현재 상태**:
```html
<meta name="google-site-verification" content="PASTE_YOUR_VERIFICATION_CODE_HERE" />
```

**수정 후**:
```html
<meta name="google-site-verification" content="실제_인증_코드" />
```

**파일 목록**: (위와 동일한 7개 파일)
- [ ] 각 파일당 1개 위치 수정

**총 교체 횟수**: 7곳

---

#### ✅ 3. Sitemap 도메인 교체
**위치**: `syscare_v0.1/sitemap.xml`

**현재 상태** (6곳):
```xml
<loc>https://yourdomain.com/</loc>
<loc>https://yourdomain.com/diagnosis.html</loc>
<loc>https://yourdomain.com/system-check.html</loc>
<loc>https://yourdomain.com/regular-checkup.html</loc>
<loc>https://yourdomain.com/security-report-sample.html</loc>
<loc>https://yourdomain.com/diagnosis_success.html</loc>
```

**수정 후**:
```xml
<loc>https://syscare.co.kr/</loc>
<loc>https://syscare.co.kr/diagnosis.html</loc>
...
```

- [ ] `yourdomain.com`을 실제 도메인으로 교체 (6곳)
- [ ] `lastmod` 날짜를 오늘 날짜로 업데이트 (6곳)

**총 교체 횟수**: 12곳

---

#### ✅ 4. Robots.txt 도메인 교체
**위치**: `syscare_v0.1/robots.txt`

**현재 상태**:
```txt
Sitemap: https://yourdomain.com/sitemap.xml
```

**수정 후**:
```txt
Sitemap: https://syscare.co.kr/sitemap.xml
```

- [ ] 실제 도메인으로 교체 (1곳)

---

## 🔍 빠른 찾기 및 교체 가이드 (VS Code)

### 방법 1: 파일별 수정

각 파일을 열고:
1. `Ctrl + H` (찾기 및 바꾸기)
2. 찾을 내용: `G-XXXXXXXXXX`
3. 바꿀 내용: 실제 측정 ID
4. **모두 바꾸기** 클릭 (2개 교체됨)
5. 저장 (`Ctrl + S`)

### 방법 2: 전체 프로젝트에서 일괄 교체

1. `Ctrl + Shift + H` (전체 프로젝트 찾기 및 바꾸기)
2. **찾을 내용**: `G-XXXXXXXXXX`
3. **바꿀 내용**: 실제 측정 ID
4. **파일 포함 패턴**: `syscare_v0.1/*.html`
5. **모두 바꾸기** 클릭 (14개 교체됨)
6. 모든 파일 저장 (`Ctrl + K, S`)

**동일한 방법으로**:
- `PASTE_YOUR_VERIFICATION_CODE_HERE` → 실제 GSC 인증 코드
- `yourdomain.com` → 실제 도메인

---

## 🚀 배포 절차

### 단계 1: 코드 수정 완료 확인
- [ ] GA4 측정 ID 교체 완료 (14곳)
- [ ] GSC 인증 코드 교체 완료 (7곳)
- [ ] Sitemap 도메인 교체 완료 (6곳)
- [ ] Robots.txt 도메인 교체 완료 (1곳)
- [ ] 모든 파일 저장 완료

### 단계 2: 로컬 테스트 (선택사항)
- [ ] 로컬 서버 실행: `python -m http.server 8000`
- [ ] 브라우저에서 `http://localhost:8000` 접속
- [ ] 개발자 도구 > Console 탭에서 JavaScript 오류 확인
- [ ] Network 탭에서 `gtag/js` 요청 성공 확인

### 단계 3: 웹사이트 배포
배포 방법에 따라 선택:

**GitHub Pages**:
```bash
cd syscare_v0.1
git add .
git commit -m "Add GA4 and Search Console tracking"
git push origin main
```

**FTP 업로드**:
- [ ] FTP 클라이언트 (FileZilla 등) 실행
- [ ] `syscare_v0.1/` 폴더 전체 업로드
- [ ] `sitemap.xml`, `robots.txt` 포함 확인

**Netlify/Vercel**:
- [ ] 대시보드에서 수동 배포 또는 Git 푸시
- [ ] 배포 완료 대기
- [ ] 배포 URL 확인

### 단계 4: 배포 후 즉시 확인
- [ ] 실제 웹사이트 접속 (https://yourdomain.com)
- [ ] 브라우저 개발자 도구 열기 (`F12`)
- [ ] Console 탭에서 오류 없는지 확인
- [ ] Network 탭에서 다음 요청 확인:
  - ✅ `gtag/js?id=G-...` (200 OK)
  - ✅ `collect?v=2&...` (200 OK)

---

## 📊 GA4 설정 체크리스트

### GA4 콘솔 설정

**접속**: https://analytics.google.com

#### 1. 기본 설정
- [ ] 계정 생성 완료
- [ ] 속성 생성 완료 (SYSCARE 웹사이트)
- [ ] 웹 데이터 스트림 생성 완료
- [ ] 측정 ID 복사 완료 (`G-...`)

#### 2. 향상된 측정
**위치**: 관리 > 데이터 스트림 > [웹 스트림] > 향상된 측정

- [ ] 향상된 측정 **켜짐** 상태 확인
- [ ] 다음 항목 체크 확인:
  - [ ] 페이지 조회수
  - [ ] 스크롤 수
  - [ ] 이탈 클릭
  - [ ] 사이트 검색
  - [ ] 동영상 참여
  - [ ] 파일 다운로드
  - [ ] **양식 상호작용** ⭐

#### 3. 전환 설정 (배포 2-3일 후)
**위치**: 관리 > 이벤트

이벤트 발생 후 설정:
- [ ] `generate_lead` 이벤트 확인 (진단 신청 1건 이상 발생 후)
- [ ] `generate_lead` → **전환으로 표시** 토글 켜기

#### 4. 맞춤 측정기준 (선택사항)
**위치**: 관리 > 맞춤 정의 > 맞춤 측정기준 만들기

- [ ] `button_location` (이벤트 매개변수)
- [ ] `risk_level` (이벤트 매개변수)
- [ ] `form_type` (이벤트 매개변수)

---

## 🔍 Search Console 설정 체크리스트

### Search Console 콘솔 설정

**접속**: https://search.google.com/search-console

#### 1. 속성 추가 및 인증
**방법 A: 도메인 속성** (권장)
- [ ] 도메인 입력 (예: `syscare.co.kr`)
- [ ] TXT 레코드 복사
- [ ] DNS 설정에 TXT 레코드 추가
- [ ] 5분~1시간 대기
- [ ] Search Console에서 **확인** 클릭
- [ ] 인증 성공 확인

**방법 B: URL 접두어**
- [ ] 전체 URL 입력 (예: `https://syscare.co.kr`)
- [ ] HTML 태그 방법 선택
- [ ] 메타 태그 복사
- [ ] 7개 HTML 파일에 적용
- [ ] 웹사이트 배포
- [ ] Search Console에서 **확인** 클릭
- [ ] 인증 성공 확인

#### 2. Sitemap 제출
- [ ] 좌측 메뉴 > **Sitemaps** 클릭
- [ ] 입력란에 `sitemap.xml` 입력
- [ ] **제출** 클릭
- [ ] 상태: **성공** 확인 (최대 24시간 대기)

#### 3. URL 검사 (선택사항)
주요 페이지 색인 요청:
- [ ] `https://yourdomain.com/` (메인)
- [ ] `https://yourdomain.com/diagnosis.html`
- [ ] `https://yourdomain.com/system-check.html`

각 URL:
1. URL 검사 도구에 URL 입력
2. **색인 생성 요청** 클릭

---

## ✅ 배포 후 24시간 확인 사항

### GA4 데이터 확인
**위치**: GA4 > 보고서 > 실시간

- [ ] **사용자 수**: 0명 이상 (실시간 방문자)
- [ ] **이벤트**: `page_view` 이벤트 표시
- [ ] **페이지**: 주요 페이지 경로 표시

**위치**: GA4 > 보고서 > 수명 주기 > 획득

- [ ] 데이터 누적 시작 (24-48시간 후)
- [ ] 세션 수, 사용자 수 확인

### Search Console 데이터 확인
**위치**: Search Console > 실적

- [ ] 노출수 데이터 나타남 (2-3일 후)
- [ ] 클릭수 데이터 누적

**위치**: Search Console > Sitemaps

- [ ] 제출된 사이트맵 상태: **성공**
- [ ] 발견된 URL 수: 6개

---

## 🐛 문제 해결 체크리스트

### GA4 데이터가 안 보일 때

**즉시 확인**:
- [ ] 브라우저 개발자 도구 > Console 탭: JavaScript 오류 없음
- [ ] Network 탭: `gtag/js` 요청 성공 (200 OK)
- [ ] 측정 ID가 정확히 교체되었는지 확인 (HTML 소스 보기)
- [ ] 광고 차단기 비활성화 후 테스트

**배포 확인**:
- [ ] 웹사이트 HTML 소스 보기 (`Ctrl+U`)
- [ ] `G-XXXXXXXXXX` 남아있지 않은지 확인
- [ ] 실제 측정 ID (`G-ABC123...`)로 교체되었는지 확인

**대기 필요**:
- [ ] 48-72시간 대기 (초기 데이터 처리)
- [ ] GA4 실시간 보고서 vs 표준 보고서 차이 이해

### Search Console 인증 실패 시

**HTML 태그 방법**:
- [ ] 메타 태그가 `<head>` 내부에 있는지 확인
- [ ] `content` 속성 값만 교체했는지 확인 (태그 전체 X)
- [ ] 파일이 실제 서버에 배포되었는지 확인
- [ ] 브라우저에서 소스 보기로 태그 존재 확인

**DNS 방법**:
- [ ] TXT 레코드 전파 대기 (최대 48시간)
- [ ] 명령 프롬프트에서 확인:
  ```bash
  nslookup -type=TXT yourdomain.com
  ```
- [ ] TXT 레코드에 `google-site-verification=...` 포함 확인

### 이벤트가 수집되지 않을 때

**진단 신청 이벤트 (`generate_lead`)**:
- [ ] 실제로 진단 신청 폼 제출 해봄 (테스트)
- [ ] diagnosis.html 코드에 GA4 이벤트 코드 포함 확인
- [ ] JavaScript Console에서 `gtag` 함수 존재 확인:
  ```javascript
  typeof gtag  // "function" 이어야 함
  ```
- [ ] 제출 성공 시 `generate_lead` 이벤트 발생 확인

**CTA 클릭 이벤트 (`cta_click`)**:
- [ ] CTA 버튼 클릭 해봄
- [ ] js/main.js 코드 수정 확인
- [ ] GA4 DebugView에서 이벤트 확인

---

## 📈 1주일 후 성과 확인

### GA4 주요 지표
**위치**: GA4 > 보고서 > 수명 주기 > 획득

- [ ] **총 사용자 수**: _______명
- [ ] **신규 사용자 수**: _______명
- [ ] **세션 수**: _______
- [ ] **이벤트 수**: _______
- [ ] **전환 수** (`generate_lead`): _______건

### 지역별 트래픽
**위치**: GA4 > 보고서 > 사용자 > 인구통계 세부정보

- [ ] 세종특별자치시: _______명
- [ ] 대전광역시: _______명
- [ ] 천안시: _______명
- [ ] 청주시: _______명
- [ ] 타겟 지역 비율: _______%

### Search Console 주요 지표
**위치**: Search Console > 실적

- [ ] **총 클릭수**: _______
- [ ] **총 노출수**: _______
- [ ] **평균 CTR**: _______%
- [ ] **평균 게재순위**: _______

### 주요 키워드 순위
- [ ] "세종 전산 관리": _______위
- [ ] "대전 IT 유지보수": _______위
- [ ] "충청 전산 보안": _______위

---

## 📝 메모 공간

### GA4 측정 ID
```
G-____________________
```

### Search Console 인증 코드
```
google-site-verification=____________________
```

### 실제 도메인
```
https://____________________
```

### 배포 일시
```
배포 완료: ____년 __월 __일 __:__
```

### 문제 발생 시 기록
```
문제:
해결 방법:
완료 일시:
```

---

## 🎯 다음 단계

배포 및 1주일 모니터링 완료 후:

- [ ] **ANALYTICS_IMPLEMENTATION_GUIDE.md** 읽기 (고급 최적화)
- [ ] 주간 모니터링 루틴 시작 (월요일 30분)
- [ ] Looker Studio 대시보드 생성 (선택사항)
- [ ] 지역별 A/B 테스트 계획 수립

---

**작성일**: 2025년 1월 15일
**버전**: 1.0
**담당자**: _________________
