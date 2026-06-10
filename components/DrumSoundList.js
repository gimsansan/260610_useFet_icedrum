import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function DrumSoundList({ sounds }) {
  if (!sounds || sounds.length === 0) {
    return <Text style={styles.empty}>사운드가 없어요</Text>;
  }

  return (
    <FlatList
      data={sounds}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.file}>{item.file}</Text>
        </View>
      )}
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
