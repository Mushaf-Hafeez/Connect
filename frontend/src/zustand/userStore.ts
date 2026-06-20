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

  setUser: (user: User) => void
  clearUser: () => void
}

const storedUser = localStorage.getItem("user")

export const userStore = create<UserState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user))
    set({ user })
  },

  clearUser: () => {
    localStorage.removeItem("user")
    set({ user: null })
  },
}))
