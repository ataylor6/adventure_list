export type AdventureCategory = 'nature' | 'city';

export type AdventurePost = {
  id: string;
  imageUrl: string;
  location: string;
  username: string;
  avatarUrl?: string;
  category: AdventureCategory;
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

/**
 * Sample posts so you can test scrolling + filters in full mode.
 * Your uploads are prepended on top of these.
 */
export const SAMPLE_FEED: AdventurePost[] = [
  {
    id: 'sample-1',
    imageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80',
    location: 'Serengeti, Tanzania, Africa',
    username: 'Safari_Captures',
    avatarUrl: 'https://i.pravatar.cc/150?u=safari',
    category: 'nature',
  },
  {
    id: 'sample-2',
    imageUrl:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&q=80',
    location: 'Tokyo, Japan',
    username: 'city.frames',
    avatarUrl: 'https://i.pravatar.cc/150?u=city',
    category: 'city',
  },
  {
    id: 'sample-3',
    imageUrl:
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=900&q=80',
    location: 'Maasai Mara, Kenya',
    username: 'wild.lens',
    avatarUrl: 'https://i.pravatar.cc/150?u=wild',
    category: 'nature',
  },
  {
    id: 'sample-4',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80',
    location: 'New York, USA',
    username: 'grid.walk',
    avatarUrl: 'https://i.pravatar.cc/150?u=nyc',
    category: 'city',
  },
  {
    id: 'sample-5',
    imageUrl:
      'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=900&q=80',
    location: 'Kruger National Park, South Africa',
    username: 'trail.notes',
    avatarUrl: 'https://i.pravatar.cc/150?u=trail',
    category: 'nature',
  },
  {
    id: 'sample-6',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
    location: 'Paris, France',
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    category: 'city',
  },
  {
    id: 'sample-7',
    imageUrl:
      'https://images.unsplash.com/photo-1552410260-0fd5da933302?w=900&q=80',
    location: 'Okavango Delta, Botswana',
    username: 'ashtay427',
    avatarUrl: CURRENT_USER.avatarUrl,
    category: 'nature',
  },
  {
    id: 'sample-8',
    imageUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=80',
    location: 'San Francisco, USA',
    username: 'campfire.club',
    avatarUrl: 'https://i.pravatar.cc/150?u=camp',
    category: 'city',
  },
];
