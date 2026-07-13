import type { Conversation } from "@/components/chat/ChatList"
import type { Message } from "@/types/chat"
import { createStore } from "zustand"

interface StoreState {
  conversations: Conversation[] | null

  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void

  updateLastMessage: (message: Message) => void

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

  updateLastMessage: (message) => {
    set((state) => ({
      conversations: state.conversations?.map((conversation) =>
        conversation.id === message.conversationId
          ? { ...conversation, messages: [message] }
          : conversation
      ),
    }))
  },

  clearConversations: () => set({ conversations: null }),
}))
