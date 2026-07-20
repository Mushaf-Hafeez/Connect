import type { Conversation } from "@/components/chat/ChatList"
import type { Message, MessageStatus } from "@/types/chat"
import { createStore } from "zustand"

interface StoreState {
  conversations: Conversation[] | null

  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void

  updateLastMessage: (message: Message) => void
  updateLastMessageStatus: (
    messageId: string,
    messageStatus: MessageStatus
  ) => void
  incrementUnreadCount: (conversationId: string) => void
  resetUnreadCount: (conversationId: string) => void

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

  updateLastMessageStatus: (messageId, messageStatus) => {
    set((state) => ({
      conversations: state.conversations?.map((conversation) =>
        conversation.messages[0]?.id === messageId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      statuses: message.statuses.map((s) => ({
                        ...s,
                        status: messageStatus,
                      })),
                    }
                  : message
              ),
            }
          : conversation
      ),
    }))
  },

  incrementUnreadCount: (conversationId) => {
    set((state) => ({
      conversations: state.conversations?.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              _count: {
                messages: (conversation._count?.messages ?? 0) + 1,
              },
            }
          : conversation
      ),
    }))
  },

  resetUnreadCount: (conversationId) => {
    set((state) => ({
      conversations: state.conversations?.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              _count: {
                messages: 0,
              },
            }
          : conversation
      ),
    }))
  },

  clearConversations: () => set({ conversations: null }),
}))
