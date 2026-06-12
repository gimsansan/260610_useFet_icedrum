import { Pressable, StyleSheet, Text, View } from 'react-native';
import FridgeItemList from '../components/FridgeItemList';
import useFetch from '../hooks/useFetch';

const FRIDGE_URL = 'https://api.example.com/fridge-items';

// ============================================================
// ★ 2단계: hooks/useFetch.js 와 아래 코드를 나란히 비교
//    - 1단계 fetch 로직은 그대로 (앱 동작 동일)
//    - // ↔ useFetch.js:줄번호 주석으로 1:1 대응 확인
//    - 비교 끝나면 3단계로 FridgeScreen 주석 토글
// ============================================================
// function FridgeScreen() {
//   const [items, setItems] = useState(null);       // ↔ useFetch.js:15 data
//   const [loading, setLoading] = useState(true);   // ↔ useFetch.js:16
//   const [error, setError] = useState(null);       // ↔ useFetch.js:17
//
//   useEffect(() => {                               // ↔ useFetch.js:19
//     let cancelled = false;                        // ↔ useFetch.js:20
//
//     async function fetchItems() {                 // ↔ useFetch.js:22 doFetch
//       try {
//         setLoading(true);                         // ↔ useFetch.js:24
//         const res = isMockUrl(FRIDGE_URL)         // ↔ useFetch.js:25 (url 인자)
//           ? await mockFetch(FRIDGE_URL)
//           : await fetch(FRIDGE_URL);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`); // ↔ useFetch.js:27
//         const data = await res.json();            // ↔ useFetch.js:28 json
//
//         if (!cancelled) {                         // ↔ useFetch.js:29
//           setItems(data);                         // ↔ useFetch.js:30 setData
//           setError(null);                         // ↔ useFetch.js:31
//         }
//       } catch (err) {
//         if (!cancelled) setError(err.message);   // ↔ useFetch.js:34
//       } finally {
//         if (!cancelled) setLoading(false);       // ↔ useFetch.js:36
//       }
//     }
//
//     fetchItems();                                 // ↔ useFetch.js:40 doFetch()
//     return () => {
//       cancelled = true;                           // ↔ useFetch.js:42
//     };
//   }, []);                                         // ↔ useFetch.js:44 [url] — FridgeScreen은 URL 고정
//
//   // ↓ 아래 UI는 3단계 useFetch 쓸 때도 동일 (훅만 바꿈)
//   if (loading) return <Text style={styles.message}>로딩 중...</Text>;
//   if (error) return <Text style={styles.error}>에러: {error}</Text>;
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>냉장고 (2단계 — useFetch와 비교)</Text>
//       <FridgeItemList items={items} />
//     </View>
//   );
// }

// ============================================================
// ★ 7단계 (현재): Pull to Refresh
//    - loading && !items  → 첫 로드만 스피너 (데이터 없을 때)
//    - loading && items   → RefreshControl 스피너 (리스트 유지)
//    - refetch를 onRefresh로 그대로 전달 → loading 상태 재사용
// ============================================================
function FridgeScreen() {
  const { data: items, loading, error, refetch } = useFetch(FRIDGE_URL);

  if (loading && !items) return <Text style={styles.message}>로딩 중...</Text>;
  if (error && !items) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.error}>에러: {error}</Text>
        <Pressable style={styles.refetchButton} onPress={refetch}>
          <Text style={styles.refetchText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>냉장고 (7단계 — Pull to Refresh)</Text>
      <FridgeItemList items={items} refreshing={loading} onRefresh={refetch} />
    </View>
  );
}

export default FridgeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 18, fontWeight: '700', padding: 16, paddingBottom: 8 },
  message: { padding: 16, fontSize: 16 },
  errorBox: { padding: 16 },
  error: { fontSize: 16, color: 'crimson' },
  refetchButton: {
    marginHorizontal: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  refetchText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
