import { Pressable, StyleSheet, Text, View } from 'react-native';
import DrumSoundList from '../components/DrumSoundList';
import useFetch from '../hooks/useFetch';

const DRUM_URL = 'https://api.example.com/drum-sounds';

// ============================================================
// ★ 7단계 (현재): Pull to Refresh
//    - loading && !sounds → 첫 로드만 스피너
//    - loading && sounds  → RefreshControl 스피너 (리스트 유지)
// ============================================================
function DrumScreen() {
  const { data: sounds, loading, error, refetch } = useFetch(DRUM_URL);

  if (loading && !sounds) return <Text style={styles.message}>로딩 중...</Text>;
  if (error && !sounds) {
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
      <Text style={styles.title}>드럼 (7단계 — Pull to Refresh)</Text>
      <DrumSoundList sounds={sounds} refreshing={loading} onRefresh={refetch} />
    </View>
  );
}

export default DrumScreen;

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
