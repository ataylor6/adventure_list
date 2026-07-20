import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import { MissingState } from '@/components/MissingState';

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function WishlistPhotoScreen() {
  const router = useRouter();
  const { wishlistId, photoId } = useLocalSearchParams<{
    wishlistId: string;
    photoId: string;
  }>();
  const { resolveWishlistPhoto, removePhotoFromWishlist } = useFeed();
  const data = resolveWishlistPhoto(wishlistId ?? '', photoId ?? '');

  if (!data) {
    return <MissingState title="Save not found" message="This wishlist save is unavailable." />;
  }

  const { album, photo } = data;
  const hasDescription = Boolean(photo.description?.trim());
  const hasExtras = Boolean(
    photo.stayed?.trim() ||
      photo.at?.trim() ||
      photo.listenedTo?.trim() ||
      photo.wore?.trim(),
  );

  const onRemove = () => {
    Alert.alert('Remove from wishlist?', 'This only removes it from your trip wishlist.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removePhotoFromWishlist(album.id, photo.id);
          router.back();
        },
      },
    ]);
  };

  const openOriginal = () => {
    if (!photo.sourceUsername || !photo.sourceFolderId) return;
    router.push({
      pathname: '/user/[username]/folder/[folderId]/photo/[photoId]',
      params: {
        username: photo.sourceUsername,
        folderId: photo.sourceFolderId,
        photoId: photo.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={{ uri: photo.imageUrl }} style={styles.image} contentFit="cover" />
          {photo.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
              <Text style={styles.locationText}>{photo.location}</Text>
            </View>
          ) : null}
        </View>

        {photo.sourceUsername ? (
          <Text style={styles.source}>Saved from @{photo.sourceUsername}</Text>
        ) : null}

        {hasDescription ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{photo.description}</Text>
          </View>
        ) : null}

        {hasExtras ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This adventure</Text>
            <DetailRow label="Stayed" value={photo.stayed} />
            <DetailRow label="At" value={photo.at} />
            <DetailRow label="Listened to" value={photo.listenedTo} />
            <DetailRow label="Wore" value={photo.wore} />
          </View>
        ) : null}

        {photo.sourceUsername && photo.sourceFolderId ? (
          <Pressable style={styles.secondaryBtn} onPress={openOriginal}>
            <Text style={styles.secondaryBtnText}>View original post</Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.deleteBtn} onPress={onRemove}>
          <Ionicons name="bookmark-outline" size={18} color="#B42318" />
          <Text style={styles.deleteText}>Remove from wishlist</Text>
        </Pressable>
      </ScrollView>
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
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  image: {
    width: '100%',
    aspectRatio: 0.92,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.card,
  },
  locationText: {
    flex: 1,
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
  },
  source: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  row: {
    gap: 2,
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rowValue: {
    fontSize: 15,
    color: Colors.text,
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(61, 46, 34, 0.08)',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B42318',
  },
});
