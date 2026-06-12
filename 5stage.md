5단계 — FridgeScreenLeakDemo 실험
App.js 주석에 이미 안내가 있습니다.

FridgeScreen → FridgeScreenLeakDemo로 import 교체
npm run web 실행 후, 로딩 중에 "드럼" 탭 클릭
브라우저 콘솔에서 ⚠️ 언마운트 뒤 setState 경고 확인
배우는 것: cancelled 플래그가 왜 필요한지, useFetch의 cleanup이 실무에서 어떤 역할인지 체감


정확히 말하면:

클래식 메모리 누수(메모리가 계속 쌓임)라기보다
언마운트된 화면에 setState를 호출하는 잘못된 패턴을 보여주는 데모입니다.




4단계(완료) → LeakDemo → refetch → RefreshControl → 에러 재시도 → (선택) expo-av 드럼 → Navigation → TanStack Query 비교


이 프로젝트의 장점
mockApi 덕분에 실제 서버 없이 fetch 흐름 연습 가능
FridgeScreen.js 주석에 1단계 코드가 보존되어 있어 되돌아가며 비교하기 좋음
npm run web으로 브라우저 콘솔로 LeakDemo까지 바로 확인 가능
원하시면 6단계(refetch 추가) 기준으로 구체적인 과제 체크리스트(직접 코딩할 파일·함수 단위)도 정리해 드릴 수 있습니다.


`FridgeScreenLeakDemo`가 정상 동작 중입니다. 콘솔 로그는 코드 의도대로 찍히고 있습니다.

## 로그 의미

| 로그 | 의미 |
|------|------|
| `[LeakDemo] ✅ 마운트 중 setItems...` | fetch 완료 시점에 **아직 화면이 살아 있음** → `setState` 실행 |
| `[LeakDemo] ✅ 마운트 중 setLoading(false)` | 위와 동일 |
| `[LeakDemo] 🚪 FridgeScreen 언마운트 — cancelled = true` | 탭 전환 등으로 화면 **언마운트**, cleanup에서 `cancelled = true` |

`FridgeScreenLeakDemo`는 `cancelled`를 **로그용으로만** 쓰고, `setState`는 막지 않습니다.

```91:107:screens/FridgeScreenLeakDemo.js
        logSetState('setItems / setError(null)', cancelled);
        setItems(data);        // ← cancelled여도 무조건 실행
        setError(null);
      // ...
        logSetState('setLoading(false)', cancelled);
        setLoading(false);     // ← cancelled여도 무조건 실행
```

---

## 지금 출력이 `✅`만 보이는 이유

**언마운트가 fetch 완료(약 1초)보다 늦었기 때문**입니다.

- 로딩 끝난 뒤 → 드럼 탭 클릭 → 이미 `setState`는 마운트 중에 끝남 → `✅`만 출력
- 실험 목표인 `⚠️ 언마운트 뒤 setState`는 **로딩 중에** 탭을 바꿔야 나옵니다

### 재현 방법

1. `npm run web` 실행
2. **"로딩 중... (LeakDemo)"** 가 보이는 동안(1초 안) 바로 **드럼** 탭 클릭
3. 콘솔에 아래가 보여야 합니다:

```
[LeakDemo] 🚪 FridgeScreen 언마운트 — cancelled = true
[LeakDemo] ⚠️ 언마운트 뒤 setItems / setError(null)
[LeakDemo] ⚠️ 언마운트 뒤 setLoading(false)
```

`mockApi`의 `DELAY_MS`를 3000으로 올리면 타이밍 맞추기 더 쉽습니다.

---

## 로그가 반복되는 이유

개발 모드에서 **React Strict Mode**가 mount → unmount → remount를 한 번 더 돌립니다. 그래서 `🚪 언마운트`가 여러 번 보일 수 있습니다. 탭을 왔다 갔다해도 반복됩니다.

---

## `useFetch`와의 차이

| | LeakDemo | `useFetch` |
|---|----------|------------|
| 언마운트 후 fetch 완료 | `setState` 실행 → `⚠️` | `if (!cancelled)`로 **막음** |
| 목적 | 문제 재현 | 실무 패턴 |

실험이 끝나면 `App.js`에서 다시 `FridgeScreen`으로 import를 되돌리면 됩니다.

**로딩 중에 탭을 바꿨는데도 `⚠️`가 안 보이면** 알려주세요. 그때는 타이밍/Strict Mode 쪽을 같이 보면 됩니다.


