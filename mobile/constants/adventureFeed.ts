import type { Ionicons } from '@expo/vector-icons';

export type FeedMode = 'travel' | 'local';

export type TravelCategory =
  | 'nature'
  | 'city'
  | 'car_trips'
  | 'honeymoon'
  | 'wedding'
  | 'engagement'
  | 'camping'
  | 'roadtrip'
  | 'bachelorette'
  | 'bachelor'
  | 'off_roading';

export type LocalCategory =
  | 'coffee_shops'
  | 'girls_night'
  | 'boys_night'
  | 'date_night'
  | 'family_fun';

/** Tags used on posts — travel or local depending on feed mode. */
export type AdventureCategory = TravelCategory | LocalCategory;

export const TRAVEL_CATEGORIES: {
  id: TravelCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
  { id: 'city', label: 'City', icon: 'business-outline' },
  { id: 'car_trips', label: 'Car trips', icon: 'car-outline' },
  { id: 'roadtrip', label: 'Roadtrip', icon: 'map-outline' },
  { id: 'camping', label: 'Camping', icon: 'bonfire-outline' },
  { id: 'off_roading', label: 'Off roading', icon: 'trail-sign-outline' },
  { id: 'honeymoon', label: 'Honeymoon', icon: 'heart-outline' },
  { id: 'wedding', label: 'Wedding', icon: 'rose-outline' },
  { id: 'engagement', label: 'Engagement', icon: 'diamond-outline' },
  { id: 'bachelorette', label: 'Bachelorette', icon: 'wine-outline' },
  { id: 'bachelor', label: 'Bachelor', icon: 'beer-outline' },
];

export const LOCAL_CATEGORIES: {
  id: LocalCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'coffee_shops', label: 'Coffee shops', icon: 'cafe-outline' },
  { id: 'girls_night', label: 'Girls night', icon: 'sparkles-outline' },
  { id: 'boys_night', label: 'Boys night', icon: 'game-controller-outline' },
  { id: 'date_night', label: 'Date night', icon: 'heart-outline' },
  { id: 'family_fun', label: 'Family fun', icon: 'people-outline' },
];

/** Prefer TRAVEL_CATEGORIES; kept for existing imports. */
export const ADVENTURE_CATEGORIES = TRAVEL_CATEGORIES;

export function categoriesForMode(mode: FeedMode) {
  return mode === 'local' ? LOCAL_CATEGORIES : TRAVEL_CATEGORIES;
}

export function categoryMeta(id: AdventureCategory) {
  return (
    TRAVEL_CATEGORIES.find((c) => c.id === id) ??
    LOCAL_CATEGORIES.find((c) => c.id === id)
  );
}

export type AdventurePost = {
  id: string;
  imageUrl: string;
  location: string;
  username: string;
  /** Album this post belongs to — required to open photo detail from the feed. */
  folderId: string;
  avatarUrl?: string;
  /** Travel vs local feed this post belongs to. */
  feedMode: FeedMode;
  /** One or more adventure tags (multi-select). */
  tags: AdventureCategory[];
  latitude?: number;
  longitude?: number;
  description?: string;
  stayed?: string;
  at?: string;
  listenedTo?: string;
  wore?: string;
};

export type CurrentUser = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

