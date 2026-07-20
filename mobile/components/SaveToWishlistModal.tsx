import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { FolderPhoto } from '@/constants/profileFolders';
import { Colors } from '@/constants/theme';
import { useFeed, type WishlistPhoto } from '@/context/FeedContext';

type Props = {
  visible: boolean;
  photo: FolderPhoto;
  sourceUsername?: string;
  sourceFolderId?: string;
  onClose: () => void;
  onSaved?: () => void;
};

export function SaveToWishlistModal({
  visible,
  photo,
  sourceUsername,
  sourceFolderId,
  onClose,
  onSaved,
}: Props) {
  const {
    wishlistAlbums,
    createWishlistAlbum,
    savePhotoToWishlist,
    isPhotoInWishlist,
  } = useFeed();
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');

  const onPick = (wishlistId: string) => {
    const ok = savePhotoToWishlist(photo, wishlistId, {
      username: sourceUsername,
      folderId: sourceFolderId,
    });
    if (!ok) {
      Alert.alert('Could not save', 'That wishlist is unavailable.');
      return;
    }
    onSaved?.();
    onClose();
    Alert.alert('Saved', 'Added to your trip wishlist.');
  };

  const onCreate = () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Name required', 'Enter a name for the new trip wishlist.');
      return;
    }
    const entry: WishlistPhoto = {
      ...JSON.parse(JSON.stringify(photo)),
      sourceUsername,
      sourceFolderId,
    };
    createWishlistAlbum(name, entry);
    setCreatingNew(false);
    setNewName('');
    onSaved?.();
    onClose();
    Alert.alert('Saved', 'Added to your trip wishlist.');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Save to trip wishlist</Text>

          {creatingNew ? (
            <View style={styles.newBox}>
              <Text style={styles.label}>Wishlist name</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. Patagonia someday"
                placeholderTextColor="#8A837A"
                autoFocus
              />
              <View style={styles.actions}>
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => {
                    setCreatingNew(false);
                    setNewName('');
                  }}
                >
                  <Text style={styles.secondaryText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.primaryBtn} onPress={onCreate}>
                  <Text style={styles.primaryText}>Create & save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <ScrollView style={styles.list} bounces={false}>
              {wishlistAlbums.map((album) => {
                const saved = isPhotoInWishlist(photo.id, album.id);
                return (
                  <Pressable
                    key={album.id}
                    style={[styles.row, saved && styles.rowSaved]}
                    onPress={() => {
                      if (saved) {
                        Alert.alert('Already saved', `This post is already in “${album.title}”.`);
                        return;
                      }
                      onPick(album.id);
                    }}
                  >
                    <Ionicons
                      name="bookmark"
                      size={16}
                      color={saved ? Colors.cream : Colors.text}
                    />
                    <View style={styles.rowText}>
                      <Text style={[styles.rowTitle, saved && styles.rowTitleSaved]}>
                        {album.title}
                      </Text>
                      <Text style={[styles.rowSub, saved && styles.rowSubSaved]}>
                        {saved ? 'Already saved' : `${album.photos.length} saves`}
                      </Text>
                    </View>
                    {saved ? (
                      <Ionicons name="checkmark" size={18} color={Colors.cream} />
                    ) : null}
                  </Pressable>
                );
              })}
              <Pressable
                style={styles.row}
                onPress={() => {
                  setCreatingNew(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.text} />
                <Text style={styles.rowTitle}>New trip wishlist</Text>
              </Pressable>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 18,
    maxHeight: '70%',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  list: {
    maxHeight: 320,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  rowSaved: {
    backgroundColor: Colors.card,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  rowTitleSaved: {
    color: Colors.cream,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowSubSaved: {
    color: 'rgba(243, 237, 228, 0.75)',
  },
  newBox: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryBtn: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.cream,
  },
});
