import type { User } from "./user"

export interface Chat {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  avatar?: string
}

export type MessageStatus = "SENT" | "DELIVERED" | "READ"

export interface MessageStatusInfo {
  userId: string
  status: MessageStatus
}
export interface Message {
  id: string
  text: string | null
  attachments: string[]
  sender: User
  statuses: MessageStatusInfo[]
  createdAt: Date
  conversationId?: string
}

export type Requester = Omit<User, "id">

export interface PendingRequest {
  id: string
  requester: Requester
}

export type Friend = User & { friendshipId: string }
