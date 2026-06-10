import { StyleSheet, Text, View } from 'react-native';
import DrumSoundList from '../components/DrumSoundList';
// import useFetch from '../hooks/useFetch'; // ★ 4단계: 주석 해제

const DRUM_URL = 'https://api.example.com/drum-sounds';

// ============================================================
// ★ 4단계: 다른 화면도 URL만 바꿔서 동일 패턴 (훅 재사용의 이점)
//    FridgeScreen 3단계를 완료한 뒤 아래 주석을 해제하세요
// ============================================================
// function DrumScreen() {
//   const { data: sounds, loading, error } = useFetch(DRUM_URL);
//
//   if (loading) return <Text style={styles.message}>로딩 중...</Text>;
//   if (error) return <Text style={styles.error}>에러: {error}</Text>;
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>드럼 (4단계 — useFetch 재사용)</Text>
//       <DrumSoundList sounds={sounds} />
//     </View>
//   );
// }

function DrumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        4단계 학습 전입니다.{'\n'}
        screens/DrumScreen.js 의 주석을 해제하세요.
      </Text>
    </View>
  );
}

export default DrumScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 18, fontWeight: '700', padding: 16, paddingBottom: 8 },
  message: { padding: 16, fontSize: 16 },
  error: { padding: 16, fontSize: 16, color: 'crimson' },
  placeholder: { padding: 16, fontSize: 15, color: '#666', lineHeight: 22 },
});
