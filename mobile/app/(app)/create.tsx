import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AdventureCategory } from '@/constants/adventureFeed';
import { ADVENTURE_CATEGORIES } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import { locationLabelFromExif, coordsFromExif } from '@/utils/photoLocation';
import { coordsFromPlaceLabel } from '@/utils/geo';

const CATEGORIES = ADVENTURE_CATEGORIES;

export default function CreateScreen() {
  const { addPost, user, myFolders } = useFeed();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [tags, setTags] = useState<AdventureCategory[]>([]);
  const [folderId, setFolderId] = useState<string | null>(myFolders[0]?.id ?? null);
  const [description, setDescription] = useState('');
  const [stayed, setStayed] = useState('');
  const [at, setAt] = useState('');
  const [listenedTo, setListenedTo] = useState('');
  const [wore, setWore] = useState('');

  const resetDraft = () => {
    setImageUri(null);
    setLocation('');
    setCoords(null);
    setTags([]);
    setFolderId(myFolders[0]?.id ?? null);
    setDescription('');
    setStayed('');
    setAt('');
    setListenedTo('');
    setWore('');
  };

  const toggleTag = (id: AdventureCategory) => {
    setTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to upload an adventure.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      exif: true,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setBusy(true);
    try {
      const fromExif = await locationLabelFromExif(asset.exif ?? null);
      const fromGps = coordsFromExif(asset.exif ?? null);
      setImageUri(asset.uri);
      setLocation(fromExif === 'Location unavailable' ? '' : fromExif);
      setCoords(fromGps);
    } catch (e) {
      Alert.alert(
        'Could not read photo',
        e instanceof Error ? e.message : 'Something went wrong reading the photo.',
      );
    } finally {
      setBusy(false);
    }
  };

  const publish = () => {
    if (!imageUri) return;
    if (tags.length === 0) {
      Alert.alert('Tags required', 'Choose at least one tag for this adventure.');
      return;
    }
    if (!folderId) {
      Alert.alert('Album required', 'Choose which album this photo belongs in.');
      return;
    }
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      Alert.alert('Location required', 'Add or edit a location for this adventure.');
      return;
    }

    const resolved = coords ?? coordsFromPlaceLabel(trimmedLocation);

    addPost({
      imageUrl: imageUri,
      location: trimmedLocation,
      tags,
      folderId,
      latitude: resolved?.latitude,
      longitude: resolved?.longitude,
      description,
      stayed,
      at,
      listenedTo,
      wore,
    });
    resetDraft();
    router.replace('/(app)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!imageUri ? (
            <>
              <Ionicons name="camera-outline" size={56} color={Colors.text} />
              <Text style={styles.title}>New adventure</Text>
              <Text style={styles.body}>
                Posting as @{user.username}. Pick a photo, then choose Nature or City and fill
                in the details.
              </Text>

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={pickPhoto}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color={Colors.cream} />
                ) : (
                  <Text style={styles.buttonText}>Choose photo</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Edit & post</Text>
              <View style={styles.previewCard}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <View style={styles.previewFooter}>
                  <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
                  <Text style={styles.previewLocation} numberOfLines={1}>
                    {location.trim() || 'Add a location'}
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Tags</Text>
              <Text style={styles.helper}>Select one or more</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((item) => {
                  const active = tags.includes(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleTag(item.id)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={16}
                        color={active ? Colors.cream : Colors.text}
                      />
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Album</Text>
              <View style={styles.categoryRow}>
                {myFolders.map((folder) => {
                  const active = folderId === folder.id;
                  return (
                    <Pressable
                      key={folder.id}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setFolderId(folder.id)}
                    >
                      <Ionicons
                        name="folder"
                        size={14}
                        color={active ? Colors.cream : Colors.text}
                      />
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {folder.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Serengeti, Tanzania, Africa"
                placeholderTextColor="#8A837A"
                autoCapitalize="words"
              />

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="What made this moment?"
                placeholderTextColor="#8A837A"
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.sectionTitle}>This adventure (optional)</Text>

              <Text style={styles.label}>Stayed</Text>
              <TextInput
                style={styles.input}
                value={stayed}
                onChangeText={setStayed}
                placeholder="Where did you stay?"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>At</Text>
              <TextInput
                style={styles.input}
                value={at}
                onChangeText={setAt}
                placeholder="Where were you in the moment?"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>Listened to</Text>
              <TextInput
                style={styles.input}
                value={listenedTo}
                onChangeText={setListenedTo}
                placeholder="Music, sounds, silence…"
                placeholderTextColor="#8A837A"
              />

              <Text style={styles.label}>Wore</Text>
              <TextInput
                style={styles.input}
                value={wore}
                onChangeText={setWore}
                placeholder="What were you wearing?"
                placeholderTextColor="#8A837A"
              />

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={publish}
              >
                <Text style={styles.buttonText}>Post adventure</Text>
              </Pressable>

              <Pressable style={styles.secondary} onPress={pickPhoto} disabled={busy}>
                <Text style={styles.secondaryText}>Choose different photo</Text>
              </Pressable>
              <Pressable style={styles.secondary} onPress={resetDraft}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 28,
    paddingVertical: 24,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 28,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#000000',
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    paddingBottom: 4,
  },
  previewLocation: {
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '90%',
  },
  categoryRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 244, 238, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  chipActive: {
    backgroundColor: Colors.card,
    borderColor: Colors.card,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.cream,
  },
  sectionTitle: {
    alignSelf: 'stretch',
    marginTop: 12,
    marginBottom: 2,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    alignSelf: 'stretch',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 6,
  },
  helper: {
    alignSelf: 'stretch',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -2,
    marginBottom: 2,
  },
  input: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8B59A',
    backgroundColor: '#F7F4EE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  multiline: {
    minHeight: 96,
  },
  button: {
    marginTop: 14,
    alignSelf: 'stretch',
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: Colors.cream,
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: 6,
  },
  secondaryText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
