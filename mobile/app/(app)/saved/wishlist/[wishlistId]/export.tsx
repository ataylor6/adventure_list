import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

import { MissingState } from '@/components/MissingState';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import {
  buildItineraryDraft,
  exportItineraryDraft,
  type ItineraryStop,
} from '@/utils/exportWishlistItinerary';

type StopField = keyof Omit<ItineraryStop, 'id'>;

const STOP_FIELDS: { key: StopField; label: string; multiline?: boolean; placeholder: string }[] = [
  { key: 'location', label: 'Location', placeholder: 'Where is this stop?' },
  {
    key: 'description',
    label: 'Description',
    multiline: true,
    placeholder: 'Notes for this stop…',
  },
  { key: 'stayed', label: 'Stayed', placeholder: 'Where did they stay?' },
  { key: 'at', label: 'At', placeholder: 'Where were they in the moment?' },
  { key: 'listenedTo', label: 'Listened to', placeholder: 'Music, sounds…' },
  { key: 'wore', label: 'Wore', placeholder: 'What to pack / wear' },
];

export default function WishlistItineraryExportScreen() {
  const router = useRouter();
  const { wishlistId } = useLocalSearchParams<{ wishlistId: string }>();
  const { resolveWishlistAlbum } = useFeed();
  const album = resolveWishlistAlbum(wishlistId ?? '');

  const initialDraft = useMemo(
    () => (album ? buildItineraryDraft(album) : null),
    // Seed once from the album; edits stay local until export.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [album?.id],
  );

  const [title, setTitle] = useState(initialDraft?.title ?? '');
  const [stops, setStops] = useState<ItineraryStop[]>(initialDraft?.stops ?? []);
  const [exporting, setExporting] = useState(false);

  if (!album || !initialDraft) {
    return <MissingState title="Wishlist not found" message="This trip wishlist is unavailable." />;
  }

  const updateStop = (stopId: string, field: StopField, value: string) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === stopId ? { ...stop, [field]: value } : stop)),
    );
  };

  const onExport = async () => {
    setExporting(true);
    try {
      await exportItineraryDraft({ title, stops });
    } catch {
      Alert.alert('Export failed', 'Could not create the itinerary file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.sideBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>Itinerary</Text>
          <Text style={styles.topSub}>Edit, then export</Text>
        </View>
        <View style={styles.sideBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.helper}>
            Review each stop below. Changes here only affect the exported Word doc — your wishlist
            stays as-is.
          </Text>

          <Text style={styles.label}>Trip title</Text>
          <TextInput
            style={[styles.input, styles.titleInput]}
            value={title}
            onChangeText={setTitle}
            placeholder="Trip title"
            placeholderTextColor={Colors.textSecondary}
          />

          {stops.length === 0 ? (
            <Text style={styles.empty}>This wishlist has no saves yet.</Text>
          ) : (
            stops.map((stop, index) => (
              <View key={stop.id} style={styles.stopCard}>
                <Text style={styles.stopHeading}>Stop {index + 1}</Text>
                {STOP_FIELDS.map((field) => (
                  <View key={field.key} style={styles.fieldBlock}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      style={[styles.input, field.multiline && styles.multiline]}
                      value={stop[field.key]}
                      onChangeText={(value) => updateStop(stop.id, field.key, value)}
                      placeholder={field.placeholder}
                      placeholderTextColor={Colors.textSecondary}
                      multiline={field.multiline}
                      textAlignVertical={field.multiline ? 'top' : 'center'}
                    />
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.exportBtn, exporting && styles.exportBtnDisabled]}
            onPress={onExport}
            disabled={exporting || stops.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Export Word document"
          >
            {exporting ? (
              <ActivityIndicator color={Colors.cream} />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={18} color={Colors.cream} />
                <Text style={styles.exportBtnText}>Export .docx</Text>
              </>
            )}
          </Pressable>
        </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sideBtn: {
    width: 40,
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  topSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  helper: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentBlueFadedBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  titleInput: {
    backgroundColor: Colors.accentBlueFaded,
  },
  multiline: {
    minHeight: 96,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 32,
    lineHeight: 20,
  },
  stopCard: {
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.accentBlueFaded,
    borderWidth: 1,
    borderColor: Colors.accentBlueFadedBorder,
    gap: 10,
  },
  stopHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  exportBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    color: Colors.cream,
    fontSize: 16,
    fontWeight: '700',
  },
});
