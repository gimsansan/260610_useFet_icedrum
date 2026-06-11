# useFetch 커스텀 훅 학습 — 인계문

## 현재 위치
- **1단계 완료** → 2단계 시작 전
- 학습 앱: React Native (Expo) 냉장고/드럼 탭 전환 앱
- 파일 구조: `App.js`, `screens/FridgeScreen.js`, `components/FridgeItemList.js`, `utils/mockApi.js`
- `hooks/useFetch.js`는 아직 미업로드 — 2단계 시작 시 업로드 필요

## 1단계에서 학습 완료한 내용

### 핵심 패턴: fetch + state 3개 + useEffect + cancelled + 조건부 렌더
- `items`(데이터), `loading`(진행중), `error`(실패) — state 3개로 UI 분기
- `useEffect([], )` → 마운트 시 1회 fetch
- useEffect 콜백은 async 불가 → 내부에 `async function fetchItems()` 별도 선언
- `try/catch/finally`로 성공·실패·로딩종료 처리
- `cancelled` 플래그로 언마운트 후 setState 방지
- 렌더 순서: loading → error → 정상 UI (FridgeItemList)

### `!cancelled` 깊이 학습한 부분 (중요)
- 학습자가 `!` + 부정의미 변수명 조합(이중 부정)에서 혼란을 겪음
- **해결된 사고법**: "값 먼저, 의미 나중"
  - 1단계: 변수 값 확인 (true/false)
  - 2단계: `!` 붙이면 값만 뒤집기
  - 3단계: if(결과) → 통과/불통
  - 4단계: 마지막에 의미 해석
- `!`를 "의미를 뒤집는 것"이 아닌 **"if문 통과 스위치"**로 인식하는 방식으로 정착
- 퀴즈 2회 진행, 전문 정답 → 이 부분은 잡힌 상태

## 2단계 진행 방향
- `useFetch.js` 파일을 업로드받아 1단계 FridgeScreen 코드와 1:1 비교
- FridgeScreen 안의 fetch 로직이 어떻게 커스텀 훅으로 추출되는지 확인
- 학습 순서 (App.js 주석 참고):
  - 2단계: `hooks/useFetch.js`와 1단계 코드 비교
  - 3단계: FridgeScreen 1단계 주석처리 + 3단계 주석 해제 (useFetch 사용)
  - 4단계: DrumScreen 주석 해제 (useFetch 재사용)

## 학습자 특성
- 시각적/단계별 설명 선호 (스테퍼, 다이어그램 잘 반응함)
- 영어 원문으로 사고하면 이해가 빠름 ("if not cancelled, do it")
- 이중 부정에서 의미 해석을 먼저 하려는 습관 있음 → "값 먼저" 리마인드 필요
- "간" = 간단히 답변 신호
