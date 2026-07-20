import type { Ionicons } from '@expo/vector-icons';

export type AdventureCategory =
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

export const ADVENTURE_CATEGORIES: {
  id: AdventureCategory;
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

export type AdventurePost = {
  id: string;
  imageUrl: string;
  location: string;
  username: string;
  /** Album this post belongs to — required to open photo detail from the feed. */
  folderId: string;
  avatarUrl?: string;
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
    tags: ['city'],
  },
];
