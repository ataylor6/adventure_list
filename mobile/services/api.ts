import { API_BASE_URL } from '@/constants/config';
import type {
  BetaLead,
  FeedResponse,
  LikeResponse,
  Post,
  StoriesResponse,
  UserProfile,
} from '@/types/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { detail?: string | { msg: string }[] };
      if (typeof body.detail === 'string') {
        message = body.detail;
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        message = body.detail[0].msg;
      }
    } catch {
      // keep statusText
    }
    throw new Error(message || `API ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => request<{ status: string; mode: 'waitlist' | 'full' }>('/health'),

  createBetaLead: (email: string, username: string) =>
    request<BetaLead>('/beta-leads', {
      method: 'POST',
      body: JSON.stringify({ email, username }),
    }),

  getFeed: (cursor?: string | null) => {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    return request<FeedResponse>(`/feed${qs}`);
  },

  getStories: () => request<StoriesResponse>('/stories'),

  likePost: (postId: string) =>
    request<LikeResponse>(`/posts/${postId}/like`, { method: 'POST' }),

  savePost: (postId: string) =>
    request<Post>(`/posts/${postId}/save`, { method: 'POST' }),

  getMyProfile: () => request<UserProfile>('/profile/me'),

  getProfilePosts: (username: string) =>
    request<Post[]>(`/profile/${encodeURIComponent(username)}/posts`),
};
