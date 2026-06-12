// 학습용 목 API — api.example.com 은 실제로 응답하지 않으므로
// fetch 대신 이 함수를 쓰면 네트워크 없이도 동일한 흐름을 연습할 수 있습니다.

const FRIDGE_POOL = [
  { id: 1, name: "우유", expiry: "2026-06-15" },
  { id: 2, name: "계란", expiry: "2026-06-20" },
  { id: 3, name: "김치", expiry: "2026-07-01" },
  { id: 4, name: "두부", expiry: "2026-06-18" },
  { id: 5, name: "요거트", expiry: "2026-06-14" },
  { id: 6, name: "버터", expiry: "2026-08-01" },
  { id: 7, name: "치즈", expiry: "2026-07-10" },
];

const DRUM_POOL = [
  { id: 1, name: "킥", file: "kick.wav" },
  { id: 2, name: "스네어", file: "snare.wav" },
  { id: 3, name: "하이햇", file: "hihat.wav" },
  { id: 4, name: "탐", file: "tom.wav" },
  { id: 5, name: "크래시", file: "crash.wav" },
  { id: 6, name: "라이드", file: "ride.wav" },
];

function randomPick(pool) {
  const count = 3 + Math.floor(Math.random() * (pool.length - 2));
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

const DELAY_MS = 1000;

const fetchStats = { fridge: 0, drum: 0, total: 0 };

function statsKey(url) {
  if (url.includes('fridge-items')) return 'fridge';
  if (url.includes('drum-sounds')) return 'drum';
  return 'other';
}

export function getMockFetchStats() {
  return { ...fetchStats };
}

export async function mockFetch(url) {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  const key = statsKey(url);
  if (key !== 'other') {
    fetchStats[key] += 1;
    fetchStats.total += 1;
    console.log(
      `[mockFetch] ${key} #${fetchStats[key]} (total ${fetchStats.total})`
    );
  }

  let data;
  if (url === "https://api.example.com/fridge-items") {
    data = randomPick(FRIDGE_POOL);
  } else if (url === "https://api.example.com/drum-sounds") {
    data = randomPick(DRUM_POOL);
  }

  if (!data) {
    return { ok: false, status: 404 };
  }

  return {
    ok: true,
    status: 200,
    async json() {
      return data;
    },
  };
}

export function isMockUrl(url) {
  return url.startsWith("https://api.example.com/");
}