StrictMode 삭제는 맞습니다. 이 프로젝트 `index.js`에는 원래 StrictMode가 없었고, 지금도 없습니다.

## 지금 콘솔은 StrictMode 때문이 아님

스크린샷의 `✅` 두 줄은 **fetch 1번 완료** 때 나오는 정상 로그입니다.

```
✅ 마운트 중 setItems / setError(null)   ← try 블록
✅ 마운트 중 setLoading(false)          ← finally 블록
```

`logSetState`가 **setState 지점마다** 한 번씩 찍히도록 되어 있어서, 마운트 2번이 아니라 **로그 2번**입니다.

---

## `⚠️`가 안 보이는 이유

StrictMode와 무관합니다. **로딩이 끝난 뒤**에 탭을 바꿨거나, 아직 탭을 안 바꾼 상태입니다.

- fetch 완료 시점에 화면이 살아 있음 → `cancelled = false` → `✅`
- `⚠️`를 보려면 **"로딩 중... (LeakDemo)"** 보이는 1초 안에 드럼 탭 클릭

그때 순서는 이렇게 나와야 합니다:

```
🚪 FridgeScreen 언마운트 — cancelled = true
⚠️ 언마운트 뒤 setItems / setError(null)
⚠️ 언마운트 뒤 setLoading(false)
```

---

## 타이밍 맞추기 팁

1초(`mockApi` `DELAY_MS`)가 짧아서 놓치기 쉽습니다. `utils/mockApi.js`에서 `DELAY_MS`를 **3000**으로 올리면 실험하기 훨씬 수월합니다.

---

**정리:** StrictMode 삭제 ≠ 로그 사라짐. `✅`는 fetch 성공 로그이고, `⚠️`는 **로딩 중 탭 전환**으로만 재현됩니다.


맞습니다. **React가 자동으로 띄운 경고가 아니라**, `FridgeScreenLeakDemo.js`에서 **학습용으로 직접 찍은 설명 로그**입니다.

## 각 줄이 의미하는 것

**🚪 FridgeScreen 언마운트 — cancelled = true**  
→ 드럼 탭으로 나가면서 `useEffect` cleanup이 실행됐고, `cancelled`를 `true`로 바꿨다는 뜻입니다.

**⚠️ 언마운트 뒤 setItems / setError(null)**  
→ fetch가 끝난 시점에 이미 화면은 사라졌는데(`cancelled === true`), 그래도 `setItems`, `setError`를 호출했다는 뜻입니다.

**⚠️ 언마운트 뒤 setLoading(false)**  
→ 마찬가지로, 사라진 화면에 `setLoading(false)`까지 호출했다는 뜻입니다.

---

## 코드상 흐름

```41:51:screens/FridgeScreenLeakDemo.js
function logSetState(label, cancelled) {
  if (cancelled) {
    console.warn(`${LOG} ⚠️ 언마운트 뒤 ${label}`);
  } else {
    console.log(`${LOG} ✅ 마운트 중 ${label}`);
  }
}
```

```119:125:screens/FridgeScreenLeakDemo.js
    return () => {
      cancelled = true;
      console.log(`${LOG} 🚪 FridgeScreen 언마운트 — cancelled = true`);
    };
```

`cancelled`가 `true`면 “이미 언마운트됐는데 setState 한다”고 **말로 풀어서** `console.warn`으로 찍는 구조입니다.

---

## 결국 무엇을 보여주는가

| | LeakDemo (지금) | useFetch (실무) |
|---|---|---|
| 언마운트 후 fetch 완료 | setState **실행함** → ⚠️ 로그 | `if (!cancelled)`로 **막음** → 로그 없음 |

즉, **“없어진 화면에 state를 넣으려 했다”**는 상황을 눈으로 확인하려고 만든 데모입니다.  
React 18+에서는 예전처럼 “unmounted component” 경고가 잘 안 뜨기 때문에, 이 프로젝트는 **직접 로그로 그 상황을 설명**하는 방식입니다.

**한 줄 요약:** 맞는 말을 풀어서 출력한 것이고, 실제로도 언마운트 뒤 `setState`가 **의도적으로 실행**되고 있습니다. `useFetch`는 그걸 `cancelled`로 막는 버전입니다.

