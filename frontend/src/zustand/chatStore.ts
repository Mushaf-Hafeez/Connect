import type { Participant } from "@/components/chat/ChatList"
import { createStore } from "zustand"

interface StoreState {
  isChatSelected: boolean
  chatSelected: Participant | null

  setIsChatSelected: (value: boolean) => void
  setChatSelected: (chat: Participant | null) => void
}

export const chatStore = createStore<StoreState>((set) => ({
  isChatSelected: false,
  chatSelected: null,

  setIsChatSelected: (value: boolean) => {
    set({ isChatSelected: value })
  },
  setChatSelected: (chat: Participant | null) => {
    set({ chatSelected: chat })
  },
}))
