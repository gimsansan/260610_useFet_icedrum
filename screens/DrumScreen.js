import DrumSoundList from '../components/DrumSoundList';
import QueryFetchScreen from './QueryFetchScreen';

const DRUM_URL = 'https://api.example.com/drum-sounds';

// ============================================================
// ★ 10단계 (현재): useQuery — staleTime 캐시, dedupe, 백그라운드 refetch
// ============================================================
function DrumScreen() {
  return (
    <QueryFetchScreen
      title="드럼 (10단계 — useQuery)"
      url={DRUM_URL}
      queryKey={['drum-sounds']}
      staleTime={30_000}
      renderList={({ data, loading, refetch }) => (
        <DrumSoundList sounds={data} refreshing={loading} onRefresh={refetch} />
      )}
    />
  );
}

export default DrumScreen;
