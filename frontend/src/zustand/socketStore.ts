import { create } from "zustand"
import { io, Socket } from "socket.io-client"

interface SocketState {
  socket: Socket | null
  onlineUsers: string[]

  connectSocket: (userId: string) => void
  disconnectSocket: () => void

  setOnlineUsers: (onlineUserIds: string[]) => void
  removeOnlineUser: (onlineUserId: string) => void
}

export const socketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId: string) => {
    const { socket: existingSocket } = get()

    if (existingSocket) {
      existingSocket.disconnect()
    }

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        userId,
      },
      withCredentials: true,
    })

    socket.on("connect", () => {
      // console.log("socket connected: ", socket.id)
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const { socket } = get()

    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  },

  setOnlineUsers: (onlineUserIds: string[]) => {
    set({
      onlineUsers: onlineUserIds,
    })
  },

  removeOnlineUser: (onlineUserId: string) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.filter(
        (onlineUser) => onlineUser !== onlineUserId
      ),
    }))
  },
}))
