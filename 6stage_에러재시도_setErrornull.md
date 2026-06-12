# 6단계 — `setError(null)` 체감하기 (다시 시도 버튼)

## 목표

처음 로딩만 보면 `setError(null)`은 체감이 어렵다.  
**에러 화면 → 다시 시도 → 목록** 흐름을 같은 화면에서 경험한다.

**배우는 것**

- `setError(null)` = 에러 state **비우기** (성공 시)
- `setError(err.message)` = 에러 state **넣기** (실패 시)
- **refetch** = fetch를 **다시** 실행하는 패턴

---

## 왜 방법 2(다시 시도 버튼)인가

| 방법 | 설명 | 체감 |
|------|------|------|
| URL만 바꿔 저장 | 파일 수정 후 리로드 | 가능하지만 탭 이동·저장 필요 |
| **다시 시도 버튼** | 에러 화면에서 버튼 클릭 | **같은 화면**에서 에러→목록 전환 |

---

## 사용 파일

- **교체용 (권장):** `screens/FridgeScreenRetryDemo.js` — 이미 구현됨
- **직접 수정:** `screens/FridgeScreenLeakDemo.js` (아래 가이드 참고)

### App.js import

```js
import FridgeScreen from './screens/FridgeScreenRetryDemo';
```

---

## 1. 상수 추가

파일 상단 `FRIDGE_URL` 근처:

```js
const FRIDGE_URL_OK = "https://api.example.com/fridge-items";
const FRIDGE_URL_FAIL = "https://api.example.com/fridge-wrong"; // MOCK_DATA에 없음 → 404

// 학습용: true면 첫 로딩 실패
const LEARN_START_WITH_FAIL = true;
```

---

## 2. `requestUrl` state 추가

```js
const [requestUrl, setRequestUrl] = useState(
  LEARN_START_WITH_FAIL ? FRIDGE_URL_FAIL : FRIDGE_URL_OK
);
```

- 첫 mount → 잘못된 URL → `mockFetch` 404 → **에러 화면**
- 다시 시도 시 → `FRIDGE_URL_OK`로 바꿔 **성공**

---

## 3. `useEffect` — `FRIDGE_URL` → `requestUrl`

**변경 전**

```js
const res = isMockUrl(FRIDGE_URL)
  ? await mockFetch(FRIDGE_URL)
  : await fetch(FRIDGE_URL);
```

**변경 후**

```js
const res = isMockUrl(requestUrl)
  ? await mockFetch(requestUrl)
  : await fetch(requestUrl);
```

**의존성 배열**

```js
}, []);           // 변경 전 — mount 1번만
}, [requestUrl]); // 변경 후 — URL 바뀌면 다시 fetch
```

---

## 4. `handleRetry` 함수

```js
function handleRetry() {
  setRequestUrl(FRIDGE_URL_OK);
}
```

`requestUrl`이 바뀌면 → `useEffect` 재실행 → fetch 다시 → 성공 시 `setError(null)`.

---

## 5. import 추가

```js
import { Pressable, StyleSheet, Text, View } from "react-native";
```

---

## 6. 에러 UI — 다시 시도 버튼

**변경 전**

```js
if (error) return <Text style={styles.error}>에러: {error}</Text>;
```

**변경 후**

```js
if (error) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.error}>에러: {error}</Text>
      <Pressable style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>다시 시도</Text>
      </Pressable>
    </View>
  );
}
```

---

## 7. styles 추가

```js
errorBox: { padding: 16 },
retryButton: {
  marginTop: 12,
  alignSelf: "flex-start",
  backgroundColor: "#1976d2",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 6,
},
retryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
```

---

## 실행 방법

1. `App.js`에서 `FridgeScreenRetryDemo` import
2. `npm run web`
3. 첫 화면: **로딩 중...** (1초)
4. 그다음: **에러: HTTP 404** + **다시 시도** 버튼
5. **다시 시도** 클릭
6. **로딩 중...** → **우유·계란·김치 목록**

### 콘솔 로그 (`logSetState`)

| 시점 | 콘솔 |
|------|------|
| 1차 fetch 실패 | `[RetryDemo] ✅ setError("HTTP 404")` |
| | `[RetryDemo] ✅ setLoading(false)` |
| 다시 시도 성공 | `[RetryDemo] ✅ setItems / setError(null)` ← **에러 지움** |
| | `[RetryDemo] ✅ setLoading(false)` |

---

## 화면·state 변화

| 단계 | `loading` | `error` | `items` | 사용자 화면 |
|------|-----------|---------|---------|-------------|
| 1차 fetch 실패 | `false` | `"HTTP 404"` | `null` | 에러 문구 |
| 다시 시도 클릭 | `true` | `"HTTP 404"` (아직) | `null` | 로딩 중 |
| 2차 fetch 성공 | `false` | **`null`** ← `setError(null)` | `[...]` | **목록** |

**체감 포인트:** 빨간 에러가 사라지고 목록이 나온다 = `setError(null)` + `setItems` + `setLoading(false)`가 함께 동작한 결과.

---

## 성공 시 실행되는 코드 (참고)

```js
// try 블록
setItems(data);
setError(null);   // ← 이전 에러 지움

// finally
setLoading(false);
```

---

## 학습 끝난 뒤

- `LEARN_START_WITH_FAIL = false` 로 두면 처음부터 정상 로딩
- 5단계 Leak 실험으로 돌아갈 때는 `requestUrl` / 버튼 변경을 되돌리거나 주석 처리

---

## 다음 단계 (선택)

- `hooks/useFetch.js`에 `refetch` 반환 추가
- `FridgeScreen` / `DrumScreen`에 동일 패턴 적용
- `RefreshControl` (당겨서 새로고침) 연결
