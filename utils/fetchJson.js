import { isMockUrl, mockFetch } from './mockApi';

export async function fetchJson(url) {
  const res = isMockUrl(url) ? await mockFetch(url) : await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
