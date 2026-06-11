# useFetch 단계별 수정 가이드

이 문서는 `useFetch` 학습 앱을 1단계부터 4단계까지 만들 때 **어느 파일의 어느 부분을 수정하면 그 단계 코드가 되는지** 정리한 파일입니다.

현재 프로젝트는 4단계까지 적용된 상태입니다.

---

## 전체 단계

| 단계 | 목표 | 주로 수정하는 파일 |
| --- | --- | --- |
| 1단계 | `FridgeScreen` 안에 fetch 로직 직접 작성 | `screens/FridgeScreen.js` |
| 2단계 | 1단계 코드와 `useFetch` 훅 비교 | `hooks/useFetch.js` |
| 3단계 | `FridgeScreen`을 `useFetch`로 전환 | `screens/FridgeScreen.js` |
| 4단계 | `DrumScreen`에서 `useFetch` 재사용 | `screens/DrumScreen.js` |

---

## 공통 준비: mock API

파일: `utils/mockApi.js`

이 파일은 실제 서버 대신 가짜 응답을 돌려줍니다. 주소는 `api.example.com` 기준으로 유지합니다.

확인할 부분:

```javascript
const MOCK_DATA = {
  "https://api.example.com/fridge-items": [
    { id: 1, name: "우유", expiry: "2026-06-15" },
    { id: 2, name: "계란", expiry: "2026-06-20" },
    { id: 3, name: "김치", expiry: "2026-07-01" },
  ],

  "https://api.example.com/drum-sounds": [
    { id: 1, name: "킥", file: "kick.wav" },
    { id: 2, name: "스네어", file: "snare.wav" },
    { id: 3, name: "하이햇", file: "hihat.wav" },
  ],
};

export function isMockUrl(url) {
  return url.startsWith("https://api.example.com/");
}
```

주의:

- `FRIDGE_URL`, `DRUM_URL`, `MOCK_DATA`, `isMockUrl`이 모두 `https://api.example.com/` 기준이어야 mock 흐름이 맞습니다.
- catch 실험을 하려면 `https://api.example.com/없는주소`처럼 `api.example.com/`은 유지하고 뒤 경로만 틀립니다.

---

## 1단계: `FridgeScreen` 안에 fetch 직접 작성

파일: `screens/FridgeScreen.js`

목표:

- `useState` 3개로 `items`, `loading`, `error` 관리
- `useEffect` 안에서 fetch 실행
- `cancelled`로 언마운트 후 `setState` 방지

1단계에서 필요한 import:

```javascript
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FridgeItemList from '../components/FridgeItemList';
import { isMockUrl, mockFetch } from '../utils/mockApi';
```

1단계 핵심 코드:

```javascript
function FridgeScreen() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = isMockUrl(FRIDGE_URL)
          ? await mockFetch(FRIDGE_URL)
          : await fetch(FRIDGE_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Text style={styles.message}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>에러: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>냉장고 (1단계)</Text>
      <FridgeItemList items={items} />
    </View>
  );
}
```

성공 기준:

- 냉장고 탭에서 `로딩 중...`이 보인 뒤 우유/계란/김치 목록이 나옵니다.

---

## 2단계: `FridgeScreen` 코드와 `useFetch` 비교

파일: `hooks/useFetch.js`

2단계는 코드 수정이 아니라 비교 단계입니다.

비교 포인트:

| 1단계 `FridgeScreen` | 2단계 `useFetch` |
| --- | --- |
| `items`, `setItems` | `data`, `setData` |
| `fetchItems()` | `doFetch()` |
| `FRIDGE_URL` 직접 사용 | `url` 매개변수 사용 |
| JSX 반환 | `{ data, loading, error }` 반환 |
| `cancelled` | 동일하게 사용 |

`useFetch` 핵심 구조:

```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function doFetch() {
      try {
        setLoading(true);
        const res = isMockUrl(url) ? await mockFetch(url) : await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    doFetch();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

성공 기준:

- `FridgeScreen` 안에 있던 fetch/state/effect 로직이 `useFetch` 안으로 이동했다는 점을 이해합니다.

---

## 3단계: `FridgeScreen`을 `useFetch`로 전환

파일: `screens/FridgeScreen.js`

수정할 부분:

1. 1단계용 import 제거
2. `useFetch` import 추가
3. 1단계 `function FridgeScreen()`은 주석 처리 또는 제거
4. `useFetch(FRIDGE_URL)`를 쓰는 새 `FridgeScreen` 활성화

3단계 import:

```javascript
import { StyleSheet, Text, View } from 'react-native';
import FridgeItemList from '../components/FridgeItemList';
import useFetch from '../hooks/useFetch';
```

3단계 활성 코드:

```javascript
const FRIDGE_URL = 'https://api.example.com/fridge-items';

