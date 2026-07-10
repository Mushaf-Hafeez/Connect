import { create } from "zustand"

interface User {
  id: string
  displayName: string
  username: string
  email: string
  profilePic: string
  isEmailVerified: boolean
  lastSeen: Date | null
  createdAt: Date
  updatedAt: Date
}

interface UserState {
  user: User | null
  isCheckingAuth: boolean

  setUser: (user: User) => void
  clearUser: () => void
  setIsCheckingAuth: (isCheckingAuth: boolean) => void
}

const storedUser = localStorage.getItem("user")

export const userStore = create<UserState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  isCheckingAuth: true,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user))
    set({ user })
  },

  clearUser: () => {
    localStorage.removeItem("user")
    set({ user: null })
  },

  setIsCheckingAuth: (isCheckingAuth: boolean) => {
    set({ isCheckingAuth })
  },
}))
