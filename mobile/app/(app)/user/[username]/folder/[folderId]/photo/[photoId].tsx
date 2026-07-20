import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import { SaveToWishlistModal } from '@/components/SaveToWishlistModal';
import { MissingState } from '@/components/MissingState';
import { UserContentHeader } from '@/components/UserContentHeader';
import {
  ADVENTURE_CATEGORIES,
  type AdventureCategory,
} from '@/constants/adventureFeed';
import { openNearbyFromLocation } from '@/utils/openNearby';
import {
  POST_REPORT_OPTIONS,
  submitPostReport,
  type PostReportReason,
} from '@/utils/reportContent';

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function PhotoDetailScreen() {
  const router = useRouter();
  const { username, folderId, photoId } = useLocalSearchParams<{
    username: string;
    folderId: string;
    photoId: string;
  }>();
  const {
    user,
    posts,
    myFolders,
    resolvePhoto,
    movePhoto,
    deletePhoto,
    updatePhoto,
    createFolder,
    setAlbumCover,
    isPhotoInWishlist,
  } = useFeed();
  const [selectedFolderId, setSelectedFolderId] = useState(folderId ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<PostReportReason | null>(null);
  const [editing, setEditing] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStayed, setEditStayed] = useState('');
  const [editAt, setEditAt] = useState('');
  const [editListenedTo, setEditListenedTo] = useState('');
  const [editWore, setEditWore] = useState('');
  const [editTags, setEditTags] = useState<AdventureCategory[]>([]);

  const data = resolvePhoto(username ?? '', folderId ?? '', photoId ?? '');
  const isOwn = (username ?? '').toLowerCase() === user.username.toLowerCase();

  const selectedFolderTitle = useMemo(() => {
    return myFolders.find((f) => f.id === selectedFolderId)?.title ?? data?.folder.title ?? 'Album';
  }, [myFolders, selectedFolderId, data?.folder.title]);

  const photoTags = useMemo(() => {
    if (!data) return [] as AdventureCategory[];
    const fromFeed = posts.find((p) => p.id === data.photo.id)?.tags;
    return fromFeed ?? data.photo.tags ?? [];
  }, [data, posts]);

  if (!data) {
    return <MissingState title="Photo not found" message="This post is unavailable." />;
  }

  const { photo, profile } = data;
  const inWishlist = isPhotoInWishlist(photo.id);
  const hasDescription = Boolean(photo.description?.trim());
  const hasExtras = Boolean(
    photo.stayed?.trim() ||
      photo.at?.trim() ||
      photo.listenedTo?.trim() ||
      photo.wore?.trim(),
  );

  const startEditing = () => {
    setEditLocation(photo.location ?? '');
    setEditDescription(photo.description ?? '');
    setEditStayed(photo.stayed ?? '');
    setEditAt(photo.at ?? '');
    setEditListenedTo(photo.listenedTo ?? '');
    setEditWore(photo.wore ?? '');
    setEditTags(photoTags);
    setEditing(true);
  };

  const toggleEditTag = (id: AdventureCategory) => {
    setEditTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const onSaveEdits = () => {
    if (!editLocation.trim()) {
      Alert.alert('Location required', 'Add a location for this adventure.');
      return;
    }
    if (editTags.length === 0) {
      Alert.alert('Tags required', 'Choose at least one tag.');
      return;
    }
    const ok = updatePhoto(photo.id, folderId ?? '', {
      location: editLocation,
      description: editDescription,
      stayed: editStayed,
      at: editAt,
      listenedTo: editListenedTo,
      wore: editWore,
      tags: editTags,
    });
    if (!ok) {
      Alert.alert('Could not save', 'This post could not be updated.');
      return;
    }
    setEditing(false);
  };

  const onSelectFolder = (id: string) => {
    setSelectedFolderId(id);
    setCreatingNew(false);
    setNewAlbumName('');
    setDropdownOpen(false);
  };

  const onChooseNew = () => {
    setCreatingNew(true);
    setDropdownOpen(false);
  };

  const onCreateAlbum = () => {
    const name = newAlbumName.trim();
    if (!name) {
      Alert.alert('Name required', 'Enter a name for the new album.');
      return;
    }
    const folder = createFolder(name);
    setSelectedFolderId(folder.id);
    setCreatingNew(false);
    setNewAlbumName('');
  };

  const onSaveAlbum = () => {
    if (!selectedFolderId || selectedFolderId === folderId) return;
    const ok = movePhoto(photo.id, folderId ?? '', selectedFolderId);
    if (!ok) {
      Alert.alert('Could not move photo', 'That album is unavailable.');
      return;
    }
    router.replace({
      pathname: '/user/[username]/folder/[folderId]/photo/[photoId]',
      params: {
        username: user.username,
        folderId: selectedFolderId,
        photoId: photo.id,
      },
    });
  };

  const onMakeCover = () => {
    const ok = setAlbumCover(folderId ?? '', photo.id);
    if (!ok) {
      Alert.alert('Could not update cover', 'That album is unavailable.');
      return;
    }
    Alert.alert('Cover updated', 'This photo is now the album cover.');
  };

  const onDelete = () => {
    Alert.alert('Delete photo?', 'This removes it from the album and your feed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const result = deletePhoto(photo.id, folderId ?? '');
          if (!result.success) return;
          if (result.albumDeleted) {
            router.replace({
              pathname: '/user/[username]',
              params: { username: user.username },
            });
            return;
          }
          router.replace({
            pathname: '/user/[username]/folder/[folderId]',
            params: { username: user.username, folderId: folderId ?? '' },
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <UserContentHeader
        right={
          isOwn ? (
            editing ? (
              <Pressable onPress={cancelEditing} hitSlop={12} accessibilityLabel="Cancel edit">
                <Text style={styles.headerActionText}>Cancel</Text>
              </Pressable>
            ) : (
              <Pressable onPress={startEditing} hitSlop={12} accessibilityLabel="Edit post">
                <Ionicons name="create-outline" size={24} color={Colors.text} />
              </Pressable>
            )
          ) : (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setWishlistOpen(true)}
                hitSlop={12}
                accessibilityLabel="Save to trip wishlist"
              >
                <Ionicons
                  name={inWishlist ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={Colors.text}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setReportReason(null);
                  setReportOpen(true);
                }}
                hitSlop={12}
                accessibilityLabel="Report post"
              >
                <Ionicons name="flag-outline" size={22} color={Colors.text} />
              </Pressable>
            </View>
          )
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image
            source={{ uri: photo.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          {!editing && photo.location ? (
            <Pressable
              style={styles.locationRow}
              onPress={() => {
                const fromFeed = posts.find((p) => p.id === photo.id);
                openNearbyFromLocation(router, {
                  location: photo.location ?? '',
                  latitude: photo.latitude ?? fromFeed?.latitude,
                  longitude: photo.longitude ?? fromFeed?.longitude,
                });
              }}
              hitSlop={6}
            >
              <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
              <Text style={styles.locationText}>{photo.location}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.folderChip}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/user/[username]',
                params: { username: profile.username },
              })
            }
            hitSlop={6}
          >
            <Text style={styles.folderChipText}>@{profile.username}</Text>
          </Pressable>
          <Ionicons name="chevron-forward" size={14} color={Colors.card} />
          <Pressable
            style={styles.folderChipAlbum}
            onPress={() =>
              router.push({
                pathname: '/user/[username]/folder/[folderId]',
                params: {
                  username: profile.username,
                  folderId: data.folder.id,
                },
              })
            }
            hitSlop={6}
          >
            <Ionicons name="folder" size={14} color={Colors.card} />
            <Text style={styles.folderChipText}>{data.folder.title}</Text>
          </Pressable>
        </View>

        {editing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit post</Text>

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="Where was this?"
              placeholderTextColor="#8A837A"
            />

            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagRow}>
              {ADVENTURE_CATEGORIES.map((item) => {
                const active = editTags.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.tagChip, active && styles.tagChipActive]}
                    onPress={() => toggleEditTag(item.id)}
                  >
                    <Text style={[styles.tagChipText, active && styles.tagChipTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, styles.descriptionInput]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="What made this adventure stick?"
              placeholderTextColor="#8A837A"
              multiline
              textAlignVertical="top"
            />

            <View style={styles.adventureSection}>
              <Text style={styles.adventureSectionTitle}>This adventure</Text>

              <Text style={styles.label}>Stayed</Text>
              <TextInput
                style={[styles.input, styles.adventureInput]}
                value={editStayed}
                onChangeText={setEditStayed}
                placeholder="Where did you stay?"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>At</Text>
              <TextInput
                style={[styles.input, styles.adventureInput]}
                value={editAt}
                onChangeText={setEditAt}
                placeholder="Where were you?"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>Listened to</Text>
              <TextInput
                style={[styles.input, styles.adventureInput]}
                value={editListenedTo}
                onChangeText={setEditListenedTo}
                placeholder="What was playing?"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>Wore</Text>
              <TextInput
                style={[styles.input, styles.adventureInput]}
                value={editWore}
                onChangeText={setEditWore}
                placeholder="What did you wear?"
                placeholderTextColor="#8A837A"
              />
            </View>

            <Pressable style={styles.actionBtn} onPress={onSaveEdits}>
              <Text style={styles.actionBtnText}>Save changes</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {photoTags.length > 0 ? (
              <View style={styles.tagRow}>
                {photoTags.map((tagId) => {
                  const meta = ADVENTURE_CATEGORIES.find((c) => c.id === tagId);
                  if (!meta) return null;
                  return (
                    <View key={tagId} style={styles.tagChipReadonly}>
                      <Ionicons name={meta.icon} size={14} color={Colors.text} />
                      <Text style={styles.tagChipReadonlyText}>{meta.label}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {hasDescription ? (
              <View style={[styles.section, styles.descriptionSection]}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{photo.description}</Text>
              </View>
            ) : null}

            {hasExtras ? (
              <View style={[styles.section, styles.descriptionSection]}>
                <Text style={styles.sectionTitle}>This adventure</Text>
                <DetailRow label="Stayed" value={photo.stayed} />
                <DetailRow label="At" value={photo.at} />
                <DetailRow label="Listened to" value={photo.listenedTo} />
                <DetailRow label="Wore" value={photo.wore} />
              </View>
            ) : null}
          </>
        )}

        {isOwn && !editing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Album</Text>
            <Text style={styles.helper}>Move this photo to another album</Text>

            <Pressable style={styles.dropdown} onPress={() => setDropdownOpen(true)}>
              <View style={styles.dropdownLeft}>
                <Ionicons name="folder" size={16} color={Colors.text} />
                <Text style={styles.dropdownText}>{selectedFolderTitle}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
            </Pressable>

            {creatingNew ? (
              <View style={styles.newAlbumBox}>
                <Text style={styles.label}>New album name</Text>
                <TextInput
                  style={styles.input}
                  value={newAlbumName}
                  onChangeText={setNewAlbumName}
                  placeholder="e.g. Patagonia 2026"
                  placeholderTextColor="#8A837A"
                  autoFocus
                />
                <View style={styles.newAlbumActions}>
                  <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => {
                      setCreatingNew(false);
                      setNewAlbumName('');
                      setSelectedFolderId(folderId ?? '');
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.actionBtnCompact} onPress={onCreateAlbum}>
                    <Text style={styles.actionBtnText}>Create</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.actionBtn,
                selectedFolderId === folderId && styles.actionBtnDisabled,
              ]}
              onPress={onSaveAlbum}
              disabled={selectedFolderId === folderId || creatingNew}
            >
              <Text style={styles.actionBtnText}>Update album</Text>
            </Pressable>

            <Pressable
              style={[
                styles.coverBtn,
                data.folder.coverUrl === photo.imageUrl && styles.actionBtnDisabled,
              ]}
              onPress={onMakeCover}
              disabled={data.folder.coverUrl === photo.imageUrl}
            >
              <Ionicons
                name="image-outline"
                size={18}
                color={data.folder.coverUrl === photo.imageUrl ? Colors.textSecondary : Colors.cream}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  data.folder.coverUrl === photo.imageUrl && styles.coverBtnTextDisabled,
                ]}
              >
                {data.folder.coverUrl === photo.imageUrl
                  ? 'Album cover photo'
                  : 'Make album cover photo'}
              </Text>
            </Pressable>

            <Pressable style={styles.deleteBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="#B42318" />
              <Text style={styles.deleteText}>Delete photo</Text>
            </Pressable>
          </View>
        ) : null}

        {!isOwn ? (
          <View style={styles.otherPostActions}>
            <Pressable style={styles.wishlistBtn} onPress={() => setWishlistOpen(true)}>
              <Ionicons
                name={inWishlist ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={Colors.cream}
              />
              <Text style={styles.wishlistBtnText}>
                {inWishlist ? 'Saved to trip wishlist' : 'Save to trip wishlist'}
              </Text>
            </Pressable>
            <Pressable
              style={styles.reportPostBtn}
              onPress={() => {
                setReportReason(null);
                setReportOpen(true);
              }}
              accessibilityLabel="Report post"
            >
              <Text style={styles.reportPostBtnText}>Report post</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <SaveToWishlistModal
        visible={wishlistOpen}
        photo={photo}
        sourceUsername={profile.username}
        sourceFolderId={folderId}
        onClose={() => setWishlistOpen(false)}
      />

      <Modal
        visible={reportOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setReportOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setReportOpen(false)}>
          <Pressable style={styles.reportModalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.reportModalTitle}>Report post</Text>
            <Text style={styles.reportModalBody}>
              Why are you reporting this post from @{profile.username}?
            </Text>

            <View style={styles.reportOptionList}>
              {POST_REPORT_OPTIONS.map((option) => {
                const selected = reportReason === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={styles.reportOptionRow}
                    onPress={() => setReportReason(option.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.reportOptionLabel}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.reportModalActions}>
              <Pressable
                style={styles.reportCancelBtn}
                onPress={() => setReportOpen(false)}
              >
                <Text style={styles.reportCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.reportSubmitBtn,
                  !reportReason && styles.reportSubmitBtnDisabled,
                ]}
                disabled={!reportReason}
                onPress={() => {
                  if (!reportReason) return;
                  setReportOpen(false);
                  submitPostReport(reportReason);
                  setReportReason(null);
                }}
              >
                <Text style={styles.reportSubmitText}>Report</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDropdownOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose album</Text>
            <ScrollView style={styles.modalList} bounces={false}>
              {myFolders.map((folder) => {
                const active = selectedFolderId === folder.id;
                return (
                  <Pressable
                    key={folder.id}
                    style={[styles.modalRow, active && styles.modalRowActive]}
                    onPress={() => onSelectFolder(folder.id)}
                  >
                    <Ionicons
                      name="folder"
                      size={16}
                      color={active ? Colors.cream : Colors.text}
                    />
                    <Text style={[styles.modalRowText, active && styles.modalRowTextActive]}>
                      {folder.title}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color={Colors.cream} />
                    ) : null}
                  </Pressable>
                );
              })}
              <Pressable style={styles.modalRow} onPress={onChooseNew}>
                <Ionicons name="add-circle-outline" size={18} color={Colors.text} />
                <Text style={styles.modalRowText}>New</Text>
              </Pressable>
            </ScrollView>
          </View>
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 28,
    padding: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#000000',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  locationText: {
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '90%',
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
    paddingRight: 4,
  },
  folderChipAlbum: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  folderChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.card,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 244, 238, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  tagChipActive: {
    backgroundColor: Colors.accentBlue,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  tagChipReadonly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.accentBlue,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  tagChipTextActive: {
    color: Colors.text,
  },
  tagChipReadonlyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    backgroundColor: 'rgba(247, 244, 238, 0.9)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  descriptionSection: {
    backgroundColor: Colors.accentBlueFaded,
    borderWidth: 1,
    borderColor: Colors.accentBlueFadedBorder,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  helper: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rowValue: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8B59A',
    backgroundColor: '#F7F4EE',
    paddingHorizontal: 14,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  newAlbumBox: {
    gap: 8,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  inputMultiline: {
    minHeight: 96,
    paddingTop: 12,
    paddingBottom: 12,
  },
  descriptionInput: {
    backgroundColor: Colors.accentBlueFaded,
    borderColor: Colors.accentBlueFadedBorder,
  },
  adventureSection: {
    marginTop: 4,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.accentBlueFaded,
    borderWidth: 1,
    borderColor: Colors.accentBlueFadedBorder,
    gap: 2,
  },
  adventureSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  adventureInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: Colors.accentBlueFadedBorder,
  },
  headerActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8B59A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
  },
  newAlbumActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEBE3',
  },
  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '600',
  },
  actionBtnCompact: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coverBtnTextDisabled: {
    color: Colors.textSecondary,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionBtnText: {
    color: Colors.cream,
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(180, 35, 24, 0.35)',
    backgroundColor: 'rgba(180, 35, 24, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    color: '#B42318',
    fontWeight: '700',
    fontSize: 15,
  },
  wishlistBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wishlistBtnText: {
    color: Colors.cream,
    fontWeight: '700',
    fontSize: 15,
  },
  otherPostActions: {
    gap: 8,
  },
  reportPostBtn: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportPostBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reportModalCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  reportModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  reportModalBody: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  reportOptionList: {
    gap: 4,
    marginTop: 4,
  },
  reportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.accentBlue,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accentBlue,
  },
  reportOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  reportModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  reportCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reportSubmitBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportSubmitBtnDisabled: {
    opacity: 0.4,
  },
  reportSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.cream,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: '#F7F4EE',
    borderRadius: 16,
    padding: 14,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  modalList: {
    maxHeight: 320,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalRowActive: {
    backgroundColor: Colors.card,
  },
  modalRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  modalRowTextActive: {
    color: Colors.cream,
  },
});
