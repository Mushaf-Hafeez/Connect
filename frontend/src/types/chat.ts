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
