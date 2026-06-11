// ============================================================

// ★ 언마운트 후 setState 실험용 (학습 전용)

//

// FridgeScreen.js 와의 차이:

//   - cancelled 는 "언마운트 됐는지 확인" 용도만 (로그)

//   - setState 는 막지 않음 → 없는 컴포넌트에 setState 시도 재현

//

// 사용법 (App.js):

//   import FridgeScreen from './screens/FridgeScreenLeakDemo';

//   로 바꾼 뒤, 로딩 중 "드럼" 탭 클릭 → 브라우저 콘솔 확인

// ============================================================



import { useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import FridgeItemList from '../components/FridgeItemList';

import { isMockUrl, mockFetch } from '../utils/mockApi';



const FRIDGE_URL = 'https://api.example.com/fridge-items';

const LOG = '[LeakDemo]';



function logSetState(label, cancelled) {

  if (cancelled) {

    console.warn(`${LOG} ⚠️ 언마운트 뒤 ${label}`);

  } else {

    console.log(`${LOG} ✅ 마운트 중 ${label}`);

  }

}



function FridgeScreenLeakDemo() {

  const [items, setItems] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    let cancelled = false;



    async function fetchItems() {

      try {

        setLoading(true);

        const res = isMockUrl(FRIDGE_URL)

          ? await mockFetch(FRIDGE_URL)

          : await fetch(FRIDGE_URL);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();



        logSetState('setItems / setError(null)', cancelled);

        setItems(data);

        setError(null);

      } catch (err) {

        logSetState(`setError("${err.message}")`, cancelled);

        setError(err.message);

      } finally {

        logSetState('setLoading(false)', cancelled);

        setLoading(false);

      }

    }



    fetchItems();



    return () => {

      cancelled = true;

      console.log(`${LOG} 🚪 FridgeScreen 언마운트 — cancelled = true`);

    };

  }, []);



  if (loading) return <Text style={styles.message}>로딩 중... (LeakDemo)</Text>;

  if (error) return <Text style={styles.error}>에러: {error}</Text>;



  return (

    <View style={styles.container}>

      <Text style={styles.title}>냉장고 (LeakDemo — setState 안 막음)</Text>

      <FridgeItemList items={items} />

    </View>

  );

}



export default FridgeScreenLeakDemo;



const styles = StyleSheet.create({

  container: { flex: 1, paddingTop: 8 },

  title: { fontSize: 18, fontWeight: '700', padding: 16, paddingBottom: 8 },

  message: { padding: 16, fontSize: 16 },

  error: { padding: 16, fontSize: 16, color: 'crimson' },

});


