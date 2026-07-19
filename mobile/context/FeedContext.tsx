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
  category: AdventureCategory;
  folderId: string;
  description?: string;
  stayed?: string;
  at?: string;
  listenedTo?: string;
  wore?: string;
};

type FeedContextValue = {
  user: CurrentUser;
  posts: AdventurePost[];
  myFolders: AdventureFolder[];
  myProfile: PublicProfile;
  addPost: (input: NewPostInput) => AdventurePost;
  createFolder: (title: string) => AdventureFolder;
  movePhoto: (photoId: string, fromFolderId: string, toFolderId: string) => boolean;
  deletePhoto: (photoId: string, folderId: string) => boolean;
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

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<AdventurePost[]>(SAMPLE_FEED);
  const [myFolders, setMyFolders] = useState<AdventureFolder[]>(cloneMyFolders);

  const myProfile = useMemo<PublicProfile>(
    () => ({
      username: CURRENT_USER.username,
      displayName: CURRENT_USER.displayName,
      avatarUrl: CURRENT_USER.avatarUrl,
      bio: PROFILES.ashtay427?.bio ?? '',
      folders: myFolders,
    }),
    [myFolders],
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

  const addPost = useCallback((input: NewPostInput) => {
    const id = `${Date.now()}`;
    const post: AdventurePost = {
      id,
      imageUrl: input.imageUrl,
      location: input.location.trim(),
      username: CURRENT_USER.username,
      avatarUrl: CURRENT_USER.avatarUrl,
      category: input.category,
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
      description: optional(input.description),
      stayed: optional(input.stayed),
      at: optional(input.at),
      listenedTo: optional(input.listenedTo),
      wore: optional(input.wore),
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
  }, []);

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

    return success;
  }, []);

  const deletePhoto = useCallback((photoId: string, folderId: string) => {
    let removed = false;
    setMyFolders((prev) => {
      const source = prev.find((f) => f.id === folderId);
      if (!source?.photos.some((p) => p.id === photoId)) {
        return prev;
      }
      removed = true;
      return prev.map((folder) => {
        if (folder.id !== folderId) return folder;
        return withUpdatedCover({
          ...folder,
          photos: folder.photos.filter((p) => p.id !== photoId),
        });
      });
    });

    if (removed) {
      setPosts((prev) => prev.filter((p) => p.id !== photoId));
    }
    return removed;
  }, []);

  const value = useMemo(
    () => ({
      user: CURRENT_USER,
      posts,
      myFolders,
      myProfile,
      addPost,
      createFolder,
      movePhoto,
      deletePhoto,
      resolveProfile,
      resolveFolder,
      resolvePhoto,
    }),
    [
      posts,
      myFolders,
      myProfile,
      addPost,
      createFolder,
      movePhoto,
      deletePhoto,
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
