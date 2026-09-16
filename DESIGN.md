---
name: SYSCARE
description: 세종·대전·충청권 중소기업 전산 유지보수 서비스의 신뢰 중심 랜딩 시스템
colors:
  brand-blue: "#2563eb"
  brand-blue-hover: "#1d4ed8"
  brand-blue-soft: "#eff6ff"
  brand-blue-tint: "#dbeafe"
  brand-blue-deep: "#1e3a8a"
  neutral-canvas: "#f9fafb"
  neutral-surface: "#ffffff"
  neutral-border-soft: "#f3f4f6"
  neutral-border: "#e5e7eb"
  neutral-border-strong: "#d1d5db"
  neutral-icon-muted: "#9ca3af"
  neutral-text-muted: "#6b7280"
  neutral-text-secondary: "#374151"
  neutral-text-primary: "#111827"
  report-navy: "#1e293b"
  report-navy-line: "#334155"
  status-ok: "#15803d"
  status-watch: "#475569"
  status-warn: "#a16207"
  status-action: "#c2410c"
  status-crit: "#b91c1c"
typography:
  headline:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif"
    fontSize: "clamp(2rem, 9vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
  document: "4px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  section: "48px"
  section-lg: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 32px"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.brand-blue}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 24px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text-secondary}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 16px"
---

# Design System: SYSCARE

## Overview

**Creative North Star: "증빙 서류함(The Verifiable Ledger)"**

SYSCARE는 세종·대전·충청권 중소기업을 상대로 전산 유지보수를 판매하는 서비스다. 2026년 7월 신뢰성 개편 이후, 이 사이트의 시각 언어는 설득의 화려함이 아니라 확인 가능성을 앞세운다. 가짜 실시간 카운터, 남은 슬롯 게이지, 검증 불가능한 만족도 수치, 가상 후기를 걷어낸 자리에 남은 것은 짧은 명사형 카드, 44px 터치 타겟, 옅은 그림자 한 겹뿐인 표면이다. 화면은 조용하고, 색은 절제되어 있으며, 장식은 기능을 설명하는 선에서 멈춘다.

