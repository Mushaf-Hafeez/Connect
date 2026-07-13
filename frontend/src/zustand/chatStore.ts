import type { Participant } from "@/components/chat/ChatList"
import type { Message, MessageStatus, MessageStatusInfo } from "@/types/chat"
import { createStore } from "zustand"

const sortMessages = (messages: Message[]) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

interface StoreState {
  isChatSelected: boolean
  chatSelected: Participant | null
  conversationId: string | null
  messages: Message[]
  isTyping: boolean

  setIsChatSelected: (value: boolean) => void
  setChatSelected: (
    chat: Participant | null,
    conversationId: string | null
  ) => void
  setConversationId: (conversationId: string | null) => void
  clearChatSelected: () => void

  clearMessages: () => void
  addMessages: (messages: Message[]) => void
  prependMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  removeMessage: (messageId: string) => void
  updateMessage: (messageId: string, text: string) => void
  updateMessageStatus: (messageId: string, status: MessageStatusInfo) => void
  updateMessageStatusBatch: (
    messageIds: string[],
    userId: string,
    status: MessageStatus
  ) => void
  setIsTyping: (isTyping: boolean) => void
}

export const chatStore = createStore<StoreState>((set) => ({
  isChatSelected: false,
  chatSelected: null,
  conversationId: null,
  messages: [],
  isTyping: false,

  setIsChatSelected: (value: boolean) => {
    set({ isChatSelected: value })
  },
  setChatSelected: (
    chat: Participant | null,
    conversationId: string | null = null
  ) => {
    set({ chatSelected: chat, conversationId })
  },
  setConversationId: (conversationId: string | null) => {
    set({ conversationId })
  },
  clearChatSelected: () => {
    set({
      isChatSelected: false,
      chatSelected: null,
      conversationId: null,
      isTyping: false,
    })
  },

  clearMessages: () => {
    set({ messages: [] })
  },
  addMessages: (messages: Message[]) => {
    set({ messages: sortMessages(messages) })
  },
  prependMessages: (messages: Message[]) => {
    set((state) => {
      const existingIds = new Set(state.messages.map((message) => message.id))
      const newMessages = messages.filter(
        (message) => !existingIds.has(message.id)
      )

      return { messages: sortMessages([...newMessages, ...state.messages]) }
    })
  },
  addMessage: (message: Message) => {
    set((state) => {
      if (state.messages.some((existing) => existing.id === message.id)) {
        return state
      }

      return { messages: sortMessages([...state.messages, message]) }
    })
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
  updateMessageStatus: (messageId, status) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, statuses: [status] } : message
      ),
    }))
  },

  setIsTyping: (isTyping: boolean) => {
    set({ isTyping })
  },

  updateMessageStatusBatch: (
    messageIds: string[],
    userId: string,
    status: MessageStatus
  ) => {
    set((state) => ({
      messages: state.messages.map((message) => {
        if (!messageIds.includes(message.id)) return message

        const exists = message.statuses.some((s) => s.userId === userId)
        return {
          ...message,
          statuses: exists
            ? message.statuses.map((s) =>
                s.userId === userId ? { ...s, status } : s
              )
            : [
                ...message.statuses,
                {
                  userId,
                  status,
                  id: "",
                  messageId: message.id,
                  updatedAt: new Date().toISOString(),
                },
              ],
        }
      }),
    }))
  },
}))
