import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  CURRENT_USER,
  SAMPLE_FEED,
  type AdventureCategory,
  type AdventurePost,
  type CurrentUser,
} from '@/constants/adventureFeed';
import {
  PROFILES,
  type AdventureFolder,
  type FolderPhoto,
  type PublicProfile,
  getProfile as getStaticProfile,
} from '@/constants/profileFolders';

type NewPostInput = {
  imageUrl: string;
  location: string;
  tags: AdventureCategory[];
  folderId: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  stayed?: string;
  at?: string;
  listenedTo?: string;
  wore?: string;
};

/** Snapshot of someone else's album saved to Favorites. */
export type FavoriteAlbum = {
  id: string;
  sourceUsername: string;
  sourceFolderId: string;
  title: string;
  coverUrl: string;
  photos: FolderPhoto[];
  savedAt: string;
};

/** Individual post saved into a trip wishlist album. */
export type WishlistPhoto = FolderPhoto & {
  sourceUsername?: string;
  sourceFolderId?: string;
};

export type WishlistAlbum = {
  id: string;
  title: string;
  coverUrl: string;
  photos: WishlistPhoto[];
};

type PhotoUpdateInput = {
  location: string;
  description?: string;
  stayed?: string;
  at?: string;
  listenedTo?: string;
  wore?: string;
  tags?: AdventureCategory[];
};

type ProfileUpdateInput = {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
};

type FeedContextValue = {
  user: CurrentUser;
  posts: AdventurePost[];
  myFolders: AdventureFolder[];
  myProfile: PublicProfile;
  favoriteAlbums: FavoriteAlbum[];
  wishlistAlbums: WishlistAlbum[];
  addPost: (input: NewPostInput) => AdventurePost;
  createFolder: (title: string) => AdventureFolder;
  movePhoto: (photoId: string, fromFolderId: string, toFolderId: string) => boolean;
  deletePhoto: (
    photoId: string,
    folderId: string,
  ) => { success: boolean; albumDeleted: boolean };
  updatePhoto: (photoId: string, folderId: string, updates: PhotoUpdateInput) => boolean;
  setAlbumCover: (folderId: string, photoId: string) => boolean;
  updateProfile: (updates: ProfileUpdateInput) => void;
  travelCompanions: string[];
  toggleTravelWith: (username: string) => boolean;
  isTravelingWith: (username: string) => boolean;
  saveAlbumToFavorites: (username: string, folderId: string) => FavoriteAlbum | null;
  removeFavoriteAlbum: (favoriteId: string) => boolean;
  isAlbumFavorited: (username: string, folderId: string) => boolean;
  createWishlistAlbum: (title: string, initialPhoto?: WishlistPhoto) => WishlistAlbum;
  savePhotoToWishlist: (
    photo: FolderPhoto,
    wishlistId: string,
    source?: { username?: string; folderId?: string },
  ) => boolean;
  removePhotoFromWishlist: (wishlistId: string, photoId: string) => boolean;
  isPhotoInWishlist: (photoId: string, wishlistId?: string) => boolean;
  resolveFavoriteAlbum: (favoriteId: string) => FavoriteAlbum | null;
  resolveWishlistAlbum: (wishlistId: string) => WishlistAlbum | null;
  resolveWishlistPhoto: (
    wishlistId: string,
    photoId: string,
  ) => { album: WishlistAlbum; photo: WishlistPhoto } | null;
  resolveProfile: (username: string) => PublicProfile | null;
  resolveFolder: (
    username: string,
    folderId: string,
  ) => { profile: PublicProfile; folder: AdventureFolder } | null;
  resolvePhoto: (
    username: string,
    folderId: string,
    photoId: string,
  ) => { profile: PublicProfile; folder: AdventureFolder; photo: FolderPhoto } | null;
};

const FeedContext = createContext<FeedContextValue | null>(null);

function cloneMyFolders(): AdventureFolder[] {
  const base = PROFILES.ashtay427?.folders ?? [];
  return JSON.parse(JSON.stringify(base)) as AdventureFolder[];
}