냉장고 탭 → 로딩 중 → 드럼 탭으로 바꾸면 FridgeScreenLeakDemo가 언마운트됩니다.
그런데 1초 뒤 fetch가 끝나면, 이미 없어진 냉장고 화면에 setItems, setError, setLoading을 그대로 호출해서 ⚠️ 로그가 찍힙니다.

냉장고 화면에 머물러 있으면 cancelled는 false라 ✅만 나옵니다.


핵심은 **`cancelled`는 처음 `false`이고, 화면을 떠날 때만 `true`로 바뀐다**는 점입니다.

### 1. 시작: `cancelled = false`

```67:69:screens/FridgeScreenLeakDemo.js
  useEffect(() => {
    let cancelled = false;
```

냉장고 화면에 머물면 cleanup이 **아직 실행되지 않음** → `cancelled`는 계속 `false`.

---

### 2. fetch 끝날 때: `cancelled` 값으로 분기

```41:51:screens/FridgeScreenLeakDemo.js
function logSetState(label, cancelled) {
  if (cancelled) {
    console.warn(`${LOG} ⚠️ 언마운트 뒤 ${label}`);
  } else {
    console.log(`${LOG} ✅ 마운트 중 ${label}`);
  }
}
```

```91:107:screens/FridgeScreenLeakDemo.js
        logSetState('setItems / setError(null)', cancelled);
        setItems(data);
        setError(null);
      // ...
        logSetState('setLoading(false)', cancelled);
        setLoading(false);
```

fetch가 1초 뒤 끝날 때 아직 냉장고에 있으면 → `cancelled === false` → **`✅` 분기**.

---

### 3. 화면을 떠날 때만: `cancelled = true`

```119:125:screens/FridgeScreenLeakDemo.js
    return () => {
      cancelled = true;
      console.log(`${LOG} 🚪 FridgeScreen 언마운트 — cancelled = true`);
    };
```

드럼 탭 클릭 → `FridgeScreenLeakDemo` **언마운트** → cleanup 실행 → `cancelled = true`.  
그 **이후** fetch가 끝나면 → `logSetState(..., true)` → **`⚠️` 분기**.

---

### 흐름 비교

```
[냉장고에 머무름]
  cancelled = false (유지)
  fetch 완료 → logSetState(..., false) → ✅

[로딩 중 드럼 탭]
  cleanup → cancelled = true
  fetch 완료 → logSetState(..., true) → ⚠️
```

참고로 `useFetch`는 같은 `cancelled`를 **setState 전에 막습니다**:

```29:36:hooks/useFetch.js
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      // ...
        if (!cancelled) setLoading(false);
```

LeakDemo는 `if (!cancelled)` 없이 **무조건 setState**해서 차이를 보여주는 구조입니다.


`cancelled`는 한마디로 **"이 화면은 이미 떠났는가?"** 입니다.

- `false` → 아직 냉장고 화면에 있음 → setState 해도 됨 → `✅`
- `true` → 이미 드럼 탭으로 나감(언마운트됨) → setState 하면 안 됨 → `⚠️`

`logSetState`에 넘기는 `cancelled`는 **fetch가 끝난 그 순간**, cleanup에서 `cancelled = true`로 바뀌었는지를 물어보는 값입니다.

```
화면 머무름  → cancelled = false → "아직 살아있어"
탭 전환     → cancelled = true  → "이미 떠났어"
```







safedemo버전을 하나 생성함 실무버전 로그헬퍼 지우고 실제 코드처럼 사용 동작은메모리 누수 파일과 같음

`screens/FridgeScreenSafeDemo.js` 파일을 만들었습니다.

## 내용

`FridgeScreenLeakDemo.js`와 **같은 fetch 구조**이지만:

| | LeakDemo | SafeDemo (새 파일) |
|---|---|---|
| 로그 헬퍼 | `logSetState` 있음 | **없음** |
| setState | 무조건 실행 | **`if (!cancelled)` 일 때만** |
| 패턴 | 문제 재현 | `useFetch.js`와 동일 |

## 사용법

`App.js`에서 import만 바꾸면 됩니다.

```js
import FridgeScreen from './screens/FridgeScreenSafeDemo';
```

## 비교 실험

1. `SafeDemo` → 로딩 중 드럼 탭 → 콘솔 **조용함** (setState 안 함)
2. `LeakDemo` → 같은 동작 → **⚠️ 로그** 출력

두 파일을 나란히 보면 `if (!cancelled)` 한 줄 차이를 확인할 수 있습니다.




