import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../utils/fetchJson';
import FetchCompareStats from '../components/FetchCompareStats';

// ============================================================
// ★ 10단계: useFetch 대신 TanStack Query useQuery
//    - staleTime 동안 캐시 → 탭 왕복 시 재요청 없음
//    - isFetching 으로 백그라운드 refetch 표시
// ============================================================
export default function QueryFetchScreen({
  title,
  url,
  queryKey,
  staleTime = 30_000,
  renderList,
}) {
  const { data, isLoading, isFetching, error, refetch, isStale, dataUpdatedAt } =
    useQuery({
      queryKey: queryKey ?? [url],
      queryFn: () => fetchJson(url),
      staleTime,
    });

  const cacheAgeSec =
    dataUpdatedAt > 0
      ? Math.floor((Date.now() - dataUpdatedAt) / 1000)
      : null;

  if (isLoading && !data) {
    return <Text style={styles.message}>로딩 중...</Text>;
  }
  if (error && !data) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.error}>에러: {error.message}</Text>
        <Pressable style={styles.refetchButton} onPress={() => refetch()}>
          <Text style={styles.refetchText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FetchCompareStats
        engine="useQuery (TanStack Query)"
        note={`staleTime ${staleTime / 1000}초 · isStale=${String(isStale)} · 캐시 ${cacheAgeSec ?? 0}초 전`}
      />
      {renderList({
        data,
        loading: isFetching,
        error: error?.message ?? null,
        refetch: () => refetch(),
      })}
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
