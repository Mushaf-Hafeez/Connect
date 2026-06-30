import { useParams, useSearchParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"
import type { Message } from "@/types/chat"
import { useEffect } from "react"

const messages: Message[] = [
  {
    id: "1",
    text: "Hey! Did you review the designs?",
    sender: "other",
    createdAt: "10:15 AM",
  },
  {
    id: "2",
    text: "Yes, everything looks much cleaner.",
    sender: "me",
    createdAt: "10:20 AM",
  },
]

const ChatWindow = () => {
  const params = useParams()

  // Todo: fetch the conversation with params.id
  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatWindow
