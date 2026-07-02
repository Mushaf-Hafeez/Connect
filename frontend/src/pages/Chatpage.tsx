import ChatSidebar from "@/components/chat/ChatSidebar"
import { Outlet } from "react-router-dom"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"

const ChatPage = () => {
  const { isChatSelected } = useStore(chatStore)

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
