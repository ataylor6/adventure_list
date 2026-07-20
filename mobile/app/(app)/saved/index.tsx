import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

type Tab = 'favorites' | 'wishlists';

export default function SavedHubScreen() {
  const router = useRouter();
  const { favoriteAlbums, wishlistAlbums, createWishlistAlbum } = useFeed();
  const [tab, setTab] = useState<Tab>('favorites');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  const onCreateWishlist = () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Name required', 'Enter a name for your trip wishlist.');
      return;
    }
    const album = createWishlistAlbum(name);
    setCreateOpen(false);
    setNewName('');
    router.push({
      pathname: '/saved/wishlist/[wishlistId]',
      params: { wishlistId: album.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Saved</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'favorites' && styles.tabActive]}
          onPress={() => setTab('favorites')}
        >
          <Ionicons
            name={tab === 'favorites' ? 'heart' : 'heart-outline'}
            size={16}
            color={tab === 'favorites' ? Colors.cream : Colors.text}
          />
          <Text style={[styles.tabText, tab === 'favorites' && styles.tabTextActive]}>
            Favorites
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'wishlists' && styles.tabActive]}
          onPress={() => setTab('wishlists')}
        >
          <Ionicons
            name={tab === 'wishlists' ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={tab === 'wishlists' ? Colors.cream : Colors.text}
          />
          <Text style={[styles.tabText, tab === 'wishlists' && styles.tabTextActive]}>
            Trip wishlists
          </Text>
        </Pressable>
      </View>

      {tab === 'favorites' ? (
        <FlatList
          data={favoriteAlbums}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Save someone else&apos;s album from their profile to keep it here.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={[styles.tile, { width: size, height: size }]}
              onPress={() =>
                router.push({
                  pathname: '/saved/favorite/[albumId]',
                  params: { albumId: item.id },
                })
              }
            >
              <Image source={{ uri: item.coverUrl }} style={styles.tileImage} contentFit="cover" />
              <View style={styles.scrim} />
              <View style={styles.tileMeta}>
                <Ionicons name="heart" size={14} color={Colors.cream} />
                <Text style={styles.tileTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.tileSub} numberOfLines={1}>
                  @{item.sourceUsername}
                </Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={wishlistAlbums}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
          ListHeaderComponent={
            <Pressable style={styles.createRow} onPress={() => setCreateOpen(true)}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.card} />
              <Text style={styles.createText}>New trip wishlist</Text>
            </Pressable>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Create a wishlist, then save posts into it.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={[styles.tile, { width: size, height: size }]}
              onPress={() =>
                router.push({
                  pathname: '/saved/wishlist/[wishlistId]',
                  params: { wishlistId: item.id },
                })
              }
            >
              <Image source={{ uri: item.coverUrl }} style={styles.tileImage} contentFit="cover" />
              <View style={styles.scrim} />
              <View style={styles.tileMeta}>
                <Ionicons name="bookmark" size={14} color={Colors.cream} />
                <Text style={styles.tileTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.tileSub}>
                  {item.photos.length} save{item.photos.length === 1 ? '' : 's'}
                </Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={createOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setCreateOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>New trip wishlist</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Iceland 2027"
              placeholderTextColor="#8A837A"
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => {
                  setCreateOpen(false);
                  setNewName('');
                }}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onCreateWishlist}>
                <Text style={styles.primaryBtnText}>Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(61, 46, 34, 0.08)',
  },
  tabActive: {
    backgroundColor: Colors.card,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  tabTextActive: {
    color: Colors.cream,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  createText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.card,
  },
  tile: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 22, 16, 0.28)',
  },
  tileMeta: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    gap: 2,
  },
  tileTitle: {
    color: Colors.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  tileSub: {
    color: 'rgba(243, 237, 228, 0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 40,
    paddingHorizontal: 28,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(61, 46, 34, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryBtn: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.cream,
  },
});
