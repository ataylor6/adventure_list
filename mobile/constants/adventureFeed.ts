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
    username: 'Safari_Captures',
    avatarUrl: 'https://i.pravatar.cc/150?u=safari',
    tags: ['nature'],
  },
  {
    id: 't1',
    folderId: 'tokyo',
    imageUrl: img('photo-1480714378408-67cf0d13bc1b'),
    location: 'Tokyo, Japan',
    username: 'city.frames',
    avatarUrl: 'https://i.pravatar.cc/150?u=city',
    tags: ['city'],
  },
  {
    id: 'm1',
    folderId: 'mara',
    imageUrl: img('photo-1549366021-9f761d450615'),
    location: 'Maasai Mara, Kenya',
    username: 'wild.lens',
    avatarUrl: 'https://i.pravatar.cc/150?u=wild',
    tags: ['nature'],
  },
  {
    id: 'n1',
    folderId: 'nyc',
    imageUrl: img('photo-1449824913935-59a10b8d2000'),
    location: 'New York, USA',
    username: 'grid.walk',
    avatarUrl: 'https://i.pravatar.cc/150?u=nyc',
    tags: ['city'],
  },
  {
    id: 'kr1',
    folderId: 'kruger',
    imageUrl: img('photo-1614028674026-a65e31bfd27c'),
    location: 'Kruger National Park, South Africa',
    username: 'trail.notes',
    avatarUrl: 'https://i.pravatar.cc/150?u=trail',
    tags: ['nature'],
  },
  {
    id: 'k1',
    folderId: 'kenya',
    imageUrl: img('photo-1682687220742-aba63b1d408a'),
    location: 'Amboseli, Kenya',
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    tags: ['nature'],
  },
  {
    id: 'b1',
    folderId: 'botswana',
    imageUrl: img('photo-1552410260-0fd5da933302'),
    location: 'Okavango Delta, Botswana',
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    tags: ['nature'],
  },
  {
    id: 'a1',
    folderId: 'amboseli',
    imageUrl: img('photo-1682687220742-aba63b1d408a'),
    location: 'Amboseli, Kenya',
    username: 'campfire.club',
    avatarUrl: 'https://i.pravatar.cc/150?u=camp',
    tags: ['city'],
  },
];
