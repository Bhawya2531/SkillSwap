import axios from "axios"
import type {
  AuthResponse,
  Skill,
  UserProfile,
  UserSummary,
  Message,
  Conversation,
  AppNotification,
} from "@/types"

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillswap_token")
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("skillswap_token")
      localStorage.removeItem("skillswap_user")
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register") && window.location.pathname !== "/") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }
  return fallback
}

// ===== Auth =====
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
}

// ===== Skills =====
export const skillsApi = {
  getAll: () => api.get<Skill[]>("/skills").then((r) => r.data),
}

// ===== Users =====
export const usersApi = {
  getMe: () => api.get<UserProfile>("/users/me").then((r) => r.data),
  updateMe: (data: {
    fullName?: string
    bio?: string
    photoUrl?: string
    location?: string
    skillsOfferedIds?: number[]
    skillsWantedIds?: number[]
  }) => api.put<UserProfile>("/users/me", data).then((r) => r.data),
  getById: (id: number) => api.get<UserSummary>(`/users/${id}`).then((r) => r.data),
  browse: (params: { query?: string; skillId?: number }) =>
    api.get<UserSummary[]>("/users", { params }).then((r) => r.data),
}

// ===== Messages =====
export const messagesApi = {
  send: (receiverId: number, content: string) =>
    api.post<Message>("/messages", { receiverId, content }).then((r) => r.data),
  getConversations: () => api.get<Conversation[]>("/messages/conversations").then((r) => r.data),
  getConversation: (partnerId: number) =>
    api.get<Message[]>(`/messages/${partnerId}`).then((r) => r.data),
}

// ===== Notifications =====
export const notificationsApi = {
  getAll: () => api.get<AppNotification[]>("/notifications").then((r) => r.data),
  getUnreadCount: () => api.get<{ count: number }>("/notifications/unread-count").then((r) => r.data),
  markAsRead: (id: number) => api.put<AppNotification>(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.put<void>("/notifications/read-all"),
}

export default api
