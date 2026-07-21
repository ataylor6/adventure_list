import { Buffer } from 'buffer';
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import type { WishlistAlbum, WishlistPhoto } from '@/context/FeedContext';

// docx expects Node's Buffer when packing the .docx zip.
if (typeof globalThis.Buffer === 'undefined') {
  (globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;
}

export type ItineraryStop = {
  id: string;
  location: string;
  description: string;
  stayed: string;
  at: string;
  listenedTo: string;
  wore: string;
};

export type ItineraryDraft = {
  title: string;
  stops: ItineraryStop[];
};

function sanitizeFilename(title: string): string {
  const cleaned = title
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return cleaned || 'trip-itinerary';
}

function detailParagraph(label: string, value?: string): Paragraph | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(trimmed),
    ],
  });
}

function stopHasContent(stop: ItineraryStop): boolean {
  return Boolean(
    stop.location.trim() ||
      stop.description.trim() ||
      stop.stayed.trim() ||
      stop.at.trim() ||
      stop.listenedTo.trim() ||
      stop.wore.trim(),
  );
}

function photoToStop(photo: WishlistPhoto): ItineraryStop {
  return {
    id: photo.id,
    location: photo.location?.trim() ?? '',
    description: photo.description?.trim() ?? '',
    stayed: photo.stayed?.trim() ?? '',
    at: photo.at?.trim() ?? '',
    listenedTo: photo.listenedTo?.trim() ?? '',
    wore: photo.wore?.trim() ?? '',
  };
}

/** Seed an editable itinerary draft from a trip wishlist album. */
export function buildItineraryDraft(album: WishlistAlbum): ItineraryDraft {
  return {
    title: album.title,
    stops: album.photos.map(photoToStop),
  };
}

function buildStopSection(stop: ItineraryStop, index: number): Paragraph[] {
  const location = stop.location.trim() || `Stop ${index + 1}`;
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: index === 0 ? 120 : 280, after: 120 },
      children: [new TextRun(location)],
    }),
  ];

  if (stop.description.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun(stop.description.trim())],
      }),
    );
  }

  for (const row of [
    detailParagraph('Stayed', stop.stayed),
    detailParagraph('At', stop.at),
    detailParagraph('Listened to', stop.listenedTo),
    detailParagraph('Wore', stop.wore),
  ]) {
    if (row) children.push(row);
  }

  if (
    !stop.description.trim() &&
    !stop.stayed.trim() &&
    !stop.at.trim() &&
    !stop.listenedTo.trim() &&
    !stop.wore.trim()
  ) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: 'No description saved for this stop.',
            italics: true,
            color: '666666',
          }),
        ],
      }),
    );
  }

  return children;
}

function buildDocument(draft: ItineraryDraft): Document {
  const stops = draft.stops.filter(stopHasContent);
  const title = draft.title.trim() || 'Trip itinerary';
  const body: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 80 },
      children: [new TextRun(title)],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `Trip itinerary · ${stops.length} stop${stops.length === 1 ? '' : 's'}`,
          color: '666666',
        }),
      ],
    }),
  ];

  stops.forEach((stop, index) => {
    body.push(...buildStopSection(stop, index));
  });

  return new Document({
    creator: 'Adventure List',
    title: `${title} itinerary`,
    description: `Itinerary exported from ${title}`,
    sections: [{ children: body }],
  });
}

/** Build a .docx from an edited itinerary draft and open the system share sheet. */
export async function exportItineraryDraft(draft: ItineraryDraft): Promise<void> {
  const stops = draft.stops.filter(stopHasContent);
  if (stops.length === 0) {
    Alert.alert(
      'Nothing to export',
      'Add at least one location or note before exporting this itinerary.',
    );
    return;
  }

  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing unavailable', 'File sharing is not available on this device.');
    return;
  }

  const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!baseDir) {
    Alert.alert('Export failed', 'Could not access a place to save the itinerary file.');
    return;
  }

  const title = draft.title.trim() || 'Trip itinerary';
  const doc = buildDocument(draft);
  const base64 = await Packer.toBase64String(doc);
  const fileUri = `${baseDir}${sanitizeFilename(title)}-itinerary.docx`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    dialogTitle: 'Export itinerary',
    UTI: 'org.openxmlformats.wordprocessingml.document',
  });
}
