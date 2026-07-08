import type { Participant } from "@/components/chat/ChatList"
import type { Message } from "@/types/chat"
import { createStore } from "zustand"

interface StoreState {
  isChatSelected: boolean
  chatSelected: Participant | null
  conversationId: string | null
  messages: Message[]

  setIsChatSelected: (value: boolean) => void
  setChatSelected: (
    chat: Participant | null,
    conversationId: string | null
  ) => void
  addMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  removeMessage: (messageId: string) => void
  updateMessage: (messageId: string, text: string) => void
}

export const chatStore = createStore<StoreState>((set) => ({
  isChatSelected: false,
  chatSelected: null,
  conversationId: null,
  messages: [],

  setIsChatSelected: (value: boolean) => {
    set({ isChatSelected: value })
  },
  setChatSelected: (
    chat: Participant | null,
    conversationId: string | null = null
  ) => {
    set({ chatSelected: chat, conversationId })
  },

  addMessages: (messages: Message[]) => {
    set({ messages })
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
  updateMessage: (messageId: string, text: string) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, text } : message
      ),
    }))
  },
}))
