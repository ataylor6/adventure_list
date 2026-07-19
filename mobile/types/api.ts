export type BetaLead = {
  id: number;
  email: string;
  username: string;
  created_at: string;
};

export type User = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_verified: boolean;
};

export type UserProfile = User & {
  bio: string;
  website?: string | null;
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_following: boolean;
};

export type Comment = {
  id: string;
  user: User;
  text: string;
  created_at: string;
  likes_count: number;
};

export type Post = {
  id: string;
  user: User;
  image_url: string;
  caption: string;
  location?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked_by_me: boolean;
  saved_by_me: boolean;
  comments: Comment[];
};

export type Story = {
  id: string;
  user: User;
  image_url: string;
  created_at: string;
  seen: boolean;
};

export type FeedResponse = {
  posts: Post[];
  next_cursor: string | null;
};

export type StoriesResponse = {
  stories: Story[];
};

export type LikeResponse = {
  post_id: string;
  liked: boolean;
  likes_count: number;
};
