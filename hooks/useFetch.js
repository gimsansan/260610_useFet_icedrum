// hooks/useFetch.js
import { useState, useEffect } from 'react';
import { isMockUrl, mockFetch } from '../utils/mockApi';

// ============================================================
// ★ 3단계: 커스텀 훅 완성본 (실무에서 가장 흔한 패턴)
//    ① use로 시작하는 함수명
//    ② 안에서 다른 Hook(useState, useEffect) 사용
//    ③ { data, loading, error } 를 return
// ============================================================
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function doFetch() {
      try {
        setLoading(true);
        // 학습용: example.com 은 mockFetch 로 대체
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
  }, [url]); // url이 바뀌면 다시 fetch

  return { data, loading, error };
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
