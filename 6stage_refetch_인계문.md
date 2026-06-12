# 6단계 — useFetch refetch 인계문

## 현재 상태 (6단계 완료)

| 파일 | 상태 |
|------|------|
| `hooks/useFetch.js` | `refetch` 반환 — `useCallback` + `useRef` 패턴 |
| `screens/FridgeScreen.js` | 「다시 불러오기」/「다시 시도」버튼 적용 |
| `screens/DrumScreen.js` | 동일 |
| `utils/mockApi.js` | `DELAY_MS = 3000` (로딩 UI 관찰용) |

---

## refetch란 무엇인가 (한 줄 정의)

> **refetch는 "데이터가 바뀌어서"가 아니라, 언제든 같은 요청을 다시 보낼 수 있게 훅 밖에 버튼을 열어두는 것이 목적이다. 실제 앱에서는 그때마다 서버 최신값·재시도 결과가 반영된다.**

---

## 현재 구현 코드

### `hooks/useFetch.js` — 핵심 구조

```js
// hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { isMockUrl, mockFetch } from '../utils/mockApi';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

  // ★ useCallback: url이 바뀔 때만 함수 재생성 (effect 무한 루프 방지)
  const doFetch = useCallback(async () => {
    cancelledRef.current = false;
    try {
      setLoading(true);
      const res = isMockUrl(url) ? await mockFetch(url) : await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!cancelledRef.current) {
        setData(json);
        setError(null);
      }
    } catch (err) {
      if (!cancelledRef.current) setError(err.message);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    doFetch();                         // mount 시 자동 실행
    return () => {
      cancelledRef.current = true;     // 언마운트 시 setState 차단
    };
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };  // ★ refetch 노출
}

export default useFetch;
```

### 화면에서 사용 패턴 (FridgeScreen / DrumScreen 공통)

```js
const { data: items, loading, error, refetch } = useFetch(FRIDGE_URL);

// 에러 화면
if (error) {
  return (
    <View>
      <Text>에러: {error}</Text>
      <Pressable onPress={refetch}>
        <Text>다시 시도</Text>
      </Pressable>
    </View>
  );
}

// 성공 화면
return (
  <View>
    <Pressable onPress={refetch}>
      <Text>다시 불러오기</Text>
    </Pressable>
    <FridgeItemList items={items} />
  </View>
);
```

---

## refetch 핵심 개념 정리

### 1. useEffect 자동 실행 vs refetch 수동 실행

| | mount 시 | 버튼 클릭 시 |
|--|----------|-------------|
| 4단계 (`doFetch`가 useEffect 안) | ✅ 실행 | ❌ 불가 |
| 6단계 (`doFetch`가 useCallback 밖) | ✅ 실행 | ✅ `refetch()` 호출 |

### 2. useCallback을 쓴 이유

```
일반 함수로 선언 시:
  렌더 → doFetch 새 참조 → useEffect 재실행 → fetch → 렌더 → ... (무한 루프)

useCallback([url]) 사용 시:
  url이 바뀔 때만 doFetch 새 참조 → effect 1회만 실행
```

### 3. let cancelled → useRef로 바꾼 이유

| | `let cancelled` (4단계) | `useRef` (6단계) |
|--|------------------------|-----------------|
| 스코프 | useEffect 안 (클로저) | 훅 전체 (refetch에서도 접근 가능) |
| refetch 시 리셋 | ❌ 불가 (effect 안에 있음) | ✅ `cancelledRef.current = false` |

### 4. 실무에서 refetch를 쓰는 상황

| 상황 | 예시 |
|------|------|
| 에러 후 재시도 | 네트워크 끊김 → 복구 후 「다시 시도」 |
| 수동 새로고침 | 사용자가 「새로고침」 버튼 클릭 |
| 당겨서 새로고침 | `RefreshControl` + `onRefresh={refetch}` (7단계) |
| 데이터 변경 후 갱신 | 항목 추가/삭제 → 목록 다시 로드 |

---

## AI 프롬프트 예시

아래 프롬프트를 AI에게 주면 refetch 관련 예시 코드나 설명을 요청할 수 있습니다.

---

### 프롬프트 A — refetch 개념 설명 요청

```
아래 React Native useFetch 훅이 있습니다.

(hooks/useFetch.js 코드 붙여넣기)

이 훅에서 refetch가 왜 필요한지, useCallback과 useRef를 쓴 이유를
초보자도 이해할 수 있게 설명해줘.
다음 세 가지를 꼭 포함해줘:
1. useEffect 안 doFetch (4단계) vs useCallback 밖 doFetch (6단계) 차이
2. useCallback을 안 쓰면 무슨 일이 생기는지
3. let cancelled를 useRef로 바꾼 이유
```

---

### 프롬프트 B — 다음 확장 예시 코드 생성 요청

```
아래는 React Native useFetch 훅(6단계 완료)입니다.

(hooks/useFetch.js 코드 붙여넣기)

이 훅을 이용해서 다음 기능을 구현하는 예시 코드를 만들어줘:
1. FlatList + RefreshControl — refetch를 onRefresh에 연결 (7단계)
2. 에러 화면에 「다시 시도」버튼 — 성공 시 setError(null) 체감
3. loading 중에는 버튼을 비활성화 (disabled + opacity)

React Native + Expo 환경이야. 파일 단위로 나눠서 보여줘.
```

---

### 프롬프트 C — TanStack Query와 비교 요청

```
아래는 직접 만든 useFetch 훅(refetch 포함)입니다.

(hooks/useFetch.js 코드 붙여넣기)

TanStack Query(useQuery)와 이 훅을 비교 설명해줘.
다음 항목 기준으로 비교표를 만들어줘:
- refetch 방법
- 캐싱 유무
- loading / error 상태 관리
- 언마운트 cleanup
- 코드 양

React Native + Expo 환경 기준이야.
```

---

## 다음 단계

| 단계 | 내용 | 핵심 |
|------|------|------|
| **7단계** | `FlatList` + `RefreshControl` | `onRefresh={refetch}`, `refreshing={loading}` |
| **에러 재시도** | URL 실패 → 버튼 → 성공 `setError(null)` | 6stage_에러재시도_setErrornull.md 참고 |
| **TanStack Query 비교** | `useQuery`와 직접 만든 `useFetch` 대조 | 프롬프트 C 사용 |
