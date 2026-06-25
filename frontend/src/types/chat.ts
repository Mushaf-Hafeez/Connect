import type { User } from "./user"

export interface Chat {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  avatar?: string
}

export interface Message {
  id: string
  text: string
  sender: "me" | "other"
  createdAt: string
}

export type Requester = Omit<User, "id">

export interface PendingRequest {
  id: string
  requester: Requester
}

export type Friend = User & { friendshipId: string }
