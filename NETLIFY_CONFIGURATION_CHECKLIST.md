# Netlify Configuration Checklist
**SYSCARE 프로젝트 - Google Search Console 리디렉션 이슈 해결**

생성일: 2025-01-15
배포 커밋: 198fd03

---

## 📋 즉시 확인 필요 (Netlify 대시보드)

### 1. Domain Settings 확인
**경로**: Netlify Dashboard → Site settings → Domain management

#### ✅ 확인 사항
- [ ] **Primary domain**: `syscare.co.kr` (www 없이 설정되어 있는지 확인)
- [ ] **Domain aliases**: `www.syscare.co.kr`, `mlkit-syscare.netlify.app`
- [ ] **HTTPS**: Enabled
- [ ] **Force HTTPS**: Enabled (체크박스 활성화)
- [ ] **SSL/TLS Certificate**: Active (Let's Encrypt - 자동 갱신)

#### 🔧 설정 방법
```
1. Site settings → Domain management → Domains
2. syscare.co.kr 옆에 "Set as primary domain" 버튼 확인
3. www.syscare.co.kr이 "Redirects to primary domain"으로 표시되는지 확인
```

---

### 2. DNS Records 확인
**경로**: Netlify Dashboard → Domains → DNS settings (syscare.co.kr)

#### ✅ 현재 DNS 레코드
```dns
# Apex domain (이미 설정됨)
syscare.co.kr    3600    IN    NETLIFY    mlkit-syscare.netlify.app

# www 서브도메인 (추가 확인 필요)
www.syscare.co.kr    3600    IN    CNAME    syscare.co.kr
또는
www.syscare.co.kr    3600    IN    NETLIFY    mlkit-syscare.netlify.app
```

#### 🔧 www 레코드 추가 방법 (없는 경우)
```
1. Netlify DNS → Add new record
2. Record type: CNAME
3. Name: www
4. Value: syscare.co.kr (또는 mlkit-syscare.netlify.app)
5. TTL: 3600
```

---

### 3. Build & Deploy Settings 확인
**경로**: Site settings → Build & deploy → Build settings

#### ✅ 확인 사항
- [ ] **Base directory**: (비어있음 - 루트에서 빌드)
- [ ] **Build command**: (비어있음 - 정적 사이트)
- [ ] **Publish directory**: `syscare_v0.1/` (반드시 설정!)
- [ ] **Production branch**: `main`

#### 🔧 Publish Directory 설정 방법
```
1. Site settings → Build & deploy → Build settings
2. Publish directory 입력: syscare_v0.1/
3. Save 클릭
```

**⚠️ 중요**: Publish directory가 루트(/)로 설정되어 있으면 `_redirects` 파일이 작동하지 않습니다!

---

### 4. 배포 확인
**경로**: Deploys 탭

#### ✅ 확인 사항
- [ ] 최신 배포 상태: "Published"
- [ ] 배포 시간: 방금 전 (푸시 후 1-2분 이내)
- [ ] 배포 로그에서 `_redirects` 처리 확인

#### 🔍 배포 로그 확인 방법
```
1. Deploys 탭 → 최신 배포 클릭
2. Deploy log 확인
3. 다음 메시지 찾기:
   "1 redirect rule processed"
   또는
   "Processing redirects"
```

---

## 🧪 배포 후 테스트 (5-10분 소요)

### 1. 리디렉션 테스트

#### A. www → non-www 리디렉션
**도구**: https://httpstatus.io/

```
입력: https://www.syscare.co.kr/
예상 결과:
  Status: 301 Moved Permanently
  Location: https://syscare.co.kr/

입력: http://www.syscare.co.kr/
예상 결과:
  301 → https://www.syscare.co.kr/ → 301 → https://syscare.co.kr/
  (최종: 200 OK)
```

#### B. Legacy 페이지 리디렉션
```
입력: https://syscare.co.kr/booking.html
예상 결과:
  Status: 301 Moved Permanently
  Location: https://syscare.co.kr/diagnosis.html

입력: https://syscare.co.kr/consultation.html
예상 결과:
  Status: 301 Moved Permanently
  Location: https://syscare.co.kr/diagnosis.html
```

#### C. 메인 페이지 (리디렉션 없음)
```
입력: https://syscare.co.kr/
예상 결과:
  Status: 200 OK
  (리디렉션 없이 바로 로드)
```

---

### 2. Canonical 태그 확인

#### 브라우저 개발자 도구로 확인
```
1. https://syscare.co.kr/ 열기
2. F12 → Elements 탭
3. <head> 섹션에서 찾기:
   <link rel="canonical" href="https://syscare.co.kr/">
```

#### 확인할 페이지 목록
- [ ] https://syscare.co.kr/ → `<link rel="canonical" href="https://syscare.co.kr/">`
- [ ] https://syscare.co.kr/diagnosis.html → `href="https://syscare.co.kr/diagnosis.html"`
- [ ] https://syscare.co.kr/system-check.html → `href="https://syscare.co.kr/system-check.html"`
- [ ] https://syscare.co.kr/regular-checkup.html → `href="https://syscare.co.kr/regular-checkup.html"`
- [ ] https://syscare.co.kr/security-report-sample.html → `href="https://syscare.co.kr/security-report-sample.html"`

---

### 3. robots.txt 및 sitemap 확인

```
# robots.txt 확인
URL: https://syscare.co.kr/robots.txt
확인 내용:
  - Sitemap: https://syscare.co.kr/sitemap.xml (업데이트됨)

# sitemap.xml 확인
URL: https://syscare.co.kr/sitemap.xml
확인 내용:
  - 모든 URL이 https://syscare.co.kr/로 시작
  - 6개 페이지 포함 (index, diagnosis, system-check, etc.)
```

---

## 🔍 Google Search Console 설정 (배포 후)

### 1. URL 검사 도구

**주요 페이지 테스트**:
```
1. https://syscare.co.kr/ 검사
2. https://syscare.co.kr/diagnosis.html 검사
3. https://syscare.co.kr/system-check.html 검사
```

**각 페이지에서 확인**:
- [ ] "URL이 Google에 등록되어 있음" 또는 "URL이 Google에 등록되어 있지 않음"
- [ ] 크롤링 섹션: "리디렉션" 없음
- [ ] Canonical URL: 입력한 URL과 동일
- [ ] "색인 생성 요청" 클릭

---

### 2. Sitemap 재제출

**경로**: Google Search Console → Sitemaps

```
1. 기존 sitemap 삭제 (있는 경우)
2. 새 sitemap 제출: https://syscare.co.kr/sitemap.xml
3. 상태: "성공" 확인 (처리까지 수 시간 소요 가능)
```

---

### 3. 색인 생성 상태 모니터링

**경로**: Google Search Console → 색인 생성 → 페이지

#### 2-3일 후 확인
- [ ] "리디렉션 오류" 항목 감소 또는 0개
- [ ] "색인 생성됨" 페이지 수 증가
- [ ] "발견됨 - 현재 색인이 생성되지 않음" 항목 감소

---

## 🛠️ 문제 해결 가이드

### 문제 1: _redirects 파일이 작동하지 않음
**증상**: www 리디렉션이 여전히 작동하지 않음

**해결 방법**:
1. Netlify 배포 로그 확인 → "_redirects" 처리 메시지 있는지 확인
2. Publish directory가 `syscare_v0.1/`로 설정되었는지 확인
3. `_redirects` 파일 위치 확인: `syscare_v0.1/_redirects` (루트 아님!)
4. Netlify에서 Clear cache and retry deploy

---

### 문제 2: www 서브도메인이 연결되지 않음
**증상**: www.syscare.co.kr 접속 불가 또는 "Site not found"

**해결 방법**:
1. Netlify DNS에서 www CNAME 레코드 추가
2. Netlify Domain settings에서 www.syscare.co.kr 도메인 추가
3. HTTPS 인증서 재발급 (자동 - 5-10분 소요)

---

### 문제 3: Canonical 태그가 보이지 않음
**증상**: 페이지 소스에서 canonical 태그 없음

**해결 방법**:
1. 브라우저 캐시 강제 새로고침 (Ctrl+Shift+R / Cmd+Shift+R)
2. 시크릿 모드로 페이지 열기
3. 배포가 완료되었는지 Netlify에서 확인

---

### 문제 4: GSC에서 여전히 리디렉션 오류
**증상**: URL 검사에서 "리디렉션됨" 표시

**해결 방법**:
1. 모든 리디렉션이 1단계인지 확인 (최대 2단계)
2. Primary domain 설정 재확인
3. GSC에서 "색인 생성 요청" 다시 실행
4. 2-3일 기다리기 (Google 크롤러가 재방문해야 함)

---

## 📊 예상 타임라인

| 시점 | 활동 | 예상 결과 |
|------|------|-----------|
| **즉시** | Netlify 대시보드 설정 확인 | Primary domain, HTTPS 설정 확인 완료 |
| **5-10분** | 리디렉션 테스트 | www → non-www 정상 작동 |
| **1시간** | GSC URL 검사 | Canonical URL 정상 인식 |
| **24시간** | Sitemap 처리 | GSC에서 sitemap 성공 표시 |
| **2-3일** | 색인 재생성 | 리디렉션 오류 감소 |
| **1-2주** | 완전 색인 갱신 | 모든 페이지 정상 색인 |

---

## ✅ 최종 체크리스트

### Netlify 설정 (즉시 확인)
- [ ] Primary domain = syscare.co.kr
- [ ] Force HTTPS = Enabled
- [ ] Publish directory = syscare_v0.1/
- [ ] www DNS 레코드 존재
- [ ] 최신 배포 성공 (commit 198fd03)

### 기능 테스트 (배포 후 10분)
- [ ] www.syscare.co.kr → syscare.co.kr 리디렉션 (301)
- [ ] booking.html → diagnosis.html 리디렉션 (301)
- [ ] 메인 페이지 canonical 태그 확인
- [ ] robots.txt에 올바른 sitemap URL

### Google Search Console (배포 후 1시간)
- [ ] URL 검사 - 리디렉션 없음 확인
- [ ] Sitemap 재제출
- [ ] 주요 페이지 색인 생성 요청

### 장기 모니터링 (2-3일 후)
- [ ] GSC "리디렉션 오류" 감소 확인
- [ ] "색인 생성됨" 페이지 수 증가
- [ ] 검색 결과에서 올바른 URL 표시

---

## 📞 지원 리소스

- **Netlify Redirects 문서**: https://docs.netlify.com/routing/redirects/
- **Google Canonical URL 가이드**: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **GSC 리디렉션 이슈**: https://support.google.com/webmasters/answer/7451184

---

**작성**: Claude Code
**커밋**: 198fd03 - Fix Google Search Console redirect issues
**날짜**: 2025-01-15
