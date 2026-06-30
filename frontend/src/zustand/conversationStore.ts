import type { Conversation } from "@/components/chat/ChatList"
import { createStore } from "zustand"

interface StoreState {
  conversations: Conversation[] | null
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  clearConversations: () => void
}

export const conversationStore = createStore<StoreState>((set) => ({
  conversations: null,

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) => {
    set((state) => {
      const existing = state.conversations ?? []
      const withoutDuplicate = existing.filter((c) => c.id !== conversation.id)
      return { conversations: [conversation, ...withoutDuplicate] }
    })
  },

  clearConversations: () => set({ conversations: null }),
}))