/** Default logged-in user for local/dev. */
export const CURRENT_USER: CurrentUser = {
  username: 'ashtay427',
  displayName: 'Ashley',
  avatarUrl: 'https://i.pravatar.cc/150?u=ashtay427',
};

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80`;

/** Seed coords so Nearby / 5-mile filter works offline for sample posts. */
const SEED_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Serengeti, Tanzania, Africa': { latitude: -2.3333, longitude: 34.8333 },
  'Tokyo, Japan': { latitude: 35.6762, longitude: 139.6503 },
  'Maasai Mara, Kenya': { latitude: -1.4061, longitude: 35.0117 },
  'New York, USA': { latitude: 40.7128, longitude: -74.006 },
  'Kruger National Park, South Africa': { latitude: -23.9884, longitude: 31.5547 },
  'Amboseli, Kenya': { latitude: -2.6527, longitude: 37.2606 },
  'Okavango Delta, Botswana': { latitude: -19.2833, longitude: 22.7833 },
  'Austin, TX': { latitude: 30.2672, longitude: -97.7431 },
};

/**
 * Sample posts so you can test scrolling + filters in full mode.
 * Your uploads are prepended on top of these.
 * `id` + `folderId` must match entries in profileFolders.
 */
export const SAMPLE_FEED: AdventurePost[] = [
  {
    id: 's1',
    folderId: 'serengeti-2024',
    imageUrl: img('photo-1516426122078-c23e76319801'),
    location: 'Serengeti, Tanzania, Africa',
    ...SEED_COORDS['Serengeti, Tanzania, Africa'],
    username: 'Safari_Captures',
    avatarUrl: 'https://i.pravatar.cc/150?u=safari',
    feedMode: 'travel',
    tags: ['nature'],
  },
  {
    id: 't1',
    folderId: 'tokyo',
    imageUrl: img('photo-1480714378408-67cf0d13bc1b'),
    location: 'Tokyo, Japan',
    ...SEED_COORDS['Tokyo, Japan'],
    username: 'city.frames',
    avatarUrl: 'https://i.pravatar.cc/150?u=city',
    feedMode: 'travel',
    tags: ['city'],
  },
  {
    id: 'm1',
    folderId: 'mara',
    imageUrl: img('photo-1549366021-9f761d450615'),
    location: 'Maasai Mara, Kenya',
    ...SEED_COORDS['Maasai Mara, Kenya'],
    username: 'wild.lens',
    avatarUrl: 'https://i.pravatar.cc/150?u=wild',
    feedMode: 'travel',
    tags: ['nature'],
  },
  {
    id: 'n1',
    folderId: 'nyc',
    imageUrl: img('photo-1449824913935-59a10b8d2000'),
    location: 'New York, USA',
    ...SEED_COORDS['New York, USA'],
    username: 'grid.walk',
    avatarUrl: 'https://i.pravatar.cc/150?u=nyc',
    feedMode: 'travel',
    tags: ['city'],
  },
  {
    id: 'kr1',
    folderId: 'kruger',
    imageUrl: img('photo-1614028674026-a65e31bfd27c'),
    location: 'Kruger National Park, South Africa',
    ...SEED_COORDS['Kruger National Park, South Africa'],
    username: 'trail.notes',
    avatarUrl: 'https://i.pravatar.cc/150?u=trail',
    feedMode: 'travel',
    tags: ['nature'],
  },
  {
    id: 'k1',
    folderId: 'kenya',
    imageUrl: img('photo-1682687220742-aba63b1d408a'),
    location: 'Amboseli, Kenya',
    ...SEED_COORDS['Amboseli, Kenya'],
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    feedMode: 'travel',
    tags: ['nature'],
  },
  {
    id: 'b1',
    folderId: 'botswana',
    imageUrl: img('photo-1552410260-0fd5da933302'),
    location: 'Okavango Delta, Botswana',
    ...SEED_COORDS['Okavango Delta, Botswana'],
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    feedMode: 'travel',
    tags: ['nature'],
  },
  {
    id: 'a1',
    folderId: 'amboseli',
    imageUrl: img('photo-1682687220742-aba63b1d408a'),
    location: 'Amboseli, Kenya',
    ...SEED_COORDS['Amboseli, Kenya'],
    username: 'campfire.club',
    avatarUrl: 'https://i.pravatar.cc/150?u=camp',
    feedMode: 'travel',
    tags: ['city'],
  },
  {
    id: 'lc1',
    folderId: 'austin-local',
    imageUrl: img('photo-1495474472287-4d71bcdd2085'),
    location: 'Austin, TX',
    ...SEED_COORDS['Austin, TX'],
    username: 'latte.logs',
    avatarUrl: 'https://i.pravatar.cc/150?u=latte',
    feedMode: 'local',
    tags: ['coffee_shops'],
  },
  {
    id: 'lc2',
    folderId: 'austin-local',
    imageUrl: img('photo-1514933651103-005eec06c04b'),
    location: 'Austin, TX',
    ...SEED_COORDS['Austin, TX'],
    username: 'night.out',
    avatarUrl: 'https://i.pravatar.cc/150?u=night',
    feedMode: 'local',
    tags: ['girls_night'],
  },
  {
    id: 'lc3',
    folderId: 'austin-local',
    imageUrl: img('photo-1517248135467-4c7edcad34c4'),
    location: 'Austin, TX',
    ...SEED_COORDS['Austin, TX'],
    username: 'table.for.two',
    avatarUrl: 'https://i.pravatar.cc/150?u=date',
    feedMode: 'local',
    tags: ['date_night'],
  },
  {
    id: 'lc4',
    folderId: 'austin-local',
    imageUrl: img('photo-1478146896981-b80fe463b330'),
    location: 'Austin, TX',
    ...SEED_COORDS['Austin, TX'],
    username: 'family.days',
    avatarUrl: 'https://i.pravatar.cc/150?u=family',
    feedMode: 'local',
    tags: ['family_fun'],
  },
  {
    id: 'lc5',
    folderId: 'austin-local',
    imageUrl: img('photo-1575444758702-4a6b9222336e'),
    location: 'Austin, TX',
    ...SEED_COORDS['Austin, TX'],
    username: 'crew.night',
    avatarUrl: 'https://i.pravatar.cc/150?u=boys',
    feedMode: 'local',
    tags: ['boys_night'],
  },
];
