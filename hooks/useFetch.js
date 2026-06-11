// hooks/useFetch.js
import { useState, useEffect } from 'react';
import { isMockUrl, mockFetch } from '../utils/mockApi';

// ============================================================
// ★ 2단계 (현재): FridgeScreen.js 1단계 코드와 1:1 비교
// ★ 3단계: FridgeScreen에서 import 해서 사용
//
// 커스텀 훅 3요건:
//    ① use로 시작하는 함수명
//    ② 안에서 다른 Hook(useState, useEffect) 사용
//    ③ { data, loading, error } 를 return
// ============================================================
function useFetch(url) {
  const [data, setData] = useState(null);         // ↔ FridgeScreen.js:16 items
  const [loading, setLoading] = useState(true);   // ↔ FridgeScreen.js:17
  const [error, setError] = useState(null);       // ↔ FridgeScreen.js:18

  useEffect(() => {                               // ↔ FridgeScreen.js:20
    let cancelled = false;                        // ↔ FridgeScreen.js:21

    async function doFetch() {                    // ↔ FridgeScreen.js:23 fetchItems
      try {
        setLoading(true);                         // ↔ FridgeScreen.js:25
        const res = isMockUrl(url) ? await mockFetch(url) : await fetch(url);
                                                    // ↔ FridgeScreen.js:26-28 (FRIDGE_URL → url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`); // ↔ FridgeScreen.js:29
        const json = await res.json();            // ↔ FridgeScreen.js:30 data
        if (!cancelled) {
          setData(json);                          // ↔ FridgeScreen.js:33 setItems
          setError(null);                         // ↔ FridgeScreen.js:34
        }
      } catch (err) {
        if (!cancelled) setError(err.message);    // ↔ FridgeScreen.js:37
      } finally {
        if (!cancelled) setLoading(false);        // ↔ FridgeScreen.js:39
      }
    }

    doFetch();                                    // ↔ FridgeScreen.js:43 fetchItems()
    return () => {
      cancelled = true;                           // ↔ FridgeScreen.js:45
    };
  }, [url]); // url이 바뀌면 다시 fetch — FridgeScreen은 [] (URL 고정)

  return { data, loading, error };                // ↔ FridgeScreen은 JSX return
}

export default useFetch;

// ============================================================
// ★ 2단계 참고: FridgeScreen(1단계) 로직과 1:1 대응
// ============================================================
// FridgeScreen                    →  useFetch
// --------------------------------   -------------------------
// items, setItems                 →  data, setData
// loading, setLoading             →  loading, setLoading
// error, setError                 →  error, setError
// useEffect + fetchItems()        →  useEffect + doFetch()
// cancelled 플래그                →  cancelled 플래그 (동일)
// return JSX                      →  return { data, loading, error }
// ============================================================
