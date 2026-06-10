import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FridgeItemList from '../components/FridgeItemList';
import { isMockUrl, mockFetch } from '../utils/mockApi';
// import useFetch from '../hooks/useFetch'; // ★ 3단계: 주석 해제

const FRIDGE_URL = 'https://api.example.com/fridge-items';

// ============================================================
// ★ 1단계: fetch 로직이 컴포넌트 안에 그대로 있음 (먼저 이걸 이해)
//    - useState 3개로 data / loading / error 관리
//    - useEffect 안에서 async fetch
//    - cancelled 로 언마운트 후 setState 방지
// ============================================================
function FridgeScreen() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;// 나갔냐?

    async function fetchItems() {
      try {
        setLoading(true);
        // 연습용 → mockFetch (서버 없이도 동작)
        // 실제 → fetch (진짜 서버 호출)
        // 같은 fetch 흐름을 유지하면서, 학습할 때와 실무 URL 쓸 때를 나눈 겁니다.
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

// ============================================================
// ★ 3단계: useFetch 로 추출 후
//    1단계 function FridgeScreen 전체를 주석 처리하고 아래 주석을 해제하세요
// ============================================================
// function FridgeScreen() {
//   const { data: items, loading, error } = useFetch(FRIDGE_URL);
//
//   if (loading) return <Text style={styles.message}>로딩 중...</Text>;
//   if (error) return <Text style={styles.error}>에러: {error}</Text>;
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>냉장고 (3단계 — useFetch)</Text>
//       <FridgeItemList items={items} />
//     </View>
//   );
// }

export default FridgeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 18, fontWeight: '700', padding: 16, paddingBottom: 8 },
  message: { padding: 16, fontSize: 16 },
  error: { padding: 16, fontSize: 16, color: 'crimson' },
});
