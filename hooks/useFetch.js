// hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { isMockUrl, mockFetch } from '../utils/mockApi';

// ============================================================
// ★ 6단계 (현재): doFetch 분리 + refetch 반환
//    - mount 시 useEffect가 doFetch() 호출
//    - 버튼 등 useEffect 밖에서 refetch() 호출 가능
// ============================================================
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

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
    doFetch();
    return () => {
      cancelledRef.current = true;
    };
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
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
// cancelled 플래그                →  cancelledRef (동일 역할)
// return JSX                      →  return { data, loading, error, refetch }
// ============================================================
