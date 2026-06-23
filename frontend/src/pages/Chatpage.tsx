import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"

const ChatPage = () => {
  return (
    <div className="h-screen bg-background">
      <div className="hidden h-full md:flex">
        <div className="w-95 shrink-0 border-r">
          <ChatSidebar />
        </div>

        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>

      <div className="h-full md:hidden">
        <ChatSidebar />
      </div>
    </div>
  )
}

export default ChatPage
