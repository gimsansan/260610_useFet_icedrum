import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import FridgeScreen from './screens/FridgeScreen';
// import FridgeScreen from './screens/FridgeScreenLeakDemo'; // ★ 5단계 실험 시
// import FridgeScreen from './screens/FridgeScreenRetryDemo'; // ★ 6stage setError(null) 실험 시
import DrumScreen from './screens/DrumScreen';
// ============================================================
// useFetch 커스텀 훅 학습 앱
//
//   ✅ 1~4단계 완료
//   ✅ 8단계 — FetchScreen으로 반복 UI 추출
//   ✅ 9단계 — React Navigation bottom-tabs
//   ✅ 10단계 (현재) — useFetch vs TanStack Query useQuery
// ============================================================

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={styles.root}>
          <View style={styles.stageBanner}>
            <Text style={styles.stageText}>
              10단계: useFetch vs useQuery — 탭 왕복하며 mockFetch 횟수 비교
            </Text>
          </View>
          <View style={styles.nav}>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: '#1976d2',
                  tabBarInactiveTintColor: '#666',
                }}
              >
                <Tab.Screen
                  name="냉장고"
                  component={FridgeScreen}
                  options={{ unmountOnBlur: true }}
                />
                <Tab.Screen
                  name="드럼"
                  component={DrumScreen}
                  options={{ unmountOnBlur: true }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </View>
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  nav: { flex: 1 },
  stageBanner: {
    backgroundColor: '#fff3e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0b2',
  },
  stageText: { fontSize: 13, color: '#e65100', fontWeight: '600' },
});
