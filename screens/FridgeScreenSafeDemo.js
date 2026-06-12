// ============================================================
// ★ 실무 패턴 학습용 — FridgeScreenLeakDemo 와 나란히 비교
//
// FridgeScreenLeakDemo.js 와의 차이:
//   - logSetState 없음
//   - if (!cancelled) 로 setState 만 실행 (hooks/useFetch.js 와 동일)
//
// 사용법 (App.js):
//   import FridgeScreen from './screens/FridgeScreenSafeDemo';
//
// 실험:
//   1. npm run web
//   2. 로딩 중 "드럼" 탭 클릭
//   3. 콘솔에 ⚠️ 없음 — 언마운트 뒤 setState 가 실행되지 않음
//   4. FridgeScreenLeakDemo 와 fetch/cleanup 구조만 비교
// ============================================================

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FridgeItemList from '../components/FridgeItemList';
import { isMockUrl, mockFetch } from '../utils/mockApi';

const FRIDGE_URL = 'https://api.example.com/fridge-items';

function FridgeScreenSafeDemo() {
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
        const json = await res.json();

        // ↔ LeakDemo: logSetState + setItems (무조건)
        // ↔ useFetch.js:29-32
        if (!cancelled) {
          setItems(json);
          setError(null);
        }
      } catch (err) {
        // ↔ LeakDemo: logSetState + setError (무조건)
        // ↔ useFetch.js:34
        if (!cancelled) setError(err.message);
      } finally {
        // ↔ LeakDemo: logSetState + setLoading(false) (무조건)
        // ↔ useFetch.js:36
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
      // ↔ LeakDemo: console.log 언마운트 로그 — 학습용이라 여기서는 생략
    };
  }, []);

  if (loading) return <Text style={styles.message}>로딩 중... (SafeDemo)</Text>;
  if (error) return <Text style={styles.error}>에러: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>냉장고(SafeDemo — setState 막음)실무</Text>
      <FridgeItemList items={items} />
    </View>
  );
}

export default FridgeScreenSafeDemo;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 18, fontWeight: '700', padding: 16, paddingBottom: 8 },
  message: { padding: 16, fontSize: 16 },
  error: { padding: 16, fontSize: 16, color: 'crimson' },
});
