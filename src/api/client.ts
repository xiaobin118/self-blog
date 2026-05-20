import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unified response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  },
);

// --- Types ---

export interface ApiUser {
  id: string;
  username: string;
  avatarUrl: string;
  email?: string;
  role: 'ADMIN' | 'USER';
}

export interface ApiTag {
  id: string;
  name: string;
  count: number;
}

export interface ApiPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ApiUser;
  tags: { tag: ApiTag }[];
}

export interface ApiComment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  isApproved: boolean;
  user: ApiUser;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Auth API ---

export const authApi = {
  getMe: () => api.get<never, ApiResponse<ApiUser>>('/api/auth/me'),
};

// --- Posts API ---

export const postsApi = {
  getList: (params?: { page?: number; limit?: number; q?: string; tag?: string }) =>
    api.get<never, ApiResponse<PaginatedData<ApiPost>>>('/api/posts', { params }),

  getBySlug: (slug: string) =>
    api.get<never, ApiResponse<ApiPost>>(`/api/posts/${slug}`),

  create: (data: {
    title: string;
    content: string;
    summary: string;
    coverImage?: string;
    published?: boolean;
    tags?: string[];
  }) => api.post<never, ApiResponse<ApiPost>>('/api/posts', data),

  update: (id: string, data: {
    title?: string;
    content?: string;
    summary?: string;
    coverImage?: string;
    published?: boolean;
    tags?: string[];
  }) => api.put<never, ApiResponse<ApiPost>>(`/api/posts/${id}`, data),

  delete: (id: string) =>
    api.delete<never, ApiResponse>(`/api/posts/${id}`),
};

// --- Tags API ---

export const tagsApi = {
  getAll: () => api.get<never, ApiResponse<ApiTag[]>>('/api/tags'),
  create: (name: string) =>
    api.post<never, ApiResponse<ApiTag>>('/api/tags', { name }),
  delete: (id: string) =>
    api.delete<never, ApiResponse>(`/api/tags/${id}`),
};

// --- Comments API ---

export const commentsApi = {
  getByPost: (postId: string) =>
    api.get<never, ApiResponse<ApiComment[]>>('/api/comments', { params: { postId } }),

  create: (data: { postId: string; content: string; parentId?: string }) =>
    api.post<never, ApiResponse<ApiComment>>('/api/comments', data),

  delete: (id: string) =>
    api.delete<never, ApiResponse>(`/api/comments/${id}`),

  approve: (id: string) =>
    api.put<never, ApiResponse<ApiComment>>(`/api/comments/${id}/approve`),
};
