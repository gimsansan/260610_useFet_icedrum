import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function FridgeItemList({ items }) {
  if (!items || items.length === 0) {
    return <Text style={styles.empty}>냉장고가 비어 있어요</Text>;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.expiry}>유통기한: {item.expiry}</Text>
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
  expiry: { fontSize: 14, color: '#888', marginTop: 4 },
});
