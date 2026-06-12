import { Pressable, StyleSheet, Text, View } from 'react-native';
import useFetch from '../hooks/useFetch';
import FetchCompareStats from '../components/FetchCompareStats';

// ============================================================
// ★ 8단계: 반복 UI 추출
// ★ 10단계: useFetch 경로 — FetchCompareStats로 useQuery와 비교
// ============================================================
export default function FetchScreen({ title, url, renderList, compareNote }) {
  const { data, loading, error, refetch } = useFetch(url);

  if (loading && !data) return <Text style={styles.message}>로딩 중...</Text>;
  if (error && !data) {
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
      <Text style={styles.title}>{title}</Text>
      <FetchCompareStats
        engine="useFetch (직접 구현)"
        note={
          compareNote ??
          '탭 전환 시 언마운트 → 다시 마운트 → 매번 mockFetch 호출 (캐시 없음)'
        }
      />
      {renderList({ data, loading, error, refetch })}
    </View>
  );
}

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
