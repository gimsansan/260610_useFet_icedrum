# Web path access command steps
_Exported on 6/12/2026 at 23:13:32 GMT+9 from Cursor (3.7.12)_

---

**User**

@d:\2605_month\260610_icedurm_usefetch\260610_useFet_icedrum\ @단계설명포함_direct_web_path_access_command.md (114-117) 9단계를 해야 겠는데[?

---

**Cursor**

9단계 내용과 현재 `App.js` 탭 구현을 확인 중입니다.


네, **8단계까지 끝났으니 9단계가 다음**입니다.

현재 `App.js`는 아직 수동 탭입니다.

```15:40:App.js
export default function App() {
  const [screen, setScreen] = useState('fridge');
  // ...
  {screen === 'fridge' ? <FridgeScreen /> : <DrumScreen />}
```

`package.json`에는 React Navigation 패키지가 **아직 없습니다**.

---

## 9단계에서 할 일

**목표:** `useState('fridge')` + `Pressable` 탭 → `@react-navigation/bottom-tabs`

### 1. 패키지 설치 (Expo 권장)

```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

### 2. `App.js` 구조 변경

| 지금 | 9단계 후 |
|------|----------|
| `useState`로 화면 선택 | `NavigationContainer` + `createBottomTabNavigator` |
| 커스텀 `Pressable` 탭바 | 네비게이터가 탭바 제공 |
| 조건부 렌더 `{screen === 'fridge' ? ...}` | `Tab.Screen name="Fridge" component={FridgeScreen}` |

대략 이런 형태입니다:

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FridgeScreen from './screens/FridgeScreen';
import DrumScreen from './screens/DrumScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* stageBanner는 그대로 두거나 Tab.Navigator 위에 유지 */}
      <Tab.Navigator>
        <Tab.Screen name="냉장고" component={FridgeScreen} />
        <Tab.Screen name="드럼" component={DrumScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 3. `FridgeScreen` / `DrumScreen`은 그대로

8단계에서 만든 `FetchScreen` 기반 화면은 **수정 없이** `Tab.Screen`의 `component`로 연결하면 됩니다.

---

## 배우는 포인트

- **탭 전환 = 언마운트/리마운트** — 5단계 LeakDemo와 연결됨
- **URL/딥링크** — 나중에 웹 경로(`/fridge`, `/drum`)와 연결 가능 (문서 제목의 web path access와 이어짐)
- **스택 네비게이션** — 상세 화면 추가 시 `Stack` + `Tab` 조합으로 확장

---

## 주의

- `package.json`에 의존성이 추가되므로 **개발 서버 재시작** 필요
- 커스텀 dev client를 쓰는 경우 **rebuild** 필요할 수 있음 (Expo Go면 보통 재시작만으로 됨)

---

직접 구현해 달라면 **Agent 모드**로 전환해 주세요. Agent 모드에서 9단계 코드까지 적용할 수 있습니다.

---

**User**

구현해

---

**Cursor**

9단계 React Navigation 탭 전환을 구현합니다. 현재 코드와 Expo v56 설정을 확인합니다.


패키지 설치 완료. `App.js`를 React Navigation 탭 구조로 변경합니다.


9단계 구현을 마쳤습니다.

## 변경 사항

**패키지 추가** (`package.json`)
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

**`App.js`**
- `useState` + `Pressable` 수동 탭 제거
- `SafeAreaProvider` → `NavigationContainer` → `Tab.Navigator` 구조로 교체
- `냉장고` / `드럼` 탭은 `FridgeScreen`, `DrumScreen`에 그대로 연결
- 5·6단계 실험용 import 주석 유지

## 확인 방법

개발 서버를 **재시작**한 뒤 실행하세요.

```bash
npm run web
```

하단 탭으로 냉장고/드럼 전환이 되면 정상입니다.

## rebuild 안내

`package.json`에 네이티브 의존성이 추가됐습니다.
- **Expo Go** → 서버 재시작만으로 보통 충분
- **커스텀 dev client** → `npx expo prebuild` 후 네이티브 rebuild 필요할 수 있음

---

**User**

10단계 구현해 @단계설명포함_direct_web_path_access_command.md (119-122) 

---

**Cursor**

10단계 구현을 위해 현재 `useFetch` 구조와 문서의 10단계 설명을 확인합니다.


TanStack Query 설치와 비교용 화면·훅을 추가합니다.


탭 전환 시 `useFetch`는 재요청, `useQuery`는 캐시를 보여주려면 탭에서 `unmountOnBlur`가 필요합니다.


10단계 구현을 마쳤습니다.

## 변경 요약

**패키지:** `@tanstack/react-query`

**새 파일**
- `utils/fetchJson.js` — `useFetch` / `useQuery` 공통 fetcher
- `lib/queryClient.js` — `staleTime: 30초`, `retry: 1`
- `screens/QueryFetchScreen.js` — `useQuery` 기반 화면 래퍼
- `components/FetchCompareStats.js` — mockFetch 호출 횟수 표시

**비교 구조**
| 탭 | 훅 | 동작 |
|---|---|---|
| 냉장고 | `useFetch` | 탭 돌아올 때마다 재요청 (캐시 없음) |
| 드럼 | `useQuery` | 30초 `staleTime` 동안 캐시 → 즉시 표시 |

탭에 `unmountOnBlur: true`를 넣어 9단계 Navigation에서도 언마운트 후 차이가 보이게 했습니다.

## 확인 방법

개발 서버 **재시작** 후:

```bash
npm run web
```

1. 냉장고 → 드럼 → 냉장고 탭 왕복
2. 화면의 **mockFetch 호출** 숫자 확인
   - 냉장고(useFetch): 왕복할 때마다 +1
   - 드럼(useQuery): 첫 방문 후 30초 안에는 +0 (캐시)
3. 콘솔에 `[mockFetch] fridge #N` / `drum #N` 로그도 확인 가능

`@tanstack/react-query`는 JS 전용이라 **rebuild 없이** 서버 재시작만 하면 됩니다.

