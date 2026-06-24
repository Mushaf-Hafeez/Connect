import ChatItem from "./ChatItem"
import type { Chat } from "@/types/chat"

const chats: Chat[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    lastMessage: "The quarterly report looks solid...",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Michael Chen",
    lastMessage: "Thanks for sending those files.",
    time: "Yesterday",
    unread: 0,
  },
]

const ChatList = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  )
}

export default ChatList
