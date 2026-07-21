import type { AdventureCategory } from '@/constants/adventureFeed';

export type FolderPhoto = {
  id: string;
  imageUrl: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  stayed?: string;
  at?: string;
  listenedTo?: string;
  wore?: string;
  tags?: AdventureCategory[];
};

export type AdventureFolder = {
  id: string;
  title: string;
  coverUrl: string;
  photos: FolderPhoto[];
};

export type PublicProfile = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  socialLinks?: ProfileSocialLink[];
  folders: AdventureFolder[];
};

export type SocialPlatformId =
  | 'tiktok'
  | 'instagram'
  | 'etsy'
  | 'alltrails'
  | 'strava';

export type ProfileSocialLink = {
  platform: SocialPlatformId;
  handle: string;
};

export const SOCIAL_PLATFORMS: {
  id: SocialPlatformId;
  label: string;
  placeholder: string;
}[] = [
  { id: 'tiktok', label: 'TikTok', placeholder: '@username' },
  { id: 'instagram', label: 'Instagram', placeholder: '@username' },
  { id: 'etsy', label: 'Etsy', placeholder: 'shop name or URL' },
  { id: 'alltrails', label: 'AllTrails', placeholder: 'username' },
  { id: 'strava', label: 'Strava', placeholder: 'athlete name or URL' },
];

