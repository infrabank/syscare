# SYSCARE 성과 측정 및 분석 전략 가이드

## 목차
1. [개요](#개요)
2. [Google Analytics 4 (GA4) 구현](#google-analytics-4-ga4-구현)
3. [Google Search Console 설정](#google-search-console-설정)
4. [지역별 트래픽 추적](#지역별-트래픽-추적)
5. [키워드 순위 모니터링](#키워드-순위-모니터링)
6. [전환율 추적](#전환율-추적)
7. [지속적 최적화 전략](#지속적-최적화-전략)

---

## 개요

SYSCARE는 세종·대전·충청 지역 중소기업을 타겟으로 하는 지역 기반 IT 서비스입니다. 이 가이드는 2025년 최신 Google Analytics 4 (GA4)와 Google Search Console을 활용하여 성과를 측정하고 지속적으로 최적화하는 방법을 제공합니다.

### 핵심 측정 목표
- **지역별 트래픽**: 세종, 대전, 천안, 청주 등 타겟 지역 유입 추적
- **키워드 순위**: "세종 전산 관리", "대전 IT 유지보수" 등 지역 키워드 순위
- **전환율**: 무료 진단 신청 (diagnosis.html) 완료율
- **사용자 행동**: 체류시간, 스크롤 깊이, CTA 클릭률

---

## Google Analytics 4 (GA4) 구현

### 1단계: GA4 속성 생성

1. [Google Analytics](https://analytics.google.com/) 접속
2. 관리 > 계정 생성 또는 기존 계정 선택
3. "속성 만들기" 클릭
   - **속성 이름**: SYSCARE 웹사이트
   - **시간대**: 대한민국 (GMT+09:00)
   - **통화**: 대한민국 원 (KRW)
4. 비즈니스 정보 입력
   - **업종**: 컴퓨터 및 정보기술
   - **비즈니스 규모**: 소규모
5. 데이터 스트림 생성
   - **플랫폼**: 웹
   - **웹사이트 URL**: https://yourdomain.com (실제 도메인 입력)
   - **스트림 이름**: SYSCARE 메인 사이트

### 2단계: 추적 코드 설치

GA4가 제공하는 추적 코드를 모든 HTML 페이지의 `<head>` 섹션에 추가합니다.

#### 설치 위치
다음 파일들에 추가:
- `syscare_v0.1/index.html`
- `syscare_v0.1/diagnosis.html`
- `syscare_v0.1/diagnosis_success.html`
- `syscare_v0.1/system-check.html`
- `syscare_v0.1/regular-checkup.html`
- `syscare_v0.1/admin-bookings.html`
- `syscare_v0.1/security-report-sample.html`

#### 추적 코드 템플릿
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  // 기본 페이지뷰 추적
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    // 지역 정보 자동 수집 활성화
    'allow_google_signals': true,
    // 향상된 측정 활성화
    'allow_enhanced_conversions': true
  });
</script>
```

**주의**: `G-XXXXXXXXXX`를 실제 측정 ID로 교체하세요.

#### 설치 위치 (코드 내)
`<head>` 태그 내부, Tailwind CSS CDN 링크 바로 아래에 위치:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SYSCARE | 세종, 대전, 충청도 중소기업 전산 유지보수 및 보안 서비스</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Analytics 4 -->
  <!-- 여기에 GA4 코드 삽입 -->

  <!-- 나머지 head 콘텐츠 -->
</head>
```

### 3단계: 향상된 측정 활성화

GA4 관리 > 데이터 스트림 > 웹 스트림 선택 > "향상된 측정" 설정

다음 항목을 활성화하세요:
- ✅ **페이지 조회수** (기본 활성화)
- ✅ **스크롤 추적** (90% 스크롤 시 이벤트 발생)
- ✅ **아웃바운드 클릭** (외부 링크 클릭 추적)
- ✅ **사이트 검색** (해당 시 활성화)
- ✅ **동영상 참여** (유튜브 동영상 추가 시 활성화)
- ✅ **파일 다운로드** (보안 리포트 샘플 다운로드 추적)
- ✅ **양식 상호작용** (**중요**: diagnosis.html 폼 추적용)

### 4단계: 맞춤 이벤트 설정

SYSCARE의 핵심 전환 이벤트를 추적하기 위한 맞춤 코드입니다.

#### diagnosis.html 폼 제출 추적

`syscare_v0.1/diagnosis.html` 파일의 폼 제출 핸들러 수정:

```javascript
// 기존 폼 제출 코드 찾기
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  // GA4 이벤트 전송 추가 (Formspree 제출 전)
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      'event_category': 'conversion',
      'event_label': 'diagnosis_form_submission',
      'value': 1
    });
  }

  // 기존 Formspree 제출 로직
  // ... 나머지 코드
});
```

#### CTA 버튼 클릭 추적

`syscare_v0.1/js/main.js`의 `initCTAButtons()` 함수 수정:

```javascript
function initCTAButtons() {
  const ctaButtons = document.querySelectorAll('a[href="diagnosis.html"]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // GA4 이벤트 전송
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

      // 기존 ripple 효과 코드
      // ... 나머지 코드
    });
  });
}
```

#### 전산 상태 확인 완료 추적

`syscare_v0.1/js/system-check.js`의 `processAssessment()` 함수에 추가:

```javascript
function processAssessment() {
  // ... 기존 점수 계산 로직

  const result = calculateScore(data);

  // GA4 이벤트 전송
  if (typeof gtag === 'function') {
    gtag('event', 'assessment_completed', {
      'event_category': 'engagement',
      'event_label': 'system_check',
      'risk_level': result.riskLevel,
      'score': result.score,
      'has_contact_info': !!(data.phone && data.email)
    });
  }

  // 결과 표시 로직
  displayResults(result);
}
```

### 5단계: 전환 이벤트 설정

GA4 관리 > 이벤트 > "전환으로 표시" 토글 활성화:

1. **generate_lead** - 진단 신청 폼 제출 (최우선 전환)
2. **assessment_completed** - 전산 상태 확인 완료
3. **cta_click** - 주요 CTA 버튼 클릭 (참여도 지표)
4. **form_start** - 폼 입력 시작 (향상된 측정 자동 수집)

### 6단계: 맞춤 보고서 생성

#### 지역별 전환 보고서

GA4 > 탐색 > 빈 템플릿 > 다음 설정:

**측정기준**:
- 도시 (City)
- 소스/매체 (Source/Medium)

**측정항목**:
- 사용자 수 (Users)
- 세션 수 (Sessions)
- 전환 수 (Conversions) - generate_lead
- 전환율 (Conversion rate)

**필터**:
- 국가 = 대한민국 (South Korea)
- 도시 = 세종특별자치시, 대전광역시, 천안시, 청주시, 아산시, 공주시

#### 유입경로 분석 (Funnel Analysis)

GA4 > 탐색 > 유입경로 탐색 > 단계 설정:

1. **랜딩 페이지 방문**: `page_view` (page_location contains "index.html")
2. **CTA 클릭**: `cta_click`
3. **진단 페이지 도달**: `page_view` (page_location contains "diagnosis.html")
4. **폼 입력 시작**: `form_start`
5. **진단 신청 완료**: `generate_lead`

**측정기준**: 도시, 소스/매체, 기기 카테고리

---

## Google Search Console 설정

### 1단계: 속성 추가 및 소유권 확인

#### 도메인 속성 추가 (권장)

1. [Google Search Console](https://search.google.com/search-console) 접속
2. "속성 추가" 클릭
3. **도메인 속성** 선택
4. 도메인 입력: `yourdomain.com` (http://, https://, www 제외)

#### DNS 레코드를 통한 확인 (가장 포괄적)

1. Search Console이 제공하는 TXT 레코드 복사
   - 예: `google-site-verification=abcd1234xyz`
2. 도메인 등록업체(가비아, 호스팅케이알 등)의 DNS 관리 페이지 접속
3. TXT 레코드 추가:
   - **호스트/이름**: @ 또는 빈칸
   - **유형**: TXT
   - **값**: 복사한 인증 코드
   - **TTL**: 3600 또는 기본값
4. DNS 전파 대기 (5분~48시간)
5. Search Console에서 "확인" 클릭

#### HTML 태그를 통한 확인 (대안)

DNS 접근이 불가능한 경우:

1. Search Console에서 "HTML 태그" 방법 선택
2. 제공된 메타 태그 복사:
```html
<meta name="google-site-verification" content="abcd1234xyz" />
```
3. 모든 주요 HTML 파일의 `<head>` 섹션에 추가 (GA4 코드 아래):
   - `index.html`
   - `diagnosis.html`
   - `system-check.html`
4. 파일 업로드 후 "확인" 클릭

### 2단계: Sitemap 제출

#### sitemap.xml 생성

`syscare_v0.1/sitemap.xml` 파일 생성:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- 메인 랜딩 페이지 (최우선) -->
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 주요 전환 페이지 -->
  <url>
    <loc>https://yourdomain.com/diagnosis.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://yourdomain.com/system-check.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 지원 페이지 -->
  <url>
    <loc>https://yourdomain.com/regular-checkup.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://yourdomain.com/security-report-sample.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
```

**주의**:
- `yourdomain.com`을 실제 도메인으로 교체
- `lastmod` 날짜를 업데이트 시마다 수정
- Legacy 페이지(booking.html, consultation.html)는 제외

#### Sitemap 제출 방법

1. Search Console > Sitemaps 메뉴
2. "새 사이트맵 추가" 입력란에 `sitemap.xml` 입력
3. "제출" 클릭
4. 상태가 "성공"으로 변경될 때까지 대기 (최대 24시간)

### 3단계: robots.txt 설정

`syscare_v0.1/robots.txt` 파일 생성:

```txt
# SYSCARE 웹사이트 크롤링 규칙

User-agent: *
Allow: /

# 관리자 페이지는 검색 엔진에서 제외
Disallow: /admin-bookings.html

# Success 페이지는 직접 검색 결과에서 제외 (이메일 링크로만 접근)
Disallow: /diagnosis_success.html

# Legacy 페이지 제외
Disallow: /booking.html
Disallow: /consultation.html

# Sitemap 위치
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 지역별 트래픽 추적

### GA4 지역 보고서 활용

#### 기본 지역 보고서

GA4 > 보고서 > 수명 주기 > 획득 > 사용자 획득

1. **측정기준 추가**: "도시" 클릭
2. **검색 필터**: "세종", "대전", "천안", "청주" 입력
3. **비교 추가**: 세종특별자치시 vs 대전광역시 vs 기타 지역

#### 맞춤 탐색 보고서 생성

GA4 > 탐색 > 자유 형식 탐색

**행 (측정기준)**:
- 도시 (City)
- 소스/매체 (Source/Medium)

**값 (측정항목)**:
- 사용자 수
- 신규 사용자 수
- 세션 수
- 참여 세션 수
- 평균 참여 시간
- 전환 수 (generate_lead)

**필터 추가**:
```
도시 일치 조건:
- 세종특별자치시
- 대전광역시
- 천안시
- 청주시
- 아산시
- 공주시
- 논산시
- 계룡시
```

#### 세그먼트 생성

타겟 지역 사용자를 별도 세그먼트로 저장:

1. GA4 > 탐색 > 세그먼트 > "+" 클릭
2. **맞춤 세그먼트 생성**:
   - **이름**: 타겟 지역 (세종·대전·충청)
   - **조건**:
     - 도시가 다음 중 하나와 일치: 세종특별자치시, 대전광역시, 천안시, 청주시
3. 저장 후 모든 보고서에 적용 가능

### 지역별 성과 지표 대시보드

#### Looker Studio 연동 (무료)

1. [Looker Studio](https://lookerstudio.google.com/) 접속
2. "만들기" > "데이터 소스"
3. Google Analytics 선택 > SYSCARE 속성 연결
4. "보고서 만들기"

#### 대시보드 구성 예시

**위젯 1: 지역별 사용자 지도**
- 차트 유형: 지도
- 측정기준: 도시
- 측정항목: 사용자 수
- 필터: 국가 = 대한민국

**위젯 2: 지역별 전환율 표**
| 도시 | 사용자 수 | 세션 수 | 전환 수 | 전환율 |
|------|-----------|---------|---------|--------|
| 세종특별자치시 | | | | |
| 대전광역시 | | | | |
| 천안시 | | | | |
| 청주시 | | | | |

**위젯 3: 시간대별 트렌드**
- 차트 유형: 시계열 그래프
- 측정기준: 날짜
- 측정항목: 사용자 수, 전환 수
- 세그먼트: 타겟 지역

---

## 키워드 순위 모니터링

### Google Search Console 실적 보고서

#### 핵심 지역 키워드 목록

SYSCARE 타겟 키워드:

**1차 키워드 (최우선)**:
- 세종 전산 관리
- 대전 IT 유지보수
- 충청 전산 보안
- 세종 IT 관리
- 대전 전산 유지보수

**2차 키워드 (중요)**:
- 세종 랜섬웨어 예방
- 대전 서버 관리
- 천안 IT 아웃소싱
- 청주 전산실 관리
- 세종 네트워크 보안

**3차 키워드 (롱테일)**:
- 세종 중소기업 전산 관리
- 대전 전산 장애 예방
- 충청도 IT 전문 업체
- 세종시 무료 전산 진단

#### 실적 보고서 설정

Search Console > 실적 > 검색결과 탭

1. **날짜 범위**: 최근 3개월 (비교 모드: 전년 동기)
2. **필터 추가**:
   - **검색어**: 위 키워드 목록 중 하나 입력
   - **국가**: 대한민국
3. **측정항목 확인**:
   - ✅ 총 클릭수
   - ✅ 총 노출수
   - ✅ 평균 CTR (클릭률)
   - ✅ 평균 게재순위

#### 순위 추적 스프레드시트 템플릿

매주 월요일 오전 10시에 다음 데이터 기록:

```
날짜 | 키워드 | 클릭수 | 노출수 | CTR | 평균순위 | 전주대비 변화
2025-01-13 | 세종 전산 관리 | 45 | 320 | 14.1% | 3.2 | ▲ 1.1
2025-01-13 | 대전 IT 유지보수 | 38 | 280 | 13.6% | 4.5 | ▼ 0.3
...
```

**자동화 옵션**: Search Console API + Google Sheets 연동

### 페이지별 검색 성과

#### 최적화 우선순위 페이지

Search Console > 실적 > "페이지" 탭

**모니터링 대상**:
1. `/` (index.html) - 메인 랜딩 페이지
2. `/diagnosis.html` - 전환 페이지
3. `/system-check.html` - 참여형 콘텐츠

**최적화 기준**:
- 노출수 많지만 CTR 낮음 → 메타 설명 개선
- 순위 5~15위 → 콘텐츠 보강으로 상위 진입 가능
- 순위 1~3위 → 현재 전략 유지

### Search Console Insights 활용 (2025년 신기능)

Search Console > Insights (메인 대시보드에 통합됨)

**주요 지표**:
- **실적 좋은 콘텐츠**: 클릭수 상위 페이지
- **최근 실적**: 지난 7일간 트래픽 변화
- **신규 콘텐츠 실적**: 새로 추가한 페이지 성과
- **참조 링크**: 어떤 사이트에서 링크했는지

---

## 전환율 추적

### 전환 퍼널 분석

#### 전체 전환 경로

```
1. 랜딩 (index.html)
   ↓ [CTA 클릭: cta_click]
2. 진단 페이지 도달 (diagnosis.html)
   ↓ [폼 입력 시작: form_start]
3. 폼 작성 중
   ↓ [제출 버튼 클릭]
4. 진단 신청 완료 (generate_lead)
   ↓
5. 성공 페이지 (diagnosis_success.html)
```

#### GA4 유입경로 탐색 보고서

GA4 > 탐색 > 유입경로 탐색

**단계 설정**:
- **1단계**: `page_view` (page_location = "/")
  - 기준선: 100%
- **2단계**: `cta_click` (destination = "diagnosis_page")
  - 이탈률 확인
- **3단계**: `page_view` (page_location = "/diagnosis.html")
  - 중간 이탈 방지 필요
- **4단계**: `form_start`
  - 폼 로딩 문제 체크
- **5단계**: `generate_lead`
  - 최종 전환율 계산

**측정기준 브레이크다운**:
- 도시별 전환율
- 기기별 전환율 (모바일 vs 데스크톱)
- 소스별 전환율 (Google Organic, Naver, Direct 등)

### 전환율 최적화 (CRO) 체크포인트

#### 진단 신청 폼 (diagnosis.html)

**추적할 이벤트**:

```javascript
// 폼 필드별 상호작용 추적
const formFields = ['company_name', 'contact_name', 'phone', 'email'];

formFields.forEach(fieldName => {
  document.querySelector(`[name="${fieldName}"]`).addEventListener('focus', function() {
    gtag('event', 'form_field_focus', {
      'event_category': 'form_interaction',
      'field_name': fieldName
    });
  });
});

// 폼 이탈 추적 (작성 중 이탈)
window.addEventListener('beforeunload', function(e) {
  const form = document.getElementById('diagnosisForm');
  if (form.dataset.started === 'true' && form.dataset.submitted !== 'true') {
    gtag('event', 'form_abandonment', {
      'event_category': 'form_interaction',
      'filled_fields': getFilledFieldCount(),
      'total_fields': formFields.length
    });
  }
});
```

#### 전환율 개선 기회 발견

**GA4 보고서 활용**:

1. **높은 이탈률 단계 찾기**:
   - 유입경로 보고서에서 50% 이상 이탈하는 단계 확인
   - 해당 페이지의 문제점 분석 (로딩 속도, UI/UX 등)

2. **기기별 전환율 격차**:
   - 모바일 전환율이 데스크톱 대비 20% 이상 낮으면 모바일 최적화 필요

3. **지역별 전환율 격차**:
   - 타겟 지역 (세종·대전) 전환율이 평균보다 낮으면 지역 맞춤 메시지 강화

### A/B 테스트 추적

#### CTA 버튼 문구 테스트 예시

**변수 A (기존)**: "무료 예방 진단 받기"
**변수 B (테스트)**: "30분 무료 진단 신청 (세종·대전 당일 방문)"

```javascript
// 사용자를 무작위로 그룹 분배
const testGroup = Math.random() < 0.5 ? 'A' : 'B';

// 버튼 문구 변경
if (testGroup === 'B') {
  document.querySelectorAll('.cta-diagnosis').forEach(button => {
    button.textContent = '30분 무료 진단 신청 (세종·대전 당일 방문)';
  });
}

// 클릭 시 그룹 정보 전송
gtag('event', 'cta_click', {
  'event_category': 'ab_test',
  'ab_test_group': testGroup,
  'button_variant': testGroup === 'A' ? 'default' : 'urgency_local'
});
```

#### GA4에서 결과 분석

GA4 > 탐색 > 자유 형식

**측정기준**: 맞춤 이벤트 매개변수 `ab_test_group`
**측정항목**: 이벤트 수 (cta_click), 전환 수 (generate_lead)

**승자 판정 기준**:
- 최소 표본: 각 그룹당 100명 이상
- 통계적 유의성: 전환율 차이 20% 이상

---

## 지속적 최적화 전략

### 일일 모니터링 (10분)

**체크리스트**:
- [ ] GA4 실시간 보고서 확인 (이상 트래픽 감지)
- [ ] 오류 로그 확인 (폼 제출 실패율)
- [ ] 전일 전환 수 확인 (목표 대비 달성률)

**알림 설정**:

GA4 > 관리 > 맞춤 알림 생성:
- **알림 이름**: 진단 신청 급감 알림
- **조건**: 일일 전환 수 (generate_lead) < 5
- **알림 방법**: 이메일 (jhw@mlkit.co.kr)

### 주간 리뷰 (30분, 매주 월요일)

**보고서 생성**:

1. **지역별 트래픽 비교**
   - 세종·대전·충청 지역 유입: 전주 대비 ±%
   - 타겟 지역 외 유입 비율

2. **핵심 키워드 순위 변동**
   - Search Console 스프레드시트 업데이트
   - 순위 하락 키워드 파악 → 콘텐츠 보강

3. **전환율 트렌드**
   - 주간 전환율: %
   - 전주 대비: ▲/▼ %
   - 이탈률 높은 단계: [단계명]

**액션 아이템 도출**:
- 개선이 필요한 페이지 1~2개 선정
- 다음 주 실험 계획 수립 (A/B 테스트, 콘텐츠 수정 등)

### 월간 딥다이브 분석 (2시간, 매월 첫째 주)

#### 1. 지역별 ROI 분석

**세종특별자치시**:
- 유입: [N]명
- 전환: [N]건
- 전환율: [N]%
- CPL (전환당 비용): [광고비] / [전환 수]

**대전광역시**:
- 동일 지표 계산

**인사이트**:
- 어느 지역이 가장 효율적인가?
- 저조한 지역의 원인 파악 (키워드 순위? 광고 노출?)

#### 2. 콘텐츠 성과 평가

Search Console > 실적 > 페이지별 정렬

**개선 대상 선정**:
- 노출수 상위 10개 페이지 중 CTR 5% 미만인 페이지
- 순위 10~20위에 있는 페이지 (상위 진입 가능성 높음)

**최적화 방법**:
- 제목 태그 개선 (지역명 + 강력한 혜택)
- 메타 설명 개선 (구체적 수치 + CTA)
- 구조화된 데이터 추가 (JSON-LD 업데이트)

#### 3. 사용자 행동 패턴 분석

GA4 > 탐색 > 경로 탐색

**질문**:
- 사용자가 diagnosis.html에 도달하기 전 어떤 경로를 거치는가?
- 이탈률이 높은 페이지는?
- 예상 외로 인기 있는 콘텐츠는?

**최적화 아이디어**:
- 인기 페이지에 CTA 추가 배치
- 이탈률 높은 페이지의 콘텐츠 개선 또는 제거

#### 4. 기술적 SEO 점검

**Search Console > 커버리지**:
- 인덱싱 오류 확인 (404, 서버 오류 등)
- 제외된 페이지 확인 (의도적 제외인지 검토)

**Core Web Vitals**:
- LCP (최대 콘텐츠 렌더링): < 2.5초 (양호)
- FID (최초 입력 지연): < 100ms (양호)
- CLS (누적 레이아웃 이동): < 0.1 (양호)

**개선이 필요한 경우**:
- 이미지 최적화 (WebP 변환, 지연 로딩)
- Chart.js 로딩 최적화
- 불필요한 JavaScript 제거

### 분기별 전략 조정 (4시간, 분기 첫째 주)

#### 1. 목표 달성도 평가

**분기 목표 예시**:
- 세종·대전 지역 유입: 1,500명/월
- 진단 신청 전환율: 3%
- 주요 키워드 상위 5위 진입: 5개

**달성도 체크**:
| 목표 | 목표값 | 실제값 | 달성률 |
|------|--------|--------|--------|
| 지역 유입 | 1,500 | 1,320 | 88% |
| 전환율 | 3% | 2.7% | 90% |
| 키워드 순위 | 5개 | 3개 | 60% |

#### 2. 경쟁사 분석

**타겟 경쟁사** (세종·대전 IT 유지보수 업체):
- 주요 키워드에서 경쟁사 순위 확인
- 경쟁사 사이트 방문 → 강점/약점 분석
- 차별화 포인트 재정립

**도구 활용**:
- Google 검색 (시크릿 모드)
- Naver 검색 (지역 설정: 세종/대전)
- SimilarWeb (경쟁사 트래픽 추정)

#### 3. 신규 콘텐츠 기획

**데이터 기반 주제 선정**:

Search Console > 실적 > 검색어

**기회 키워드 발굴**:
- 노출수는 많지만 현재 페이지가 없는 키워드
- 예: "세종 랜섬웨어 피해 사례", "대전 서버 다운 대응"

**콘텐츠 형식**:
- 블로그 형식 콘텐츠 페이지 추가
- 사례 연구 (성공 사례 상세 페이지)
- FAQ 페이지 (자주 묻는 질문)

#### 4. 다음 분기 목표 설정

**SMART 기준**:
- **S**pecific (구체적): "진단 신청 증가"가 아닌 "월 45건으로 증가"
- **M**easurable (측정 가능): GA4로 추적 가능한 지표
- **A**chievable (달성 가능): 현재 대비 20~30% 증가 목표
- **R**elevant (관련성): 비즈니스 목표와 연계
- **T**ime-bound (기한): 분기 말까지

---

## 고급 추적 및 분석

### 전화 통화 추적

#### CallRail 또는 유사 서비스 통합

SYSCARE 연락처: 070-8015-8079

**설정**:
1. CallRail에서 동적 전화번호 발급
2. GA4와 연동하여 전화 전환 추적
3. 지역별/소스별 전화 유입 분석

**HTML 수정**:
```html
<!-- 기존 -->
<a href="tel:070-8015-8079">070-8015-8079</a>

<!-- CallRail 적용 후 -->
<a href="tel:070-8015-8079" class="callrail-tracking">070-8015-8079</a>
```

### 히트맵 분석 (Hotjar 또는 Microsoft Clarity)

#### Microsoft Clarity 통합 (무료)

1. [Microsoft Clarity](https://clarity.microsoft.com/) 가입
2. 프로젝트 생성: SYSCARE 웹사이트
3. 추적 코드 복사

**설치 위치**: 모든 HTML 파일 `<head>` 내부 (GA4 코드 아래)

```html
<!-- Microsoft Clarity -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

**분석 가능 항목**:
- **히트맵**: 사용자가 가장 많이 클릭하는 영역
- **스크롤맵**: 페이지 어디까지 읽는지 확인
- **세션 녹화**: 실제 사용자 행동 재생
- **Rage Clicks**: 같은 곳을 여러 번 클릭 (불만 지점)

**최적화 사례**:
- CTA 버튼이 히트맵에서 차가운 영역 → 위치 변경 또는 디자인 개선
- 폼에서 Rage Clicks 발생 → 해당 필드 간소화 또는 설명 추가

### UTM 매개변수 추적

#### 캠페인별 성과 측정

**UTM 생성 예시** (Google Campaign URL Builder 사용):

```
원본 URL: https://yourdomain.com/diagnosis.html

네이버 블로그 포스팅:
https://yourdomain.com/diagnosis.html?utm_source=naver&utm_medium=blog&utm_campaign=sejong_seo&utm_content=jan2025

카카오톡 비즈니스 메시지:
https://yourdomain.com/diagnosis.html?utm_source=kakao&utm_medium=business_message&utm_campaign=winter_promo&utm_content=diagnosis_cta

지역 커뮤니티 광고:
https://yourdomain.com/diagnosis.html?utm_source=daejeon_community&utm_medium=display_ad&utm_campaign=local_awareness
```

#### GA4에서 캠페인 성과 확인

GA4 > 보고서 > 획득 > 트래픽 획득

**측정기준**: 세션 소스/매체
**측정항목**: 세션 수, 전환 수, 전환율

**최적화 판단**:
- 전환율 5% 이상 → 예산 증액
- 전환율 1% 미만 → 메시지 수정 또는 중단

---

## 실전 체크리스트

### 초기 설정 (첫 주)

- [ ] GA4 계정 생성 및 속성 설정
- [ ] GA4 추적 코드 모든 페이지에 설치
- [ ] 향상된 측정 활성화
- [ ] 맞춤 이벤트 코드 추가 (generate_lead, cta_click 등)
- [ ] 전환 이벤트 설정 (generate_lead를 전환으로 표시)
- [ ] Google Search Console 속성 추가 및 소유권 확인
- [ ] sitemap.xml 생성 및 제출
- [ ] robots.txt 생성 및 업로드
- [ ] GA4와 Search Console 연동

### 매일 (10분)

- [ ] GA4 실시간 보고서 확인
- [ ] 전일 전환 수 확인 (목표: 일 5건 이상)
- [ ] 오류 알림 확인 (이메일)

### 매주 월요일 (30분)

- [ ] Search Console 키워드 순위 스프레드시트 업데이트
- [ ] 주간 트래픽 리포트 생성 (지역별, 소스별)
- [ ] 전환 퍼널 분석 (이탈률 높은 단계 파악)
- [ ] 액션 아이템 3개 도출

### 매월 첫째 주 (2시간)

- [ ] 지역별 ROI 분석
- [ ] 콘텐츠 성과 평가 (CTR, 평균 순위)
- [ ] 사용자 행동 패턴 분석 (경로 탐색)
- [ ] Core Web Vitals 점검
- [ ] 월간 리포트 작성 및 공유

### 분기 첫째 주 (4시간)

- [ ] 목표 달성도 평가
- [ ] 경쟁사 분석
- [ ] 신규 콘텐츠 3개 기획
- [ ] 다음 분기 목표 설정 (SMART 기준)
- [ ] A/B 테스트 결과 정리

---

## 예상 성과 지표 (3개월 후)

### 트래픽

- **총 방문자**: 월 3,000~5,000명
- **타겟 지역 비율**: 전체 트래픽의 40~50%
- **Organic 검색 비율**: 60% 이상

### 키워드 순위

- **상위 5위 진입**: 5~7개 키워드
- **상위 10위 진입**: 15~20개 키워드

### 전환

- **진단 신청**: 월 30~50건
- **전환율**: 2~3%
- **전화 문의**: 월 10~15건

### 참여도

- **평균 세션 시간**: 2분 30초 이상
- **이탈률**: 50% 이하
- **페이지/세션**: 2.5 이상

---

## 문제 해결 가이드

### GA4 데이터가 수집되지 않을 때

**체크리스트**:
1. 추적 코드가 `<head>` 태그 내에 올바르게 설치되었는지 확인
2. 브라우저 개발자 도구 > Network 탭에서 `gtag/js` 요청 확인
3. 광고 차단 프로그램 비활성화 후 테스트
4. GA4 실시간 보고서에서 자신의 방문 확인 (모바일로 테스트)
5. 최대 48시간 대기 (초기 데이터 수집 지연 가능)

### Search Console에서 사이트가 인덱싱되지 않을 때

**해결 방법**:
1. Search Console > URL 검사 도구에서 개별 페이지 인덱싱 요청
2. robots.txt에서 실수로 `Disallow: /` 설정하지 않았는지 확인
3. sitemap.xml이 올바르게 생성되었는지 검증 (XML Validator)
4. 호스팅 서버가 Google 크롤러를 차단하지 않는지 확인
5. 최대 1~2주 대기 (신규 사이트는 인덱싱에 시간 소요)

### 전환 이벤트가 기록되지 않을 때

**디버깅 방법**:
1. 브라우저 개발자 도구 > Console에서 JavaScript 오류 확인
2. GA4 DebugView 활성화:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX', {
     'debug_mode': true
   });
   ```
3. 폼 제출 시 `gtag('event', 'generate_lead', ...)` 코드가 실행되는지 `console.log` 추가
4. GA4 > 관리 > DebugView에서 실시간 이벤트 스트림 확인

---

## 참고 자료

### 공식 문서

- [GA4 공식 문서](https://support.google.com/analytics/answer/10089681)
- [Google Search Console 가이드](https://support.google.com/webmasters/answer/9128668)
- [GA4 이벤트 측정 가이드](https://support.google.com/analytics/answer/12946393)

### 유용한 도구

- [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) - GA 태그 디버깅
- [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/) - UTM 매개변수 생성
- [Looker Studio](https://lookerstudio.google.com/) - 무료 대시보드 생성
- [Microsoft Clarity](https://clarity.microsoft.com/) - 무료 히트맵 및 세션 녹화

### 학습 리소스

- [Google Analytics Academy](https://analytics.google.com/analytics/academy/) - 무료 GA4 교육
- [Google Search Central](https://developers.google.com/search/docs) - SEO 가이드
- [GA4 Community](https://www.en.advertisercommunity.com/t5/Google-Analytics-4/bd-p/Google-Analytics-4-forum) - 커뮤니티 포럼

---

## 최종 체크

이 가이드를 완료하면 다음을 달성할 수 있습니다:

✅ GA4로 모든 사용자 행동 추적 (페이지뷰, 이벤트, 전환)
✅ Search Console로 검색 성과 모니터링 (키워드 순위, CTR, 노출수)
✅ 세종·대전·충청 지역 트래픽 정확히 측정
✅ 진단 신청 전환 퍼널 완벽히 파악
✅ 데이터 기반 최적화로 지속적 성과 개선

**다음 단계**: 이 가이드대로 설정 완료 후 3개월간 데이터 수집 → 첫 분기 리포트 작성

---

**문서 버전**: 1.0
**최종 업데이트**: 2025년 1월 (2025년 최신 GA4 및 Search Console 기준)
**담당자**: SYSCARE 마케팅팀 (jhw@mlkit.co.kr)
