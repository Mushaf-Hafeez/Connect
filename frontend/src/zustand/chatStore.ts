import type { Participant } from "@/components/chat/ChatList"
import type { Message } from "@/types/chat"
import { createStore } from "zustand"

interface StoreState {
  isChatSelected: boolean
  chatSelected: Participant | null

  messages: Message[]

  setIsChatSelected: (value: boolean) => void
  setChatSelected: (chat: Participant | null) => void
}

export const chatStore = createStore<StoreState>((set) => ({
  isChatSelected: false,
  chatSelected: null,
  messages: [],

  setIsChatSelected: (value: boolean) => {
    set({ isChatSelected: value })
  },
  setChatSelected: (chat: Participant | null) => {
    set({ chatSelected: chat })
  },

  addMessages: (messages: Message[]) => {
    set((state) => ({
      messages: [...state.messages, ...messages],
    }))
  },
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }))
  },
  removeMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    }))
  },
}))
