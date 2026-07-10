import { create } from "zustand"
import { io, Socket } from "socket.io-client"

interface SocketState {
  socket: Socket | null

  connectSocket: (userId: string) => void
  disconnectSocket: () => void
}

export const socketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: (userId: string) => {
    console.log(import.meta.env.VITE_BACKEND_URL)
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        userId,
      },
      withCredentials: true,
    })

    socket.on("connect", () => {
      console.log("socket connected: ", socket.id)
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
}))
