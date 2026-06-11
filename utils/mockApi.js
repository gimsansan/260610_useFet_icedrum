// 학습용 목 API — api.example.com 은 실제로 응답하지 않으므로

// fetch 대신 이 함수를 쓰면 네트워크 없이도 동일한 흐름을 연습할 수 있습니다.

const MOCK_DATA = {
  "https://api.example.com/fridge-items": [
    { id: 1, name: "우유", expiry: "2026-06-15" },

    { id: 2, name: "계란", expiry: "2026-06-20" },

    { id: 3, name: "김치", expiry: "2026-07-01" },
  ],

  "https://api.example.com/drum-sounds": [
    { id: 1, name: "킥", file: "kick.wav" },

    { id: 2, name: "스네어", file: "snare.wav" },

    { id: 3, name: "하이햇", file: "hihat.wav" },
  ],
};

const DELAY_MS = 1000;

export async function mockFetch(url) {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  const data = MOCK_DATA[url];

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