function FridgeScreen() {
  const { data: items, loading, error } = useFetch(FRIDGE_URL);

  if (loading) return <Text style={styles.message}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>에러: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>냉장고 (3단계 — useFetch)</Text>
      <FridgeItemList items={items} />
    </View>
  );
}
```

삭제 또는 주석 처리할 것:

```javascript
import { useEffect, useState } from 'react';
import { isMockUrl, mockFetch } from '../utils/mockApi';
```

성공 기준:

- 냉장고 탭 제목이 `냉장고 (3단계 — useFetch)`로 보입니다.
- 우유/계란/김치 목록이 그대로 나옵니다.
- fetch 로직은 화면 파일이 아니라 `hooks/useFetch.js` 안에 있습니다.

---

## 4단계: `DrumScreen`에서 `useFetch` 재사용

파일: `screens/DrumScreen.js`

목표:

- `FridgeScreen`과 같은 `useFetch`를 사용
- URL만 `drum-sounds`로 바꿈
- `DrumSoundList`에 `sounds` 전달

4단계 import:

```javascript
import { StyleSheet, Text, View } from 'react-native';
import DrumSoundList from '../components/DrumSoundList';
import useFetch from '../hooks/useFetch';
```

4단계 활성 코드:

```javascript
const DRUM_URL = 'https://api.example.com/drum-sounds';

function DrumScreen() {
  const { data: sounds, loading, error } = useFetch(DRUM_URL);

  if (loading) return <Text style={styles.message}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>에러: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>드럼 (4단계 — useFetch 재사용)</Text>
      <DrumSoundList sounds={sounds} />
    </View>
  );
}
```

삭제 또는 주석 처리할 것:

```javascript
function DrumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        4단계 학습 전입니다.{'\n'}
        screens/DrumScreen.js 의 주석을 해제하세요.
      </Text>
    </View>
  );
}
```

성공 기준:

- 드럼 탭 제목이 `드럼 (4단계 — useFetch 재사용)`으로 보입니다.
- 킥/스네어/하이햇 목록이 나옵니다.

---

## `App.js`에서 확인할 부분

파일: `App.js`

4단계까지는 기본 `FridgeScreen`과 `DrumScreen`을 사용합니다.

```javascript
import FridgeScreen from './screens/FridgeScreen';
// import FridgeScreen from './screens/FridgeScreenLeakDemo';
import DrumScreen from './screens/DrumScreen';
```

화면 전환 부분:

```javascript
{screen === 'fridge' ? <FridgeScreen /> : <DrumScreen />}
```

주의:

- `FridgeScreenLeakDemo`는 언마운트 후 setState 실험용입니다.
- 4단계 학습 중에는 기본 `FridgeScreen`을 사용합니다.

---

## 실험용: 언마운트 후 setState 확인

파일: `screens/FridgeScreenLeakDemo.js`

이 파일은 `cancelled`로 setState를 막지 않고, 로그로만 상태를 확인하는 실험용입니다.

사용 방법:

```javascript
// App.js
// import FridgeScreen from './screens/FridgeScreen';
import FridgeScreen from './screens/FridgeScreenLeakDemo';
```

실험:

1. 냉장고 탭 진입
2. `로딩 중... (LeakDemo)`가 보이는 동안 드럼 탭 클릭
3. 브라우저 콘솔 확인

기대 로그:

```text
[LeakDemo] 🚪 FridgeScreen 언마운트 — cancelled = true
[LeakDemo] ⚠️ 언마운트 뒤 setItems / setError(null)
[LeakDemo] ⚠️ 언마운트 뒤 setLoading(false)
```

복귀:

```javascript
import FridgeScreen from './screens/FridgeScreen';
// import FridgeScreen from './screens/FridgeScreenLeakDemo';
```

---

## 최종 상태 체크

4단계까지 완료된 최종 상태:

| 파일 | 최종 상태 |
| --- | --- |
| `App.js` | 냉장고/드럼 탭 전환 |
| `screens/FridgeScreen.js` | `useFetch(FRIDGE_URL)` 사용 |
| `screens/DrumScreen.js` | `useFetch(DRUM_URL)` 사용 |
| `hooks/useFetch.js` | fetch 공통 로직 담당 |
| `utils/mockApi.js` | 냉장고/드럼 mock 데이터 제공 |

화면 확인:

- 냉장고: `냉장고 (3단계 — useFetch)` + 우유/계란/김치
- 드럼: `드럼 (4단계 — useFetch 재사용)` + 킥/스네어/하이햇