export function socialPlatformLabel(id: SocialPlatformId): string {
  return SOCIAL_PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80`;

export const PROFILES: Record<string, PublicProfile> = {
  ashtay427: {
    username: 'ashtay427',
    displayName: 'Ashley',
    avatarUrl: 'https://i.pravatar.cc/150?u=ashtay427',
    bio: 'Collecting adventures · trails & wildlife',
    folders: [
      {
        id: 'botswana',
        title: 'Botswana',
        coverUrl: img('photo-1552410260-0fd5da933302'),
        photos: [
          {
            id: 'b1',
            imageUrl: img('photo-1552410260-0fd5da933302'),
            location: 'Okavango Delta, Botswana',
            description: 'Sunrise over the channels — hippos calling somewhere out of frame.',
            stayed: 'Camp Okavango',
            at: 'First light on the mokoro',
            listenedTo: 'Birdsong + quiet water',
            wore: 'Linen shirt, binoculars always',
          },
          {
            id: 'b2',
            imageUrl: img('photo-1516426122078-c23e76319801'),
            location: 'Chobe, Botswana',
            description: 'Elephants crossing at golden hour.',
            stayed: 'Chobe Game Lodge',
            at: 'Riverbank overlook',
            listenedTo: 'Distant thunder',
            wore: 'Dusty boots',
          },
          { id: 'b3', imageUrl: img('photo-1549366021-9f761d450615'), location: 'Moremi, Botswana' },
          {
            id: 'b4',
            imageUrl: img('photo-1614028674026-a65e31bfd27c'),
            location: 'Savuti, Botswana',
            stayed: 'Savuti Camp',
            at: 'Waterhole at dusk',
          },
        ],
      },
      {
        id: 'kenya',
        title: 'Kenya',
        coverUrl: img('photo-1682687220742-aba63b1d408a'),
        photos: [
          {
            id: 'k1',
            imageUrl: img('photo-1682687220742-aba63b1d408a'),
            location: 'Amboseli, Kenya',
            description: 'Kilimanjaro peeked out for about twenty minutes. Worth the wait.',
            stayed: 'Tortilis Camp',
            at: 'Observation hill',
            listenedTo: 'Playlist: slow morning jazz',
            wore: 'Olive field jacket',
          },
          { id: 'k2', imageUrl: img('photo-1549366021-9f761d450615'), location: 'Maasai Mara, Kenya' },
          { id: 'k3', imageUrl: img('photo-1516426122078-c23e76319801'), location: 'Tsavo, Kenya' },
        ],
      },
      {
        id: 'weekend-hikes',
        title: 'Weekend hikes',
        coverUrl: img('photo-1464822759023-fed622ff2c3b'),
        photos: [
          {
            id: 'h1',
            imageUrl: img('photo-1464822759023-fed622ff2c3b'),
            location: 'Local trails',
            description: 'Quick Saturday loop before coffee.',
            stayed: 'Home base',
            at: 'Trailhead lot',
            listenedTo: 'Nothing — wind only',
            wore: 'Trail runners',
          },
          { id: 'h2', imageUrl: img('photo-1501785888041-af3ef285b470'), location: 'Ridge path' },
          {
            id: 'h3',
            imageUrl: img('photo-1470071459604-3b5ec3a7fe05'),
            location: 'Foggy summit',
            stayed: 'Back by noon',
            listenedTo: 'Podcast on the descent',
          },
          { id: 'h4', imageUrl: img('photo-1441974231531-c6227db76b6e'), location: 'Forest loop' },
          { id: 'h5', imageUrl: img('photo-1472214103451-9374bd1c798e'), location: 'Lake overlook' },
        ],
      },
    ],
  },
  Safari_Captures: {
    username: 'Safari_Captures',
    displayName: 'Safari Captures',
    avatarUrl: 'https://i.pravatar.cc/150?u=safari',
    bio: 'Golden hour on the savanna',
    folders: [
      {
        id: 'serengeti-2024',
        title: 'Serengeti 2024',
        coverUrl: img('photo-1516426122078-c23e76319801'),
        photos: [
          {
            id: 's1',
            imageUrl: img('photo-1516426122078-c23e76319801'),
            location: 'Serengeti, Tanzania, Africa',
            description: 'Migration season — dust, light, and patience.',
            stayed: 'Serengeti Pioneer Camp',
            at: 'Central Serengeti plains',
            listenedTo: 'Guide radio chatter',
            wore: 'Khaki everything',
          },
          { id: 's2', imageUrl: img('photo-1549366021-9f761d450615'), location: 'Serengeti, Tanzania' },
          {
            id: 's3',
            imageUrl: img('photo-1614028674026-a65e31bfd27c'),
            location: 'Serengeti, Tanzania',
            stayed: 'Mobile tented camp',
            at: 'Kopje overlook',
            listenedTo: 'Crickets after dark',
            wore: 'Beanie + camera strap',
          },
          { id: 's4', imageUrl: img('photo-1552410260-0fd5da933302'), location: 'Serengeti, Tanzania' },
          { id: 's5', imageUrl: img('photo-1682687220742-aba63b1d408a'), location: 'Serengeti, Tanzania' },
          { id: 's6', imageUrl: img('photo-1501785888041-af3ef285b470'), location: 'Serengeti, Tanzania' },
        ],
      },
      {
        id: 'big-cats',
        title: 'Big cats',
        coverUrl: img('photo-1549366021-9f761d450615'),
        photos: [
          {
            id: 'c1',
            imageUrl: img('photo-1549366021-9f761d450615'),
            location: 'Maasai Mara, Kenya',
            description: 'She stared right through the lens.',
            stayed: 'Mara Serena',
            at: 'Marsh pride territory',
            listenedTo: 'Silence',
            wore: 'Soft-shutter nerves',
          },
          { id: 'c2', imageUrl: img('photo-1614028674026-a65e31bfd27c'), location: 'Kruger, South Africa' },
          { id: 'c3', imageUrl: img('photo-1552410260-0fd5da933302'), location: 'Okavango, Botswana' },
        ],
      },
    ],
  },
  'wild.lens': {
    username: 'wild.lens',
    displayName: 'Wild Lens',
    avatarUrl: 'https://i.pravatar.cc/150?u=wild',
    bio: 'Wildlife through glass',
    folders: [
      {
        id: 'mara',
        title: 'Maasai Mara',
        coverUrl: img('photo-1549366021-9f761d450615'),
        photos: [
          {
            id: 'm1',
            imageUrl: img('photo-1549366021-9f761d450615'),
            location: 'Maasai Mara, Kenya',
            description: 'Long lens day. Worth every ounce.',
            stayed: 'Little Governors',
            at: 'Balloon-side plains',
            listenedTo: 'Shutter bursts',
            wore: 'Harness + knee pads',
          },
          { id: 'm2', imageUrl: img('photo-1516426122078-c23e76319801'), location: 'Maasai Mara, Kenya' },
          { id: 'm3', imageUrl: img('photo-1682687220742-aba63b1d408a'), location: 'Maasai Mara, Kenya' },
          { id: 'm4', imageUrl: img('photo-1614028674026-a65e31bfd27c'), location: 'Maasai Mara, Kenya' },
        ],
      },
    ],
  },
  'city.frames': {
    username: 'city.frames',
    displayName: 'City Frames',
    avatarUrl: 'https://i.pravatar.cc/150?u=city',
    bio: 'Concrete, neon, and early trains',
    folders: [
      {
        id: 'tokyo',
        title: 'Tokyo',
        coverUrl: img('photo-1480714378408-67cf0d13bc1b'),
        photos: [
          {
            id: 't1',
            imageUrl: img('photo-1480714378408-67cf0d13bc1b'),
            location: 'Tokyo, Japan',
            description: 'Skyline wash after rain.',
            stayed: 'Shibuya hotel',
            at: 'Crossing overlook',
            listenedTo: 'Station announcements',
            wore: 'Light jacket, camera always on',
          },
          { id: 't2', imageUrl: img('photo-1502602898657-3e91760cbb34'), location: 'Tokyo, Japan' },
          { id: 't3', imageUrl: img('photo-1514565131-fce0801e5785'), location: 'Tokyo, Japan' },
        ],
      },
    ],
  },
  'grid.walk': {
    username: 'grid.walk',
    displayName: 'Grid Walk',
    avatarUrl: 'https://i.pravatar.cc/150?u=nyc',
    bio: 'Street grids & late light',
    folders: [
      {
        id: 'nyc',
        title: 'New York',
        coverUrl: img('photo-1449824913935-59a10b8d2000'),
        photos: [
          {
            id: 'n1',
            imageUrl: img('photo-1449824913935-59a10b8d2000'),
            location: 'New York, USA',
            description: 'Blue hour from the bridge approach.',
            stayed: "Friend's couch, Brooklyn",
            at: 'Manhattan skyline',
            listenedTo: 'Subway rumble',
            wore: 'Denim + scarf',
          },
          { id: 'n2', imageUrl: img('photo-1514565131-fce0801e5785'), location: 'New York, USA' },
          { id: 'n3', imageUrl: img('photo-1502602898657-3e91760cbb34'), location: 'New York, USA' },
        ],
      },
    ],
  },
  'trail.notes': {
    username: 'trail.notes',
    displayName: 'Trail Notes',
    avatarUrl: 'https://i.pravatar.cc/150?u=trail',
    bio: 'Field notes from the bush',
    folders: [
      {
        id: 'kruger',
        title: 'Kruger',
        coverUrl: img('photo-1614028674026-a65e31bfd27c'),
        photos: [
          {
            id: 'kr1',
            imageUrl: img('photo-1614028674026-a65e31bfd27c'),
            location: 'Kruger National Park, South Africa',
            stayed: 'Satara Rest Camp',
            at: 'S100 loop',
            listenedTo: 'Hyenas after dinner',
            wore: 'Park-issued map scars',
          },
          { id: 'kr2', imageUrl: img('photo-1552410260-0fd5da933302'), location: 'Kruger, South Africa' },
          { id: 'kr3', imageUrl: img('photo-1516426122078-c23e76319801'), location: 'Kruger, South Africa' },
        ],
      },
    ],
  },
  'campfire.club': {
    username: 'campfire.club',
    displayName: 'Campfire Club',
    avatarUrl: 'https://i.pravatar.cc/150?u=camp',
    bio: 'Stories after sundown',
    folders: [
      {
        id: 'amboseli',
        title: 'Amboseli',
        coverUrl: img('photo-1682687220742-aba63b1d408a'),
        photos: [
          {
            id: 'a1',
            imageUrl: img('photo-1682687220742-aba63b1d408a'),
            location: 'Amboseli, Kenya',
            description: 'Campfire stories under a ridiculous sky.',
            stayed: 'Ol Tukai Lodge',
            at: 'Campfire circle',
            listenedTo: 'Acoustic guitar + frogs',
            wore: 'Flannel over sunburn',
          },
          { id: 'a2', imageUrl: img('photo-1501785888041-af3ef285b470'), location: 'Amboseli, Kenya' },
          { id: 'a3', imageUrl: img('photo-1470071459604-3b5ec3a7fe05'), location: 'Amboseli, Kenya' },
        ],
      },
    ],
  },
};

export function getProfile(username: string): PublicProfile | null {
  const key = Object.keys(PROFILES).find(
    (k) => k.toLowerCase() === username.toLowerCase(),
  );
  return key ? PROFILES[key] : null;
}

export function getFolder(
  username: string,
  folderId: string,
): { profile: PublicProfile; folder: AdventureFolder } | null {
  const profile = getProfile(username);
  if (!profile) return null;
  const folder = profile.folders.find((f) => f.id === folderId);
  if (!folder) return null;
  return { profile, folder };
}

export function getPhoto(
  username: string,
  folderId: string,
  photoId: string,
): { profile: PublicProfile; folder: AdventureFolder; photo: FolderPhoto } | null {
  const data = getFolder(username, folderId);
  if (!data) return null;
  const photo = data.folder.photos.find((p) => p.id === photoId);
  if (!photo) return null;
  return { ...data, photo };
}
