import FridgeItemList from '../components/FridgeItemList';
import FetchScreen from './FetchScreen';

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
// ★ 8단계 (현재): FetchScreen으로 반복 UI 추출
// ============================================================
function FridgeScreen() {
  return (
    <FetchScreen
      title="냉장고 (8단계 — 공통 FetchScreen)"
      url={FRIDGE_URL}
      renderList={({ data, loading, refetch }) => (
        <FridgeItemList items={data} refreshing={loading} onRefresh={refetch} />
      )}
    />
  );
}

export default FridgeScreen;
