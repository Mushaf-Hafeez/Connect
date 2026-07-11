import ChatSidebar from "@/components/chat/ChatSidebar"
import { Outlet } from "react-router-dom"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { useEffect } from "react"
import { socketStore } from "@/zustand/socketStore"
import type { Message } from "@/types/chat"

const ChatPage = () => {
  const { addMessage, isChatSelected, conversationId } = useStore(chatStore)
  const { socket } = useStore(socketStore)

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) return

      addMessage(message)
    }

    socket.on("new-message", handleNewMessage)

    return () => {
      socket.off("new-message", handleNewMessage)
    }
  }, [socket, addMessage, conversationId])
  return (
    <div className="h-screen bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`w-full shrink-0 border-r md:w-96 ${isChatSelected ? "hidden md:block" : "block"} `}
        >
          <ChatSidebar />
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 ${isChatSelected ? "block" : "hidden md:block"} `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