이 시스템은 하나의 표면 안에서도 세 가지 모드로 갈라진다. index.html과 regular-checkup.html은 설득(Persuade) 모드로 신뢰 근거와 CTA를 배치하고, diagnosis.html과 system-check.html은 운영(Operate) 모드로 입력과 진행에 집중하며, privacy.html과 security-report-sample.html은 읽기(Read) 모드로 밀도 높은 문서를 그대로 화면에 올린다. 세 모드는 같은 파란색과 같은 회색조를 공유하지만, Read 모드만 유일하게 CSS 커스텀 프로퍼티(`--navy`, `--ink`, `--muted`, `--line`, `--blue`)로 토큰을 명시한다. 이 프로퍼티의 값은 우연이 아니라 Tailwind 유틸리티 값과 정확히 일치한다: `--ink`는 gray-900(#111827)과, `--muted`는 gray-500(#6b7280)과, `--line`은 gray-200(#e5e7eb)과, `--bg`는 gray-100(#f3f4f6)과, `--blue`는 blue-600(#2563eb)과 같다. 즉 두 문법(Tailwind 클래스, CSS 변수) 아래에 하나의 팔레트만 존재한다.

다크 모드는 의도적으로 지원하지 않는다. `:root { color-scheme: light; }`가 명시적으로 고정되어 있으며, 이는 문서형 콘텐츠(월간 보고서, 개인정보처리방침)의 대비와 인쇄 가독성을 지키기 위한 결정이지 미구현이 아니다.

**Key Characteristics:**
- 신뢰는 장식이 아니라 절제로 표현한다: 그림자는 `shadow-sm` 한 단계, 색은 파란색 하나에 회색조
- 44px 이상의 터치 타겟과 `keep-all` 줄바꿈으로 모바일 우선을 지킨다
- 같은 파란색(#2563eb)이 버튼 문법(Tailwind)과 문서 문법(CSS 변수) 모두의 앵커다
- Read 모드(보고서, 약관)만 예외적으로 밀도 높은 문서 레이아웃과 상태 배지 색을 쓴다
- 라이트 모드 고정은 결함이 아니라 문서 가독성을 위한 결정이다

## Colors

파란색 하나와 회색조 하나, 그리고 Read 모드에만 존재하는 5색 상태 배지가 팔레트의 전부다. 강조색을 늘리는 대신 절제된 회색 단계로 위계를 만든다.

### Primary
- **Brand Blue** (#2563eb): 모든 주요 CTA 배경, 링크, 아이콘 강조색. Tailwind blue-600이자 보고서 문서의 `--blue`와 동일한 값이다. 화면당 등장 빈도는 낮게 유지한다.
- **Brand Blue Hover** (#1d4ed8): 버튼 hover 상태(blue-700). 채도를 올리지 않고 명도만 낮춘다.
- **Brand Blue Deep** (#1e3a8a): 히어로 그라디언트의 시작색과 최종 CTA 그라디언트의 종료색(indigo-800 #3730a3과 짝을 이루는 유일한 그라디언트 사용처)에 쓰인다. 단독 배경색으로는 쓰지 않는다.
- **Brand Blue Soft** (#eff6ff) / **Brand Blue Tint** (#dbeafe): 안내 배지, 단계 번호 원, 동의 안내 박스처럼 "정보성"을 표시하는 옅은 배경.

### Neutral
- **Canvas** (#f9fafb): 섹션 배경(#scope, #support)의 기본 회색. 흰 카드와 명도 차이로 섹션을 구분한다.
- **Surface** (#ffffff): 카드, 폼, 헤더의 기본 배경.
- **Border Soft** (#f3f4f6): `#trust` 구역의 근거 리스트 테두리처럼 거의 보이지 않는 경계선.
- **Border** (#e5e7eb): FAQ 아코디언, 체크박스 행, 입력창 테두리의 기본 경계선. 보고서 문서의 `--line`과 동일한 값이다.
- **Border Strong** (#d1d5db): 입력 필드 기본 테두리.
- **Icon Muted** (#9ca3af): FAQ 화살표 아이콘처럼 존재감을 낮춰야 하는 아이콘.
- **Text Muted** (#6b7280): 카드 설명, 메타 정보 등 2차 텍스트. 사이트에서 가장 많이 쓰이는 회색이며 보고서의 `--muted`와 동일하다.
- **Text Secondary** (#374151): 폼 라벨.
- **Text Primary** (#111827): 본문 기본 색(`body` 태그에 직접 지정). 보고서의 `--ink`와 동일하다.

### 보고서 전용 뉴트럴(Read 모드)
- **Report Navy** (#1e293b): 보고서 섹션 제목, 표지 타이틀, 웹 전용 푸터 배경. 앱 화면 어디에도 쓰이지 않는, 문서 등록(register)만의 색이다.
- **Report Navy Line** (#334155): 표 상단의 강조 테두리.

### 상태 배지(Read 모드 전용)
월간 보고서에서만 쓰는 5단계 상태색이다. "관찰(watch)"은 경고처럼 보이지 않도록 의도적으로 슬레이트 계열을 쓴다.
- **OK** (#15803d): 정상.
- **Watch** (#475569): 관찰 필요. 경고색이 아니라 중립 회색-남색을 써서 실제 위험과 구분한다.
- **Warn** (#a16207): 주의.
- **Action** (#c2410c): 조치 필요.
- **Crit** (#b91c1c): 긴급.

### Named Rules
**The One Blue Rule.** 강조색은 brand-blue 하나다. 새 화면에 두 번째 강조색을 추가하지 않는다. 색으로 위계를 더 만들고 싶으면 회색 명도를 옮긴다.

**The Color-Plus-Glyph Rule.** 상태를 색으로만 구분하지 않는다. 보고서 배지는 색, 아이콘 글리프(✓ ◎ ! ▲ ✕), 텍스트 라벨을 항상 함께 쓴다. 색만으로 의미를 전달하는 컴포넌트를 새로 만들지 않는다.

## Typography

**Body Font:** Pretendard Variable(with Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, sans-serif). 2026년 9월 최적화 이후 CDN 정적 서체(`pretendard.min.css`) 대신 가변 다이나믹 서브셋(`pretendardvariable-dynamic-subset.min.css`)을 쓴다.

**Character:** 하나의 한글 최적화 서체가 표지 제목부터 폼 라벨까지 전부를 담당한다. 별도의 디스플레이 서체나 세리프는 없다. 위계는 서체 교체가 아니라 굵기와 크기 단계, 그리고 `letter-spacing`을 좁히는 방식으로 만든다.

### Hierarchy
- **Headline** (fontWeight 800, `clamp(2rem, 9vw, 3rem)`, line-height 1.15, letter-spacing -0.04em): 히어로 H1 전용. 768px 미만에서는 이 clamp 값이 desktop의 `text-4xl md:text-5xl`을 대체해 한 줄 개행이 부자연스러워지지 않게 한다.
- **Title** (fontWeight 700, 1.5rem~1.875rem 반응형(`text-2xl md:text-3xl`), letter-spacing -0.025em): 섹션 H2. 항상 중앙 정렬로 각 구역을 연다.
- **Body** (fontWeight 400, 1rem, line-height 1.6): 기본 본문.
- **Label** (fontWeight 500~600, 0.875rem): 카드 설명, 폼 라벨, 메타 정보. 실제로 가장 많이 등장하는 텍스트 스타일이다.

### Named Rules
**The Keep-All Rule.** `body, h1~h6 { word-break: keep-all; overflow-wrap: break-word; }`가 전역에 걸려 있다. 한글 문장이 어절 중간에서 끊기지 않는다. 새 컴포넌트에서 이 규칙을 개별적으로 덮어쓰지 않는다.

**The Noun-Phrase Rule.** 카드 설명은 "관리합니다/제공합니다" 같은 서술형 문장이 아니라 짧은 명사구로 쓴다("PC · 계정 · 프린터"처럼). 이는 `syscare_v0.1/CLAUDE.md`에 명시된 카피 규칙이며 타이포그래피 밀도에도 그대로 반영된다.

## Layout

컨테이너는 목적에 따라 세 단계 폭을 쓴다: 헤더 내부는 `max-w-6xl`(1152px)로 넓게, 본문 섹션은 `max-w-3xl`(768px)로 좁게, 폼 페이지(diagnosis.html)는 `max-w-2xl`(672px)로 더 좁게 잡는다. 최종 CTA 같은 단일 행동 유도 구역은 `max-w-md`(448px)까지 줄인다. 폭을 넓히는 것이 아니라 목적에 맞게 계속 좁혀나가는 방향이 이 시스템의 그리드 원칙이다.

섹션 리듬은 `py-12 md:py-16`(48px/64px)로 균일하다. 가로 여백은 항상 `px-4`(16px). 카드 그리드는 2열 고정(`grid-cols-2`)이며 3열 이상으로 넓히지 않는다. 리스트 항목 사이 간격은 `gap-2.5`~`gap-3`(10~12px)로 촘촘하다.

헤더는 `position: sticky`로 고정한다. `position: fixed`로 되돌리면 히어로 섹션을 가리는 회귀 버그가 재발하므로 sticky를 유지해야 한다. 헤더 높이는 `h-14 md:h-16`(56px/64px). 모바일에서는 화면 하단에 `.mobile-cta-bar`가 `position: fixed`로 추가되며, 이 바가 있는 페이지는 `body.has-cta-bar`가 `main`과 `footer`에 `padding-bottom: calc(80px + env(safe-area-inset-bottom))`을 더해 콘텐츠가 바에 가리지 않게 한다. 헤더와 하단 바 모두 `env(safe-area-inset-*)`로 노치·홈 인디케이터 영역을 피한다.

접근성 대형 글꼴(125~200%) 환경에서도 헤더와 하단 바가 한 줄을 유지하도록, 768px 미만에서는 로고·전화 버튼·CTA 버튼·하단 바 텍스트에 `font-size: min(...)` 상한을 별도로 건다(예: 로고 `min(1.25rem, 22px)`). 이는 우연한 값이 아니라 명시적으로 작성된 방어 규칙이다.

## Elevation & Depth

이 시스템은 그림자를 거의 쓰지 않는다. 카드는 `shadow-sm`(옅은 1단계) 정도까지만 올라가고, `shadow-lg`나 `shadow-md`는 라이브 화면 어디에도 없다. 깊이는 그림자가 아니라 배경 명도 차이(흰 카드 위 회색 섹션 배경)와 얇은 테두리로 표현한다. `css/style.css`의 16~75행, 88~230행에 남아 있는 `hover:scale`, `stat-card`류의 강한 그림자·상승 애니메이션은 폐기된 이전 디자인의 잔재이며 새 화면에 재사용하지 않는다.

Read 모드(보고서)는 그림자 대신 종이 질감의 얇은 테두리(`border: 1px solid var(--line)`)로 "문서 한 장"이라는 인상을 만든다. 인쇄 시에는 이 테두리조차 제거되고 `break-after: page`로 실제 페이지 경계를 대신한다.

### Named Rules
**The Flat-By-Default Rule.** 표면은 그림자 없이 시작한다. `shadow-sm`은 화이트 카드가 회색 배경과 구분돼야 할 때만 쓰고, 그 이상의 그림자 단계는 시스템에 존재하지 않는다.

## Shapes

모서리 반경은 용도에 따라 네 단계로 나뉜다.
- **8px**(`rounded-lg`): 입력창, 전화 아이콘 버튼처럼 작은 컨트롤.
- **12px**(`rounded-xl`): 카드, 버튼, FAQ 아코디언 등 가장 널리 쓰는 기본 반경.
- **16px**(`rounded-2xl`): 신뢰 구역 CTA 패널, 진단 폼 카드처럼 더 큰 promo 영역.
- **9999px**(`rounded-full`): 배지 pill, 단계 번호 원(1·2·3).

Read 모드는 이 반경 체계를 따르지 않는다. 보고서 문서(`.report-page`)는 4px, 버튼은 10px로 훨씬 각진 값을 쓴다. 이는 실수가 아니라 "인쇄 문서"라는 다른 등록(register)임을 시각적으로 표시하기 위한 의도적 이탈이다.

테두리는 항상 1px 실선이며, 색은 `neutral-border`(#e5e7eb) 또는 그보다 옅은 `neutral-border-soft`(#f3f4f6)다. 점선(dashed)은 보고서의 "상세 펼치기" 토글 버튼처럼 "본문이 아닌 보조 동작"을 표시할 때만 예외적으로 쓴다.

## Components

### Buttons
- **Shape:** 12px 반경, 높이 44~48px(터치 타겟 하한 44px 준수).
- **Primary:** 배경 brand-blue(#2563eb), 텍스트 흰색, `font-bold`. hover 시 brand-blue-hover(#1d4ed8)로 명도만 낮춤. 히어로처럼 어두운 배경 위에서는 흰 배경에 파란 텍스트로 반전한다.
- **Secondary(전화 상담류):** 테두리만 있는 형태(`border border-blue-600 text-blue-700`) 또는 반투명 흰 배경(`bg-white/15 border-white/40`, 어두운 배경 위). 배경을 채우지 않아 Primary보다 한 단계 낮은 우선순위임을 표시한다.
- **아이콘 버튼(전화):** 정사각형 44×44px, `rounded-lg`, 테두리만.
- 모든 카드 안에 개별 CTA를 넣지 않는다. CTA는 히어로, 신뢰 구역 이후 1회, 최종 구역, 모바일 하단 바에만 배치한다.

### Cards / Containers
- **Corner Style:** 12px(`rounded-xl`) 기본, 큰 패널은 16px.
- **Background:** 흰색, 회색 섹션 배경 위에 놓인다.
- **Shadow Strategy:** `shadow-sm` 한 단계 또는 무그림자 + 얇은 테두리(border-gray-100/200). 두 방식을 섞어 쓰지 않는다: 그림자가 있으면 테두리를 빼고, 테두리가 있으면 그림자를 뺀다.
- **Internal Padding:** 16px(`p-4`) 기본, 24px(`p-6`) promo 패널.

### Inputs / Fields
- **Style:** 흰 배경, `border border-gray-300`, 8px 반경, 높이 48px(`h-12`), 좌우 패딩 16px.
- **Label:** `<label for>`와 `id`를 항상 짝짓는다(암묵적 레이블 금지). 라벨은 `text-sm font-semibold text-gray-700`.
- **Focus:** `focus:ring-2 focus:ring-blue-500 focus:border-transparent`. 링 색은 brand-blue 계열 하나만 쓴다.
- **그룹 구조:** 다중 선택 항목은 `<fieldset>`+`<legend>`로 묶는다(diagnosis.html의 "가장 불편한 문제" 체크박스 그룹).
- **선택 정보 접기:** 필수가 아닌 필드 묶음은 `<details>/<summary>` 아코디언으로 기본 접어 폼의 체감 길이를 줄인다.
- **Error:** `text-sm text-red-600`, 기본 숨김(`hidden`) 후 검증 실패 시에만 노출.

### Navigation(Header)
- 데스크톱: 로고(파란색, 굵게) + 가운데 텍스트 내비게이션(4개 앵커) + 전화 아이콘 버튼 + Primary CTA 버튼.
- 모바일: 텍스트 내비게이션은 숨기고 로고 + 아이콘 버튼 + CTA만 남긴다.
- `position: sticky`, 반투명 흰 배경(`bg-white/95 backdrop-blur-sm`), 하단 1px 테두리.
- hover는 링크 색만 brand-blue로 바꾸는 정도로 절제한다.

### FAQ / Accordion
- 네이티브 `<details>/<summary>` 사용. `summary::-webkit-details-marker`를 숨기고 대신 Font Awesome 셰브론 아이콘을 `group-open:rotate-180`으로 회전시켜 열림 상태를 표시한다.
- 테두리만 있는 카드(`border border-gray-200 rounded-xl`), 그림자 없음.

### 모바일 하단 CTA 바(Signature Component)
페이지 하단에 고정되는 2버튼 바(`전화 상담` 아웃라인 + Primary CTA)로, `.hero`/`.faq-item`과 함께 이 시스템에서 가장 특징적인 컴포넌트다. `md:hidden`으로 데스크톱에서는 사라지고, `body.has-cta-bar`가 페이지 하단 여백을 자동으로 확보한다. 이 바가 있는 페이지에서 최종 섹션의 CTA와 내용이 겹치지 않는지 항상 확인한다.

### 상태 배지(Read 모드 Signature Component)
Read 모드(보고서)에서만 쓰는 pill 배지. 배경은 상태색의 10% 미만 채도 tint, 테두리는 같은 색의 옅은 버전, 텍스트와 글리프는 진한 버전을 쓴다. 5단계(OK/Watch/Warn/Action/Crit) 외에 새 상태를 임의로 추가하지 않는다.

## Do's and Don'ts

### Do:
- **Do** 강조색은 brand-blue(#2563eb) 하나로 유지한다. 새 색을 더할 때는 회색 명도 단계를 옮기는 것으로 먼저 해결을 시도한다.
- **Do** 모든 인터랙티브 요소를 44px 이상의 터치 타겟으로 만든다.
- **Do** 카드 설명은 짧은 명사구로 쓰고, 카드마다 개별 CTA를 넣지 않는다.
- **Do** 헤더는 `position: sticky`를 유지한다.
- **Do** Read 모드(보고서, 약관류) 새 화면에서는 CSS 커스텀 프로퍼티(`--navy`, `--ink`, `--muted`, `--line`, 상태색)를 그대로 재사용한다.
- **Do** 상태 표시는 색 + 아이콘 글리프 + 텍스트 세 가지를 항상 함께 쓴다.

### Don't:
- **Don't** 실시간 카운터, 남은 슬롯 게이지, 이탈 의도 팝업 등 긴급성을 조작하는 컴포넌트를 만들지 않는다.
- **Don't** 검증 불가능한 수치·후기·인증 배지를 새 화면에 넣지 않는다.
- **Don't** `shadow-lg`, `shadow-md` 같은 강한 그림자나 hover 시 큰 상승·확대 애니메이션(`css/style.css` 16~75행, 88~230행의 폐기된 `stat-card`/`value-card` 패턴)을 재사용하지 않는다.
- **Don't** 다크 모드를 추가하지 않는다. `color-scheme: light`는 문서 가독성을 위한 결정이다.
- **Don't** 헤더를 `position: fixed`로 바꾸지 않는다. 히어로를 가리는 회귀 버그가 재발한다.
- **Don't** 강조색을 두 개 이상 쓰지 않는다. indigo-800은 최종 CTA 그라디언트 한 곳의 예외이며 새 규칙의 근거로 삼지 않는다.

## 마이그레이션 대상

아래 4개 페이지는 2026년 7월 신뢰성 개편 이전의 구세대 헤더·레이아웃(`position: fixed` 내비게이션, `container` 클래스, `shadow-lg`, `text-5xl` 히어로)을 그대로 쓰고 있다. 이 문서가 서술하는 시스템의 일부가 아니라 "이관 대기 중"인 화면으로 취급한다.

- `system-check.html`
- `regular-checkup.html`
- `privacy.html`
- `diagnosis_success.html`

이관 시 아래 index.html의 헤더·푸터를 정본으로 그대로 옮기되, 서브페이지이므로 로고는 `href="index.html"`로 바꾼다. 내비게이션 앵커(`#scope`, `#trust`, `#support`, `#faq`)는 index.html에만 존재하는 구역이므로 서브페이지에서는 `index.html#scope`처럼 페이지 경로를 붙인다.

### 정본 헤더(서브페이지용)

```html
<header class="site-header sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-2">
        <a href="index.html" class="header-logo text-xl md:text-2xl font-bold text-blue-600 shrink-0">SYSCARE</a>
        <nav class="hidden md:flex items-center gap-6 text-sm text-gray-700" aria-label="주요 메뉴">
            <a href="index.html#scope" class="hover:text-blue-600 transition-colors">관리 범위</a>
            <a href="index.html#trust" class="hover:text-blue-600 transition-colors">신뢰 근거</a>
            <a href="index.html#support" class="hover:text-blue-600 transition-colors">지원·비용</a>
            <a href="index.html#faq" class="hover:text-blue-600 transition-colors">FAQ</a>
        </nav>
        <div class="flex items-center gap-2">
            <a href="tel:010-3861-8079" aria-label="전화 상담 010-3861-8079"
               class="header-phone flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors">
                <i class="fas fa-phone" aria-hidden="true"></i>
            </a>
            <a href="diagnosis.html"
               class="header-cta flex items-center h-11 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                15분 상담 신청
            </a>
        </div>
    </div>
</header>
```

### 정본 푸터

```html
<footer class="bg-gray-900 text-gray-400 py-10 text-sm">
    <div class="max-w-3xl mx-auto px-4 text-center">
        <div class="text-xl font-bold text-blue-400 mb-3">SYSCARE</div>
        <ul class="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6">
            <li><a href="diagnosis.html" class="hover:text-white transition-colors">상담 신청</a></li>
            <li><a href="regular-checkup.html" class="hover:text-white transition-colors">서비스 비용</a></li>
            <li><a href="security-report-sample.html" class="hover:text-white transition-colors">보고서 샘플</a></li>
            <li><a href="system-check.html" class="hover:text-white transition-colors">자가진단</a></li>
            <li><a href="privacy.html" class="hover:text-white transition-colors">개인정보처리방침</a></li>
        </ul>
        <p class="mb-1">010-3861-8079 (평일 09:00~18:00) · jhw@mlkit.co.kr</p>
        <p class="mb-4">세종특별자치시 집현중앙7로 6, B동 609호(지식산업센터)</p>
        <p class="mb-1">SYSCARE는 <a href="https://myloket.co.kr" target="_blank" rel="noopener" class="text-gray-300 hover:text-white underline">(주)마이로켓</a>이 운영하는 중소기업 전산 유지보수 서비스입니다.</p>
        <p class="text-xs text-gray-400 mb-1">
            상호: (주)마이로켓 | 대표자: 제현우 | 사업자등록번호: 216-88-00409 | 통신판매업신고: 2018-세종아름-0019
        </p>
        <p class="text-xs text-gray-400 mb-4">
            주소: 세종특별자치시 집현중앙7로 6, 지식산업센터 B동 609호 (집현동) | 전화: 010-3861-8079 | 개인정보 보호책임자: 제현우 (jhw@mlkit.co.kr)
        </p>
        <p class="text-xs text-gray-400">&copy; 2025 SYSCARE. All rights reserved.</p>
    </div>
</footer>
```

4개 페이지 모두 홈페이지가 아니므로 index.html처럼 `<nav>` 전체를 데스크톱에만 보이게 두되, 로고 href만 다르다는 점(`index.html` vs index.html 자신의 `#`)을 놓치지 않는다. 또한 `regular-checkup.html`, `privacy.html`, `diagnosis_success.html`은 모바일 하단 CTA 바(`.mobile-cta-bar`)와 `body.has-cta-bar` 여백 처리도 함께 이식해야 헤더 회귀 버그와 동일한 종류의 "콘텐츠 가림" 문제를 반복하지 않는다.
</content>