function withUpdatedCover(folder: AdventureFolder): AdventureFolder {
  const coverUrl = folder.photos[0]?.imageUrl ?? folder.coverUrl;
  return { ...folder, coverUrl };
}

function optional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function defaultWishlistAlbums(): WishlistAlbum[] {
  return [
    {
      id: 'wishlist-default',
      title: 'Trip wishlist',
      coverUrl:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      photos: [],
    },
  ];
}

function withWishlistCover(album: WishlistAlbum): WishlistAlbum {
  const coverUrl = album.photos[0]?.imageUrl ?? album.coverUrl;
  return { ...album, coverUrl };
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<AdventurePost[]>(SAMPLE_FEED);
  const [myFolders, setMyFolders] = useState<AdventureFolder[]>(cloneMyFolders);
  const [favoriteAlbums, setFavoriteAlbums] = useState<FavoriteAlbum[]>([]);
  const [wishlistAlbums, setWishlistAlbums] = useState<WishlistAlbum[]>(defaultWishlistAlbums);
  const [displayName, setDisplayName] = useState(CURRENT_USER.displayName);
  const [avatarUrl, setAvatarUrl] = useState(CURRENT_USER.avatarUrl);
  const [bio, setBio] = useState(PROFILES.ashtay427?.bio ?? '');
  const [travelCompanions, setTravelCompanions] = useState<string[]>([]);

  const user = useMemo<CurrentUser>(
    () => ({
      username: CURRENT_USER.username,
      displayName,
      avatarUrl,
    }),
    [displayName, avatarUrl],
  );

  const myProfile = useMemo<PublicProfile>(
    () => ({
      username: CURRENT_USER.username,
      displayName,
      avatarUrl,
      bio,
      folders: myFolders,
    }),
    [myFolders, displayName, avatarUrl, bio],
  );

  const resolveProfile = useCallback(
    (username: string) => {
      if (username.toLowerCase() === CURRENT_USER.username.toLowerCase()) {
        return myProfile;
      }
      return getStaticProfile(username);
    },
    [myProfile],
  );

  const resolveFolder = useCallback(
    (username: string, folderId: string) => {
      const profile = resolveProfile(username);
      if (!profile) return null;
      const folder = profile.folders.find((f) => f.id === folderId);
      if (!folder) return null;
      return { profile, folder };
    },
    [resolveProfile],
  );

  const resolvePhoto = useCallback(
    (username: string, folderId: string, photoId: string) => {
      const data = resolveFolder(username, folderId);
      if (!data) return null;
      const photo = data.folder.photos.find((p) => p.id === photoId);
      if (!photo) return null;
      return { ...data, photo };
    },
    [resolveFolder],
  );

  const addPost = useCallback(
    (input: NewPostInput) => {
      const id = `${Date.now()}`;
      const tags = [...new Set(input.tags)];
      const post: AdventurePost = {
        id,
        folderId: input.folderId,
        imageUrl: input.imageUrl,
        location: input.location.trim(),
        username: CURRENT_USER.username,
        avatarUrl,
        tags,
        latitude: input.latitude,
        longitude: input.longitude,
        description: optional(input.description),
        stayed: optional(input.stayed),
        at: optional(input.at),
        listenedTo: optional(input.listenedTo),
        wore: optional(input.wore),
      };

      const folderPhoto: FolderPhoto = {
        id,
        imageUrl: input.imageUrl,
        location: input.location.trim(),
        latitude: input.latitude,
        longitude: input.longitude,
        description: optional(input.description),
        stayed: optional(input.stayed),
        at: optional(input.at),
        listenedTo: optional(input.listenedTo),
        wore: optional(input.wore),
        tags,
      };

      setPosts((prev) => [post, ...prev]);
      setMyFolders((prev) =>
        prev.map((folder) => {
          if (folder.id !== input.folderId) return folder;
          return withUpdatedCover({
            ...folder,
            photos: [folderPhoto, ...folder.photos],
          });
        }),
      );

      return post;
    },
    [avatarUrl],
  );

  const updateProfile = useCallback((updates: ProfileUpdateInput) => {
    if (updates.displayName !== undefined) {
      const next = updates.displayName.trim() || CURRENT_USER.displayName;
      setDisplayName(next);
    }
    if (updates.bio !== undefined) {
      setBio(updates.bio.trim());
    }
    if (updates.avatarUrl !== undefined) {
      const next = updates.avatarUrl.trim();
      if (next) {
        setAvatarUrl(next);
        setPosts((prev) =>
          prev.map((p) =>
            p.username.toLowerCase() === CURRENT_USER.username.toLowerCase()
              ? { ...p, avatarUrl: next }
              : p,
          ),
        );
      }
    }
  }, []);

  const isTravelingWith = useCallback(
    (username: string) => {
      const u = username.toLowerCase();
      return travelCompanions.some((c) => c.toLowerCase() === u);
    },
    [travelCompanions],
  );

  const toggleTravelWith = useCallback(
    (username: string) => {
      const trimmed = username.trim();
      if (!trimmed) return false;
      if (trimmed.toLowerCase() === CURRENT_USER.username.toLowerCase()) return false;

      setTravelCompanions((prev) => {
        const exists = prev.some((c) => c.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
          return prev.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
        }
        // Prefer canonical casing from known profiles when available
        const profile = getStaticProfile(trimmed);
        return [...prev, profile?.username ?? trimmed];
      });
      return true;
    },
    [],
  );

  const createFolder = useCallback((title: string) => {
    const trimmed = title.trim();
    const folder: AdventureFolder = {
      id: `folder-${Date.now()}`,
      title: trimmed || 'New album',
      coverUrl:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      photos: [],
    };
    setMyFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const movePhoto = useCallback((photoId: string, fromFolderId: string, toFolderId: string) => {
    if (fromFolderId === toFolderId) return true;

    let success = false;
    setMyFolders((prev) => {
      const source = prev.find((f) => f.id === fromFolderId);
      const targetExists = prev.some((f) => f.id === toFolderId);
      const photo = source?.photos.find((p) => p.id === photoId);
      if (!photo || !targetExists) {
        return prev;
      }
      success = true;
      return prev.map((folder) => {
        if (folder.id === fromFolderId) {
          return withUpdatedCover({
            ...folder,
            photos: folder.photos.filter((p) => p.id !== photoId),
          });
        }
        if (folder.id === toFolderId) {
          return withUpdatedCover({
            ...folder,
            photos: [photo, ...folder.photos.filter((p) => p.id !== photoId)],
          });
        }
        return folder;
      });
    });

    if (success) {
      setPosts((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, folderId: toFolderId } : p)),
      );
    }

    return success;
  }, []);

  const setAlbumCover = useCallback((folderId: string, photoId: string) => {
    let success = false;
    setMyFolders((prev) => {
      const folder = prev.find((f) => f.id === folderId);
      const photo = folder?.photos.find((p) => p.id === photoId);
      if (!folder || !photo) return prev;
      success = true;
      const rest = folder.photos.filter((p) => p.id !== photoId);
      return prev.map((f) => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          coverUrl: photo.imageUrl,
          photos: [photo, ...rest],
        };
      });
    });
    return success;
  }, []);

  const deletePhoto = useCallback((photoId: string, folderId: string) => {
    let success = false;
    let albumDeleted = false;

    setMyFolders((prev) => {
      const source = prev.find((f) => f.id === folderId);
      const photo = source?.photos.find((p) => p.id === photoId);
      if (!source || !photo) {
        return prev;
      }

      success = true;
      const remaining = source.photos.filter((p) => p.id !== photoId);

      if (remaining.length === 0) {
        albumDeleted = true;
        return prev.filter((f) => f.id !== folderId);
      }

      const coverStillValid = remaining.some((p) => p.imageUrl === source.coverUrl);
      const nextCover = coverStillValid
        ? source.coverUrl
        : remaining[Math.floor(Math.random() * remaining.length)]!.imageUrl;

      return prev.map((folder) => {
        if (folder.id !== folderId) return folder;
        return {
          ...folder,
          coverUrl: nextCover,
          photos: remaining,
        };
      });
    });

    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== photoId));
    }

    return { success, albumDeleted };
  }, []);

  const updatePhoto = useCallback((photoId: string, folderId: string, updates: PhotoUpdateInput) => {
    const location = updates.location.trim();
    if (!location) return false;

    const next = {
      location,
      description: optional(updates.description),
      stayed: optional(updates.stayed),
      at: optional(updates.at),
      listenedTo: optional(updates.listenedTo),
      wore: optional(updates.wore),
      ...(updates.tags !== undefined ? { tags: [...new Set(updates.tags)] } : {}),
    };

    let success = false;
    setMyFolders((prev) => {
      const source = prev.find((f) => f.id === folderId);
      if (!source?.photos.some((p) => p.id === photoId)) {
        return prev;
      }
      success = true;
      return prev.map((folder) => {
        if (folder.id !== folderId) return folder;
        return {
          ...folder,
          photos: folder.photos.map((p) => (p.id === photoId ? { ...p, ...next } : p)),
        };
      });
    });

    if (success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                location: next.location,
                description: next.description,
                stayed: next.stayed,
                at: next.at,
                listenedTo: next.listenedTo,
                wore: next.wore,
                ...(updates.tags !== undefined ? { tags: [...new Set(updates.tags)] } : {}),
              }
            : p,
        ),
      );
    }

    return success;
  }, []);

  const isAlbumFavorited = useCallback(
    (username: string, folderId: string) => {
      const u = username.toLowerCase();
      return favoriteAlbums.some(
        (a) => a.sourceUsername.toLowerCase() === u && a.sourceFolderId === folderId,
      );
    },
    [favoriteAlbums],
  );

  const saveAlbumToFavorites = useCallback(
    (username: string, folderId: string) => {
      if (username.toLowerCase() === CURRENT_USER.username.toLowerCase()) {
        return null;
      }
      const data = resolveFolder(username, folderId);
      if (!data) return null;
      if (isAlbumFavorited(username, folderId)) {
        return favoriteAlbums.find(
          (a) =>
            a.sourceUsername.toLowerCase() === username.toLowerCase() &&
            a.sourceFolderId === folderId,
        ) ?? null;
      }
      const snapshot: FavoriteAlbum = {
        id: `fav-${Date.now()}`,
        sourceUsername: data.profile.username,
        sourceFolderId: data.folder.id,
        title: data.folder.title,
        coverUrl: data.folder.coverUrl,
        photos: JSON.parse(JSON.stringify(data.folder.photos)) as FolderPhoto[],
        savedAt: new Date().toISOString(),
      };
      setFavoriteAlbums((prev) => [snapshot, ...prev]);
      return snapshot;
    },
    [resolveFolder, isAlbumFavorited, favoriteAlbums],
  );

  const removeFavoriteAlbum = useCallback((favoriteId: string) => {
    let removed = false;
    setFavoriteAlbums((prev) => {
      if (!prev.some((a) => a.id === favoriteId)) return prev;
      removed = true;
      return prev.filter((a) => a.id !== favoriteId);
    });
    return removed;
  }, []);

  const createWishlistAlbum = useCallback(
    (title: string, initialPhoto?: WishlistPhoto) => {
      const trimmed = title.trim();
      const album: WishlistAlbum = {
        id: `wishlist-${Date.now()}`,
        title: trimmed || 'Trip wishlist',
        coverUrl:
          initialPhoto?.imageUrl ??
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        photos: initialPhoto ? [initialPhoto] : [],
      };
      setWishlistAlbums((prev) => [...prev, album]);
      return album;
    },
    [],
  );

  const savePhotoToWishlist = useCallback(
    (
      photo: FolderPhoto,
      wishlistId: string,
      source?: { username?: string; folderId?: string },
    ) => {
      let success = false;
      setWishlistAlbums((prev) => {
        const target = prev.find((a) => a.id === wishlistId);
        if (!target) return prev;
        if (target.photos.some((p) => p.id === photo.id)) {
          success = true;
          return prev;
        }
        success = true;
        const entry: WishlistPhoto = {
          ...JSON.parse(JSON.stringify(photo)),
          sourceUsername: source?.username,
          sourceFolderId: source?.folderId,
        };
        return prev.map((album) => {
          if (album.id !== wishlistId) return album;
          return withWishlistCover({
            ...album,
            photos: [entry, ...album.photos],
          });
        });
      });
      return success;
    },
    [],
  );

  const removePhotoFromWishlist = useCallback((wishlistId: string, photoId: string) => {
    let removed = false;
    setWishlistAlbums((prev) => {
      const target = prev.find((a) => a.id === wishlistId);
      if (!target?.photos.some((p) => p.id === photoId)) return prev;
      removed = true;
      return prev.map((album) => {
        if (album.id !== wishlistId) return album;
        return withWishlistCover({
          ...album,
          photos: album.photos.filter((p) => p.id !== photoId),
        });
      });
    });
    return removed;
  }, []);

  const isPhotoInWishlist = useCallback(
    (photoId: string, wishlistId?: string) => {
      if (wishlistId) {
        return (
          wishlistAlbums.find((a) => a.id === wishlistId)?.photos.some((p) => p.id === photoId) ??
          false
        );
      }
      return wishlistAlbums.some((a) => a.photos.some((p) => p.id === photoId));
    },
    [wishlistAlbums],
  );

  const resolveFavoriteAlbum = useCallback(
    (favoriteId: string) => favoriteAlbums.find((a) => a.id === favoriteId) ?? null,
    [favoriteAlbums],
  );

  const resolveWishlistAlbum = useCallback(
    (wishlistId: string) => wishlistAlbums.find((a) => a.id === wishlistId) ?? null,
    [wishlistAlbums],
  );

  const resolveWishlistPhoto = useCallback(
    (wishlistId: string, photoId: string) => {
      const album = wishlistAlbums.find((a) => a.id === wishlistId);
      if (!album) return null;
      const photo = album.photos.find((p) => p.id === photoId);
      if (!photo) return null;
      return { album, photo };
    },
    [wishlistAlbums],
  );

  const value = useMemo(
    () => ({
      user,
      posts,
      myFolders,
      myProfile,
      favoriteAlbums,
      wishlistAlbums,
      travelCompanions,
      addPost,
      createFolder,
      movePhoto,
      deletePhoto,
      updatePhoto,
      setAlbumCover,
      updateProfile,
      toggleTravelWith,
      isTravelingWith,
      saveAlbumToFavorites,
      removeFavoriteAlbum,
      isAlbumFavorited,
      createWishlistAlbum,
      savePhotoToWishlist,
      removePhotoFromWishlist,
      isPhotoInWishlist,
      resolveFavoriteAlbum,
      resolveWishlistAlbum,
      resolveWishlistPhoto,
      resolveProfile,
      resolveFolder,
      resolvePhoto,
    }),
    [
      user,
      posts,
      myFolders,
      myProfile,
      favoriteAlbums,
      wishlistAlbums,
      travelCompanions,
      addPost,
      createFolder,
      movePhoto,
      deletePhoto,
      updatePhoto,
      setAlbumCover,
      updateProfile,
      toggleTravelWith,
      isTravelingWith,
      saveAlbumToFavorites,
      removeFavoriteAlbum,
      isAlbumFavorited,
      createWishlistAlbum,
      savePhotoToWishlist,
      removePhotoFromWishlist,
      isPhotoInWishlist,
      resolveFavoriteAlbum,
      resolveWishlistAlbum,
      resolveWishlistPhoto,
      resolveProfile,
      resolveFolder,
      resolvePhoto,
    ],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) {
    throw new Error('useFeed must be used within FeedProvider');
  }
  return ctx;
}
