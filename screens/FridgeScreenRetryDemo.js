// ============================================================
// ★ 6단계 학습용 — setError(null) 체감 (다시 시도 버튼)
//
// FridgeScreenLeakDemo.js 와의 차이:
//   - 첫 로딩을 의도적으로 실패시켜 에러 화면 표시
//   - 「다시 시도」버튼 → fetch 재실행 → setError(null) + 목록
//   - logSetState 로 setError / setError(null) 콘솔 확인
//   - if (!cancelled) 로 setState 막음 (실무 패턴)
//
// 콘솔 확인 순서:
//   1차 fetch 실패 → ✅ setError("HTTP 404")  ← err.cause (UI용)
//   다시 시도 성공  → ✅ setItems / setError(null)  ← 에러 지움 체감
//
// 사용법 (App.js):
//   import FridgeScreen from './screens/FridgeScreenRetryDemo';
//
// 가이드: 6stage_에러재시도_setErrornull.md
// ============================================================

import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FridgeItemList from "../components/FridgeItemList";
import { isMockUrl, mockFetch } from "../utils/mockApi";

const FRIDGE_URL_OK = "https://api.example.com/fridge-items";
const FRIDGE_URL_FAIL = "https://api.example.com/fridge-wrong";

// true: 첫 로딩 404 → 에러 화면 → 다시 시도로 성공 체험
// false: 처음부터 정상 로딩
const LEARN_START_WITH_FAIL = true;

const LOG = "[RetryDemo]";

function logSetState(label, cancelled) {
  if (cancelled) {
    console.warn(`${LOG} ⚠️ 언마운트 뒤 ${label} (setState 생략)`);
  } else {
    console.log(`${LOG} ✅ ${label}`);
  }
}

function FridgeScreenRetryDemo() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestUrl, setRequestUrl] = useState(
    LEARN_START_WITH_FAIL ? FRIDGE_URL_FAIL : FRIDGE_URL_OK,
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = isMockUrl(requestUrl)
          ? await mockFetch(requestUrl)
          : await fetch(requestUrl);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();

        logSetState("setItems / setError(null)", cancelled);
        if (!cancelled) {
          setItems(json);
          setError(null);
        }
      } catch (err) {
        console.log(err.message);
        const errorText = String(err.cause ?? err.message);

        logSetState(`setError("${errorText}")`, cancelled);
        // err.message = 개발자용, err.cause = 화면/UI용
        if (!cancelled) setError(errorText);
      } finally {
        logSetState("setLoading(false)", cancelled);
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, [requestUrl]);

  function handleRetry() {
    setRequestUrl(FRIDGE_URL_OK);
  }

  if (loading) {
    return <Text style={styles.message}>로딩 중... (RetryDemo)</Text>;
  }

  if (error) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.error}>에러: {error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>냉장고 (RetryDemo — setError(null) 체감)</Text>
      <FridgeItemList items={items} />
    </View>
  );
}

export default FridgeScreenRetryDemo;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 18, fontWeight: "700", padding: 16, paddingBottom: 8 },
  message: { padding: 16, fontSize: 16 },
  error: { fontSize: 16, color: "crimson" },
  errorBox: { padding: 16 },
  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
