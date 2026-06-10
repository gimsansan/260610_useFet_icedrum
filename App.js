import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FridgeScreen from './screens/FridgeScreen';
import DrumScreen from './screens/DrumScreen';

// ============================================================
// useFetch 커스텀 훅 학습 앱
//
// 학습 순서:
//   1단계 → screens/FridgeScreen.js (현재 활성) fetch 로직 이해
//   2단계 → hooks/useFetch.js 와 1단계 코드 1:1 비교
//   3단계 → FridgeScreen 1단계 주석 처리 + 3단계 주석 해제
//   4단계 → screens/DrumScreen.js 주석 해제
// ============================================================

export default function App() {
  const [screen, setScreen] = useState('fridge');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, screen === 'fridge' && styles.tabActive]}
          onPress={() => setScreen('fridge')}
        >
          <Text style={styles.tabText}>냉장고</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, screen === 'drum' && styles.tabActive]}
          onPress={() => setScreen('drum')}
        >
          <Text style={styles.tabText}>드럼</Text>
        </Pressable>
      </View>

      {screen === 'fridge' ? <FridgeScreen /> : <DrumScreen />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  tabActive: {
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: { fontSize: 15, fontWeight: '600' },
});
