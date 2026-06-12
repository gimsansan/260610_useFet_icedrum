import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

// ============================================================
// ★ 7단계: refreshing + onRefresh prop 추가 → RefreshControl 연결
// ============================================================
export default function DrumSoundList({ sounds, refreshing, onRefresh }) {
  return (
    <FlatList
      data={sounds ?? []}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.file}>{item.file}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>사운드가 없어요</Text>}
      refreshControl={
        <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: { padding: 16, color: '#666' },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: { fontSize: 16, fontWeight: '600' },
  file: { fontSize: 14, color: '#888', marginTop: 4 },
});
