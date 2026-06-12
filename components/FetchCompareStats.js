import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMockFetchStats } from '../utils/mockApi';

export default function FetchCompareStats({ engine, note }) {
  const [stats, setStats] = useState(getMockFetchStats);

  useFocusEffect(
    useCallback(() => {
      setStats(getMockFetchStats());
    }, [])
  );

  return (
    <View style={styles.box}>
      <Text style={styles.engine}>{engine}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <Text style={styles.stats}>
        mockFetch 호출 — 냉장고: {stats.fridge} / 드럼: {stats.drum} (합계{' '}
        {stats.total})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#f3f6fb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dce4f0',
  },
  engine: { fontSize: 13, fontWeight: '700', color: '#1565c0' },
  note: { fontSize: 12, color: '#555', marginTop: 4 },
  stats: { fontSize: 12, color: '#333', marginTop: 6 },
});
