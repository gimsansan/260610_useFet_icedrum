import DrumSoundList from '../components/DrumSoundList';
import FetchScreen from './FetchScreen';

const DRUM_URL = 'https://api.example.com/drum-sounds';

// ============================================================
// ★ 8단계 (현재): FetchScreen으로 반복 UI 추출
// ============================================================
function DrumScreen() {
  return (
    <FetchScreen
      title="드럼 (8단계 — 공통 FetchScreen)"
      url={DRUM_URL}
      renderList={({ data, loading, refetch }) => (
        <DrumSoundList sounds={data} refreshing={loading} onRefresh={refetch} />
      )}
    />
  );
}

export default DrumScreen;
