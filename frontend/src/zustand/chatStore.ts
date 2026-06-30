import { createStore } from "zustand"

interface StoreState {
  isChatSelected: boolean

  setChatSelected: (value: boolean) => void
}

export const chatStore = createStore<StoreState>((set) => ({
  isChatSelected: false,

  setChatSelected: (value: boolean) => {
    set({ isChatSelected: value })
  },
}))
