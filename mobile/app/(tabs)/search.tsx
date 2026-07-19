import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { api } from '@/services/api';
import type { Post } from '@/types/api';

export default function SearchScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getFeed()
      .then((res) => setPosts(res.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.user.username.includes(query.toLowerCase()) ||
          p.caption.toLowerCase().includes(query.toLowerCase()),
      )
    : posts;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.text} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image_url }} style={styles.tile} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No posts match “{query}”</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  tile: {
    width: '33.333%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: Colors.background,
    backgroundColor: '#EFEFEF',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.textSecondary,
  },
});
