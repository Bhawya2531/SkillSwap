export interface Skill {
  id: number
  name: string
  icon: string
}

export interface UserProfile {
  id: number
  fullName: string
  email: string
  bio: string
  photoUrl: string | null
  location: string
  createdAt: string
  skillsOffered: Skill[]
  skillsWanted: Skill[]
}

export interface UserSummary {
  id: number
  fullName: string
  bio: string
  photoUrl: string | null
  location: string
  skillsOffered: Skill[]
  skillsWanted: Skill[]
}

export interface Message {
  id: number
  senderId: number
  senderName: string
  senderPhotoUrl: string | null
  receiverId: number
  receiverName: string
  content: string
  sentAt: string
  isRead: boolean
}

export interface Conversation {
  partnerId: number
  partnerName: string
  partnerPhotoUrl: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface AppNotification {
  id: number
  content: string
  type: string
  isRead: boolean
  createdAt: string
  actorId: number | null
  actorName: string | null
  actorPhotoUrl: string | null
}

export interface AuthResponse {
  token: string
  user: UserProfile
}
